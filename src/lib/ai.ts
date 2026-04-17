import { useStore } from '../stores/useStore'

export async function callGemini(prompt: string, imageBase64?: string): Promise<string | null> {
  const { aiConfig } = useStore.getState()
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Gemini-Key': aiConfig.gemini },
    body: JSON.stringify({ provider: 'gemini', prompt, imageBase64 })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function callOpenRouter(prompt: string, imageBase64?: string): Promise<string | null> {
  const { aiConfig } = useStore.getState()
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-OpenRouter-Key': aiConfig.openrouter },
    body: JSON.stringify({ provider: 'openrouter', prompt, imageBase64 })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function callDeepSeek(prompt: string): Promise<string | null> {
  const { aiConfig } = useStore.getState()
  const res = await fetch('/api/ai', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DeepSeek-Key': aiConfig.deepseek },
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
  const strictPrompt = `[SİSTEM KURALI / ANTI-HALLUCINATION]: Sen profesyonel bir sporcu performans ve medikal asistanısın. Bu bir sağlık projesi olduğu için: 1) Asla uydurma/halüsinasyon (hallucination) bilgi verme. 2) Asla ilaç veya tıbbi tedavi reçetesi yazma. 3) Bilimsel geçerliliği olmayan kürleri önerme. Eğer sorulan soru senin spor, diyet veya antrenman bilimi kapsamının (yaklaşık %100 doğruluğunun) dışındaysa doğrudan 'Bunun için bir spor hekimine başvurulmalıdır' de. YALNIZCA KESİN VE DOĞRU BİLGİ ÜRET.\n\nKullanıcı Talebi:\n${prompt}`

  const providers = [
    { id: 'gemini', name: '💎 Gemini', fn: () => callGemini(strictPrompt, imageBase64) },
    { id: 'openrouter', name: '🌐 OpenRouter', fn: () => callOpenRouter(strictPrompt, imageBase64) },
    { id: 'deepseek', name: '🧠 DeepSeek', fn: () => callDeepSeek(strictPrompt) },
  ]

  const results = await Promise.allSettled(providers.map(p => p.fn()))
  return providers.map((p, i) => ({
    id: p.id,
    name: p.name,
    result: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<string | null>).value : null,
    error: results[i].status === 'rejected' ? (results[i] as PromiseRejectedResult).reason?.message : null,
  }))
}
