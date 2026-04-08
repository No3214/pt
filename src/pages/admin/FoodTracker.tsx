import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../../lib/constants'
import { callGemini } from '../../lib/ai'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

function MacroRing({ value, max, color, label, unit, dm }: { value: number; max: number; color: string; label: string; unit: string; dm: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const r = 38, circ = 2 * Math.PI * r
  const colors: Record<string, string> = { primary: '#C2684A', secondary: '#7A9E82', sand: '#D4C4AB', accent: '#5e8fa8' }
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke={dm ? 'rgba(255,255,255,0.06)' : '#f5f5f4'} strokeWidth="6" />
          <motion.circle cx="45" cy="45" r={r} fill="none"
            stroke={colors[color] || color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: inView ? circ * (1 - pct / 100) : circ }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold">{Math.round(value)}</span>
          <span className={`text-[0.6rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{unit}</span>
        </div>
      </div>
      <span className={`text-xs font-medium mt-2 ${dm ? 'text-white/50' : 'text-stone-500'}`}>{label}</span>
      {max > 0 && <span className={`text-[0.6rem] ${dm ? 'text-white/25' : 'text-stone-300'}`}>{Math.round(pct)}%</span>}
    </div>
  )
}

export default function FoodTracker() {
  const { foodLog, addFood, removeFood, clearFoodLog, showToast, darkMode: dm } = useStore()
  const [search, setSearch] = useState('')
  const [foodImg, setFoodImg] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`
  const hasVision = true

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })
  // Quick-add popular items
  const quickFoods = useMemo(() => [
    turkishFoods.find(f => f.name.includes('Yumurta')),
    turkishFoods.find(f => f.name.includes('Tavuk')),
    turkishFoods.find(f => f.name.includes('Pilav')),
    turkishFoods.find(f => f.name.includes('Yulaf')),
    turkishFoods.find(f => f.name.includes('Muz')),
    turkishFoods.find(f => f.name.includes('Süt')),
  ].filter(Boolean) as FoodItem[], [])

  const handlePhotoPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFoodImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const analyzeWithAI = async () => {
    if (!foodImg) { showToast('Lütfen önce bir fotoğraf yükleyin.'); return }
    const base64 = foodImg.split(',')[1]
    if (!base64) return
    setAnalyzing(true)
    const prompt = `Sen uzman bir sporcu diyetisyenisin. Fotoğraftaki ana yemeği tespit et (Türk mutfağı ise belirt). Tahmini kalori ve makro değerlerini hesapla. SADECE saf JSON döndür, markdown kullanma:\n{"name":"Yemek Adı (Miktar)","cal":250,"p":15,"f":5,"c":30}`
    try {
      let result: string | null = null
      result = await callGemini(prompt, base64)
      if (!result) throw new Error('Vision API yanıt vermedi')
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim()
      const foodData: FoodItem = JSON.parse(cleaned)
      addFood(foodData)
      showToast(`AI tespit: ${foodData.name} - ${foodData.cal} kcal`)
    } catch (err: unknown) {
      showToast('AI Analiz Hatası: ' + err.message)
    }
    setAnalyzing(false)
  }

  const waMsg = foodLog.length > 0
    ? `📸 *GÜNLÜK YEMEK LOGU*\n━━━━━━━━━━━━━━━━━━━━\n${foodLog.map(f => `• ${f.name} — ${f.cal} kcal`).join('\n')}\n\n📊 *TOPLAM:*\n🔥 ${totals.cal} kcal\n🥩 P: ${Math.round(totals.p)}g · 🥑 Y: ${Math.round(totals.f)}g · 🍚 K: ${Math.round(totals.c)}g`
    : ''

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Yemek Takibi</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Fotoğraf analizi & besin veritabanı</p>
        </div>
        <div className="flex gap-2">
          {hasVision && (
            <span className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${dm ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              AI Vision
            </span>
          )}          <span className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500'}`}>
            {foodLog.length} öğün
          </span>
        </div>
      </motion.div>

      {/* Macro Rings */}
      <motion.div variants={fadeUp} className={`${card} mb-8`}>
        <div className="flex items-center justify-around flex-wrap gap-6">
          <MacroRing value={totals.cal} max={2200} color="primary" label="Kalori" unit="kcal" dm={dm} />
          <MacroRing value={totals.p} max={150} color="secondary" label="Protein" unit="g" dm={dm} />
          <MacroRing value={totals.f} max={70} color="sand" label="Yağ" unit="g" dm={dm} />
          <MacroRing value={totals.c} max={250} color="accent" label="Karbonhidrat" unit="g" dm={dm} />
        </div>
        {/* Linear summary under rings */}
        <div className={`mt-6 pt-4 border-t flex items-center justify-center gap-6 text-xs ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
          <span className={dm ? 'text-white/30' : 'text-stone-400'}>Hedef: 2200 kcal</span>
          <span className={`font-medium ${totals.cal > 2200 ? 'text-primary' : 'text-secondary'}`}>
            {totals.cal > 2200 ? `+${totals.cal - 2200}` : `${2200 - totals.cal} kalan`}
          </span>
        </div>
      </motion.div>

      {/* Quick Add Bar */}
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h3 className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>Hızlı Ekle</h3>
          <div className={`flex-1 h-px ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickFoods.map((f, i) => (
            <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { addFood(f); showToast(`${f.name} eklendi`) }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/[0.08] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]' : 'border-black/[0.04] bg-white text-stone-600 hover:bg-stone-50'}`}>              {f.name} · <span className="text-primary">{f.cal}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left */}
        <div className="space-y-6">
          {/* Photo */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-lg font-medium mb-4">Yemek Fotoğrafı</h3>
            <div onClick={() => fileInput.current?.click()}
              className={`aspect-video rounded-xl mb-4 flex items-center justify-center cursor-pointer overflow-hidden transition-all group ${dm ? 'bg-white/[0.04] hover:bg-white/[0.06]' : 'bg-stone-50 hover:bg-stone-100'}`}>
              {foodImg ? (
                <img src={foodImg} alt="Secilen yemek fotografi" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="text-center">
                  <svg className={`w-10 h-10 mx-auto mb-2 ${dm ? 'text-white/15' : 'text-stone-200'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <div className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Fotoğraf çek veya yükle</div>
                </div>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" capture="environment" className="hidden" onChange={handlePhotoPreview} />
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInput.current?.click()}
                className={`flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                Galeri
              </motion.button>              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInput.current?.click()}
                className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer bg-primary text-white border-none">
                Kamera
              </motion.button>
            </div>
            {hasVision && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={analyzeWithAI}
                disabled={analyzing}
                className="w-full mt-3 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer bg-gradient-to-r from-primary to-amber-500 disabled:opacity-50"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Analiz ediliyor...
                  </span>
                ) : 'AI ile Kalori Tespit Et'}
              </motion.button>
            )}
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-lg font-medium mb-4">Besin Ekle</h3>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara... (tavuk, pilav, yumurta...)" className={inp} />
            {filtered.length > 0 && (
              <p className={`text-xs mt-2 mb-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>{filtered.length} sonuç</p>            )}
            <div className="max-h-[280px] overflow-y-auto mt-2">
              <AnimatePresence>
                {filtered.map((f, i) => (
                  <motion.div
                    key={f.name + i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { addFood(f); setSearch(''); showToast(`${f.name} eklendi`) }}
                    className={`flex justify-between items-center p-3.5 border-b cursor-pointer transition-all ${dm ? 'border-white/[0.04] hover:bg-white/[0.04]' : 'border-stone-50 hover:bg-stone-50'}`}
                  >
                    <div>
                      <span className="text-sm font-medium">{f.name}</span>
                      <div className={`text-xs mt-0.5 flex gap-2 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                        <span className="text-secondary">P:{f.p}g</span>
                        <span className="text-sand">Y:{f.f}g</span>
                        <span>K:{f.c}g</span>
                      </div>
                    </div>
                    <span className="font-semibold text-sm text-primary">{f.cal} kcal</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Food Log */}
          <motion.div variants={fadeUp} className={card}>            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-medium">Günlük Log</h3>
              {foodLog.length > 0 && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearFoodLog}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/50 bg-transparent' : 'border-stone-200 text-stone-400 bg-transparent'}`}>
                  Temizle
                </motion.button>
              )}
            </div>
            {foodLog.length === 0 ? (
              <div className={`py-16 text-center border-2 border-dashed rounded-xl ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}>
                <svg className={`w-10 h-10 mx-auto mb-3 ${dm ? 'text-white/15' : 'text-stone-200'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h18v18H3z" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/>
                </svg>
                <p className={`text-sm font-medium ${dm ? 'text-white/25' : 'text-stone-300'}`}>Henüz besin eklenmedi</p>
                <p className={`text-xs mt-1 ${dm ? 'text-white/15' : 'text-stone-200'}`}>Arama yapın veya fotoğraf analiz edin</p>
              </div>
            ) : (
              <div className="space-y-1">
                <AnimatePresence>
                  {foodLog.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      whileHover={{ x: 2 }}
                      className={`flex justify-between items-center p-3.5 rounded-xl ${dm ? 'hover:bg-white/[0.03]' : 'hover:bg-stone-50'} transition-colors group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${dm ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'}`}>
                          {i + 1}                        </div>
                        <div>
                          <span className="text-sm font-medium">{f.name}</span>
                          <div className={`text-xs mt-0.5 flex gap-2 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                            <span className="text-secondary">P:{f.p}g</span>
                            <span className="text-sand">Y:{f.f}g</span>
                            <span>K:{f.c}g</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{f.cal} kcal</span>
                        <button onClick={() => removeFood(i)}
                          className="bg-transparent border-none cursor-pointer text-primary/0 group-hover:text-primary/60 hover:!text-primary text-lg transition-all">×</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Total bar */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
                  <span className={`text-xs font-medium ${dm ? 'text-white/40' : 'text-stone-400'}`}>TOPLAM</span>
                  <span className="text-sm font-bold text-primary">{totals.cal} kcal</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* WhatsApp */}
          {foodLog.length > 0 && (
            <motion.div variants={fadeUp} className={card}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">WhatsApp Yemek Logu</span>                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigator.clipboard.writeText(waMsg).then(() => showToast('Kopyalandı!'))}
                    className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                    Kopyala
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, '_blank')}
                    className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-primary text-white border-none">
                    Gönder
                  </motion.button>
                </div>
              </div>
              <textarea value={waMsg} readOnly rows={6} className={`${inp} font-mono text-xs`} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}