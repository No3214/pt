import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { splits, sanitize } from '../../lib/constants'
import { exercises, categoryLabels, difficultyLabels } from '../../lib/exercises'
import { councilQuery } from '../../lib/ai'
import { useTranslation } from '../../locales'

interface WorkoutLine { exercise: string; sets: number; reps: string; note: string; muscle?: string }

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

const muscleIcons: Record<string, string> = {
  'Gogus': '\uD83E\uDEC1', 'Sirt': '\uD83D\uDD19', 'Omuz': '\uD83E\uDD3E', 'Bacak': '\uD83E\uDDB5',
  'Kol': '\uD83D\uDCAA', 'Karin': '\uD83E\uDDF1', 'Kalca': '\uD83E\uDDB4', 'On Kol': '\uD83D\uDCAA',
  'Trapez': '\uD83D\uDD1D', 'Tam Vucut': '\uD83C\uDFCB',
}

const diffColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-secondary/10', text: 'text-secondary' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  advanced: { bg: 'bg-primary/10', text: 'text-primary' },
}
interface Exercise { name: string; muscle?: string; [key: string]: unknown }

function ExerciseThumb({ exercise }: { exercise: Exercise; dm?: boolean }) {
  const [err, setErr] = useState(false)
  
  if (err) {
    return <span className="text-xl">{muscleIcons[exercise.muscle || ''] || '●'}</span>
  }

  // Tries to load exercise.gif, fails gracefully to emoji
  const fileName = exercise.name ? exercise.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'unknown'
  return (
    <img
      src={`/exercises/${fileName}.gif`}
      alt={exercise.name}
      loading="lazy"
      onError={() => setErr(true)}
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
    />
  )
}

