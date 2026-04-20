// ARENA — Veo 3 render edge function
// Called by scripts/ai-video/generate-hero.ts or admin UI to queue + execute
// a Vertex AI Veo 3 text-to-video render. Result uploaded to Supabase Storage.
//
// Request:
//   POST /functions/v1/render-veo3
//   { render_id?: string, prompt: string, aspect: '16:9'|'9:16', duration?: number, audio?: boolean, brief_id?: string }
//
// Response:
//   { render_id, status, output_url? }
//
// Env:
//   GCP_PROJECT, GCP_LOCATION (default us-central1), GCP_SERVICE_ACCOUNT_JSON
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET (default: ai-renders)

import { corsHeaders, handleCors, json } from '../_shared/cors.ts'
import { requireAdmin, errToResponse } from '../_shared/auth.ts'

interface RenderRequest {
  render_id?: string
  prompt: string
  aspect?: '16:9' | '9:16' | '1:1'
  duration?: number
  audio?: boolean
  brief_id?: string
  prompt_id?: string
}

const GCP_PROJECT = Deno.env.get('GCP_PROJECT')
const GCP_LOCATION = Deno.env.get('GCP_LOCATION') ?? 'us-central1'
const SA_JSON = Deno.env.get('GCP_SERVICE_ACCOUNT_JSON')
const BUCKET = Deno.env.get('SUPABASE_STORAGE_BUCKET') ?? 'ai-renders'

// Rough pricing: Veo 3 ~$0.50/sec with audio, $0.35/sec without (Apr 2026 estimate)
function estimateCost(duration: number, audio: boolean): number {
  return duration * (audio ? 0.5 : 0.35)
}

async function getAccessToken(): Promise<string> {
  if (!SA_JSON) throw new Error('GCP_SERVICE_ACCOUNT_JSON not configured')
  const sa = JSON.parse(SA_JSON) as {
    client_email: string
    private_key: string
    token_uri: string
  }

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: sa.token_uri,
    exp: now + 3600,
    iat: now,
  }

  const enc = new TextEncoder()
  const b64 = (s: string) =>
    btoa(s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')

  const signingInput = `${b64(JSON.stringify(header))}.${b64(JSON.stringify(payload))}`

  const pkcs8 = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '')
  const keyData = Uint8Array.from(atob(pkcs8), (c) => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(signingInput))
  const jwt = `${signingInput}.${b64(String.fromCharCode(...new Uint8Array(sig)))}`

  const tokenRes = await fetch(sa.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })
  if (!tokenRes.ok) throw new Error(`Token exchange failed: ${await tokenRes.text()}`)
  const td = await tokenRes.json() as { access_token: string }
  return td.access_token
}

async function callVeo3(token: string, prompt: string, aspect: string, duration: number, audio: boolean) {
  const endpoint =
    `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/projects/${GCP_PROJECT}/` +
    `locations/${GCP_LOCATION}/publishers/google/models/veo-3.0:predictLongRunning`

  const body = {
    instances: [{ prompt }],
    parameters: {
      aspectRatio: aspect,
      durationSeconds: duration,
      generateAudio: audio,
      sampleCount: 1,
    },
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Veo 3 call failed: ${res.status} ${await res.text()}`)
  return await res.json() as { name: string } // operation name
}

async function pollOperation(token: string, opName: string, maxSeconds = 480) {
  const endpoint = `https://${GCP_LOCATION}-aiplatform.googleapis.com/v1/${opName}`
  const start = Date.now()
  while (Date.now() - start < maxSeconds * 1000) {
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json() as {
      done?: boolean
      error?: { message: string }
      response?: { predictions: Array<{ video: { uri: string } }> }
    }
    if (data.done) {
      if (data.error) throw new Error(data.error.message)
      return data.response?.predictions?.[0]?.video?.uri
    }
    await new Promise((r) => setTimeout(r, 10_000))
  }
  throw new Error('Veo 3 operation timed out')
}

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const ctx = await requireAdmin(req)
    const body = await req.json() as RenderRequest
    if (!body.prompt) return json({ error: 'prompt required' }, 400)

    const aspect = body.aspect ?? '16:9'
    const duration = Math.min(body.duration ?? 8, 10) // Veo 3 max 10s
    const audio = body.audio ?? true
    const estCost = estimateCost(duration, audio)

    // Upsert ai_renders row
    const renderPayload = {
      kind: 'veo3',
      prompt: body.prompt,
      prompt_id: body.prompt_id,
      params: { aspect, duration, audio },
      status: 'running',
      cost_usd: estCost,
      tenant_id: ctx.tenantId,
      brief_id: body.brief_id,
      created_by: ctx.userId,
    }

    let renderId = body.render_id
    if (renderId) {
      await ctx.supabase.from('ai_renders').update(renderPayload).eq('id', renderId)
    } else {
      const { data, error } = await ctx.supabase.from('ai_renders').insert(renderPayload).select('id').single()
      if (error) throw new Error(`DB insert failed: ${error.message}`)
      renderId = data.id
    }

    try {
      const token = await getAccessToken()
      const started = Date.now()
      const op = await callVeo3(token, body.prompt, aspect, duration, audio)
      const gcsUri = await pollOperation(token, op.name)
      if (!gcsUri) throw new Error('No video URI returned')

      // Download from GCS signed URL would happen here; for now store reference
      const elapsed = Date.now() - started

      await ctx.supabase.from('ai_renders').update({
        status: 'success',
        output_url: gcsUri,
        duration_ms: elapsed,
        completed_at: new Date().toISOString(),
      }).eq('id', renderId)

      return json({ render_id: renderId, status: 'success', output_url: gcsUri, cost_usd: estCost })
    } catch (renderErr) {
      const msg = renderErr instanceof Error ? renderErr.message : String(renderErr)
      await ctx.supabase.from('ai_renders').update({
        status: 'failed',
        error_message: msg,
        completed_at: new Date().toISOString(),
      }).eq('id', renderId)
      return json({ render_id: renderId, status: 'failed', error: msg }, 500)
    }
  } catch (e) {
    return errToResponse(e)
  }
})
