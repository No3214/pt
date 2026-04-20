/**
 * ARENA Performance — AI Hero Video Batch Generator
 *
 * Reads prompts/video/veo-hero-library.json + imagen-poster-library.json
 * and queues render jobs via Vertex AI (Veo 3 / Imagen 4).
 *
 * Usage:
 *   npx tsx scripts/ai-video/generate-hero.ts [--filter=hero-spike-action-v1] [--dry-run]
 *
 * Env:
 *   GCP_PROJECT        Google Cloud project id
 *   GCP_LOCATION       Vertex AI region (default: us-central1)
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Notes:
 *   - Gercek Vertex AI SDK calisinca @google-cloud/vertexai import edilir
 *   - Su an stub: prompt'lari okur, ai_renders tablosuna queue'lar, gercek API cagrisini
 *     edge function veya worker tarafina birakir (cost + timeout kontrol)
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'

interface VideoPrompt {
  id: string
  kind: 'veo3' | 'imagen4' | 'flux_pro' | 'runway' | 'higgsfield'
  aspect: string
  duration?: number
  audio?: boolean
  prompt: string
  use_shared_suffix?: boolean
  target_placement?: string[]
  notes?: string
}

interface PromptLibrary {
  version: string
  description: string
  shared_suffix?: string
  items: VideoPrompt[]
}

const PROMPT_FILES = [
  'prompts/video/veo-hero-library.json',
  'prompts/video/imagen-poster-library.json',
]

async function loadLibrary(path: string): Promise<PromptLibrary> {
  const raw = await readFile(resolve(process.cwd(), path), 'utf-8')
  return JSON.parse(raw) as PromptLibrary
}

function buildFullPrompt(item: VideoPrompt, sharedSuffix?: string): string {
  if (!item.use_shared_suffix || !sharedSuffix) return item.prompt
  return `${item.prompt} ${sharedSuffix}`
}

async function queueRender(item: VideoPrompt, fullPrompt: string, opts: { dryRun: boolean }) {
  const payload = {
    kind: item.kind,
    prompt_id: item.id,
    prompt: fullPrompt,
    params: {
      aspect: item.aspect,
      duration: item.duration,
      audio: item.audio,
      target_placement: item.target_placement,
    },
    status: 'queued',
  }

  if (opts.dryRun) {
    console.log(`[DRY] ${item.id} -> ${item.kind} ${item.aspect} ${item.duration ?? 'n/a'}s`)
    console.log(`      ${fullPrompt.slice(0, 120)}...`)
    return { ok: true, dryRun: true }
  }

  const sbUrl = process.env.SUPABASE_URL
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!sbUrl || !sbKey) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const res = await fetch(`${sbUrl}/rest/v1/ai_renders`, {
    method: 'POST',
    headers: {
      'apikey': sbKey,
      'Authorization': `Bearer ${sbKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[FAIL] ${item.id}: ${res.status} ${text}`)
    return { ok: false, error: text }
  }
  const data = await res.json() as Array<{ id: string }>
  console.log(`[QUEUE] ${item.id} -> ai_renders.id=${data[0]?.id}`)
  return { ok: true, id: data[0]?.id }
}

async function main() {
  const { values } = parseArgs({
    options: {
      filter:  { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
    },
  })

  const filter = values.filter as string | undefined
  const dryRun = Boolean(values['dry-run'])

  let totalQueued = 0
  let totalSkipped = 0

  for (const file of PROMPT_FILES) {
    console.log(`\n=== Loading ${file} ===`)
    const lib = await loadLibrary(file)
    for (const item of lib.items) {
      if (filter && item.id !== filter) {
        totalSkipped++
        continue
      }
      const fullPrompt = buildFullPrompt(item, lib.shared_suffix)
      await queueRender(item, fullPrompt, { dryRun })
      totalQueued++
    }
  }

  console.log(`\n=== Done: ${totalQueued} queued, ${totalSkipped} skipped (filter) ===`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
