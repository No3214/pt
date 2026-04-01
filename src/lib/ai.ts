// ═══════════════ AI Provider Functions ═══════════════
import { useStore } from '../stores/useStore'

export async function callGemini(prompt: string, imageBase64?: string): Promise<string | null> {
  const key = useStore.getState().aiKeys.gemini
  if (!key) return null
  const parts: any[] = [{ text: prompt }]
  if (imageBase64) parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } })
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }] }) }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.candidates[0].content.parts[0].text.trim()
}

export async function callOpenRouter(prompt: string, imageBase64?: string): Promise<string | null> {
  const { openrouter: key, openrouterModel: model } = useStore.getState().aiKeys
  if (!key) return null
  const content = imageBase64
    ? [{ type: 'text', text: prompt }, { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,' + imageBase64 } }]
    : prompt
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({ model: model || 'anthropic/claude-sonnet-4', messages: [{ role: 'user', content }] }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))
  return data.choices[0].message.content.trim()
}

export async function callDeepSeek(prompt: string): Promise<string | null> {
  const key = useStore.getState().aiKeys.deepseek
  if (!key) return null
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }] }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))
  return data.choices[0].message.content.trim()
}

export interface CouncilResult {
  id: string; name: string
  result: string | null; error: string | null
}

export async function councilQuery(prompt: string, imageBase64?: string): Promise<CouncilResult[]> {
  const keys = useStore.getState().aiKeys
  const providers = [
    { id: 'gemini', name: '💎 Gemini', fn: () => callGemini(prompt, imageBase64), hasKey: !!keys.gemini },
    { id: 'openrouter', name: '🌐 OpenRouter', fn: () => callOpenRouter(prompt, imageBase64), hasKey: !!keys.openrouter },
    { id: 'deepseek', name: '🧠 DeepSeek', fn: () => callDeepSeek(prompt), hasKey: !!keys.deepseek },
  ].filter(p => p.hasKey)

  if (providers.length === 0) {
    alert('En az bir API anahtarı girin (Ayarlar sekmesi).')
    return []
  }

  const results = await Promise.allSettled(providers.map(p => p.fn()))
  return providers.map((p, i) => ({
    id: p.id,
    name: p.name,
    result: results[i].status === 'fulfilled' ? (results[i] as any).value : null,
    error: results[i].status === 'rejected' ? (results[i] as any).reason.message : null,
  }))
}
