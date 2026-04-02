import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../lib/constants'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function Portal() {
  const { darkMode: dm, showToast } = useStore()
  const [foodLog, setFoodLog] = useState<FoodItem[]>([])
  const [search, setSearch] = useState('')
  const [habits, setHabits] = useState([false, false, false, false])

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })
  const habitLabels = ['3 Litre Su', '8 Saat Uyku', 'Protein Hedefi', '10.000 Adım']
  const habitIcons = ['💧', '💤', '🥩', '🚶']
  const doneCount = habits.filter(Boolean).length

  const addFood = (f: FoodItem) => { setFoodLog([...foodLog, f]); setSearch('') }
  const removeFood = (i: number) => setFoodLog(foodLog.filter((_, idx) => idx !== i))

  const submitHabits = () => {
    showToast(`${doneCount}/4 alışkanlık tamamlandı!`)
    setHabits([false, false, false, false])
  }

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border transition-all duration-300 ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  return (
    <div className={`min-h-screen ${dm ? 'bg-bg-dark text-white' : 'bg-bg'}`}>
      {/* Hero */}
      <div className="pt-24 pb-12 px-6">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-[1100px] mx-auto text-center">
          <motion.div variants={fadeUp}>
            <p className={`text-sm uppercase tracking-[0.2em] mb-3 ${dm ? 'text-terracotta/70' : 'text-terracotta'}`}>DANIŞAN PORTALI</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-3">Hoşgeldin</h1>
            <p className={`text-lg ${dm ? 'text-white/40' : 'text-stone-400'}`}>Antrenman ve beslenme takibini buradan yapabilirsin.</p>
          </motion.div>

          {/* Habit Progress Ring */}
          <motion.div variants={fadeUp} className="mt-8 flex justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={dm ? 'rgba(255,255,255,0.06)' : '#f5f5f4'} strokeWidth="8" />
                <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#7A9E82" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - doneCount / 4) }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold">{doneCount}/4</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-[1100px] mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Habits */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-xl font-semibold mb-5">Günlük Check-in</h3>
            <div className="space-y-3">
              {habitLabels.map((h, i) => (
                <motion.label
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-center gap-3.5 p-4 rounded-xl cursor-pointer transition-all ${habits[i]
                    ? (dm ? 'bg-sage/10 border border-sage/20' : 'bg-sage/5 border border-sage/15')
                    : (dm ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-stone-50 border border-stone-100')
                  }`}
                >
                  <input type="checkbox" checked={habits[i]} onChange={() => { const n = [...habits]; n[i] = !n[i]; setHabits(n) }}
                    className="w-5 h-5 accent-sage rounded" />
                  <span className="text-xl">{habitIcons[i]}</span>
                  <span className={`text-sm font-medium ${habits[i] ? (dm ? 'text-sage' : 'text-sage') : ''}`}>{h}</span>
                </motion.label>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={submitHabits}
              className="w-full mt-5 py-3.5 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
            >
              Gönder
            </motion.button>
          </motion.div>

          {/* Food Log */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-xl font-semibold mb-5">Yemek Logu</h3>
            <div className="mb-4 max-h-[200px] overflow-y-auto">
              {foodLog.length === 0 ? (
                <div className={`py-8 text-center border-2 border-dashed rounded-xl ${dm ? 'border-white/[0.06]' : 'border-stone-200'}`}>
                  <p className={`text-sm ${dm ? 'text-white/30' : 'text-stone-400'}`}>Henüz yemek eklenmedi</p>
                </div>
              ) : foodLog.map((f, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 border-b text-sm ${dm ? 'border-white/[0.04]' : 'border-stone-50'}`}>
                  <span>{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-terracotta">{f.cal}</span>
                    <button onClick={() => removeFood(i)} className="bg-transparent border-none cursor-pointer text-terracotta/50 hover:text-terracotta transition-colors">×</button>
                  </div>
                </div>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara..."
              className={inp} />
            <div className="max-h-[180px] overflow-y-auto mt-2">
              {filtered.map((f, i) => (
                <div key={i} onClick={() => addFood(f)}
                  className={`flex justify-between items-center p-3 border-b cursor-pointer text-sm transition-all ${dm ? 'border-white/[0.04] hover:bg-white/[0.04]' : 'border-stone-50 hover:bg-stone-50'}`}>
                  <span>{f.name}</span>
                  <span className="text-terracotta font-semibold">{f.cal}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Macros */}
          <motion.div variants={fadeUp} className={card}>
            <h3 className="font-display text-xl font-semibold mb-5">Bugünkü Makrolar</h3>
            <div className="space-y-4">
              {[
                { label: 'Kalori', value: totals.cal, unit: 'kcal', color: 'text-terracotta', bg: dm ? 'bg-terracotta/10' : 'bg-terracotta/5' },
                { label: 'Protein', value: Math.round(totals.p), unit: 'g', color: 'text-sage', bg: dm ? 'bg-sage/10' : 'bg-sage/5' },
                { label: 'Yağ', value: Math.round(totals.f), unit: 'g', color: 'text-sand', bg: dm ? 'bg-sand/10' : 'bg-sand/5' },
                { label: 'Karbonhidrat', value: Math.round(totals.c), unit: 'g', color: '', bg: dm ? 'bg-white/[0.04]' : 'bg-stone-50' },
              ].map((t, i) => (
                <div key={i} className={`p-4 rounded-xl ${t.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-semibold ${t.color}`}>{t.value}</span>
                      <span className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{t.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini WhatsApp */}
            {foodLog.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const msg = `📸 *GÜNLÜK YEMEK LOGU*\n${foodLog.map(f => `• ${f.name} — ${f.cal} kcal`).join('\n')}\n\n📊 Toplam: ${totals.cal} kcal | P:${Math.round(totals.p)}g Y:${Math.round(totals.f)}g K:${Math.round(totals.c)}g`
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
                }}
                className={`w-full mt-5 py-3.5 rounded-full text-sm font-medium cursor-pointer border transition-all ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}
              >
                Koçuma Gönder
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}