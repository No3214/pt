import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Assessment() {
  const { measurements, addMeasurement, progressPhotos, addProgressPhoto, deleteProgressPhoto, showToast, darkMode: dm } = useStore()
  const [fms, setFms] = useState({ deepSquat: 2, hurdleStep: 2, inlineLunge: 3, shoulderMobility: 1, activeStraightLeg: 2, coreStability: 3 })
  const [meas, setMeas] = useState({ shoulder: '', chest: '', waist: '', hip: '', leg: '', arm: '' })
  const [postureNotes, setPostureNotes] = useState('')
  const [postureImg, setPostureImg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'fms' | 'measurements' | 'posture'>('fms')
  const progressInput = useRef<HTMLInputElement>(null)
  const postureInput = useRef<HTMLInputElement>(null)

  const fmsTotal = Object.values(fms).reduce((a, b) => a + b, 0)
  const fmsMax = Object.keys(fms).length * 3
  const fmsPercent = Math.round((fmsTotal / fmsMax) * 100)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const saveMeasurements = () => {
    addMeasurement({ ...meas, date: new Date().toLocaleDateString('tr-TR') })
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
        addProgressPhoto({ src: compressed, date: new Date().toLocaleDateString('tr-TR') })
        showToast('Fotoğraf eklendi!')
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const fmsFields = [
    { key: 'deepSquat', label: 'Derin Squat', icon: '🏋️' },
    { key: 'hurdleStep', label: 'Hurdle Step', icon: '🦵' },
    { key: 'inlineLunge', label: 'Inline Lunge', icon: '🚶' },
    { key: 'shoulderMobility', label: 'Omuz Mobilitesi', icon: '💪' },
    { key: 'activeStraightLeg', label: 'Aktif Düz Bacak', icon: '🦿' },
    { key: 'coreStability', label: 'Core Stabilite', icon: '🎯' },
  ] as const

  const measLabels: Record<string, string> = { shoulder: 'Omuz', chest: 'Göğüs', waist: 'Bel', hip: 'Kalça', leg: 'Sağ Bacak', arm: 'Sağ Kol' }

  const tabs = [
    { id: 'fms' as const, label: 'FMS Skorlama', icon: '📐' },
    { id: 'measurements' as const, label: 'Ölçümler', icon: '📏' },
    { id: 'posture' as const, label: 'Postür Analizi', icon: '👤' },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Fiziksel Değerlendirme</h2>
        <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>FMS skorlama, çevre ölçümleri & postür analizi</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className={`flex gap-2 p-1.5 rounded-2xl mb-8 ${dm ? 'bg-white/[0.04]' : 'bg-stone-100'}`}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium cursor-pointer transition-all border-none ${activeTab === t.id
              ? (dm ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-stone-900 shadow-sm')
              : (dm ? 'text-white/40 bg-transparent hover:text-white/60' : 'text-stone-400 bg-transparent hover:text-stone-600')
            }`}>
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </motion.div>      <AnimatePresence mode="wait">
        {/* FMS Tab */}
        {activeTab === 'fms' && (
          <motion.div key="fms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="grid md:grid-cols-[1fr_280px] gap-8">
              <div className={card}>
                <div className="grid grid-cols-2 gap-4">
                  {fmsFields.map(f => (
                    <div key={f.key} className={`p-4 rounded-xl ${dm ? 'bg-white/[0.03]' : 'bg-stone-50'}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span>{f.icon}</span>
                        <label className="text-sm font-medium">{f.label}</label>
                      </div>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map(v => (
                          <button key={v} onClick={() => setFms({ ...fms, [f.key]: v })}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all border-none ${fms[f.key] === v
                              ? 'bg-terracotta text-white'
                              : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-white text-stone-400 hover:bg-stone-100')
                            }`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FMS Score Ring */}
              <div className={`${card} flex flex-col items-center justify-center text-center`}>
                <div className="relative w-36 h-36 mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke={dm ? 'rgba(255,255,255,0.06)' : '#f5f5f4'} strokeWidth="10" />
                    <motion.circle cx="60" cy="60" r="52" fill="none"
                      stroke={fmsPercent > 70 ? '#7A9E82' : '#C2684A'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - fmsPercent / 100) }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{fmsTotal}</span>
                    <span className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>/ {fmsMax}</span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${fmsPercent > 70 ? 'text-sage' : 'text-terracotta'}`}>
                  {fmsPercent > 70 ? 'İyi Seviye' : 'Geliştirilmeli'}
                </p>
                <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>FMS Toplam Skor</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Measurements Tab */}
        {activeTab === 'measurements' && (
          <motion.div key="measurements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className={card}>
              <h3 className="font-display text-xl font-medium mb-6">Çevre Ölçümleri (cm)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => (
                  <div key={k}>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>{measLabels[k]}</label>
                    <input type="number" value={meas[k]} onChange={e => setMeas({ ...meas, [k]: e.target.value })} placeholder="0" className={inp} />
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={saveMeasurements}
                className="w-full mt-6 py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
              >
                Ölçümleri Kaydet
              </motion.button>

              {/* History */}
              {measurements.length > 0 && (
                <div className="mt-8">
                  <h4 className={`text-sm font-medium mb-4 ${dm ? 'text-white/50' : 'text-stone-500'}`}>Geçmiş Ölçümler</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
                          <th className="text-left py-3 font-medium">Tarih</th>
                          {Object.values(measLabels).map(l => <th key={l} className="text-center py-3 font-medium">{l}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {measurements.slice(-5).reverse().map((m, i) => (
                          <tr key={i} className={`border-b ${dm ? 'border-white/[0.04]' : 'border-stone-50'}`}>
                            <td className="py-3 text-xs">{m.date}</td>
                            {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => (
                              <td key={k} className="text-center py-3">{m[k] || '-'}</td>
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
            <div className={card}>
              <h3 className="font-display text-xl font-medium mb-2">Postür Analizi</h3>
              <p className={`text-sm mb-6 ${dm ? 'text-white/40' : 'text-stone-400'}`}>Kifoz, lordoz veya asimetri analizi için fotoğraf ekleyin.</p>
              <div onClick={() => postureInput.current?.click()}
                className={`aspect-[4/3] max-w-[500px] mx-auto border-2 border-dashed rounded-2xl mb-6 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-terracotta/30 ${dm ? 'border-white/10 bg-white/[0.02]' : 'border-stone-200 bg-stone-50'}`}>
                {postureImg ? <img src={postureImg} alt="Postür" className="w-full h-full object-cover" /> : (
                  <div className="text-center">
                    <div className="text-4xl mb-3 opacity-40">📸</div>
                    <div className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Postür fotoğrafı yükle</div>
                  </div>
                )}
              </div>
              <input ref={postureInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePosturePhoto} />
              <div className="mb-6">
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Notlar & Düzeltici Egzersiz Hedefleri</label>
                <textarea value={postureNotes} onChange={e => setPostureNotes(e.target.value)} rows={4} placeholder="Örn: Anterior pelvik tilt gözlendi..." className={`${inp} resize-y`} />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => showToast('Analiz kaydedildi!')}
                className="w-full py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
              >
                Analizi Kaydet
              </motion.button>
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
            whileTap={{ scale: 0.95 }}
            onClick={() => progressInput.current?.click()}
            className="px-5 py-2.5 rounded-full bg-terracotta text-white text-sm font-medium border-none cursor-pointer"
          >
            + Fotoğraf
          </motion.button>
        </div>
        <input ref={progressInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleProgressPhoto} />
        <div className="flex gap-4 overflow-x-auto py-2 pb-4">
          {progressPhotos.length === 0 ? (
            <div className={`w-full py-12 text-center border-2 border-dashed rounded-2xl ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}>
              <p className="text-3xl mb-2 opacity-30">📸</p>
              <p className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Henüz fotoğraf eklenmedi</p>
            </div>
          ) : progressPhotos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex-shrink-0 w-44 rounded-xl overflow-hidden border ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}
            >
              <img src={p.src} alt={`İlerleme ${p.date}`} className="w-44 h-52 object-cover" />
              <div className="p-3 text-center">
                <div className="text-xs font-medium">{p.date}</div>
                <button onClick={() => deleteProgressPhoto(i)} className="bg-transparent border-none cursor-pointer text-terracotta/60 hover:text-terracotta text-xs mt-1 transition-colors">Sil</button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}