import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { daysArr } from '../../lib/constants'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const dayNames: Record<string, string> = {
  Pzt: 'Pazartesi', Sal: 'Salı', Çar: 'Çarşamba', Per: 'Perşembe',
  Cum: 'Cuma', Cts: 'Cumartesi', Paz: 'Pazar'
}

const dayColors: Record<string, string> = {
  Pzt: 'terracotta', Sal: 'sage', Çar: 'coast', Per: 'sand',
  Cum: 'terracotta', Cts: 'sage', Paz: 'coast'
}

export default function CalendarPage() {
  const { clients, calSessions, addCalSession, deleteCalSession, showToast, darkMode: dm } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [form, setForm] = useState({ client: '', day: 'Pzt', time: '10:00' })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`
  const handleAdd = () => {
    const name = form.client || activeClients[0]?.name
    if (!name || !form.time) return
    addCalSession({ name, day: form.day, time: form.time })
    showToast('Randevu eklendi!')
  }

  const todaySessions = calSessions.length
  const uniqueClients = new Set(calSessions.map(s => s.name)).size
  const busiestDay = (() => {
    const counts: Record<string, number> = {}
    calSessions.forEach(s => { counts[s.day] = (counts[s.day] || 0) + 1 })
    const max = Math.max(...Object.values(counts), 0)
    return Object.entries(counts).find(([, v]) => v === max)?.[0] || '—'
  })()

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Seans Takvimi</h2>
        <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Haftalık ders planı & randevu yönetimi</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Toplam Randevu', value: todaySessions, icon: '📅' },
          { label: 'Farklı Danışan', value: uniqueClients, icon: '👥' },
          { label: 'En Yoğun Gün', value: dayNames[busiestDay] || busiestDay, icon: '🔥' },
        ].map((s, i) => (          <motion.div key={i} whileHover={{ y: -2 }} className={`p-5 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{s.label}</p>
                <p className="text-2xl font-semibold mt-0.5">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Form */}
        <motion.div variants={fadeUp} className={card}>
          <h3 className="font-display text-xl font-medium mb-6">Randevu Ekle</h3>
          <div className="space-y-5">
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Danışan</label>
              <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className={inp}>
                {activeClients.length === 0 ? <option>Listede Yok</option> : activeClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Gün</label>
              <div className="grid grid-cols-7 gap-1.5">
                {daysArr.map(d => (
                  <button key={d} onClick={() => setForm({ ...form, day: d })}
                    className={`py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border-none ${form.day === d
                      ? 'bg-terracotta text-white'
                      : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
                    }`}>                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Saat</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inp} />
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
            >
              Takvime Ekle
            </motion.button>
            <p className={`text-xs text-center ${dm ? 'text-white/25' : 'text-stone-300'}`}>Eklenen ders CRM'den seans eksiltmez.</p>
          </div>

          {/* Today's Sessions Quick View */}
          {calSessions.length > 0 && (
            <div className={`mt-6 pt-5 border-t ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${dm ? 'text-white/40' : 'text-stone-400'}`}>Sonraki Seanslar</p>
              <div className="space-y-2">
                {calSessions
                  .slice()
                  .sort((a, b) => {
                    const dayOrder = daysArr.indexOf(a.day as any) - daysArr.indexOf(b.day as any)
                    return dayOrder !== 0 ? dayOrder : a.time.localeCompare(b.time)
                  })
                  .slice(0, 4)
                  .map((s, i) => (                    <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${dm ? 'bg-white/[0.03]' : 'bg-stone-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[0.6rem] font-bold text-white bg-${dayColors[s.day] || 'terracotta'}`}>
                        {s.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{s.name}</p>
                        <p className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{s.time}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </motion.div>

        {/* Weekly Grid */}
        <motion.div variants={fadeUp}>
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-7 gap-2">
            {daysArr.map(day => {
              const daySessions = calSessions
                .map((s, idx) => ({ ...s, idx }))
                .filter(s => s.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
              return (
                <div key={day} className={`rounded-2xl border flex flex-col min-h-[340px] overflow-hidden ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
                  <div className={`py-3 text-center font-semibold text-sm ${dm ? 'bg-sage/20 text-sage' : 'bg-sage/10 text-sage'}`}>
                    {day}
                    {daySessions.length > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-terracotta text-white text-[0.6rem]">
                        {daySessions.length}
                      </span>
                    )}                  </div>
                  <div className="p-2 flex flex-col gap-2 flex-1">
                    {daySessions.length === 0 ? (
                      <div className={`flex-1 flex items-center justify-center text-xs ${dm ? 'text-white/15' : 'text-stone-200'}`}>—</div>
                    ) : daySessions.map(sess => (
                      <motion.div
                        key={sess.idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`border-l-[3px] border-terracotta p-2.5 rounded-r-lg text-xs relative group ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}
                      >
                        <div className="font-semibold text-terracotta">{sess.time}</div>
                        <div className="mt-0.5 truncate">{sess.name}</div>
                        <button onClick={() => deleteCalSession(sess.idx)}
                          className={`absolute top-1.5 right-1.5 bg-transparent border-none cursor-pointer text-sm opacity-0 group-hover:opacity-100 transition-opacity ${dm ? 'text-white/40' : 'text-stone-300'}`}>
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          {/* Mobile View — List by Day */}
          <div className="md:hidden space-y-3">
            {daysArr.map(day => {
              const daySessions = calSessions
                .map((s, idx) => ({ ...s, idx }))
                .filter(s => s.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
              const isOpen = selectedDay === day

              return (
                <motion.div key={day} layout className={`rounded-2xl border overflow-hidden ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
                  <button
                    onClick={() => setSelectedDay(isOpen ? null : day)}
                    className={`w-full flex items-center justify-between p-4 border-none cursor-pointer bg-transparent ${dm ? 'text-white' : 'text-[#1C1917]'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">{dayNames[day]}</span>
                      {daySessions.length > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-terracotta text-white text-[0.6rem]">
                          {daySessions.length}
                        </span>
                      )}
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}
                    >
                      ▼
                    </motion.span>
                  </button>                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 space-y-2">
                          {daySessions.length === 0 ? (
                            <p className={`text-center py-4 text-xs ${dm ? 'text-white/20' : 'text-stone-300'}`}>Randevu yok</p>
                          ) : daySessions.map(sess => (
                            <div key={sess.idx} className={`flex items-center justify-between p-3 rounded-xl border-l-[3px] border-terracotta ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
                              <div>
                                <span className="font-semibold text-terracotta text-sm">{sess.time}</span>
                                <span className="ml-2 text-sm">{sess.name}</span>
                              </div>
                              <button onClick={() => deleteCalSession(sess.idx)}
                                className={`bg-transparent border-none cursor-pointer text-lg ${dm ? 'text-white/30' : 'text-stone-300'}`}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
