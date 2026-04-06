// ═══════════════ AI Provider Functions (Proxied securely) ═══════════════

export async function callGemini(prompt: string, imageBase64?: string): Promise<string | null> {
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'gemini', prompt, imageBase64 })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function callOpenRouter(prompt: string, imageBase64?: string): Promise<string | null> {
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'openrouter', prompt, imageBase64 })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function callDeepSeek(prompt: string): Promise<string | null> {
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'deepseek', prompt })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export interface CouncilResult {
  id: string; name: string
  result: string | null; error: string | null
}

export async function councilQuery(prompt: string, imageBase64?: string): Promise<CouncilResult[]> {
  const providers = [
    { id: 'gemini', name: '💎 Gemini', fn: () => callGemini(prompt, imageBase64) },
    { id: 'openrouter', name: '🌐 OpenRouter', fn: () => callOpenRouter(prompt, imageBase64) },
    { id: 'deepseek', name: '🧠 DeepSeek', fn: () => callDeepSeek(prompt) },
  ]

  const results = await Promise.allSettled(providers.map(p => p.fn()))
  return providers.map((p, i) => ({
    id: p.id,
    name: p.name,
    result: results[i].status === 'fulfilled' ? (results[i] as any).value : null,
    error: results[i].status === 'rejected' ? (results[i] as any).reason.message : null,
  }))
}
