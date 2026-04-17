/**
 * LLM COUNCIL SYSTEM — ARENA Performance Platform
 * Multi-provider AI orchestration with adversarial critique
 * Pipeline: Parallel Drafts → Critique → Synthesis → Validation
 */
import { useStore } from '../stores/useStore'

export type ProviderID = 'gemini' | 'openrouter' | 'deepseek'
export type CouncilMode = 'fast' | 'council' | 'council-critique'
export type TaskDomain = 'nutrition' | 'training' | 'assessment' | 'wellness' | 'general'

export interface ProviderResult {
  id: ProviderID; name: string
  result: string | null; error: string | null; latencyMs: number
}
export interface CritiqueResult {
  reviewerId: ProviderID; targetId: ProviderID
  critique: string | null; score: number; hallucinations: string[]
}
export interface CouncilOutput {
  mode: CouncilMode; domain: TaskDomain
  drafts: ProviderResult[]; critiques: CritiqueResult[]
  consensus: string | null; confidence: number
  timestamp: string; totalMs: number
}
const SYSTEM_BASE = `[SİSTEM KURALI / ANTI-HALLUCINATION]:
Sen profesyonel bir sporcu performans ve medikal asistanısın.
1) Asla uydurma/halüsinasyon bilgi verme.
2) Asla ilaç veya tıbbi tedavi reçetesi yazma.
3) Bilimsel geçerliliği olmayan kürleri önerme.
Kapsamın dışındaysa 'Bunun için bir spor hekimine başvurulmalıdır' de.
YALNIZCA KESİN VE DOĞRU BİLGİ ÜRET.`

const DOMAIN_PROMPTS: Record<TaskDomain, string> = {
  nutrition: `${SYSTEM_BASE}\nUZMANLIK: Sporcu beslenmesi, makro hesaplama, diyet planı. Kalori/protein/yağ/karb değerlerini belirt. Türk mutfağına uygun alternatifler öner.`,
  training: `${SYSTEM_BASE}\nUZMANLIK: Antrenman programlama, periodizasyon. Set/tekrar/dinlenme ver. Sakatlık risklerini belirt. Sporcu seviyesine uygun zorluk ayarla.`,
  assessment: `${SYSTEM_BASE}\nUZMANLIK: Vücut ölçüm analizi, performans değerlendirmesi. Trend yönünü belirt. Yüzde oranlarını ver.`,
  wellness: `${SYSTEM_BASE}\nUZMANLIK: Wellness, RPE, uyku, enerji, stres. Overtraining belirtilerine dikkat et. Aktif dinlenme öner.`,
  general: SYSTEM_BASE,
}

const CRITIQUE_PROMPT = `Sen bilimsel doğruluk denetçisisin. AI yanıtını değerlendir:
KRİTERLER: 1)Bilimsel doğruluk 2)Halüsinasyon kontrolü 3)Güvenlik 4)Pratiklik 5)Eksiksizlik
YANIT: {response}
Format: PUAN:[1-10] HALÜSİNASYONLAR:[listele/Yok] ELEŞTİRİ:[kısa değerlendirme]`
const SYNTHESIS_PROMPT = `Uzlaşı sentez uzmanısın. AI yanıtlarını analiz edip en iyi tek yanıtı üret.
KURALLAR: 1)Ortak doğru bilgileri koru 2)Çelişkide çoğunluğu seç 3)Halüsinasyonları çıkar 4)En yüksek puanlıyı temel al
YANITLAR: {draftsAndCritiques}
SENTEZ:`

