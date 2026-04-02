import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { splits, sanitize } from '../../lib/constants'
import { exercises, categoryLabels, difficultyLabels } from '../../lib/exercises'
import { councilQuery } from '../../lib/ai'
import { toPng } from 'html-to-image'

interface WorkoutLine { exercise: string; sets: number; reps: string; note: string }

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Builder() {
  const { clients, darkMode: dm, showToast, aiKeys } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [selectedClient, setSelectedClient] = useState('')
  const [nutritionNote, setNoteText] = useState('Beslenme hedeflerine uygun makrolarını diyet listenden takip etmeyi unutma.')
  const [waPreview, setWaPreview] = useState(`🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 Yeni Danışan\n💪 Lütfen Müşteri ve Split Seçin.`)
  const [loading, setLoading] = useState(false)
  const [showExerciseDB, setShowExerciseDB] = useState(false)
  const [exSearch, setExSearch] = useState('')
  const [exFilter, setExFilter] = useState({ muscle: '', category: '', equipment: '' })
  const [customProgram, setCustomProgram] = useState<WorkoutLine[]>([])
  const [currentDay, setCurrentDay] = useState('Gün 1')

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`
  const hasAI = aiKeys.gemini || aiKeys.openrouter || aiKeys.deepseek

  const filteredExercises = exercises.filter(e => {
    if (exSearch && !e.name.toLowerCase().includes(exSearch.toLowerCase())) return false
    if (exFilter.muscle && e.muscle !== exFilter.muscle) return false
    if (exFilter.category && e.category !== exFilter.category) return false
    if (exFilter.equipment && e.equipment !== exFilter.equipment) return false
    return true
  })

  const uniqueMuscles = [...new Set(exercises.map(e => e.muscle))].sort()
  const uniqueEquipment = [...new Set(exercises.map(e => e.equipment))].sort()

  const addExerciseToProgram = (name: string) => setCustomProgram([...customProgram, { exercise: name, sets: 3, reps: '10', note: '' }])
  const updateLine = (idx: number, field: keyof WorkoutLine, value: string | number) => {
    const updated = [...customProgram]
    updated[idx] = { ...updated[idx], [field]: value }
    setCustomProgram(updated)
  }
  const removeLine = (idx: number) => setCustomProgram(customProgram.filter((_, i) => i !== idx))

  const buildCustomOutput = () => {
    const client = sanitize(selectedClient || 'Danışan')
    const lines = customProgram.map(l => `• ${l.exercise} ${l.sets}×${l.reps}${l.note ? ` (${l.note})` : ''}`).join('\n')
    setWaPreview(`🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 ${currentDay}\n\n${lines}\n\nBeslenme: ${sanitize(nutritionNote)}`)
  }

  const setSplit = (type: string) => {
    const client = sanitize(selectedClient || 'Yeni Danışan')
    const note = sanitize(nutritionNote)
    setWaPreview(`🏐 *ELA EBEOĞLU — Antrenman*\n━━━━━━━━━━━━━━━━━━━━\n👤 ${client}\n💪 Program Formatı: ${type.toUpperCase()}\n\n${splits[type]}\n\nBeslenme: ${note}`)
  }

  const generateAI = async () => {
    const client = sanitize(selectedClient || 'Danışan')
    const note = sanitize(nutritionNote)
    setLoading(true)
    setWaPreview('🏦 LLM Council çalışıyor...')
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

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Program Oluşturucu</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Egzersiz veritabanı, şablonlar & WhatsApp çıktısı</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowExerciseDB(!showExerciseDB)}
          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showExerciseDB
            ? 'bg-sage text-white border-none'
            : (dm ? 'border border-white/10 text-white/70 bg-transparent' : 'border border-stone-200 text-stone-600 bg-transparent')
          }`}
        >
          {showExerciseDB ? '✕ Kapat' : `Egzersiz DB (${exercises.length})`}
        </motion.button>
      </motion.div>      {/* Exercise Database Panel */}
      <AnimatePresence>
        {showExerciseDB && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className={`${card} border-sage/20`}>
              <div className="flex flex-wrap gap-3 mb-5">
                <input value={exSearch} onChange={e => setExSearch(e.target.value)} placeholder="Egzersiz ara..." className={`${inp} max-w-[200px]`} />
                <select value={exFilter.muscle} onChange={e => setExFilter({ ...exFilter, muscle: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Kaslar</option>
                  {uniqueMuscles.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={exFilter.category} onChange={e => setExFilter({ ...exFilter, category: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Kategoriler</option>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={exFilter.equipment} onChange={e => setExFilter({ ...exFilter, equipment: e.target.value })} className={`${inp} max-w-[160px]`}>
                  <option value="">Tüm Ekipman</option>
                  {uniqueEquipment.map(eq => <option key={eq} value={eq}>{eq}</option>)}
                </select>
                <span className={`text-xs self-center ${dm ? 'text-white/30' : 'text-stone-400'}`}>{filteredExercises.length} sonuç</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto">
                {filteredExercises.map((e, i) => (
                  <motion.div key={i}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => addExerciseToProgram(e.name)}
                    className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${dm ? 'border-white/[0.04] hover:border-sage/30 hover:bg-white/[0.04]' : 'border-stone-100 hover:border-sage/30 hover:bg-sage/5'}`}>
                    <div>
                      <div className="font-medium text-sm">{e.name}</div>
                      <div className={`text-[0.7rem] mt-0.5 ${dm ? 'text-white/30' : 'text-stone-400'}`}>{e.muscle} · {e.equipment}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className={`text-[0.65rem] px-2 py-0.5 rounded-md ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>{categoryLabels[e.category]?.split(' ')[0]}</span>
                      <span className={`text-[0.65rem] px-2 py-0.5 rounded-md ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>{difficultyLabels[e.difficulty]?.split(' ')[0]}</span>
                    </div>
                  </motion.div>
                ))}
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
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-lg font-medium">Özel Program</h3>
                  <input value={currentDay} onChange={e => setCurrentDay(e.target.value)} className={`${inp} max-w-[120px] text-sm font-semibold`} />
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={buildCustomOutput}
                    className="px-5 py-2.5 rounded-full text-sm bg-terracotta text-white border-none cursor-pointer font-medium">Çıktıya Aktar</motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCustomProgram([])}
                    className={`px-4 py-2.5 text-xs rounded-full border cursor-pointer ${dm ? 'border-white/10 text-white/50 bg-transparent' : 'border-stone-200 text-stone-500 bg-transparent'}`}>Temizle</motion.button>
                </div>
              </div>
              <div className="space-y-2">
                {customProgram.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${dm ? 'border-white/[0.04]' : 'border-stone-100'}`}
                  >
                    <span className={`text-xs w-6 text-center ${dm ? 'text-white/30' : 'text-stone-400'}`}>{i + 1}</span>
                    <span className="flex-1 font-medium text-sm">{l.exercise}</span>
                    <input type="number" value={l.sets} onChange={e => updateLine(i, 'sets', +e.target.value)} className={`${inp} w-16 text-center text-sm`} min={1} max={10} />
                    <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>×</span>
                    <input value={l.reps} onChange={e => updateLine(i, 'reps', e.target.value)} className={`${inp} w-20 text-center text-sm`} placeholder="10" />
                    <input value={l.note} onChange={e => updateLine(i, 'note', e.target.value)} className={`${inp} w-32 text-sm`} placeholder="Not..." />
                    <button onClick={() => removeLine(i)} className="text-terracotta/50 hover:text-terracotta bg-transparent border-none cursor-pointer text-lg transition-colors">×</button>
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
            <div className="space-y-5">
              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Danışan</label>
                <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className={inp}>
                  {activeClients.length === 0 ? <option>Müşteri Yok</option> : activeClients.map(c => (
                    <option key={c.id} value={c.name}>{c.name} ({c.sessions} Ders)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hazır Şablonlar</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: '3gun', label: '3 Gün' },
                    { key: '4gun', label: '4 Gün' },
                    { key: 'voleybol', label: 'Voleybol' },
                  ].map(s => (
                    <motion.button key={s.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSplit(s.key)}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}>
                      {s.label}
                    </motion.button>
                  ))}
                  {hasAI && (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={generateAI} disabled={loading}
                      className="px-5 py-2.5 rounded-full text-sm font-medium text-white border-none cursor-pointer bg-gradient-to-r from-sage to-sky-500 disabled:opacity-50">
                      {loading ? 'Oluşturuluyor...' : 'AI Program'}
                    </motion.button>
                  )}
                </div>
              </div>
              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Program Notu</label>
                <textarea value={nutritionNote} onChange={e => setNoteText(e.target.value)} rows={3} className={`${inp} resize-y text-sm`} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Preview */}
        <motion.div variants={fadeUp} className={card}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg font-medium">WhatsApp Çıktısı</h3>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadPNG}
                className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                PNG
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendWhatsApp}
                className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-terracotta text-white border-none">
                Gönder
              </motion.button>
            </div>
          </div>
          <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)} className={`${inp} font-mono text-xs h-[380px] resize-y`} />
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