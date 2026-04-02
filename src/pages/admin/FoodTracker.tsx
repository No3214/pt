import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../../lib/constants'
import { callGemini, callOpenRouter } from '../../lib/ai'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function FoodTracker() {
  const { foodLog, addFood, removeFood, clearFoodLog, showToast, darkMode: dm, aiKeys } = useStore()
  const [search, setSearch] = useState('')
  const [foodImg, setFoodImg] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`
  const hasVision = aiKeys.gemini || aiKeys.openrouter

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })

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
      if (aiKeys.gemini) result = await callGemini(prompt, base64)
      else if (aiKeys.openrouter) result = await callOpenRouter(prompt, base64)
      if (!result) throw new Error('Vision API yanıt vermedi')
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim()
      const foodData: FoodItem = JSON.parse(cleaned)
      addFood(foodData)
      showToast(`AI tespit: ${foodData.name} - ${foodData.cal} kcal`)
    } catch (err: any) {
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
        {hasVision && (
          <span className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>AI Vision Aktif</span>
        )}
      </motion.div>

      {/* Macro Summary Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Kalori', value: totals.cal.toString(), unit: 'kcal', color: 'text-terracotta' },
          { label: 'Protein', value: Math.round(totals.p).toString(), unit: 'g', color: 'text-sage' },
          { label: 'Yağ', value: Math.round(totals.f).toString(), unit: 'g', color: 'text-sand' },
          { label: 'Karbonhidrat', value: Math.round(totals.c).toString(), unit: 'g', color: '' },
        ].map((t, i) => (
          <div key={i} className={`p-4 rounded-2xl border text-center ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
            <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${t.color}`}>{t.value}</p>
            <p className={`text-xs ${dm ? 'text-white/20' : 'text-stone-300'}`}>{t.unit}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left */}
        <div className="space-y-6">
          {/* Photo */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-lg font-medium mb-4">Yemek Fotoğrafı</h3>
            <div onClick={() => fileInput.current?.click()}
              className={`aspect-video rounded-xl mb-4 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:opacity-90 ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
              {foodImg ? <img src={foodImg} alt="Yemek" className="w-full h-full object-cover" /> : (
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-30">📸</div>
                  <div className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Fotoğraf çek veya yükle</div>
                </div>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" capture="environment" className="hidden" onChange={handlePhotoPreview} />
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInput.current?.click()}
                className={`flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                Galeri
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fileInput.current?.click()}
                className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer bg-terracotta text-white border-none">
                Kamera
              </motion.button>
            </div>
            {hasVision && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={analyzeWithAI}
                disabled={analyzing}
                className="w-full mt-3 py-3 rounded-xl text-sm font-medium text-white border-none cursor-pointer bg-gradient-to-r from-terracotta to-amber-500 disabled:opacity-50"
              >
                {analyzing ? 'Analiz ediliyor...' : 'AI ile Kalori Tespit Et'}
              </motion.button>
            )}
          </motion.div>

          {/* Search */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-lg font-medium mb-4">Besin Ekle</h3>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara... (tavuk, pilav, yumurta...)" className={inp} />
            <div className="max-h-[280px] overflow-y-auto mt-3">
              <AnimatePresence>
                {filtered.map((f, i) => (
                  <motion.div
                    key={f.name + i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { addFood(f); setSearch('') }}
                    className={`flex justify-between items-center p-3.5 border-b cursor-pointer transition-all ${dm ? 'border-white/[0.04] hover:bg-white/[0.04]' : 'border-stone-50 hover:bg-stone-50'}`}
                  >
                    <div>
                      <span className="text-sm font-medium">{f.name}</span>
                      <div className={`text-xs mt-0.5 ${dm ? 'text-white/30' : 'text-stone-400'}`}>P:{f.p}g · Y:{f.f}g · K:{f.c}g</div>
                    </div>
                    <span className="font-semibold text-sm text-terracotta">{f.cal}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Food Log */}
          <motion.div variants={fadeUp} className={card}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-medium">Günlük Log</h3>
              {foodLog.length > 0 && (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearFoodLog}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/50 bg-transparent' : 'border-stone-200 text-stone-400 bg-transparent'}`}>
                  Temizle
                </motion.button>
              )}
            </div>
            {foodLog.length === 0 ? (
              <div className={`py-12 text-center border-2 border-dashed rounded-xl ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}>
                <p className="text-3xl mb-2 opacity-20">🍽</p>
                <p className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Henüz besin eklenmedi</p>
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
                      className={`flex justify-between items-center p-3.5 rounded-xl ${dm ? 'hover:bg-white/[0.03]' : 'hover:bg-stone-50'} transition-colors`}
                    >
                      <div>
                        <span className="text-sm font-medium">{f.name}</span>
                        <div className={`text-xs mt-0.5 ${dm ? 'text-white/30' : 'text-stone-400'}`}>P:{f.p}g · Y:{f.f}g · K:{f.c}g</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{f.cal} kcal</span>
                        <button onClick={() => removeFood(i)} className="bg-transparent border-none cursor-pointer text-terracotta/50 hover:text-terracotta text-lg transition-colors">×</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* WhatsApp */}
          {foodLog.length > 0 && (
            <motion.div variants={fadeUp} className={card}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">WhatsApp Yemek Logu</span>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigator.clipboard.writeText(waMsg).then(() => showToast('Kopyalandı!'))}
                    className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                    Kopyala
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, '_blank')}
                    className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-terracotta text-white border-none">
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