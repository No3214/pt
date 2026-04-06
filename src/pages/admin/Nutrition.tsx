import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { toPng } from 'html-to-image'
import { sanitize } from '../../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

/* SVG macro donut */
function MacroDonut({ data, size = 140, dm }: { data: { label: string; pct: number; color: string }[]; size?: number; dm: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })
  const r = (size - 20) / 2, cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  let offset = 0
  return (
    <svg ref={ref} width={size} height={size} className="mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="14" />
      {data.map((d, i) => {
        const dash = (d.pct / 100) * circ
        const gap = 3
        const seg = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${Math.max(dash - gap, 0)} ${circ}`}
            strokeDashoffset={inView ? -offset : circ}
            style={{ transition: `stroke-dashoffset 0.8s ${i * 0.15}s cubic-bezier(0.16,1,0.3,1)` }}
            transform={`rotate(-90 ${cx} ${cy})`} />
        )
        offset += dash
        return seg
      })}
    </svg>
  )
}

const activityLabels: Record<number, string> = {
  1.2: 'Sedanter', 1.375: 'Hafif Aktif', 1.55: 'Orta Aktif', 1.725: 'Çok Aktif', 1.9: 'Profesyonel',
}

export default function Nutrition() {
  const { darkMode: dm, showToast, clients } = useStore()
  const [selectedClientId, setSelectedClientId] = useState('')
  const selectedClient = clients.find(c => c.id === selectedClientId)
  const clientAllergens = selectedClient?.allergens || []
  const [form, setForm] = useState({
    gender: 'female', age: 23, weight: 65, height: 175, activity: 1.55, goal: 0,
  })
  const [result, setResult] = useState<{
    bmr: number; tdee: number; targetCals: number;
    proteinG: number; fatG: number; carbG: number;
    proteinCal: number; fatCal: number; carbCal: number;
  } | null>(null)
  const [waPreview, setWaPreview] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)
  const resultInView = useInView(resultRef, { once: true })

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border backdrop-blur-sm ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'}`

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
    setResult({ bmr, tdee, targetCals, proteinG, fatG, carbG, proteinCal, fatCal, carbCal })
    const allergenNote = clientAllergens.length > 0
      ? `\n\n⚠️ *ALERJEN UYARISI:*\n${clientAllergens.map(a => `❌ ${a}`).join('\n')}\nBu alerjenleri içeren besinlerden kaçınılmalıdır.`
      : ''
    const legalDisclaimer = `\n\n⚖️ *Yasal & Tıbbi Uyarı:*\nBu menü tıbbi bir teşhis, tedavi veya reçete niteliği taşımaz. %100 bireysel bir tıbbi diyet planı değildir; genel sporcu beslenmesi tavsiyesi amacı taşır. Herhangi bir sağlık probleminiz, kronik hastalığınız, diyabet vb. durumunuz varsa bu programı uygulamadan önce mutlaka doktorunuza veya diyetisyeninize danışınız.`

    const wa = `🥗 *ELA EBEOĞLU — Beslenme Planı*\n━━━━━━━━━━━━━━━━━━━━${selectedClient ? `\n👤 ${selectedClient.name}` : ''}\n🎯 Hedef Kalori: ${targetCals} kcal\n\n*Günlük Makro Dağılımın:*\n🥩 Protein: ${proteinG}g (${Math.round((proteinCal / targetCals) * 100)}%)\n🥑 Yağ: ${fatG}g (${Math.round((fatCal / targetCals) * 100)}%)\n🍚 Karbonhidrat: ${carbG}g (${Math.round((carbCal / targetCals) * 100)}%)\n\n📌 *Antrenman Günü Notu:*\nKarbonhidratlarının %60'ını antrenman öncesi ve sonrası 2 öğüne böl.\n\n📌 *Dinlenme Günü Notu:*\nKarbonhidratı azaltıp yağ oranını artırabilirsin. Protein sabit tut.${allergenNote}${legalDisclaimer}`
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
    { label: 'Protein', sub: '2.2g/kg', g: result.proteinG, cal: result.proteinCal, pct: Math.round((result.proteinCal / result.targetCals) * 100), color: '#7A9E82', icon: '🥩' },
    { label: 'Yağ', sub: '%25', g: result.fatG, cal: result.fatCal, pct: Math.round((result.fatCal / result.targetCals) * 100), color: '#D4C4AB', icon: '🥑' },
    { label: 'Karbonhidrat', sub: 'kalan', g: result.carbG, cal: result.carbCal, pct: Math.round((result.carbCal / result.targetCals) * 100), color: '#C2684A', icon: '🍚' },
  ] : []

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">TDEE & Makro Hesaplayıcı</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
            Mifflin-St Jeor algoritması ile kişiselleştirilmiş beslenme planı
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>Mifflin-St Jeor</span>
          {result && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dm ? 'bg-secondary/10 text-secondary' : 'bg-secondary/10 text-secondary'}`}>
              {activityLabels[form.activity] || 'Aktif'}
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input */}
        <motion.div variants={fadeUp} className={card}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dm ? 'bg-primary/10' : 'bg-primary/10'}`}>📐</div>
            <h3 className="font-display text-xl font-medium">Fiziksel Veriler</h3>
          </div>
          {/* Client Selector */}
          <div className="mb-5">
            <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Danışan Seç (Opsiyonel)</label>
            <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className={inp}>
              <option value="">Genel Hesaplama</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.allergens && c.allergens.length > 0 ? ` ⚠️` : ''}</option>)}
            </select>
          </div>
          {/* Allergen Warning Banner */}
          {clientAllergens.length > 0 && (
            <div className={`mb-5 p-4 rounded-xl border-2 border-dashed flex items-start gap-3 ${dm ? 'border-red-500/30 bg-red-500/[0.05]' : 'border-red-400/30 bg-red-50'}`}>
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-bold text-red-500 mb-1">Alerjen Uyarısı — {selectedClient?.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {clientAllergens.map(a => (
                    <span key={a} className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-red-500/15 text-red-500 border border-red-500/20">❌ {a}</span>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${dm ? 'text-red-400/60' : 'text-red-400'}`}>Bu alerjenleri içeren besinler diyet planına dahil edilmemelidir.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Cinsiyet</label>
              <div className="flex gap-2">
                {[{ v: 'female', l: 'Kadın', icon: '♀' }, { v: 'male', l: 'Erkek', icon: '♂' }].map(g => (
                  <motion.button key={g.v} whileTap={{ scale: 0.97 }}
                    onClick={() => setForm({ ...form, gender: g.v })}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-medium cursor-pointer transition-all border-none flex items-center justify-center gap-2 ${form.gender === g.v
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : (dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500')
                    }`}>
                    <span className="text-lg">{g.icon}</span> {g.l}
                  </motion.button>
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
            <div className="col-span-2">
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Boy (cm)</label>
              <input type="number" value={form.height} onChange={e => setForm({ ...form, height: +e.target.value })} className={inp} />
            </div>
          </div>

          {/* Activity Level */}
          <div className="mt-5">
            <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Aktivite Seviyesi</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { v: 1.2, l: 'Sedanter', icon: '🪑' },
                { v: 1.375, l: 'Hafif', icon: '🚶' },
                { v: 1.55, l: 'Orta', icon: '🏃' },
                { v: 1.725, l: 'Yoğun', icon: '🏋️' },
                { v: 1.9, l: 'Pro', icon: '🏐' },
              ].map(a => (
                <motion.button key={a.v} whileTap={{ scale: 0.95 }}
                  onClick={() => setForm({ ...form, activity: a.v })}
                  className={`py-3 rounded-xl text-center cursor-pointer transition-all border-none ${form.activity === a.v
                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                    : (dm ? 'bg-white/[0.04] text-white/40' : 'bg-stone-50 text-stone-500')
                  }`}>
                  <div className="text-lg mb-0.5">{a.icon}</div>
                  <div className="text-[0.6rem] font-medium">{a.l}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="mt-5">
            <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hedef</label>
            <div className="flex gap-2">
              {[
                { v: -500, l: 'Yağ Yak', s: '-500', icon: '🔥', activeClass: 'bg-primary text-white shadow-lg' },
                { v: 0, l: 'Koru', s: '±0', icon: '⚖️', activeClass: 'bg-sky-500 text-white shadow-lg' },
                { v: 300, l: 'Kas Kazan', s: '+300', icon: '💪', activeClass: 'bg-secondary text-white shadow-lg' },
              ].map(g => (
                <motion.button key={g.v} whileTap={{ scale: 0.97 }}
                  onClick={() => setForm({ ...form, goal: g.v })}
                  className={`flex-1 py-3.5 rounded-xl text-center cursor-pointer transition-all border-none ${form.goal === g.v
                    ? g.activeClass
                    : (dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500')
                  }`}>
                  <div className="text-lg">{g.icon}</div>
                  <div className="text-sm font-medium">{g.l}</div>
                  <div className="text-xs opacity-70 mt-0.5">{g.s} kcal</div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={calculate}
            className="w-full mt-6 py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer shadow-lg shadow-primary/20 text-sm"
          >
            Hesapla & Plan Çıkar
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="results"
              ref={resultRef}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Calorie Donut + Stats */}
              <div className={card}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Donut */}
                  <div className="relative">
                    <MacroDonut data={macroData.map(m => ({ label: m.label, pct: m.pct, color: m.color }))} size={160} dm={dm} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xs uppercase tracking-wider ${dm ? 'text-white/30' : 'text-stone-400'}`}>Hedef</span>
                      <span className="font-display text-3xl text-primary">{result.targetCals}</span>
                      <span className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>kcal/gün</span>
                    </div>
                  </div>

                  {/* Side stats */}
                  <div className="flex-1 w-full space-y-3">
                    {/* BMR & TDEE pills */}
                    <div className="flex gap-2 mb-4">
                      <div className={`flex-1 p-3 rounded-xl text-center ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
                        <div className={`text-[0.65rem] uppercase tracking-wider mb-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>BMR</div>
                        <div className="text-lg font-semibold">{result.bmr}</div>
                      </div>
                      <div className={`flex-1 p-3 rounded-xl text-center ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
                        <div className={`text-[0.65rem] uppercase tracking-wider mb-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>TDEE</div>
                        <div className="text-lg font-semibold">{result.tdee}</div>
                      </div>
                      <div className={`flex-1 p-3 rounded-xl text-center ${form.goal < 0 ? (dm ? 'bg-primary/10' : 'bg-primary/5') : form.goal > 0 ? (dm ? 'bg-secondary/10' : 'bg-secondary/5') : (dm ? 'bg-sky-500/10' : 'bg-sky-50')}`}>
                        <div className={`text-[0.65rem] uppercase tracking-wider mb-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Fark</div>
                        <div className={`text-lg font-semibold ${form.goal < 0 ? 'text-primary' : form.goal > 0 ? 'text-secondary' : 'text-sky-500'}`}>
                          {form.goal > 0 ? '+' : ''}{form.goal}
                        </div>
                      </div>
                    </div>

                    {/* Macro breakdown */}
                    {macroData.map((m, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium flex items-center gap-2">
                            <span>{m.icon}</span>
                            {m.label}
                            <span className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>({m.sub})</span>
                          </span>
                          <span className="text-sm font-semibold">{m.g}g <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>· {m.pct}%</span></span>
                        </div>
                        <div className={`h-2.5 rounded-full overflow-hidden ${dm ? 'bg-white/[0.06]' : 'bg-stone-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: resultInView ? `${m.pct}%` : '0%' }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: m.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meal Timing Tips */}
              <div className={card}>
                <h4 className="font-display text-base font-medium mb-4 flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${dm ? 'bg-secondary/10' : 'bg-secondary/10'}`}>⏰</span>
                  Öğün Zamanlama Rehberi
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { time: '07:00', meal: 'Kahvaltı', pct: '25%', icon: '🌅' },
                    { time: '12:00', meal: 'Öğle', pct: '30%', icon: '☀️' },
                    { time: '16:00', meal: 'Ara Öğün', pct: '15%', icon: '🍌' },
                    { time: '19:00', meal: 'Akşam', pct: '30%', icon: '🌙' },
                  ].map(t => (
                    <div key={t.time} className={`p-3 rounded-xl text-center ${dm ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-stone-50 border border-stone-100'}`}>
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className="text-sm font-medium">{t.meal}</div>
                      <div className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{t.time}</div>
                      <div className={`text-xs font-semibold mt-1 ${dm ? 'text-secondary' : 'text-secondary'}`}>{t.pct}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Output */}
              <div className={card}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    WhatsApp Çıktısı
                  </span>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={downloadPNG}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent' : 'border-stone-200 text-stone-600 bg-transparent'}`}>
                      PNG
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyText}
                      className="px-4 py-2 rounded-full text-xs font-medium cursor-pointer bg-primary text-white border-none shadow-lg shadow-primary/20">
                      Kopyala
                    </motion.button>
                  </div>
                </div>
                <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)} rows={8} className={`${inp} font-mono text-xs leading-relaxed`} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`${card} flex flex-col items-center justify-center min-h-[500px] text-center`}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-6 opacity-20"
              >🥗</motion.div>
              <p className={`font-display text-xl ${dm ? 'text-white/20' : 'text-stone-300'}`}>Sonuçlar burada görünecek</p>
              <p className={`text-sm mt-2 max-w-[240px] ${dm ? 'text-white/10' : 'text-stone-200'}`}>
                Fiziksel verileri girin ve hesaplayın
              </p>
              <div className={`mt-6 flex gap-3 ${dm ? 'text-white/10' : 'text-stone-200'}`}>
                <span className="text-2xl">📐</span>
                <span className="text-2xl">→</span>
                <span className="text-2xl">🧮</span>
                <span className="text-2xl">→</span>
                <span className="text-2xl">📊</span>
              </div>
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
          dangerouslySetInnerHTML={{ __html: sanitize(waPreview).replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#57534E', opacity: 0.8 }}>📸 @ela.ebeoglu</div>
      </div>
    </motion.div>
  )
}
