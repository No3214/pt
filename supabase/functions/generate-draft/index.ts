// ARENA — Content draft generation edge function
// Reads a content_brief, calls Claude Sonnet 4.6 (default) or Opus 4.7 (if flagged complex),
// writes/updates content_drafts row. Triggered by UI button or cron.
//
// Request:
//   POST /functions/v1/generate-draft
//   { brief_id: string, locale?: 'tr'|'en'|..., model?: 'opus'|'sonnet'|'haiku', force?: boolean }
//
// Response:
//   { draft_id, locale, tokens_input, tokens_output, cost_usd }
//
// Env:
//   ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { corsHeaders, handleCors, json } from '../_shared/cors.ts'
import { requireAdmin, errToResponse } from '../_shared/auth.ts'

interface DraftRequest {
  brief_id: string
  locale?: string
  model?: 'opus' | 'sonnet' | 'haiku'
  force?: boolean
}

interface Brief {
  id: string
  kind: string
  title: string
  goal: string | null
  persona: string | null
  key_message: string | null
  brief: Record<string, unknown>
  tenant_id: string | null
}

const MODEL_MAP = {
  opus: 'claude-opus-4-7',
  sonnet: 'claude-sonnet-4-6',
  haiku: 'claude-haiku-4-5',
}

// Pricing per MTok (Apr 2026)
const PRICING = {
  'claude-opus-4-7':   { input: 15, output: 75 },
  'claude-sonnet-4-6': { input: 3,  output: 15 },
  'claude-haiku-4-5':  { input: 0.8, output: 4 },
}

const BRAND_SYSTEM_PROMPT = `You are the ARENA Performance copywriter. ARENA is a premium volleyball and athletic performance academy/SaaS platform headquartered in Turkey, serving ages 13-17 and their parents.

Brand voice:
- Warm, disciplined, confident. Mediterranean warmth + athletic intensity.
- Turkish as source-of-truth; output matches requested locale exactly.
- Never overpromise medal outcomes; focus on character + consistent development.
- Tagline: "Guclu Ol. Kendine Guven." (Be Strong. Trust Yourself.)
- Brand palette reference (do NOT mention in copy): Terracotta, Sage, Coast, Rich Sand.

Output rules:
- Return ONLY the requested format (markdown body, title, meta_description, excerpt).
- No meta-commentary, no "Here is...", no trailing notes.
- Use short paragraphs. Concrete examples. No buzzwords.
- Include one subtle CTA near the end.`

function buildUserPrompt(brief: Brief, locale: string): string {
  return `Generate a ${brief.kind} in locale=${locale}.

Title: ${brief.title}
Goal: ${brief.goal ?? 'awareness'}
Target persona: ${brief.persona ?? 'parent of 13-17yo athlete'}
Key message: ${brief.key_message ?? '(infer from title)'}

Detailed brief:
${JSON.stringify(brief.brief, null, 2)}

Return a JSON object with exactly these keys:
{
  "title": "...",
  "meta_description": "... (under 160 chars)",
  "excerpt": "... (50-80 words)",
  "body_md": "...full markdown body..."
}`
}

async function callClaude(model: string, userPrompt: string) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: BRAND_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API failed: ${res.status} ${await res.text()}`)

  const data = await res.json() as {
    content: Array<{ text: string }>
    usage: { input_tokens: number; output_tokens: number }
  }

  const text = data.content[0]?.text ?? ''
  // Strip code fence if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  let parsed: { title: string; meta_description: string; excerpt: string; body_md: string }
  try {
    parsed = JSON.parse(cleaned)
  } catch (_) {
    throw new Error(`Claude returned non-JSON: ${text.slice(0, 400)}`)
  }

  return {
    ...parsed,
    usage: data.usage,
  }
}

function calcCost(model: string, inputTok: number, outputTok: number): number {
  const price = PRICING[model as keyof typeof PRICING]
  if (!price) return 0
  return (inputTok / 1_000_000) * price.input + (outputTok / 1_000_000) * price.output
}

Deno.serve(async (req) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const ctx = await requireAdmin(req)
    const body = await req.json() as DraftRequest
    if (!body.brief_id) return json({ error: 'brief_id required' }, 400)

    const locale = body.locale ?? 'tr'
    const modelKey = body.model ?? 'sonnet'
    const modelId = MODEL_MAP[modelKey]

    const { data: brief, error: briefErr } = await ctx.supabase
      .from('content_briefs')
      .select('id, kind, title, goal, persona, key_message, brief, tenant_id')
      .eq('id', body.brief_id)
      .single()
    if (briefErr || !brief) throw new Error(`Brief not found: ${briefErr?.message}`)

    // Idempotency: skip if draft already approved+published, unless force=true
    if (!body.force) {
      const { data: existing } = await ctx.supabase
        .from('content_drafts')
        .select('id, status')
        .eq('brief_id', body.brief_id)
        .eq('locale', locale)
        .maybeSingle()
      if (existing && ['approved', 'published'].includes(existing.status)) {
        return json({
          draft_id: existing.id,
          skipped: true,
          reason: `Already ${existing.status}`,
        })
      }
    }

    await ctx.supabase.from('content_briefs').update({ status: 'generating' }).eq('id', brief.id)

    const userPrompt = buildUserPrompt(brief as Brief, locale)
    const result = await callClaude(modelId, userPrompt)
    const cost = calcCost(modelId, result.usage.input_tokens, result.usage.output_tokens)

    const draftPayload = {
      brief_id: brief.id,
      locale,
      title: result.title,
      body_md: result.body_md,
      meta_description: result.meta_description,
      excerpt: result.excerpt,
      status: 'draft',
      model: modelId,
      tokens_input: result.usage.input_tokens,
      tokens_output: result.usage.output_tokens,
      cost_usd: cost,
    }

    const { data: draft, error: draftErr } = await ctx.supabase
      .from('content_drafts')
      .upsert(draftPayload, { onConflict: 'brief_id,locale' })
      .select('id')
      .single()

    if (draftErr) throw new Error(`Draft upsert failed: ${draftErr.message}`)

    await ctx.supabase.from('content_briefs').update({ status: 'review' }).eq('id', brief.id)

    return json({
      draft_id: draft.id,
      locale,
      model: modelId,
      tokens_input: result.usage.input_tokens,
      tokens_output: result.usage.output_tokens,
      cost_usd: cost,
    })
  } catch (e) {
    return errToResponse(e)
  }
})
