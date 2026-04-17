import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { daysArr } from '../../lib/constants'
import { useTranslation } from '../../locales'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

const dayColorMap: Record<string, { bg: string; text: string; accent: string }> = {
  Pzt: { bg: 'bg-primary/10', text: 'text-primary', accent: 'border-primary' },
  Sal: { bg: 'bg-secondary/10', text: 'text-secondary', accent: 'border-secondary' },
  Çar: { bg: 'bg-accent/10', text: 'text-accent', accent: 'border-accent' },
  Per: { bg: 'bg-sand/10', text: 'text-sand', accent: 'border-sand' },
  Cum: { bg: 'bg-primary/10', text: 'text-primary', accent: 'border-primary' },
  Cts: { bg: 'bg-secondary/10', text: 'text-secondary', accent: 'border-secondary' },
  Paz: { bg: 'bg-accent/10', text: 'text-accent', accent: 'border-accent' },
}

const meetingTypeIcons: Record<string, string> = {
  zoom: '📹',
  teams: '🔵',
  meet: '🎥',
  other: '📱'
}


export default function CalendarPage() {
  const { t } = useTranslation()
  const { clients, calSessions, addCalSession, deleteCalSession, showToast, darkMode: dm } = useStore()
  const activeClients = clients.filter(c => c.sessions > 0)
  const [form, setForm] = useState({
    client: '',
    day: 'Pzt',
    time: '10:00',
    isOnline: false,
    meetingType: 'zoom' as 'zoom' | 'teams' | 'meet' | 'other',
    meetingLink: '',
    meetingNote: ''
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const dayNames: Record<string, string> = {
    Pzt: t.portal.admin.cal_days.mon,
    Sal: t.portal.admin.cal_days.tue,
    Çar: t.portal.admin.cal_days.wed,
    Per: t.portal.admin.cal_days.thu,
    Cum: t.portal.admin.cal_days.fri,
    Cts: t.portal.admin.cal_days.sat,
    Paz: t.portal.admin.cal_days.sun,
  }
  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const handleAdd = () => {
    const name = form.client || activeClients[0]?.name
    if (!name || !form.time) return

    // Validate online form
    if (form.isOnline && !form.meetingLink) {
      showToast('Lütfen toplantı linkini girin')
      return
    }

    const session = {
      name,
      day: form.day,
      time: form.time,
      ...(form.isOnline && {
        isOnline: true,
        meetingType: form.meetingType,
        meetingLink: form.meetingLink,
        meetingNote: form.meetingNote || undefined
      })
    }

    addCalSession(session)
    showToast(t.portal.admin.cal_added)

    // Reset form
    setForm({
      client: '',      day: 'Pzt',
      time: '10:00',
      isOnline: false,
      meetingType: 'zoom',
      meetingLink: '',
      meetingNote: ''
    })
  }

  const totalSessions = calSessions.length
  const onlineSessions = calSessions.filter(s => s.isOnline).length
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
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">{t.portal.admin.cal_title}</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.cal_subtitle}</p>
        </div>
        {/* Quick Stats */}
        <div className="flex gap-3 flex-wrap">          {[
            { label: t.portal.admin.cal_appointment, value: totalSessions, color: 'primary' },
            { label: 'Online', value: onlineSessions, color: 'secondary' },
            { label: t.portal.admin.cal_client, value: uniqueClients, color: 'accent' },
            { label: t.portal.admin.cal_busy, value: dayNames[busiestDay] || busiestDay, color: 'primary' },
          ].map((s, i) => (
            <div key={i} className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 ${dm ? `bg-${s.color}/10 text-${s.color}` : `bg-${s.color}/10 text-${s.color}`}`}>
              <span className="font-bold">{s.value}</span> {s.label}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-8 items-start">
        {/* Form */}
        <motion.div variants={fadeUp} className={card}>
          <h3 className="font-display text-xl font-medium mb-6">{t.portal.admin.cal_add_appointment}</h3>
          <div className="space-y-5">
            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>{t.portal.admin.cal_client_label}</label>
              <select value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className={inp}>
                {activeClients.length === 0 ? <option>{t.portal.admin.cal_not_listed}</option> : activeClients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>{t.portal.admin.cal_day_label}</label>
              <div className="grid grid-cols-7 gap-1.5">
                {daysArr.map(d => (
                  <button key={d} onClick={() => setForm({ ...form, day: d })}                    className={`py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border-none ${form.day === d
                      ? 'bg-primary text-white shadow-sm'
                      : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
                    }`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>{t.portal.admin.cal_time_label}</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={inp} />
            </div>

            {/* Online Lesson Toggle */}
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, isOnline: !form.isOnline })}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full border-none cursor-pointer transition-all ${
                    form.isOnline
                      ? 'bg-primary shadow-sm shadow-primary/30'
                      : (dm ? 'bg-white/[0.08]' : 'bg-stone-200')
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      form.isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}                  />
                </button>
                <label className={`text-sm font-medium cursor-pointer ${dm ? 'text-white/70' : 'text-stone-600'}`}>
                  {form.isOnline ? 'Online Ders' : 'Yüz Yüze'}
                </label>
              </div>
            </div>

            {/* Online Meeting Fields */}
            <AnimatePresence>
              {form.isOnline && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2 border-t border-white/[0.06]"
                >
                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Platform</label>
                    <select
                      value={form.meetingType}
                      onChange={e => setForm({ ...form, meetingType: e.target.value as any })}
                      className={inp}
                    >
                      <option value="zoom">Zoom</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="meet">Google Meet</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Toplantı Linki</label>
                    <input
                      type="url"
                      placeholder="https://zoom.us/j/..."
                      value={form.meetingLink}
                      onChange={e => setForm({ ...form, meetingLink: e.target.value })}
                      className={inp}
                    />
                  </div>

                  <div>
                    <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Not (Opsiyonel)</label>
                    <textarea
                      placeholder="Ders hakkında notlar..."
                      value={form.meetingNote}
                      onChange={e => setForm({ ...form, meetingNote: e.target.value })}
                      className={`${inp} resize-none h-20`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer"            >
              {t.portal.admin.cal_add_to_calendar}
            </motion.button>
            <p className={`text-xs text-center ${dm ? 'text-white/25' : 'text-stone-300'}`}>{t.portal.admin.cal_add_note}</p>
          </div>

          {/* Upcoming Sessions Quick View */}
          {calSessions.length > 0 && (
            <div className={`mt-6 pt-5 border-t ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}>
              <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${dm ? 'text-white/40' : 'text-stone-400'}`}>{t.portal.admin.cal_next_sessions}</p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {calSessions
                  .slice()
                  .sort((a, b) => {
                    const dayOrder = daysArr.indexOf(a.day as string) - daysArr.indexOf(b.day as string)
                    return dayOrder !== 0 ? dayOrder : a.time.localeCompare(b.time)
                  })
                  .map((s, i) => {
                    const dc = dayColorMap[s.day] || dayColorMap.Pzt
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-2 p-2.5 rounded-lg transition-all hover:translate-x-1 ${dm ? 'bg-white/[0.03] hover:bg-white/[0.05]' : 'bg-stone-50 hover:bg-stone-100'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[0.6rem] font-bold flex-shrink-0 ${dc.bg} ${dc.text}`}>
                          {s.day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{s.name}</p>                          <p className={`text-[0.65rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>{s.time}</p>
                        </div>
                        {s.isOnline && (
                          <span className="text-sm flex-shrink-0">{meetingTypeIcons[s.meetingType || 'zoom']}</span>
                        )}
                      </motion.div>
                    )
                  })
                }
              </div>
            </div>
          )}
        </motion.div>

        {/* Weekly Grid */}
        <motion.div variants={fadeUp}>
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-7 gap-2">
            {daysArr.map((day, di) => {
              const daySessions = calSessions
                .map((s, idx) => ({ ...s, idx }))
                .filter(s => s.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
              const dc = dayColorMap[day] || dayColorMap.Pzt
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.04 }}                  className={`rounded-2xl border flex flex-col min-h-[420px] overflow-hidden transition-all ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}
                >
                  <div className={`py-3 px-3 text-center font-semibold text-sm flex items-center justify-center gap-2 ${dc.bg} ${dc.text}`}>
                    <span>{day}</span>
                    {daySessions.length > 0 && (
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[0.6rem] font-bold bg-primary`}>
                        {daySessions.length}
                      </span>
                    )}
                  </div>
                  <div className="p-2 flex flex-col gap-1.5 flex-1 overflow-y-auto">
                    {daySessions.length === 0 ? (
                      <div className={`flex-1 flex items-center justify-center`}>
                        <span className={`text-xs ${dm ? 'text-white/10' : 'text-stone-200'}`}>—</span>
                      </div>
                    ) : daySessions.map((sess, si) => (
                      <motion.div
                        key={sess.idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: si * 0.05 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        className={`border-l-[3px] ${dc.accent} p-3 rounded-r-lg text-xs relative group cursor-default transition-shadow hover:shadow-md ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}
                      >
                        <div className={`font-bold ${dc.text}`}>{sess.time}</div>
                        <div className="mt-0.5 truncate font-medium text-sm mb-1">{sess.name}</div>
                        {sess.isOnline && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{meetingTypeIcons[sess.meetingType || 'zoom']}</span>
                            {sess.meetingLink && (
                              <motion.a                                href={sess.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                Katıl
                              </motion.a>
                            )}
                          </div>
                        )}
                        <button onClick={() => deleteCalSession(sess.idx)}
                          className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 ${dm ? 'text-white/40 hover:text-primary' : 'text-stone-300 hover:text-primary'}`}>
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
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
              const dc = dayColorMap[day] || dayColorMap.Pzt
              return (
                <motion.div key={day} layout className={`rounded-2xl border overflow-hidden ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
                  <button
                    onClick={() => setSelectedDay(isOpen ? null : day)}
                    className={`w-full flex items-center justify-between p-4 border-none cursor-pointer bg-transparent ${dm ? 'text-white' : 'text-text-main'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[0.65rem] font-bold ${dc.bg} ${dc.text}`}>
                        {day}
                      </div>
                      <span className="font-semibold text-sm">{dayNames[day]}</span>
                      {daySessions.length > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[0.6rem] font-bold">
                          {daySessions.length}
                        </span>
                      )}
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}
                    >
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 space-y-2">
                          {daySessions.length === 0 ? (
                            <p className={`text-center py-4 text-xs ${dm ? 'text-white/20' : 'text-stone-300'}`}>{t.portal.admin.cal_no_appointment}</p>
                          ) : daySessions.map(sess => (
                            <motion.div key={sess.idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-center justify-between p-3 rounded-xl border-l-[3px] ${dc.accent} ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}
                            >
                              <div className="flex-1">
                                <span className={`font-bold text-sm ${dc.text}`}>{sess.time}</span>
                                <span className="ml-2 text-sm font-medium">{sess.name}</span>
                                {sess.isOnline && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm">{meetingTypeIcons[sess.meetingType || 'zoom']}</span>
                                    {sess.meetingLink && (
                                      <motion.a
                                        href={sess.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-xs font-semibold text-primary hover:underline"
                                      >
                                        Katıl
                                      </motion.a>
                                    )}                                  </div>
                                )}
                              </div>
                              <button onClick={() => deleteCalSession(sess.idx)}
                                className={`w-7 h-7 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-lg transition-colors ${dm ? 'text-white/20 hover:text-primary hover:bg-primary/10' : 'text-stone-200 hover:text-primary hover:bg-primary/5'}`}>
                                ×
                              </button>
                            </motion.div>
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
