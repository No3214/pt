import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, type Booking } from '../../stores/useStore'
import { useTranslation } from '../../locales'
import { fadeUp, stagger as makeStagger, hoverLift, slideUp } from '../../lib/motion'
import { useBookingsRealtime } from '../../hooks/useBookingsRealtime'

const stagger = makeStagger(0.05, 0.05)

const statusConfig: Record<Booking['status'], { label: string; color: string; icon: string }> = {
  pending: { label: 'Beklemede', color: 'bg-amber-500/15 text-amber-500 border-amber-500/20', icon: '⏳' },
  approved: { label: 'Onaylandı', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: '✅' },
  paid: { label: 'Ödendi', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: '💰' },
  scheduled: { label: 'Planlandı', color: 'bg-primary/15 text-primary border-primary/20', icon: '📅' },
  completed: { label: 'Tamamlandı', color: 'bg-secondary/15 text-secondary border-secondary/20', icon: '🎯' },
  rejected: { label: 'Reddedildi', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: '❌' },
}

const sessionTypeLabels: Record<string, { label: string; icon: string; price: string }> = {
  consultation: { label: 'Ön Görüşme', icon: '💬', price: '500 ₺' },
  assessment: { label: 'Değerlendirme', icon: '📋', price: '750 ₺' },
  training: { label: 'Antrenman', icon: '🏋️', price: '1.000 ₺' },
}

const meetingTypeIcons: Record<string, string> = {
  zoom: '📹', teams: '🔵', meet: '🎥', other: '📱'
}

