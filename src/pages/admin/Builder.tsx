import { useState } from 'react'
import { useStore } from '../../stores/useStore'
import { splits, sanitize } from '../../lib/constants'
import { exercises, categoryLabels, difficultyLabels } from '../../lib/exercises'
import { councilQuery } from '../../lib/ai'
import { toPng } from 'html-to-image'

interface WorkoutLine { exercise: string; sets: number; reps: string; note: string }

export default function Builder() {
  const { clients, darkMode, showToast, aiKeys } = useStore()
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

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'
  const hasAI = aiKeys.gemini || aiKeys.openrouter || aiKeys.deepseek

  // Filter exercises
  const filteredExercises = exercises.filter(e => {
    if (exSearch && !e.name.toLowerCase().includes(exSearch.toLowerCase())) return false
    if (exFilter.muscle && e.muscle !== exFilter.muscle) return false
    if (exFilter.category && e.category !== exFilter.category) return false
    if (exFilter.equipment && e.equipment !== exFilter.equipment) return false
    return true
  })

  const uniqueMuscles = [...new Set(exercises.map(e => e.muscle))].sort()
  const uniqueEquipment = [...new Set(exercises.map(e => e.equipment))].sort()

  const addExerciseToProgram = (name: string) => {
    setCustomProgram([...customProgram, { exercise: name, sets: 3, reps: '10', note: '' }])
  }

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
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h2 className="font-display text-3xl font-semibold">Program & WhatsApp Çıktısı</h2>
        <button onClick={() => setShowExerciseDB(!showExerciseDB)}
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all ${showExerciseDB ? 'bg-sage text-white border-none' : `border ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}`}>
          {showExerciseDB ? '✕ DB Kapat' : '📚 Egzersiz Veritabanı (96)'}
        </button>
      </div>

      {/* Exercise Database Panel */}
      {showExerciseDB && (
        <div className={`${cardBg} p-6 rounded-md mb-8 border ${darkMode ? 'border-white/5' : 'border-sage/20'}`}>
          <div className="flex flex-wrap gap-3 mb-4">
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
            <span className="text-xs text-[#57534E] self-center">{filteredExercises.length} egzersiz</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
            {filteredExercises.map((e, i) => (
              <div key={i} onClick={() => addExerciseToProgram(e.name)}
                className={`flex items-center justify-between p-3 rounded-sm cursor-pointer transition-all border ${darkMode ? 'border-white/5 hover:border-sage/30 hover:bg-white/5' : 'border-black/5 hover:border-sage/30 hover:bg-sage/5'}`}>
                <div>
                  <div className="font-medium text-sm">{e.name}</div>
                  <div className="text-[0.7rem] text-[#57534E]">{e.muscle} · {e.equipment}</div>
                </div>
                <div className="flex gap-1">
                  <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-black/5">{categoryLabels[e.category]?.split(' ')[0]}</span>
                  <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-black/5">{difficultyLabels[e.difficulty]?.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Program Builder */}
      {customProgram.length > 0 && (
        <div className={`${cardBg} p-6 rounded-md mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">🏗 Özel Program Oluşturucu</h3>
              <input value={currentDay} onChange={e => setCurrentDay(e.target.value)} className={`${inp} max-w-[120px] font-semibold`} />
            </div>
            <div className="flex gap-2">
              <button onClick={buildCustomOutput} className="px-4 py-2 rounded-full text-sm bg-terracotta text-white border-none cursor-pointer">Çıktıya Aktar</button>
              <button onClick={() => setCustomProgram([])} className={`px-3 py-2 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Temizle</button>
            </div>
          </div>
          <div className="space-y-2">
            {customProgram.map((l, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-sm border ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                <span className="text-xs text-[#57534E] w-6">{i + 1}.</span>
                <span className="flex-1 font-medium text-sm">{l.exercise}</span>
                <input type="number" value={l.sets} onChange={e => updateLine(i, 'sets', +e.target.value)} className={`${inp} w-16 text-center`} min={1} max={10} />
                <span className="text-xs text-[#57534E]">×</span>
                <input value={l.reps} onChange={e => updateLine(i, 'reps', e.target.value)} className={`${inp} w-20 text-center`} placeholder="10" />
                <input value={l.note} onChange={e => updateLine(i, 'note', e.target.value)} className={`${inp} w-32`} placeholder="Not..." />
                <button onClick={() => removeLine(i)} className="text-terracotta bg-transparent border-none cursor-pointer text-lg">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left - Controls */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Müşteri Seç</label>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className={inp}>
              {activeClients.length === 0 ? <option>Müşteri Yok</option> : activeClients.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.sessions} Ders)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Hazır Şablonlar</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setSplit('3gun')} className={`px-4 py-2 rounded-full text-sm border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>3 Gün</button>
              <button onClick={() => setSplit('4gun')} className="px-4 py-2 rounded-full text-sm bg-terracotta text-white border-none cursor-pointer">4 Gün</button>
              <button onClick={() => setSplit('voleybol')} className={`px-4 py-2 rounded-full text-sm border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Voleybol</button>
              {hasAI && <button onClick={generateAI} disabled={loading} className="px-4 py-2 rounded-full text-sm text-white border-none cursor-pointer bg-gradient-to-r from-sage to-coast disabled:opacity-50">✨ AI Program</button>}
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Program Notu</label>
            <textarea value={nutritionNote} onChange={e => setNoteText(e.target.value)} rows={3} className={`${inp} resize-y`} />
          </div>
        </div>

        {/* Right - Preview */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">📝 WhatsApp Çıktısı</h3>
            <div className="flex gap-2">
              <button onClick={downloadPNG} className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>PNG 📸</button>
              <button onClick={sendWhatsApp} className="px-3 py-1 text-xs rounded-full bg-terracotta text-white border-none cursor-pointer">Gönder ↗️</button>
            </div>
          </div>
          <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)} className={`${inp} font-mono h-[350px] resize-y`} />
        </div>
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
          📸 @ela.ebeoglu | 🌐 elaebeoglu.com
        </div>
      </div>
    </div>
  )
}