async function callProvider(provider: ProviderID, prompt: string, imageBase64?: string): Promise<string | null> {
  const { aiConfig } = useStore.getState()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (provider === 'gemini') headers['X-Gemini-Key'] = aiConfig.gemini
  if (provider === 'openrouter') headers['X-OpenRouter-Key'] = aiConfig.openrouter
  if (provider === 'deepseek') headers['X-DeepSeek-Key'] = aiConfig.deepseek
  const body: Record<string, unknown> = { provider, prompt }
  if (imageBase64 && provider !== 'deepseek') body.imageBase64 = imageBase64
  const res = await fetch('/api/ai', { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

const PROVIDER_LABELS: Record<ProviderID, string> = {
  gemini: '💎 Gemini', openrouter: '🌐 OpenRouter', deepseek: '🧠 DeepSeek',
}
export function detectDomain(prompt: string): TaskDomain {
  const lower = prompt.toLowerCase()
  const score = (kws: string[]) => kws.filter(kw => lower.includes(kw)).length
  const scores: [TaskDomain, number][] = [
    ['nutrition', score(['kalori','protein','makro','diyet','beslenme','yemek','besin','karbonhidrat','öğün','meal','nutrition','food','calorie'])],
    ['training', score(['antrenman','egzersiz','set','tekrar','rep','program','workout','training','squat','bench','deadlift','kardiyo','kas','muscle'])],
    ['assessment', score(['ölçüm','kilo','vücut yağ','bmi','ilerleme','progress','analiz','assessment','body fat','weight'])],
    ['wellness', score(['uyku','stres','rpe','enerji','wellness','dinlenme','recovery','sleep','toparlanma','yorgunluk'])],
  ]
  const best = scores.sort((a, b) => b[1] - a[1])[0]
  return best[1] > 0 ? best[0] : 'general'
}

function getActiveProviders(): ProviderID[] {
  const { aiConfig } = useStore.getState()
  const active: ProviderID[] = []
  if (aiConfig.gemini) active.push('gemini')
  if (aiConfig.openrouter) active.push('openrouter')
  if (aiConfig.deepseek) active.push('deepseek')
  return active
}

async function parallelDrafts(prompt: string, domain: TaskDomain, imageBase64?: string): Promise<ProviderResult[]> {
  const providers = getActiveProviders()
  if (!providers.length) throw new Error('Hiçbir AI sağlayıcısı yapılandırılmadı.')
  const domainPrompt = `${DOMAIN_PROMPTS[domain]}\n\nKullanıcı Talebi:\n${prompt}`
  const start = Date.now()
  const results = await Promise.allSettled(providers.map(id => callProvider(id, domainPrompt, imageBase64)))
  return providers.map((id, i) => ({
    id, name: PROVIDER_LABELS[id],
    result: results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<string | null>).value : null,
    error: results[i].status === 'rejected' ? (results[i] as PromiseRejectedResult).reason.message : null,
    latencyMs: Date.now() - start,
  }))
}
async function adversarialCritique(drafts: ProviderResult[]): Promise<CritiqueResult[]> {
  const ok = drafts.filter(d => d.result && !d.error)
  if (ok.length < 2) return []
  const critiques: Promise<CritiqueResult>[] = []
  for (const draft of ok) {
    const reviewer = ok.find(d => d.id !== draft.id)!
    critiques.push(
      callProvider(reviewer.id, CRITIQUE_PROMPT.replace('{response}', draft.result!))
        .then(r => parseCritique(reviewer.id, draft.id, r))
        .catch(() => ({ reviewerId: reviewer.id, targetId: draft.id, critique: null, score: 5, hallucinations: [] }))
    )
  }
  return Promise.all(critiques)
}

function parseCritique(reviewerId: ProviderID, targetId: ProviderID, raw: string | null): CritiqueResult {
  if (!raw) return { reviewerId, targetId, critique: null, score: 5, hallucinations: [] }
  let score = 5
  const sm = raw.match(/PUAN:\s*(\d+)/i)
  if (sm) score = Math.min(10, Math.max(1, parseInt(sm[1])))
  const hallucinations: string[] = []
  const hm = raw.match(/HALÜSİNASYONLAR:\s*(.+?)(?=\n|ELEŞTİRİ:|$)/is)
  if (hm && !hm[1].trim().toLowerCase().includes('yok')) hallucinations.push(...hm[1].split(/[,;•-]/).map(s => s.trim()).filter(Boolean))
  const cm = raw.match(/ELEŞTİRİ:\s*(.+)/is)
  return { reviewerId, targetId, critique: cm ? cm[1].trim() : raw, score, hallucinations }
}
function getBestProvider(drafts: ProviderResult[], critiques: CritiqueResult[]): ProviderID {
  const ok = drafts.filter(d => d.result && !d.error)
  if (!ok.length) return 'gemini'
  let bestId = ok[0].id, bestScore = 0
  for (const d of ok) { const c = critiques.find(c => c.targetId === d.id); if (c && c.score > bestScore) { bestScore = c.score; bestId = d.id } }
  return bestId
}

async function synthesize(drafts: ProviderResult[], critiques: CritiqueResult[]): Promise<{ consensus: string | null; confidence: number }> {
  const ok = drafts.filter(d => d.result && !d.error)
  if (!ok.length) return { consensus: null, confidence: 0 }
  if (ok.length === 1) return { consensus: ok[0].result, confidence: 0.5 }
  const summary = ok.map(d => {
    const c = critiques.find(cr => cr.targetId === d.id)
    return `--- ${d.name} (Puan: ${c?.score ?? '?'}/10) ---\nYANIT: ${d.result}\n${c ? `DEĞERLENDİRME: ${c.critique}\nHALÜSİNASYONLAR: ${c.hallucinations.length ? c.hallucinations.join(', ') : 'Yok'}` : ''}`
  }).join('\n\n')
  const best = getBestProvider(drafts, critiques)
  try {
    const consensus = await callProvider(best, SYNTHESIS_PROMPT.replace('{draftsAndCritiques}', summary))
    const scores = critiques.map(c => c.score).filter(s => s > 0)
    const confidence = scores.length ? Math.min(1, scores.reduce((a, b) => a + b, 0) / scores.length / 10) : 0.5
    return { consensus, confidence }
  } catch { return { consensus: ok[0].result, confidence: 0.4 } }
}
// ─── Public API ───
export async function councilFast(prompt: string, imageBase64?: string): Promise<CouncilOutput> {
  const start = Date.now(), domain = detectDomain(prompt)
  const drafts = await parallelDrafts(prompt, domain, imageBase64)
  return { mode: 'fast', domain, drafts, critiques: [], consensus: null, confidence: 0, timestamp: new Date().toISOString(), totalMs: Date.now() - start }
}

export async function councilStandard(prompt: string, imageBase64?: string): Promise<CouncilOutput> {
  const start = Date.now(), domain = detectDomain(prompt)
  const drafts = await parallelDrafts(prompt, domain, imageBase64)
  const ok = drafts.filter(d => d.result && !d.error)
  let consensus: string | null = null, confidence = 0
  if (ok.length >= 2) {
    const input = ok.map(d => `--- ${d.name} ---\n${d.result}`).join('\n\n')
    try { consensus = await callProvider(ok[0].id, `${DOMAIN_PROMPTS[domain]}\nYanıtları sentezle:\n${input}\nSENTEZ:`); confidence = 0.7 }
    catch { consensus = ok[0].result; confidence = 0.5 }
  } else if (ok.length === 1) { consensus = ok[0].result; confidence = 0.5 }
  return { mode: 'council', domain, drafts, critiques: [], consensus, confidence, timestamp: new Date().toISOString(), totalMs: Date.now() - start }
}

export async function councilFull(prompt: string, imageBase64?: string): Promise<CouncilOutput> {
  const start = Date.now(), domain = detectDomain(prompt)
  const drafts = await parallelDrafts(prompt, domain, imageBase64)
  const critiques = await adversarialCritique(drafts)
  const { consensus, confidence } = await synthesize(drafts, critiques)
  return { mode: 'council-critique', domain, drafts, critiques, consensus, confidence, timestamp: new Date().toISOString(), totalMs: Date.now() - start }
}

export async function councilSmart(prompt: string, imageBase64?: string): Promise<CouncilOutput> {
  const providers = getActiveProviders()
  if (providers.length <= 1) return councilFast(prompt, imageBase64)
  if (prompt.length < 100) return councilStandard(prompt, imageBase64)
  const domain = detectDomain(prompt)
  if (domain === 'assessment' || domain === 'training') return councilFull(prompt, imageBase64)
  return councilStandard(prompt, imageBase64)
}
// ─── Backward Compat ───
export interface LegacyCouncilResult { id: string; name: string; result: string | null; error: string | null }
export async function councilQuery(prompt: string, imageBase64?: string): Promise<LegacyCouncilResult[]> {
  const output = await councilFast(prompt, imageBase64)
  return output.drafts.map(d => ({ id: d.id, name: d.name, result: d.result, error: d.error }))
}
