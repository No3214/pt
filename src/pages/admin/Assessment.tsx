import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Assessment() {
  const { clients, measurements, addMeasurement, progressPhotos, addProgressPhoto, deleteProgressPhoto, showToast, darkMode: dm } = useStore()
  const [selectedClientId, setSelectedClientId] = useState('')
  const [fms, setFms] = useState({ deepSquat: 2, hurdleStep: 2, inlineLunge: 3, shoulderMobility: 1, activeStraightLeg: 2, coreStability: 3 })
  const [meas, setMeas] = useState({ shoulder: '', chest: '', waist: '', hip: '', leg: '', arm: '' })
  
  // Filtered data for selected client
  const clientMeasurements = useMemo(() => 
    measurements.filter(m => m.clientId === selectedClientId), [measurements, selectedClientId])
  const clientPhotos = useMemo(() => 
    progressPhotos.filter(p => p.clientId === selectedClientId), [progressPhotos, selectedClientId])

  const [postureNotes, setPostureNotes] = useState('')
  const [postureImg, setPostureImg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'fms' | 'measurements' | 'posture'>('fms')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const progressInput = useRef<HTMLInputElement>(null)
  const postureInput = useRef<HTMLInputElement>(null)
  const scoreRef = useRef(null)
  const scoreInView = useInView(scoreRef, { once: true })
  const fmsTotal = Object.values(fms).reduce((a, b) => a + b, 0)
  const fmsMax = Object.keys(fms).length * 3
  const fmsPercent = Math.round((fmsTotal / fmsMax) * 100)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  // Measurement change comparison
  const lastTwo = useMemo(() => {
    if (clientMeasurements.length < 2) return null
    const cur = clientMeasurements[clientMeasurements.length - 1]
    const prev = clientMeasurements[clientMeasurements.length - 2]
    return { cur, prev }
  }, [clientMeasurements])

  const saveMeasurements = () => {
    if (!selectedClientId) { showToast('Lütfen önce bir danışan seçin.'); return }
    addMeasurement(selectedClientId, { ...meas, date: new Date().toLocaleDateString('tr-TR') })
    showToast('Ölçümler kaydedildi!')
  }

  const handlePosturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPostureImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }
  const handleProgressPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 400
        let w = img.width, h = img.height
        if (w > h) { h = h * MAX / w; w = MAX } else { w = w * MAX / h; h = MAX }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.7)
        if (!selectedClientId) { showToast('Önce danışan seçin.'); return }
        addProgressPhoto(selectedClientId, { src: compressed, date: new Date().toLocaleDateString('tr-TR') })
        showToast('Fotoğraf eklendi!')
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const fmsFields = [
    { key: 'deepSquat', label: 'Derin Squat', desc: 'Bilateral mobilite & stabilite' },
    { key: 'hurdleStep', label: 'Hurdle Step', desc: 'Tek bacak dengesi' },
    { key: 'inlineLunge', label: 'Inline Lunge', desc: 'Kalça fleksör esnekliği' },    { key: 'shoulderMobility', label: 'Omuz Mobilitesi', desc: 'Üst gövde esnekliği' },
    { key: 'activeStraightLeg', label: 'Aktif Düz Bacak', desc: 'Hamstring esnekliği' },
    { key: 'coreStability', label: 'Core Stabilite', desc: 'Gövde anti-extension' },
  ] as const

  const measLabels: Record<string, string> = { shoulder: 'Omuz', chest: 'Göğüs', waist: 'Bel', hip: 'Kalça', leg: 'Sağ Bacak', arm: 'Sağ Kol' }
  const measIcons: Record<string, string> = { shoulder: '💪', chest: '🫁', waist: '📐', hip: '🦴', leg: '🦵', arm: '💪' }

  const tabs = [
    { id: 'fms' as const, label: 'FMS Skorlama', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    )},
    { id: 'measurements' as const, label: 'Ölçümler', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 6H3"/><path d="M21 12H3"/><path d="M21 18H3"/><circle cx="9" cy="6" r="2" fill="currentColor"/><circle cx="15" cy="12" r="2" fill="currentColor"/><circle cx="7" cy="18" r="2" fill="currentColor"/></svg>
    )},
    { id: 'posture' as const, label: 'Postür Analizi', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 22l4-6 4 6"/></svg>
    )},
  ]

  const scoreColors = [
    { min: 0, max: 0, bg: dm ? 'bg-red-500/10' : 'bg-red-50', text: 'text-red-500', ring: '#ef4444' },
    { min: 1, max: 1, bg: dm ? 'bg-amber-500/10' : 'bg-amber-50', text: 'text-amber-500', ring: '#f59e0b' },
    { min: 2, max: 2, bg: dm ? 'bg-secondary/10' : 'bg-secondary/5', text: 'text-secondary', ring: '#7A9E82' },
    { min: 3, max: 3, bg: dm ? 'bg-sky-500/10' : 'bg-sky-50', text: 'text-sky-500', ring: '#0ea5e9' },
  ]
  const getScoreStyle = (v: number) => scoreColors.find(s => v >= s.min && v <= s.max) || scoreColors[0]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Fiziksel Değerlendirme</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>FMS skorlama, çevre ölçümleri & postür analizi</p>
        </div>
        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${fmsPercent > 70 ? (dm ? 'bg-secondary/10 text-secondary' : 'bg-secondary/10 text-secondary') : (dm ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary')}`}>
            <span className="font-semibold">{fmsTotal}/{fmsMax}</span> FMS
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500'}`}>
            {clientMeasurements.length} ölçüm
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500'}`}>
            {clientPhotos.length} fotoğraf
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className={`flex gap-1 p-1.5 rounded-2xl mb-8 ${dm ? 'bg-white/[0.04]' : 'bg-stone-100'}`}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`relative flex-1 py-3 px-4 rounded-xl text-sm font-medium cursor-pointer transition-all border-none ${activeTab === t.id              ? (dm ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm')
              : (dm ? 'text-white/40 bg-transparent hover:text-white/60' : 'text-stone-400 bg-transparent hover:text-stone-600')
            }`}>
            <span className="flex items-center justify-center gap-2">{t.icon}{t.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Client Selector */}
      <motion.div variants={fadeUp} className="mb-8 p-6 rounded-2xl border transition-all bg-primary/5 border-primary/10">
        <label className={`block mb-2 text-xs font-bold uppercase tracking-widest ${dm ? 'text-primary/70' : 'text-primary'}`}>Değerlendirilecek Danışanı Seçin</label>
        <select 
          value={selectedClientId} 
          onChange={e => setSelectedClientId(e.target.value)} 
          className={inp}
        >
          <option value="">Danışan Seçin...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* FMS Tab */}
        {activeTab === 'fms' && (
          <motion.div key="fms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid md:grid-cols-[1fr_300px] gap-8">
              <div className={card}>
                <h3 className="font-display text-xl font-medium mb-2">Fonksiyonel Hareket Taraması</h3>
                <p className={`text-xs mb-6 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Her hareket için 0-3 arası puan verin</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fmsFields.map((f, fi) => {
                    const val = fms[f.key]
                    const style = getScoreStyle(val)
                    return (
                      <motion.div
                        key={f.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: fi * 0.05 }}
                        className={`p-4 rounded-xl transition-all ${style.bg}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-sm font-semibold">{f.label}</label>
                          <span className={`text-lg font-bold ${style.text}`}>{val}</span>
                        </div>                        <p className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{f.desc}</p>
                        <div className="flex gap-1.5 mt-3">
                          {[0, 1, 2, 3].map(v => (
                            <button key={v} onClick={() => setFms({ ...fms, [f.key]: v })}
                              className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none ${fms[f.key] === v
                                ? 'bg-primary text-white shadow-sm'
                                : (dm ? 'bg-white/[0.06] text-white/40 hover:bg-white/10 hover:text-white/60' : 'bg-white text-stone-400 hover:bg-stone-100 hover:text-stone-600')
                              }`}>
                              {v}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* FMS Score Ring */}
              <div ref={scoreRef} className={`${card} flex flex-col items-center justify-center text-center sticky top-6`}>
                <div className="relative w-40 h-40 mb-5">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke={dm ? 'rgba(255,255,255,0.06)' : '#f5f5f4'} strokeWidth="8" />
                    <motion.circle cx="60" cy="60" r="52" fill="none"
                      stroke={fmsPercent > 70 ? '#7A9E82' : fmsPercent > 40 ? '#f59e0b' : '#C2684A'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: scoreInView ? 2 * Math.PI * 52 * (1 - fmsPercent / 100) : 2 * Math.PI * 52 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-4xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                    >{fmsTotal}</motion.span>
                    <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>/ {fmsMax}</span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${fmsPercent > 70 ? 'text-secondary' : fmsPercent > 40 ? 'text-amber-500' : 'text-primary'}`}>
                  {fmsPercent > 70 ? 'İyi Seviye' : fmsPercent > 40 ? 'Orta Seviye' : 'Geliştirilmeli'}
                </p>
                <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>FMS Toplam Skor</p>

                {/* Score Legend */}
                <div className={`mt-6 pt-5 border-t w-full space-y-2 ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
                  {[
                    { score: 3, label: 'Mükemmel', color: 'text-sky-500' },
                    { score: 2, label: 'İyi', color: 'text-secondary' },
                    { score: 1, label: 'Sınırlı', color: 'text-amber-500' },
                    { score: 0, label: 'Ağrı', color: 'text-red-500' },
                  ].map(s => (
                    <div key={s.score} className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${s.color}`}>{s.score}</span>
                      <span className={dm ? 'text-white/40' : 'text-stone-400'}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Measurements Tab */}
        {activeTab === 'measurements' && (
          <motion.div key="measurements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* Change comparison cards */}
            {lastTwo && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => {
                  const cur = parseFloat(lastTwo.cur[k]) || 0
                  const prev = parseFloat(lastTwo.prev[k]) || 0
                  const diff = cur - prev
                  return (
                    <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-xl text-center ${dm ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-white border border-black/[0.04]'}`}>
                      <p className={`text-[0.65rem] uppercase tracking-wider mb-1 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{measLabels[k]}</p>
                      <p className="text-lg font-semibold">{cur || '-'}</p>
                      {diff !== 0 && cur > 0 && (
                        <p className={`text-[0.7rem] font-medium mt-0.5 ${diff > 0 ? 'text-primary' : 'text-secondary'}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)} cm
                        </p>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}

            <div className={card}>
              <h3 className="font-display text-xl font-medium mb-2">Çevre Ölçümleri (cm)</h3>
              <p className={`text-xs mb-6 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Haftalık ölçüm alarak ilerlemeyi takip edin</p>              <div className="grid grid-cols-3 gap-4">
                {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => (
                  <div key={k}>
                    <label className={`flex items-center gap-1.5 mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>
                      <span>{measIcons[k]}</span>{measLabels[k]}
                    </label>
                    <input type="number" value={meas[k]} onChange={e => setMeas({ ...meas, [k]: e.target.value })} placeholder="0" className={inp} />
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={saveMeasurements}
                className="w-full mt-6 py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer"
              >
                Ölçümleri Kaydet
              </motion.button>

              {/* History */}
              {clientMeasurements.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-medium ${dm ? 'text-white/50' : 'text-stone-500'}`}>Geçmiş Ölçümler</h4>
                    <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-300'}`}>{clientMeasurements.length} kayıt</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={dm ? 'bg-white/[0.04]' : 'bg-stone-50'}>
                          <th className={`text-left py-3 px-4 font-medium text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>Tarih</th>                          {Object.values(measLabels).map(l => <th key={l} className={`text-center py-3 px-3 font-medium text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{l}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {clientMeasurements.slice(-5).reverse().map((m, i) => (
                          <tr key={i} className={`border-b transition-colors ${dm ? 'border-white/[0.04] hover:bg-white/[0.02]' : 'border-stone-50 hover:bg-stone-50/50'}`}>
                            <td className={`py-3 px-4 text-xs font-medium ${dm ? 'text-white/60' : 'text-stone-600'}`}>{m.date}</td>
                            {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => (
                              <td key={k} className="text-center py-3 px-3">{m[k] || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Posture Tab */}
        {activeTab === 'posture' && (
          <motion.div key="posture" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Photo Upload */}
              <div className={card}>
                <h3 className="font-display text-xl font-medium mb-2">Postür Fotoğrafı</h3>
                <p className={`text-xs mb-6 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Kifoz, lordoz veya asimetri analizi</p>
                <div onClick={() => postureInput.current?.click()}                  className={`aspect-[3/4] max-w-[400px] mx-auto border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary/30 group ${dm ? 'border-white/10 bg-white/[0.02]' : 'border-stone-200 bg-stone-50'}`}>
                  {postureImg ? (
                    <img src={postureImg} alt="Postür" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-center p-6">
                      <svg className={`w-12 h-12 mx-auto mb-3 ${dm ? 'text-white/20' : 'text-stone-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                      <div className={`text-sm font-medium ${dm ? 'text-white/30' : 'text-stone-400'}`}>Fotoğraf yükle</div>
                      <div className={`text-xs mt-1 ${dm ? 'text-white/20' : 'text-stone-300'}`}>PNG, JPG veya WebP</div>
                    </div>
                  )}
                </div>
                <input ref={postureInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePosturePhoto} />
              </div>

              {/* Notes & Save */}
              <div className={card}>
                <h3 className="font-display text-xl font-medium mb-2">Değerlendirme Notları</h3>
                <p className={`text-xs mb-6 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Düzeltici egzersiz hedefleri ve gözlemler</p>

                {/* Quick Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Anterior Pelvik Tilt', 'Posterior Pelvik Tilt', 'Kifoz', 'Lordoz', 'Skolyoz', 'Omuz Asimetrisi', 'Diz Valgus'].map(tag => (
                    <button key={tag} onClick={() => setPostureNotes(prev => prev ? `${prev}\n• ${tag}` : `• ${tag}`)}                      className={`px-3 py-1.5 rounded-full text-[0.7rem] font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/50 bg-transparent hover:bg-white/5 hover:text-white/70' : 'border-stone-200 text-stone-500 bg-transparent hover:bg-stone-50'}`}>
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea value={postureNotes} onChange={e => setPostureNotes(e.target.value)} rows={8} placeholder="Örn: Anterior pelvik tilt gözlendi, hip flexor germe + glute aktivasyonu önerildi..." className={`${inp} resize-y`} />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => showToast('Analiz kaydedildi!')}
                  className="w-full mt-4 py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer"
                >
                  Analizi Kaydet
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Photos */}
      <motion.div variants={fadeUp} className={`mt-10 ${card}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display text-xl font-medium">İlerleme Fotoğrafları</h3>
            <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Before / After karşılaştırma</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}            onClick={() => progressInput.current?.click()}
            className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium border-none cursor-pointer"
          >
            + Fotoğraf
          </motion.button>
        </div>
        <input ref={progressInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleProgressPhoto} />

        {clientPhotos.length === 0 ? (
          <div className={`w-full py-16 text-center border-2 border-dashed rounded-2xl ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}>
            <svg className={`w-10 h-10 mx-auto mb-3 ${dm ? 'text-white/15' : 'text-stone-200'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
            </svg>
            <p className={`text-sm font-medium ${dm ? 'text-white/25' : 'text-stone-300'}`}>Henüz fotoğraf eklenmedi</p>
            <p className={`text-xs mt-1 ${dm ? 'text-white/15' : 'text-stone-200'}`}>İlerlemeyi görsel olarak takip edin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {clientPhotos.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={`group rounded-xl overflow-hidden border cursor-pointer transition-shadow hover:shadow-lg ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}
              >
                <div className="relative" onClick={() => setLightbox(i)}>
                  <img src={p.src} alt={`İlerleme ${p.date}`} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
                <div className={`p-2.5 flex items-center justify-between ${dm ? 'bg-white/[0.03]' : 'bg-stone-50'}`}>
                  <span className="text-xs font-medium">{p.date}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteProgressPhoto(i) }}
                    className="bg-transparent border-none cursor-pointer text-primary/50 hover:text-primary text-xs transition-colors">
                    Sil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[400] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              src={clientPhotos[lightbox]?.src}
              alt="Büyük görünüm"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)) }}
                className="w-10 h-10 rounded-full bg-white/10 text-white border-none cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                ‹
              </button>
              <span className="text-white/70 text-sm font-medium">{lightbox + 1} / {clientPhotos.length}</span>
              <button onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(clientPhotos.length - 1, lightbox + 1)) }}
                className="w-10 h-10 rounded-full bg-white/10 text-white border-none cursor-pointer flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}