export default function Bookings() {
  useTranslation()
  useBookingsRealtime() // live-sync with Supabase
  const { bookings, updateBooking, deleteBooking, addCalSession, showToast, darkMode: dm } = useStore()
  const [filter, setFilter] = useState<Booking['status'] | 'all'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '10:00',
    meetingType: 'zoom' as 'zoom' | 'teams' | 'meet' | 'other',
    meetingLink: '',
    price: '',
    adminNote: ''
  })

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved' || b.status === 'paid').length,
    scheduled: bookings.filter(b => b.status === 'scheduled').length,
  }

  const inp = `w-full p-3 rounded-xl border outline-none transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-sm ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const handleApprove = (booking: Booking) => {
    updateBooking(booking.id, { status: 'approved' })
    showToast('Talep onaylandı! Ödeme bekleniyor.')
  }

  const handleReject = (booking: Booking) => {
    updateBooking(booking.id, { status: 'rejected', adminNote: scheduleForm.adminNote || 'Talep reddedildi.' })
    showToast('Talep reddedildi.')
    setSelectedBooking(null)
  }

  const handleMarkPaid = (booking: Booking) => {
    const price = scheduleForm.price ? Number(scheduleForm.price) : undefined
    updateBooking(booking.id, { status: 'paid', price })
    showToast('Ödeme onaylandı!')
  }

  const handleSchedule = (booking: Booking) => {
    if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.meetingLink) {
      showToast('Lütfen tarih, saat ve toplantı linkini girin.')
      return
    }

    // Update booking
    updateBooking(booking.id, {
      status: 'scheduled',
      scheduledDate: scheduleForm.date,
      scheduledTime: scheduleForm.time,
      meetingLink: scheduleForm.meetingLink,
      meetingType: scheduleForm.meetingType,
      adminNote: scheduleForm.adminNote
    })

    // Also add to calendar
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts']
    const dateObj = new Date(scheduleForm.date)
    const dayName = dayNames[dateObj.getDay()]

    addCalSession({
      name: `${booking.name} (${sessionTypeLabels[booking.sessionType].label})`,
      day: dayName,
      time: scheduleForm.time,
      isOnline: true,
      meetingType: scheduleForm.meetingType,
      meetingLink: scheduleForm.meetingLink,
      meetingNote: `Booking #${booking.id.slice(-4)}`
    })

    showToast('Görüşme planlandı ve takvime eklendi!')
    setSelectedBooking(null)
    setScheduleForm({ date: '', time: '10:00', meetingType: 'zoom', meetingLink: '', price: '', adminNote: '' })
  }

  const handleComplete = (booking: Booking) => {
    updateBooking(booking.id, { status: 'completed' })
    showToast('Görüşme tamamlandı olarak işaretlendi.')
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return dateStr }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-between items-start mb-10 gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Randevu Talepleri</h2>
          <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Calendly tarzı ön görüşme ve değerlendirme yönetimi</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Toplam', value: stats.total, color: 'primary' },
            { label: 'Bekleyen', value: stats.pending, color: 'amber-500' },
            { label: 'Onaylı', value: stats.approved, color: 'blue-400' },
            { label: 'Planlı', value: stats.scheduled, color: 'secondary' },
          ].map((s, i) => (
            <div key={i} className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 bg-${s.color}/10 text-${s.color}`}>
              <span className="font-bold">{s.value}</span> {s.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={fadeUp} className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {(['all', 'pending', 'approved', 'paid', 'scheduled', 'completed', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-none ${
              filter === status
                ? 'bg-primary text-white shadow-sm'
                : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
            }`}
          >
            {status === 'all' ? `Tümü (${bookings.length})` : `${statusConfig[status].icon} ${statusConfig[status].label}`}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Booking List */}
        <motion.div variants={fadeUp} className="space-y-4">
          {sorted.length === 0 ? (
            <div className={`${card} text-center py-16`}>
              <span className="text-5xl mb-4 block">📋</span>
              <p className={`text-lg font-medium ${dm ? 'text-white/50' : 'text-stone-400'}`}>Henüz randevu talebi yok</p>
              <p className={`text-sm mt-2 ${dm ? 'text-white/30' : 'text-stone-300'}`}>Yeni talepler web sitesinden gelecek</p>
            </div>
          ) : sorted.map((booking, i) => {
            const sc = statusConfig[booking.status]
            const st = sessionTypeLabels[booking.sessionType]
            const isSelected = selectedBooking?.id === booking.id
            return (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={hoverLift.whileHover}
                whileTap={hoverLift.whileTap}
                onClick={() => setSelectedBooking(isSelected ? null : booking)}
                className={`${card} cursor-pointer transition-[box-shadow,border-color,background-color] duration-300 ease-out hover:shadow-xl ${isSelected ? 'ring-2 ring-primary/30 shadow-[0_20px_60px_rgba(var(--color-primary-rgb),0.12)]' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{st.icon}</span>
                      <div>
                        <h4 className="font-semibold text-lg">{booking.name}</h4>
                        <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>{booking.email} • {booking.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${dm ? 'bg-white/[0.06] text-white/60' : 'bg-stone-100 text-stone-600'}`}>
                        {st.label}
                      </span>
                      {booking.price && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                          {booking.price} ₺
                        </span>
                      )}
                    </div>

                    {booking.message && (
                      <p className={`mt-3 text-sm line-clamp-2 ${dm ? 'text-white/50' : 'text-stone-500'}`}>
                        "{booking.message}"
                      </p>
                    )}

                    {booking.scheduledDate && (
                      <div className={`mt-3 flex items-center gap-2 text-sm ${dm ? 'text-primary' : 'text-primary'}`}>
                        <span>📅</span>
                        <span className="font-semibold">{booking.scheduledDate} — {booking.scheduledTime}</span>
                        {booking.meetingLink && (
                          <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer"
                            className="ml-2 text-xs font-semibold text-primary hover:underline"
                            onClick={e => e.stopPropagation()}>
                            {meetingTypeIcons[booking.meetingType || 'zoom']} Katıl
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-300'}`}>{formatDate(booking.createdAt)}</p>
                    <p className={`text-lg font-bold mt-1 ${dm ? 'text-white/70' : 'text-stone-600'}`}>{st.price}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mt-4 pt-4 border-t flex flex-wrap gap-2 ${dm ? 'border-white/[0.06]' : 'border-stone-100'}`}
                    >
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleApprove(booking) }}
                            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold border-none cursor-pointer hover:bg-primary/90 transition-colors">
                            ✅ Onayla
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleReject(booking) }}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold border-none cursor-pointer hover:bg-red-500/20 transition-colors">
                            ❌ Reddet
                          </button>
                        </>
                      )}
                      {booking.status === 'approved' && (
                        <button onClick={(e) => { e.stopPropagation(); handleMarkPaid(booking) }}
                          className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border-none cursor-pointer hover:bg-emerald-500/20 transition-colors">
                          💰 Ödeme Alındı
                        </button>
                      )}
                      {booking.status === 'paid' && (
                        <span className={`text-xs font-medium ${dm ? 'text-white/40' : 'text-stone-400'}`}>
                          → Sağdaki panelden görüşme planlayın
                        </span>
                      )}
                      {booking.status === 'scheduled' && (
                        <button onClick={(e) => { e.stopPropagation(); handleComplete(booking) }}
                          className="px-4 py-2 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold border-none cursor-pointer hover:bg-secondary/20 transition-colors">
                          🎯 Tamamlandı
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); deleteBooking(booking.id); setSelectedBooking(null) }}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors ${dm ? 'bg-white/[0.04] text-white/30 hover:text-red-400' : 'bg-stone-100 text-stone-400 hover:text-red-500'}`}>
                        🗑 Sil
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Schedule Panel */}
        <motion.div variants={fadeUp} className={`${card} sticky top-8 overflow-hidden`}>
          <motion.h3 layout className="font-display text-xl font-medium mb-6">
            {selectedBooking && (selectedBooking.status === 'paid' || selectedBooking.status === 'approved')
              ? '📅 Görüşme Planla'
              : '📊 Özet'}
          </motion.h3>

          <AnimatePresence mode="wait">
          {selectedBooking && (selectedBooking.status === 'paid' || selectedBooking.status === 'approved') ? (
            <motion.div
              key="schedule-form"
              variants={slideUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-xl ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
                <p className="text-sm font-semibold">{selectedBooking.name}</p>
                <p className={`text-xs mt-1 ${dm ? 'text-white/40' : 'text-stone-400'}`}>
                  {sessionTypeLabels[selectedBooking.sessionType].label} • {sessionTypeLabels[selectedBooking.sessionType].price}
                </p>
              </div>

              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Tarih</label>
                <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} className={inp} />
              </div>

              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Saat</label>
                <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} className={inp} />
              </div>

              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Platform</label>
                <select value={scheduleForm.meetingType} onChange={e => setScheduleForm({ ...scheduleForm, meetingType: e.target.value as any })} className={inp}>
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="meet">Google Meet</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Toplantı Linki</label>
                <input type="url" placeholder="https://zoom.us/j/..." value={scheduleForm.meetingLink}
                  onChange={e => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })} className={inp} />
              </div>

              {selectedBooking.status === 'approved' && (
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ücret (₺)</label>
                  <input type="number" placeholder="500" value={scheduleForm.price}
                    onChange={e => setScheduleForm({ ...scheduleForm, price: e.target.value })} className={inp} />
                </div>
              )}

              <div>
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Not (Opsiyonel)</label>
                <textarea placeholder="Danışana iletilecek not..." value={scheduleForm.adminNote}
                  onChange={e => setScheduleForm({ ...scheduleForm, adminNote: e.target.value })}
                  className={`${inp} resize-none h-20`} />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSchedule(selectedBooking)}
                className="w-full py-4 rounded-full bg-primary text-white font-medium border-none cursor-pointer"
              >
                📅 Görüşmeyi Planla
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              variants={slideUp}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              className="space-y-4"
            >
              {/* Flow explanation */}
              <div className={`p-4 rounded-xl space-y-3 ${dm ? 'bg-white/[0.04]' : 'bg-stone-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Randevu Akışı</p>
                {[
                  { step: '1', label: 'Talep Gelir', desc: 'Web sitesinden başvuru', icon: '📩' },
                  { step: '2', label: 'Değerlendirme', desc: 'Talebi incele, onayla/reddet', icon: '🔍' },
                  { step: '3', label: 'Ödeme', desc: 'Danışan ücreti öder', icon: '💰' },
                  { step: '4', label: 'Planlama', desc: 'Tarih, saat ve link belirle', icon: '📅' },
                  { step: '5', label: 'Görüşme', desc: 'Online ders/değerlendirme', icon: '🎯' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue summary */}
              {bookings.filter(b => b.price).length > 0 && (
                <div className={`p-4 rounded-xl ${dm ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-emerald-50 border border-emerald-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2`}>Gelir</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {bookings.filter(b => b.price).reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString('tr-TR')} ₺
                  </p>
                  <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                    {bookings.filter(b => b.status === 'completed').length} tamamlanan görüşme
                  </p>
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