export default function Builder() {
  const { clients, darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [selectedClient, setSelectedClient] = useState('')
  const [nutritionNote, setNoteText] = useState(t.portal.admin.builder_default_note)
  const [waPreview, setWaPreview] = useState(t.portal.admin.builder_default_wa)
  const [loading, setLoading] = useState(false)
  const [showExerciseDB, setShowExerciseDB] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [exFilter, setExFilter] = useState({ muscle: '', category: '', equipment: '' })
  const [customProgram, setCustomProgram] = useState<WorkoutLine[]>([])
  const [currentDay, setCurrentDay] = useState('Gün 1')
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates')
  const previewRef = useRef<HTMLDivElement>(null)
  const previewInView = useInView(previewRef, { once: true })

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border backdrop-blur-sm ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'}`
  const hasAI = true

  const filteredExercises = useMemo(() => exercises.filter(e => {
    if (exSearch && !e.name.toLowerCase().includes(exSearch.toLowerCase())) return false
    if (exFilter.muscle && e.muscle !== exFilter.muscle) return false
    if (exFilter.category && e.category !== exFilter.category) return false
    if (exFilter.equipment && e.equipment !== exFilter.equipment) return false
    return true
  }), [exSearch, exFilter])

  const uniqueMuscles = useMemo(() => [...new Set(exercises.map(e => e.muscle))].sort(), [])
  const uniqueEquipment = useMemo(() => [...new Set(exercises.map(e => e.equipment))].sort(), [])
  const programStats = useMemo(() => {
    const totalSets = customProgram.reduce((s, l) => s + l.sets, 0)
    const muscles = [...new Set(customProgram.map(l => l.muscle).filter(Boolean))]
    return { totalSets, muscles, exerciseCount: customProgram.length }
  }, [customProgram])

  const addExerciseToProgram = (name: string, muscle?: string) =>
    setCustomProgram([...customProgram, { exercise: name, sets: 3, reps: '10', note: '', muscle }])
  const updateLine = (idx: number, field: keyof WorkoutLine, value: string | number) => {
    const updated = [...customProgram]
    updated[idx] = { ...updated[idx], [field]: value }
    setCustomProgram(updated)
  }
  const removeLine = (idx: number) => setCustomProgram(customProgram.filter((_, i) => i !== idx))
  const moveLine = (idx: number, dir: -1 | 1) => {
    const ni = idx + dir
    if (ni < 0 || ni >= customProgram.length) return
    const updated = [...customProgram]
    ;[updated[idx], updated[ni]] = [updated[ni], updated[idx]]
    setCustomProgram(updated)
  }

  const buildCustomOutput = () => {
    const client = sanitize(selectedClient || 'Danışan')
    const lines = customProgram.map(l =>
      `• ${l.exercise} ${l.sets}×${l.reps}${l.note ? ` (${l.note})` : ''}`
    ).join('\n')
    setWaPreview(`🏐 *ARENA — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 ${currentDay}\n\n${lines}\n\n📌 Beslenme: ${sanitize(nutritionNote)}`)
  }

  const setSplit = (type: string) => {
    const client = sanitize(selectedClient || 'Yeni Danışan')
    const note = sanitize(nutritionNote)
    setWaPreview(`🏐 *ARENA — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 Program Formatı: ${type.toUpperCase()}\n\n${splits[type]}\n\n📌 Beslenme: ${note}`)
  }

  const generateAI = async () => {
    const client = sanitize(selectedClient || 'Danışan')
    const note = sanitize(nutritionNote)
    setLoading(true)
    setWaPreview(t.portal.admin.builder_llm_working)
    const prompt = `Sen ARENA performans platformunun AI koçusun. Profesyonel bir voleybol ve fitness antrenörü gibi cevap ver. Danışanım ${client} için; ${note} notlarını da dikkate alarak 4 günlük hipertrofi ve performans odaklı antrenman spliti hazırla. Çıktı sadece WhatsApp mesaj formatı olsun. Başlangıcında "🏐 *ARENA — AI Özel Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n" yaz. JSON kullanma sadece düz metin.`
    try {
      const results = await councilQuery(prompt)
      const best = results.find(r => r.result)
      if (best?.result) setWaPreview(best.result)
      else setWaPreview(t.portal.admin.builder_ai_error_empty)
    } catch (err: unknown) { setWaPreview(t.portal.admin.builder_ai_error + (err instanceof Error ? err.message : 'Unknown error')) }
    setLoading(false)
  }

  const sendWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(waPreview)}`, '_blank')

  const downloadPNG = async () => {
    const el = document.getElementById('export-container')
    if (!el) return
    el.style.left = '0'
    try {      const { toPng } = await import('html-to-image')
      const url = await toPng(el, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'ARENA_Program.png'
      link.href = url
      link.click()
    } catch { showToast(t.portal.admin.builder_png_error) }
    el.style.left = '-9999px'
  }

  const downloadPDF = () => {
    const el = document.getElementById('export-container')
    if (!el) return
    el.style.left = '0'
    import('react-to-pdf')
      .then(({ default: generatePDF }) =>
        generatePDF(() => document.getElementById('export-container'), { filename: 'ARENA_Program.pdf' })
      )
      .catch(() => showToast(t.portal.admin.builder_pdf_error))
      .finally(() => { el.style.left = '-9999px' })
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t.portal.admin.builder_title}</h2>          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
            {t.portal.admin.builder_subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats Pills */}
          {customProgram.length > 0 && (
            <div className="flex gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
                {programStats.exerciseCount} {t.portal.admin.builder_moves}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-secondary/10 text-secondary' : 'bg-secondary/10 text-secondary'}`}>
                {programStats.totalSets} {t.portal.admin.builder_sets}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium hidden sm:inline-block ${dm ? 'bg-accent/10 text-accent' : 'bg-sky-50 text-sky-600'}`}>
                {programStats.muscles.length} {t.portal.admin.builder_muscle_groups}
              </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExerciseDB(!showExerciseDB)}
            className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showExerciseDB
              ? 'bg-secondary text-white border-none shadow-lg shadow-secondary/20'
              : (dm ? 'border border-white/10 text-white/70 bg-transparent' : 'border border-stone-200 text-stone-600 bg-transparent')
            }`}
          >            {showExerciseDB ? t.portal.admin.builder_close : (
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                {t.portal.admin.builder_exercise_db} ({exercises.length})
              </span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Exercise Database Panel */}
      <AnimatePresence>
        {showExerciseDB && (
          <motion.div
            initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
            exit={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mb-8"
          >
            <div className={`p-6 rounded-2xl border backdrop-blur-sm ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'} border-secondary/20`}>
              {/* Search & Filters */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative flex-1 min-w-[200px]">
                  <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${dm ? 'text-white/30' : 'text-stone-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input value={exSearch} onChange={e => setExSearch(e.target.value)}
                    placeholder={t.portal.admin.builder_search_placeholder}
                    className={`w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 !pl-10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`} />                </div>
                <select value={exFilter.muscle} onChange={e => setExFilter({ ...exFilter, muscle: e.target.value })} className={`w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 max-w-[160px] ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}>
                  <option value="">{t.portal.admin.builder_all_muscles}</option>
                  {uniqueMuscles.map(m => <option key={m} value={m}>{muscleIcons[m] || '●'} {m}</option>)}
                </select>
                <select value={exFilter.category} onChange={e => setExFilter({ ...exFilter, category: e.target.value })} className={`w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 max-w-[160px] ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}>
                  <option value="">{t.portal.admin.builder_all_categories}</option>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={exFilter.equipment} onChange={e => setExFilter({ ...exFilter, equipment: e.target.value })} className={`w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 max-w-[160px] ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}>
                  <option value="">{t.portal.admin.builder_all_equipment}</option>
                  {uniqueEquipment.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
              </div>

              {/* Results count */}
              <div className={`flex items-center gap-2 mb-3 text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${filteredExercises.length > 0 ? 'bg-secondary' : 'bg-red-400'}`} />
                {filteredExercises.length} {t.portal.admin.builder_results}
                {exSearch && <span>· &ldquo;{exSearch}&rdquo;</span>}
              </div>

              {/* Exercise Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredExercises.map((e, i) => {
                  const dc = diffColors[e.difficulty] || diffColors.intermediate
                  return (
                    <motion.div key={`${e.name}-${i}`}                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => addExerciseToProgram(e.name, e.muscle)}
                      className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border group ${dm ? 'border-white/[0.04] hover:border-secondary/30 hover:bg-white/[0.04]' : 'border-stone-100 hover:border-secondary/30 hover:bg-secondary/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
                          <ExerciseThumb exercise={e} dm={dm} />
                        </div>
                        <div>
                          <div className="font-medium text-sm group-hover:text-secondary transition-colors">{e.name}</div>
                          <div className={`text-[0.7rem] mt-0.5 ${dm ? 'text-white/30' : 'text-stone-400'}`}>{e.muscle} · {e.equipment}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[0.65rem] px-2 py-0.5 rounded-md ${dc.bg} ${dc.text}`}>{difficultyLabels[e.difficulty]?.split(' ')[0]}</span>
                        <span className={`text-secondary opacity-0 group-hover:opacity-100 transition-opacity text-lg`}>+</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Program Builder */}
      <AnimatePresence>
        {customProgram.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className={`p-6 rounded-2xl border backdrop-blur-sm ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'}`}>
              <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dm ? 'bg-primary/10' : 'bg-primary/10'}`}>💪</div>
                  <div>
                    <h3 className="font-display text-lg font-medium">Özel Program</h3>
                    <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{programStats.exerciseCount} hareket · {programStats.totalSets} set</p>
                  </div>
                  <input value={currentDay} onChange={e => setCurrentDay(e.target.value)}
                    className={`w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 max-w-[120px] text-sm font-semibold !py-2 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`} />
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={buildCustomOutput}
                    className="px-5 py-2.5 rounded-full text-sm bg-primary text-white border-none cursor-pointer font-medium shadow-lg shadow-primary/20">
                    {t.portal.admin.builder_export}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCustomProgram([])}
                    className={`px-4 py-2.5 text-xs rounded-full border cursor-pointer ${dm ? 'border-white/10 text-white/50 bg-transparent' : 'border-stone-200 text-stone-500 bg-transparent'}`}>
                    {t.portal.admin.builder_clear}
                  </motion.button>
                </div>
              </div>
              {customProgram.map((line, idx) => (
                <motion.div key={idx} variants={fadeUp} className={`flex items-start gap-3 p-4 rounded-xl border mb-3 ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-stone-100 bg-stone-50'}`}>
                  <div className="flex-1 space-y-2">
                    <input value={line.exercise} onChange={e => updateLine(idx, 'exercise', e.target.value)}
                      className={`w-full p-2 rounded-lg text-sm border outline-none ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-stone-200'}`} />
                    <div className="flex gap-2 flex-wrap">
                      <input type="number" min="1" max="10" value={line.sets} onChange={e => updateLine(idx, 'sets', parseInt(e.target.value))}
                        className={`w-16 p-2 rounded-lg text-xs border outline-none ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-stone-200'}`}
                        placeholder="Sets" />
                      <input value={line.reps} onChange={e => updateLine(idx, 'reps', e.target.value)}
                        className={`flex-1 min-w-[100px] p-2 rounded-lg text-xs border outline-none ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-stone-200'}`}
                        placeholder="Reps" />
                      <input value={line.note} onChange={e => updateLine(idx, 'note', e.target.value)}
                        className={`flex-1 min-w-[150px] p-2 rounded-lg text-xs border outline-none ${dm ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-stone-200'}`}
                        placeholder="Not" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => moveLine(idx, -1)}
                      className={`p-2 rounded-lg text-sm cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-200'}`}>↑</motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => moveLine(idx, 1)}
                      className={`p-2 rounded-lg text-sm cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-200'}`}>↓</motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeLine(idx)}
                      className="p-2 rounded-lg text-sm text-red-500 cursor-pointer hover:bg-red-500/10">×</motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Templates Section */}
      {activeTab === 'templates' && (
        <motion.div variants={fadeUp} className="space-y-4">
          {Object.entries(splits).map(([key, value]) => (
            <motion.button key={key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSplit(key)}
              className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer group ${dm ? 'border-white/10 hover:border-secondary/50 hover:bg-white/[0.03]' : 'border-stone-200 hover:border-secondary/50 hover:bg-secondary/5'}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold capitalize text-sm group-hover:text-secondary transition-colors">{key.replace('_', ' ')}</span>
                <span className={`text-lg opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1`}>→</span>
              </div>
              <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-500'}`}>{value.split('\n')[0].substring(0, 60)}...</p>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <motion.div variants={fadeUp} className="space-y-4">
          <input value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
            placeholder={t.portal.admin.builder_client_placeholder}
            className={`${inp}`} />
          <textarea value={nutritionNote} onChange={e => setNoteText(e.target.value)}
            placeholder={t.portal.admin.builder_nutrition_note_placeholder}
            className={`${inp} h-24 resize-none`} />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={generateAI}
            disabled={loading}
            className={`w-full py-3 rounded-full font-medium text-white transition-all ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 cursor-pointer'}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                {t.portal.admin.builder_llm_working}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t.portal.admin.builder_generate}
              </span>
            )}
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setSplit('ppl'); setActiveTab('templates') }}
            className={`w-full py-3 rounded-full font-medium transition-all border cursor-pointer ${dm ? 'border-white/10 text-white/70 hover:bg-white/[0.05]' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
            {t.portal.admin.builder_use_template}
          </motion.button>
        </motion.div>
      )}

        {/* Right - Preview */}
        <motion.div variants={fadeUp} ref={previewRef} className="sticky top-20">
          <div className={`${card} min-h-[600px] flex flex-col`}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{borderColor: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}}>
              <h3 className="font-semibold text-sm">{t.portal.admin.builder_preview}</h3>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={sendWhatsApp}
                  className={`p-2 rounded-lg text-lg cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>📱</motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={downloadPNG}
                  className={`p-2 rounded-lg text-lg cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>🖼️</motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={downloadPDF}
                  className={`p-2 rounded-lg text-lg cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>📄</motion.button>
              </div>
            </div>
            <pre className={`flex-1 overflow-auto text-xs font-mono p-3 rounded-lg whitespace-pre-wrap break-words ${dm ? 'bg-black/30 text-white/80' : 'bg-stone-100 text-stone-700'}`}>{waPreview}</pre>
          </div>
        </motion.div>

      {/* Hidden Export Container */}
      <div id="export-container" style={{position: 'absolute', left: '-9999px', top: 0, width: '800px'}} className={`p-8 ${dm ? 'bg-stone-950' : 'bg-white'}`}>
        <pre className={`text-sm font-mono ${dm ? 'text-white' : 'text-black'}`}>{waPreview}</pre>
      </div>
    </motion.div>
  )
}