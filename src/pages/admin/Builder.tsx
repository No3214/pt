import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { splits, sanitize } from '../../lib/constants'
import { exercises, categoryLabels, difficultyLabels } from '../../lib/exercises'
import { councilQuery } from '../../lib/ai'
import { toPng } from 'html-to-image'
import generatePDF from 'react-to-pdf'

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
  beginner: { bg: 'bg-sage/10', text: 'text-sage' },
  intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
  advanced: { bg: 'bg-terracotta/10', text: 'text-terracotta' },
}

function ExerciseThumb({ exercise }: { exercise: any, dm?: boolean }) {
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
      onError={() => setErr(true)}
      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
    />
  )
}

export default function Builder() {
  const { clients, darkMode: dm, showToast } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [selectedClient, setSelectedClient] = useState('')
  const [nutritionNote, setNoteText] = useState(
    'Beslenme hedeflerine uygun makrolarını diyet listenden takip etmeyi unutma.'
  )
  const [waPreview, setWaPreview] = useState(
    `🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 Yeni Danışan\n💪 Lütfen Müşteri ve Split Seçin.`
  )
  const [loading, setLoading] = useState(false)
  const [showExerciseDB, setShowExerciseDB] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [exFilter, setExFilter] = useState({ muscle: '', category: '', equipment: '' })
  const [customProgram, setCustomProgram] = useState<WorkoutLine[]>([])
  const [currentDay, setCurrentDay] = useState('Gün 1')
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates')
  const previewRef = useRef<HTMLDivElement>(null)
  const previewInView = useInView(previewRef, { once: true })

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
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
    setWaPreview(`🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 ${currentDay}\n\n${lines}\n\n📌 Beslenme: ${sanitize(nutritionNote)}`)
  }

  const setSplit = (type: string) => {
    const client = sanitize(selectedClient || 'Yeni Danışan')
    const note = sanitize(nutritionNote)
    setWaPreview(`🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 Program Formatı: ${type.toUpperCase()}\n\n${splits[type]}\n\n📌 Beslenme: ${note}`)
  }

  const generateAI = async () => {
    const client = sanitize(selectedClient || 'Danışan')
    const note = sanitize(nutritionNote)
    setLoading(true)
    setWaPreview('🧠 LLM Council çalışıyor...')
    const prompt = `Sen profesyonel bir voleybol ve fitness antrenörüsün. Adın Ela. Danışanım ${client} için; ${note} notlarını da dikkate alarak 4 günlük hipertrofi ve performans odaklı antrenman spliti hazırla. Çıktı sadece WhatsApp mesaj formatı olsun. Başlangıcında "🏐 *ELA EBEOĞLU — AI Özel Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n" yaz. JSON kullanma sadece düz metin.`
    try {
      const results = await councilQuery(prompt)
      const best = results.find(r => r.result)
      if (best?.result) setWaPreview(best.result)
      else setWaPreview('AI Hatası: Sonuç alınamadı')
    } catch (err: any) { setWaPreview('AI Hatası: ' + err.message) }
    setLoading(false)
  }

  const sendWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(waPreview)}`, '_blank')

  const downloadPNG = async () => {
    const el = document.getElementById('export-container')
    if (!el) return
    el.style.left = '0'
    try {
      const url = await toPng(el, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'ElaEbeoglu_Program.png'
      link.href = url
      link.click()
    } catch { showToast('PNG oluşturulamadı') }
    el.style.left = '-9999px'
  }

  const downloadPDF = () => {
    const el = document.getElementById('export-container')
    if (!el) return
    el.style.left = '0'
    generatePDF(() => document.getElementById('export-container'), { filename: 'ElaEbeoglu_Program.pdf' })
      .finally(() => { el.style.left = '-9999px' })
      .catch(() => showToast('PDF oluşturulamadı'))
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Program Oluşturucu</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
            Egzersiz veritabanı, şablonlar & WhatsApp çıktısı
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats Pills */}
          {customProgram.length > 0 && (
            <div className="flex gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-terracotta/10 text-terracotta' : 'bg-terracotta/10 text-terracotta'}`}>
                {programStats.exerciseCount} hareket
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-sage/10 text-sage' : 'bg-sage/10 text-sage'}`}>
                {programStats.totalSets} set
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium hidden sm:inline-block ${dm ? 'bg-coast/10 text-coast' : 'bg-sky-50 text-sky-600'}`}>
                {programStats.muscles.length} kas grubu
              </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExerciseDB(!showExerciseDB)}
            className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showExerciseDB
              ? 'bg-sage text-white border-none shadow-lg shadow-sage/20'
              : (dm ? 'border border-white/10 text-white/70 bg-transparent' : 'border border-stone-200 text-stone-600 bg-transparent')
            }`}
          >
            {showExerciseDB ? '✕ Kapat' : (
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Egzersiz DB ({exercises.length})
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
            <div className={`${card} border-sage/20`}>
              {/* Search & Filters */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative flex-1 min-w-[200px]">
                  <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${dm ? 'text-white/30' : 'text-stone-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input value={exSearch} onChange={e => setExSearch(e.target.value)}
                    placeholder="Egzersiz ara..."
                    className={`${inp} !pl-10`} />
                </div>
                <select value={exFilter.muscle} onChange={e => setExFilter({ ...exFilter, muscle: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Kaslar</option>
                  {uniqueMuscles.map(m => <option key={m} value={m}>{muscleIcons[m] || '●'} {m}</option>)}
                </select>
                <select value={exFilter.category} onChange={e => setExFilter({ ...exFilter, category: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Kategoriler</option>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={exFilter.equipment} onChange={e => setExFilter({ ...exFilter, equipment: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Ekipman</option>
                  {uniqueEquipment.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
              </div>

              {/* Results count */}
              <div className={`flex items-center gap-2 mb-3 text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${filteredExercises.length > 0 ? 'bg-sage' : 'bg-red-400'}`} />
                {filteredExercises.length} sonuç
                {exSearch && <span>· &ldquo;{exSearch}&rdquo;</span>}
              </div>

              {/* Exercise Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredExercises.map((e, i) => {
                  const dc = diffColors[e.difficulty] || diffColors.intermediate
                  return (
                    <motion.div key={`${e.name}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => addExerciseToProgram(e.name, e.muscle)}
                      className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border group ${dm ? 'border-white/[0.04] hover:border-sage/30 hover:bg-white/[0.04]' : 'border-stone-100 hover:border-sage/30 hover:bg-sage/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
                          <ExerciseThumb exercise={e} dm={dm} />
                        </div>
                        <div>
                          <div className="font-medium text-sm group-hover:text-sage transition-colors">{e.name}</div>
                          <div className={`text-[0.7rem] mt-0.5 ${dm ? 'text-white/30' : 'text-stone-400'}`}>{e.muscle} · {e.equipment}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[0.65rem] px-2 py-0.5 rounded-md ${dc.bg} ${dc.text}`}>{difficultyLabels[e.difficulty]?.split(' ')[0]}</span>
                        <span className={`text-sage opacity-0 group-hover:opacity-100 transition-opacity text-lg`}>+</span>
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
            <div className={card}>
              <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dm ? 'bg-terracotta/10' : 'bg-terracotta/10'}`}>💪</div>
                  <div>
                    <h3 className="font-display text-lg font-medium">Özel Program</h3>
                    <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{programStats.exerciseCount} hareket · {programStats.totalSets} set</p>
                  </div>
                  <input value={currentDay} onChange={e => setCurrentDay(e.target.value)}
                    className={`${inp} max-w-[120px] text-sm font-semibold !py-2`} />
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={buildCustomOutput}
                    className="px-5 py-2.5 rounded-full text-sm bg-terracotta text-white border-none cursor-pointer font-medium shadow-lg shadow-terracotta/20">
                    Çıktıya Aktar
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCustomProgram([])}
                    className={`px-4 py-2.5 text-xs rounded-full border cursor-pointer ${dm ? 'border-white/10 text-white/50 bg-transparent' : 'border-stone-200 text-stone-500 bg-transparent'}`}>
                    Temizle
                  </motion.button>
                </div>
              </div>

              {/* Muscle group summary chips */}
              {programStats.muscles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {programStats.muscles.map((m, i) => (
                    <span key={m || i} className={`text-[0.65rem] px-2.5 py-1 rounded-full ${dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500'}`}>
                      {muscleIcons[m || ''] || '●'} {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                {customProgram.map((l, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl border group transition-all ${dm ? 'border-white/[0.04] hover:border-white/[0.08]' : 'border-stone-100 hover:border-stone-200'}`}
                  >
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-60 transition-opacity">
                      <button onClick={() => moveLine(i, -1)} className={`text-[0.6rem] leading-none bg-transparent border-none cursor-pointer p-0 ${dm ? 'text-white/40' : 'text-stone-400'}`}>▲</button>
                      <button onClick={() => moveLine(i, 1)} className={`text-[0.6rem] leading-none bg-transparent border-none cursor-pointer p-0 ${dm ? 'text-white/40' : 'text-stone-400'}`}>▼</button>
                    </div>
                    <span className={`text-xs w-6 h-6 rounded-lg flex items-center justify-center font-medium flex-shrink-0 ${dm ? 'bg-white/[0.06] text-white/40' : 'bg-stone-100 text-stone-400'}`}>{i + 1}</span>
                    <div className={`w-9 h-9 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0 ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
                      <ExerciseThumb exercise={l} dm={dm} />
                    </div>
                    <span className="flex-1 font-medium text-sm truncate">{l.exercise}</span>
                    <input type="number" value={l.sets} onChange={e => updateLine(i, 'sets', +e.target.value)}
                      className={`${inp} !w-14 text-center text-sm !py-2`} min={1} max={10} />
                    <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>×</span>
                    <input value={l.reps} onChange={e => updateLine(i, 'reps', e.target.value)}
                      className={`${inp} !w-16 text-center text-sm !py-2`} placeholder="10" />
                    <input value={l.note} onChange={e => updateLine(i, 'note', e.target.value)}
                      className={`${inp} !w-24 sm:!w-32 text-sm !py-2 hidden sm:block`} placeholder="Not..." />
                    <button onClick={() => removeLine(i)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer ${dm ? 'text-red-400/60 hover:bg-red-400/10' : 'text-red-400/60 hover:bg-red-50'}`}>
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left - Controls */}
        <motion.div variants={fadeUp} className="space-y-5">
          <div className={card}>
            {/* Tab Switcher */}
            <div className={`flex gap-1 p-1 rounded-xl mb-6 ${dm ? 'bg-white/[0.04]' : 'bg-stone-100'}`}>
              {([['templates', 'Şablonlar'], ['custom', 'Özel Ayarlar']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border-none ${activeTab === key
                    ? (dm ? 'bg-white/[0.08] text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm')
                    : (dm ? 'text-white/40 bg-transparent' : 'text-stone-400 bg-transparent')
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {/* Client Selector */}
              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Danışan</label>
                <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className={inp}>
                  {activeClients.length === 0
                    ? <option>Müşteri Yok</option>
                    : activeClients.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.sessions} Ders)</option>
                    ))}
                </select>
              </div>

              {activeTab === 'templates' ? (
                <>
                  {/* Split Templates */}
                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hazır Şablonlar</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: '3gun', label: '3 Gün', desc: 'Full Body', icon: '🔁' },
                        { key: '4gun', label: '4 Gün', desc: 'Upper/Lower', icon: '📅' },
                        { key: 'voleybol', label: 'Voleybol', desc: 'Spor Spesifik', icon: '🏐' },
                      ].map(s => (
                        <motion.button key={s.key} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setSplit(s.key)}
                          className={`p-4 rounded-xl text-left cursor-pointer border transition-all ${dm ? 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]' : 'border-stone-100 bg-stone-50/50 hover:bg-stone-50'}`}>
                          <span className="text-xl mb-1 block">{s.icon}</span>
                          <span className="text-sm font-medium block">{s.label}</span>
                          <span className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{s.desc}</span>
                        </motion.button>
                      ))}
                      {hasAI && (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={generateAI} disabled={loading}
                          className="p-4 rounded-xl text-left cursor-pointer border-none bg-gradient-to-br from-sage/20 to-sky-500/20 disabled:opacity-50">
                          <span className="text-xl mb-1 block">{loading ? '⏳' : '🧠'}</span>
                          <span className="text-sm font-medium block">{loading ? 'Üretiliyor...' : 'AI Program'}</span>
                          <span className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>LLM Council</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Nutrition Note */}
                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Program Notu</label>
                    <textarea value={nutritionNote} onChange={e => setNoteText(e.target.value)} rows={3} className={`${inp} resize-y text-sm`} />
                  </div>
                  {/* Quick Tips */}
                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hızlı Notlar</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Isınma 10dk', 'Soğuma 5dk', 'Süperset', 'Drop Set', 'RPE 8-9', '60sn dinlenme', '90sn dinlenme', 'Tempo 3-1-2'].map(tag => (
                        <button key={tag} onClick={() => setNoteText(prev => prev ? `${prev}\n${tag}` : tag)}
                          className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all border-none ${dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/[0.1]' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right - Preview */}
        <motion.div variants={fadeUp} ref={previewRef}>
          <div className={card}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dm ? 'bg-sage/10' : 'bg-sage/10'}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sage"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="font-display text-lg font-medium">WhatsApp Çıktısı</h3>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadPDF}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    PDF
                  </span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadPNG}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    PNG
                  </span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigator.clipboard.writeText(waPreview).then(() => showToast('Kopyalandı!'))}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                  Kopyala
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendWhatsApp}
                  className="px-5 py-2 rounded-full text-xs font-medium cursor-pointer bg-[#25D366] text-white border-none shadow-lg shadow-[#25D366]/20">
                  <span className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.638-1.467A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.175 0-4.19-.6-5.925-1.638l-.425-.25-2.75.87.888-2.675-.275-.438A9.71 9.71 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
                    Gönder
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Preview Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: previewInView ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)}
                className={`${inp} font-mono text-xs h-[380px] resize-y leading-relaxed`} />
            </motion.div>

            {/* Character count */}
            <div className={`flex justify-between items-center mt-3 text-xs ${dm ? 'text-white/20' : 'text-stone-300'}`}>
              <span>{waPreview.length} karakter</span>
              <span>{waPreview.split('\n').length} satır</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Export */}
      <div id="export-container" style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 550, background: '#FAF6F1', padding: '3rem 2rem', borderRadius: 12, fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '3px solid #7A9E82', paddingBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#1C1917', margin: 0 }}>ELA EBEOĞLU</h2>
          <div style={{ fontSize: '0.9rem', color: '#C2684A', letterSpacing: 4, marginTop: '0.5rem', fontWeight: 600 }}>PERFORMANCE COACHING</div>
        </div>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.15rem', lineHeight: 1.7, color: '#333' }}
          dangerouslySetInnerHTML={{ __html: waPreview.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#57534E', opacity: 0.8, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem' }}>
          📸 @ela.ebeoglu
        </div>
      </div>
    </motion.div>
  )
}
