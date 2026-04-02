import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { daysArr } from '../../lib/constants'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const dayNames: Record<string, string> = {
  Pzt: 'Pazartesi', Sal: 'Salı', Çar: 'Çarşamba', Per: 'Perşembe',
  Cum: 'Cuma', Cts: 'Cumartesi', Paz: 'Pazar'
}

export default function CalendarPage() {
  const { clients, calSessions, addCalSession, deleteCalSession, showToast, darkMode: dm } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [form, setForm] = useState({ client: '', day: 'Pzt', time: '10:00' })

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

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Seans Takvimi</h2>
        <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Haftalık ders planı & randevu yönetimi</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Toplam Randevu', value: todaySessions, icon: '📅' },
          { label: 'Farklı Danışan', value: uniqueClients, icon: '👥' },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{s.label}</p>
                <p className="text-2xl font-semibold mt-0.5">{s.value}</p>
              </div>
            </div>
          </div>
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
              <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} className={inp}>
                {daysArr.map(d => <option key={d} value={d}>{dayNames[d]}</option>)}
              </select>
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
        </motion.div>

        {/* Weekly Grid */}
        <motion.div variants={fadeUp} className="grid grid-cols-7 gap-2">
          {daysArr.map(day => {
            const daySessions = calSessions
              .map((s, idx) => ({ ...s, idx }))
              .filter(s => s.day === day)
              .sort((a, b) => a.time.localeCompare(b.time))
            return (
              <div key={day} className={`rounded-2xl border flex flex-col min-h-[340px] overflow-hidden ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
                <div className={`py-3 text-center font-semibold text-sm ${dm ? 'bg-sage/20 text-sage' : 'bg-sage/10 text-sage'}`}>
                  {day}
                </div>
                <div className="p-2 flex flex-col gap-2 flex-1">
                  {daySessions.length === 0 ? (
                    <div className={`flex-1 flex items-center justify-center text-xs ${dm ? 'text-white/15' : 'text-stone-200'}`}>—</div>
                  ) : daySessions.map(sess => (
                    <motion.div
                      key={sess.idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
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
        </motion.div>
      </div>
    </motion.div>
  )
}