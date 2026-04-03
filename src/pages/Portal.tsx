import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../lib/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function Portal() {
  const { darkMode: dm, showToast, toggleDarkMode } = useStore()
  const [foodLog, setFoodLog] = useState<FoodItem[]>([])
  const [search, setSearch] = useState('')
  const [habits, setHabits] = useState([false, false, false, false])
  const [submitted, setSubmitted] = useState(false)

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })
  const habitLabels = ['3 Litre Su', '8 Saat Uyku', 'Protein Hedefi', '10.000 Adım']
  const habitIcons = ['💧', '💤', '🥩', '🚶']
  const doneCount = habits.filter(Boolean).length

  const addFood = (f: FoodItem) => { setFoodLog([...foodLog, f]); setSearch('') }
  const removeFood = (i: number) => setFoodLog(foodLog.filter((_, idx) => idx !== i))
  const submitHabits = () => {
    showToast(`${doneCount}/4 alışkanlık tamamlandı!`)
    setSubmitted(true)
    setTimeout(() => {
      setHabits([false, false, false, false])
      setSubmitted(false)
    }, 2000)
  }

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 text-[0.88rem] focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/25' : 'bg-white border-black/[0.05] placeholder:text-[#1C1917]/25'}`
  const card = `p-6 rounded-2xl border transition-all duration-300 ${dm ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-white border-black/[0.03]'}`

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Günaydın'
    if (h < 18) return 'İyi Günler'
    return 'İyi Akşamlar'
  })()

  return (
    <div className={`min-h-screen font-body ${dm ? 'bg-[#050505] text-white' : 'bg-[#F7F5F2]'}`}>
      {/* ═══ Top Bar ═══ */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b transition-all duration-500 ${dm ? 'bg-[#050505]/80 border-white/[0.04]' : 'bg-white/70 border-black/[0.03]'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex justify-between items-center">
          <Link to="/" className={`flex items-center gap-3 font-display text-lg font-semibold no-underline tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center">
              <span className="text-white text-xs font-bold font-body">PT</span>
            </div>
            Danışan Portalı
          </Link>          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${dm ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.04] text-[#1C1917]/50'}`}
            aria-label="Tema">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {dm
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              }
            </svg>
          </motion.button>
        </div>
      </header>

      {/* ═══ Hero ═══ */}
      <div className="pt-28 pb-10 px-6">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div variants={fadeUp}>
              <p className={`text-[0.7rem] uppercase tracking-[0.2em] mb-3 font-medium ${dm ? 'text-terracotta/70' : 'text-terracotta'}`}>Danışan Portalı</p>
              <h1 className={`font-display text-[clamp(2.2rem,4vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.1] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{greeting}</h1>
              <p className={`text-[0.92rem] mt-2 ${dm ? 'text-white/35' : 'text-[#1C1917]/35'}`}>Antrenman ve beslenme takibini buradan yapabilirsin.</p>
            </motion.div>
            {/* Progress Ring */}
            <motion.div variants={fadeUp} className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke={dm ? 'rgba(255,255,255,0.04)' : '#f0eeec'} strokeWidth="6" />
                  <motion.circle cx="50" cy="50" r="42" fill="none" stroke={submitted ? '#7A9E82' : '#C2684A'} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - doneCount / 4) }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span key={doneCount} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-bold tracking-tight">{doneCount}/4</motion.span>
                </div>
              </div>
              <div>
                <p className={`text-[0.7rem] uppercase tracking-[0.12em] font-medium ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>Günlük Hedef</p>
                <p className={`text-[0.88rem] font-medium ${submitted ? 'text-sage' : 'text-terracotta'}`}>
                  {submitted ? 'Tamamlandı!' : `${4 - doneCount} kaldı`}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* ═══ Content ═══ */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* ── Habits ── */}
          <motion.div variants={fadeUp} className={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-display text-xl font-semibold tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Günlük Check-in</h3>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dm ? 'bg-terracotta/10' : 'bg-terracotta/[0.06]'}`}>
                <svg className="w-4 h-4 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2.5">
              {habitLabels.map((h, i) => (
                <motion.label key={i} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${habits[i]
                    ? (dm ? 'bg-sage/[0.08] border border-sage/15' : 'bg-sage/[0.04] border border-sage/10')
                    : (dm ? 'bg-white/[0.02] border border-white/[0.04]' : 'bg-[#F7F5F2] border border-black/[0.03]')
                  }`}>
                  <input type="checkbox" checked={habits[i]} onChange={() => { const n = [...habits]; n[i] = !n[i]; setHabits(n) }}
                    className="w-[18px] h-[18px] accent-sage rounded" />
                  <span className="text-lg">{habitIcons[i]}</span>
                  <span className={`text-[0.82rem] font-medium flex-1 ${habits[i] ? 'text-sage' : ''}`}>{h}</span>
                  {habits[i] && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                  )}
                </motion.label>
              ))}            </div>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={submitHabits} disabled={submitted}
              className={`w-full mt-5 py-3.5 rounded-xl font-medium text-[0.88rem] border-none cursor-pointer transition-all duration-300 ${
                submitted
                  ? 'bg-sage text-white'
                  : 'bg-terracotta text-white hover:shadow-[0_10px_25px_rgba(194,104,74,0.2)]'
              }`}>
              {submitted ? 'Gönderildi!' : 'Gönder'}
            </motion.button>
          </motion.div>

          {/* ── Food Log ── */}
          <motion.div variants={fadeUp} className={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-display text-xl font-semibold tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Yemek Logu</h3>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dm ? 'bg-sage/10' : 'bg-sage/[0.06]'}`}>
                <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z" />
                </svg>
              </div>
            </div>
            <div className="mb-4 max-h-[200px] overflow-y-auto">
              {foodLog.length === 0 ? (
                <div className={`py-8 text-center border border-dashed rounded-xl ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                  <svg className={`w-8 h-8 mx-auto mb-2 ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={`text-[0.78rem] ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>Henüz yemek eklenmedi</p>
                </div>
              ) : (                <AnimatePresence>
                  {foodLog.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                      className={`flex justify-between items-center py-2.5 border-b text-[0.82rem] ${dm ? 'border-white/[0.04]' : 'border-black/[0.03]'}`}>
                      <span className={dm ? 'text-white/70' : 'text-[#1C1917]/70'}>{f.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-terracotta tabular-nums">{f.cal}</span>
                        <button onClick={() => removeFood(i)}
                          className={`bg-transparent border-none cursor-pointer text-lg leading-none transition-colors ${dm ? 'text-white/20 hover:text-red-400' : 'text-[#1C1917]/20 hover:text-red-500'}`}>×</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara..." className={inp} />
            <div className="max-h-[180px] overflow-y-auto mt-2">
              {filtered.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  onClick={() => addFood(f)}
                  className={`flex justify-between items-center p-3 border-b cursor-pointer text-[0.82rem] transition-all duration-200 ${dm ? 'border-white/[0.03] hover:bg-white/[0.03]' : 'border-black/[0.02] hover:bg-black/[0.01]'}`}>
                  <span className={dm ? 'text-white/60' : 'text-[#1C1917]/60'}>{f.name}</span>
                  <span className="text-terracotta font-semibold tabular-nums">{f.cal}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* ── Macros ── */}
          <motion.div variants={fadeUp} className={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-display text-xl font-semibold tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Bugünkü Makrolar</h3>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dm ? 'bg-coast/10' : 'bg-coast/[0.06]'}`}>
                <svg className="w-4 h-4 text-coast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'Kalori', value: totals.cal, unit: 'kcal', color: 'terracotta', max: 2200 },
                { label: 'Protein', value: Math.round(totals.p), unit: 'g', color: 'sage', max: 150 },
                { label: 'Yağ', value: Math.round(totals.f), unit: 'g', color: 'sand', max: 70 },
                { label: 'Karbonhidrat', value: Math.round(totals.c), unit: 'g', color: 'coast', max: 250 },
              ].map((t, i) => {
                const colorClass = t.color === 'terracotta' ? 'text-terracotta' : t.color === 'sage' ? 'text-sage' : t.color === 'sand' ? (dm ? 'text-sand' : 'text-sand-dark') : 'text-coast'
                const barClass = t.color === 'terracotta' ? 'bg-terracotta' : t.color === 'sage' ? 'bg-sage' : t.color === 'sand' ? 'bg-sand' : 'bg-coast'
                const bgClass = t.color === 'terracotta' ? (dm ? 'bg-terracotta/[0.06]' : 'bg-terracotta/[0.04]')
                  : t.color === 'sage' ? (dm ? 'bg-sage/[0.06]' : 'bg-sage/[0.04]')
                  : t.color === 'sand' ? (dm ? 'bg-sand/[0.06]' : 'bg-sand/[0.04]')
                  : (dm ? 'bg-coast/[0.06]' : 'bg-coast/[0.04]')
                return (
                  <div key={i} className={`p-4 rounded-xl ${bgClass}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className={`text-[0.68rem] uppercase tracking-[0.1em] font-medium ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>{t.label}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-semibold tracking-[-0.02em] tabular-nums ${colorClass}`}>{t.value}</span>
                        <span className={`text-[0.65rem] ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>/ {t.max}{t.unit}</span>
                      </div>
                    </div>                    <div className={`h-1.5 rounded-full overflow-hidden ${dm ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`}>
                      <motion.div initial={{ width: 0 }}
                        animate={{ width: `${Math.min((t.value / t.max) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${barClass}`} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Send to Coach */}
            {foodLog.length > 0 && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => {
                  const msg = `*GÜNLÜK YEMEK LOGU*\n${foodLog.map(f => `• ${f.name} — ${f.cal} kcal`).join('\n')}\n\n Toplam: ${totals.cal} kcal | P:${Math.round(totals.p)}g Y:${Math.round(totals.f)}g K:${Math.round(totals.c)}g`
                  window.open(`https://wa.me/905362486849?text=${encodeURIComponent(msg)}`, '_blank')
                }}
                className={`w-full mt-5 py-3.5 rounded-xl text-[0.82rem] font-medium cursor-pointer border transition-all duration-300 flex items-center justify-center gap-2 ${dm ? 'border-white/[0.06] text-white/60 bg-transparent hover:bg-white/[0.03]' : 'border-black/[0.05] text-[#1C1917]/50 bg-transparent hover:bg-black/[0.01]'}`}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                Koçuma Gönder
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
