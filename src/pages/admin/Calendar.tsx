import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

interface Event {
  id: string
  date: string
  title: string
  type: 'session' | 'birthday' | 'note'
  color: string
  description?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

export default function Calendar() {
  const { clients, darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    type: 'session',
    color: 'bg-primary/10',
    description: '',
  })
  const calendarRef = useRef<HTMLDivElement>(null)
  const calendarInView = useInView(calendarRef, { once: true })  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title) return
    const eventWithId = { ...newEvent, id: Date.now().toString() }
    setEvents([...events, eventWithId])
    setNewEvent({ date: new Date().toISOString().split('T')[0], title: '', type: 'session', color: 'bg-primary/10', description: '' })
    setShowEventForm(false)
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
  const stagger = { show: { transition: { staggerChildren: 0.05 } } }

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white' : 'bg-white border-black/[0.06]'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const renderCalendarDays = () => {
    const days = []
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const dayEvents = events.filter(e => e.date === dateStr)
      days.push({ day: i, date: dateStr, events: dayEvents })
    }

    return days
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-display text-3xl font-semibold">{t.portal.admin.calendar_title}</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>{monthName}</p>
        </div>
        <motion.button
          onClick={() => setShowEventForm(!showEventForm)}
          className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-all ${showEventForm ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : (dm ? 'border border-white/10 text-white/70' : 'border border-stone-200 text-stone-600')}`}>
          {showEventForm ? t.portal.admin.calendar_close : t.portal.admin.calendar_add_event}
        </motion.button>
      </motion.div>

      {/* Add Event Form */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div variants={fadeUp} className={`${card} mb-8`}>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder={t.portal.admin.calendar_event_title}
                className={inp}
                required
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className={inp}
              />
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'session' | 'birthday' | 'note' })}
                className={inp}>
                <option value="session">{t.portal.admin.calendar_session}</option>
                <option value="birthday">{t.portal.admin.calendar_birthday}</option>
                <option value="note">{t.portal.admin.calendar_note}</option>
              </select>
              <textarea
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder={t.portal.admin.calendar_description}
                className={`${inp} h-20 resize-none`}
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-primary text-white font-medium cursor-pointer hover:bg-primary/90 transition-all">
                {t.portal.admin.calendar_save}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Grid */}
      <motion.div ref={calendarRef} variants={fadeUp} className={card}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{borderColor: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}}>
          <button onClick={handlePrevMonth} className={`p-2 rounded-lg cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>←</button>
          <h3 className="font-semibold text-lg">{monthName}</h3>
          <button onClick={handleNextMonth} className={`p-2 rounded-lg cursor-pointer ${dm ? 'hover:bg-white/10' : 'hover:bg-stone-100'}`}>→</button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`text-center text-xs font-semibold py-2 ${dm ? 'text-white/50' : 'text-stone-400'}`}>{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays().map((dayObj, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className={`aspect-square rounded-lg p-1.5 text-xs cursor-pointer transition-all ${
                !dayObj
                  ? ''
                  : `border ${dm ? 'border-white/5 hover:border-secondary/30 hover:bg-white/[0.02]' : 'border-stone-100 hover:border-secondary/30 hover:bg-stone-50'}`
              }`}
              onClick={() => dayObj && setSelectedDate(dayObj.date)}>
              {dayObj && (
                <div>
                  <div className={`font-semibold ${selectedDate === dayObj.date ? 'text-secondary' : ''}`}>{dayObj.day}</div>
                  {dayObj.events.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayObj.events.slice(0, 2).map(e => (
                        <div key={e.id} className={`${e.color} rounded px-1 py-0.5 text-[0.6rem] truncate`}>{e.title}</div>
                      ))}
                      {dayObj.events.length > 2 && <div className="text-[0.6rem] text-secondary">+{dayObj.events.length - 2}</div>}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Selected Date Events */}
      {selectedDate && (
        <motion.div variants={fadeUp} className={`${card} mt-8`}>
          <h3 className="font-semibold mb-4">{new Date(selectedDate).toLocaleDateString()}</h3>
          {events
            .filter(e => e.date === selectedDate)
            .map(e => (
              <motion.div key={e.id} variants={fadeUp} className={`${e.color} p-4 rounded-lg mb-3`}>
                <p className="font-medium">{e.title}</p>
                {e.description && <p className={`text-sm mt-2 ${dm ? 'text-white/60' : 'text-stone-600'}`}>{e.description}</p>}
              </motion.div>
            ))}
        </motion.div>
      )}
    </motion.div>
  )
}