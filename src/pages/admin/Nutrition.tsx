import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { toPng } from 'html-to-image'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

export default function Nutrition() {
  const { darkMode: dm, showToast } = useStore()
  const [form, setForm] = useState({ gender: 'female', age: 23, weight: 65, height: 175, activity: 1.55, goal: 0 })
  const [result, setResult] = useState<{ bmr: number; targetCals: number; proteinG: number; fatG: number; carbG: number; proteinCal: number; fatCal: number; carbCal: number } | null>(null)
  const [waPreview, setWaPreview] = useState('')

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const calculate = () => {
    let bmr = (10 * form.weight) + (6.25 * form.height) - (5 * form.age)
    bmr += form.gender === 'male' ? 5 : -161
    bmr = Math.round(bmr)
    const tdee = Math.round(bmr * form.activity)
    const targetCals = tdee + form.goal
    const proteinG = Math.round(form.weight * 2.2)
    const proteinCal = proteinG * 4
    const fatCal = Math.round(targetCals * 0.25)
    const fatG = Math.round(fatCal / 9)
    const carbCal = targetCals - proteinCal - fatCal
    const carbG = Math.round(carbCal / 4)
    setResult({ bmr, targetCals, proteinG, fatG, carbG, proteinCal, fatCal, carbCal })
    const wa = `🥗 *ELA EBEOĞLU — Beslenme Planı*\n━━━━━━━━━━━━━━━━━━━━\n🎯 Hedef Kalori: ${targetCals} kcal\n\n*Günlük Makro Dağılımın:*\n🥩 Protein: ${proteinG}g\n🥑 Yağ: ${fatG}g\n🍚 Karbonhidrat: ${carbG}g\n\n📌 *Antrenman Günü Notu:*\nKarbonhidratlarının %60'ını antrenman öncesi ve sonrası 2 öğüne böl.\n\n📌 *Dinlenme Günü Notu:*\nKarbonhidratı azaltıp yağ oranını artırabilirsin. Protein sabit tut.`
    setWaPreview(wa)
  }

  const copyText = () => navigator.clipboard.writeText(waPreview).then(() => showToast('Panoya kopyalandı!'))

  const downloadPNG = async () => {
    const el = document.getElementById('diet-export')
    if (!el) return
    el.style.left = '0'
    try {
      const url = await toPng(el, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'ElaEbeoglu_Diyet.png'
      link.href = url
      link.click()
    } catch { showToast('PNG oluşturulamadı') }
    el.style.left = '-9999px'
  }

  const macroData = result ? [
    { label: 'Protein', sub: '2.2g/kg', g: result.proteinG, cal: result.proteinCal, pct: Math.round((result.proteinCal / result.targetCals) * 100), color: 'sage' },
    { label: 'Yağ', sub: '%25', g: result.fatG, cal: result.fatCal, pct: Math.round((result.fatCal / result.targetCals) * 100), color: 'sand' },
    { label: 'Karbonhidrat', sub: 'kalan', g: result.carbG, cal: result.carbCal, pct: Math.round((result.carbCal / result.targetCals) * 100), color: 'terracotta' },
  ] : []

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">TDEE & Makro Hesaplayıcı</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Mifflin-St Jeor algoritması ile kişiselleştirilmiş beslenme planı</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-xs font-medium ${dm ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>Mifflin-St Jeor</span>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input */}
        <motion.div variants={fadeUp} className={card}>
          <h3 className="font-display text-xl font-medium mb-6">Fiziksel Veriler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Cinsiyet</label>
              <div className="flex gap-2">
                {[{ v: 'female', l: 'Kadın' }, { v: 'male', l: 'Erkek' }].map(g => (
                  <button key={g.v} onClick={() => setForm({ ...form, gender: g.v })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all border-none ${form.gender === g.v
                      ? 'bg-terracotta text-white'
                      : (dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500')
                    }`}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Yaş</label>
              <input type="number" value={form.age} onChange={e => setForm({ ...form, age: +e.target.value })} className={inp} />
            </div>
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Kilo (kg)</label>
              <input type="number" step={0.1} value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} className={inp} />
            </div>
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Boy (cm)</label>
              <input type="number" value={form.height} onChange={e => setForm({ ...form, height: +e.target.value })} className={inp} />
            </div>
          </div>
          <div className="mt-5">
            <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Aktivite Seviyesi</label>
            <select value={form.activity} onChange={e => setForm({ ...form, activity: +e.target.value })} className={inp}>
              <option value={1.2}>Sedanter (masa başı)</option>
              <option value={1.375}>Hafif Aktif (1-3 gün)</option>
              <option value={1.55}>Orta Aktif (3-5 gün)</option>
              <option value={1.725}>Çok Aktif (6-7 gün)</option>
              <option value={1.9}>Profesyonel Sporcu</option>
            </select>
          </div>
          <div className="mt-5">
            <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hedef</label>
            <div className="flex gap-2">
              {[{ v: -500, l: 'Yağ Yak', s: '-500' }, { v: 0, l: 'Koru', s: '±0' }, { v: 300, l: 'Kas Kazan', s: '+300' }].map(g => (
                <button key={g.v} onClick={() => setForm({ ...form, goal: g.v })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all border-none ${form.goal === g.v
                    ? 'bg-terracotta text-white'
                    : (dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500')
                  }`}>
                  <div>{g.l}</div>
                  <div className="text-xs opacity-70 mt-0.5">{g.s} kcal</div>
                </button>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={calculate}
            className="w-full mt-6 py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
          >
            Hesapla & Plan Çıkar
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Big Number */}
              <div className={card}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>Günlük Hedef Kalori</p>
                    <p className="font-display text-5xl text-terracotta mt-1">{result.targetCals}</p>
                    <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>kcal / gün</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>BMR</p>
                    <p className="text-2xl font-semibold">{result.bmr}</p>
                  </div>
                </div>                {/* Macro Bars */}
                <div className="space-y-4">
                  {macroData.map((m, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium">{m.label} <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>({m.sub})</span></span>
                        <span className="text-sm font-semibold">{m.g}g <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>· {m.cal} kcal</span></span>
                      </div>
                      <div className={`h-2.5 rounded-full overflow-hidden ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${m.color === 'sage' ? 'bg-sage' : m.color === 'sand' ? 'bg-sand' : 'bg-terracotta'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Output */}
              <div className={card}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">WhatsApp Çıktısı</span>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadPNG}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                      PNG
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyText}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-terracotta text-white border-none">
                      Kopyala
                    </motion.button>
                  </div>
                </div>
                <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)} rows={8} className={`${inp} font-mono text-xs`} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`${card} flex flex-col items-center justify-center min-h-[400px] text-center`}>
              <div className="text-5xl mb-4 opacity-20">🥗</div>
              <p className={`font-display text-xl ${dm ? 'text-white/20' : 'text-stone-300'}`}>Sonuçlar burada görünecek</p>
              <p className={`text-sm mt-1 ${dm ? 'text-white/10' : 'text-stone-200'}`}>Verileri girin ve hesaplayın</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden export */}
      <div id="diet-export" style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 550, background: '#FAF6F1', padding: '3rem 2rem', borderRadius: 12, fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '3px solid #7A9E82', paddingBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#1C1917', margin: 0 }}>ELA EBEOĞLU</h2>
          <div style={{ fontSize: '0.9rem', color: '#C2684A', letterSpacing: 4, marginTop: '0.5rem', fontWeight: 600 }}>PERFORMANCE NUTRITION</div>
        </div>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.15rem', lineHeight: 1.7, color: '#333' }}
          dangerouslySetInnerHTML={{ __html: waPreview.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#57534E', opacity: 0.8 }}>📸 @ela.ebeoglu</div>
      </div>
    </motion.div>
  )
}