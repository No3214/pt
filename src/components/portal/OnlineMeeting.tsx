import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}

const meetingTypeIcons: Record<string, string> = {
  zoom: '📹',
  teams: '🔵',
  meet: '🎥',
  other: '📱'
}

const meetingTypeLabels: Record<string, string> = {
  zoom: 'Zoom',
  teams: 'Microsoft Teams',
  meet: 'Google Meet',
  other: 'Diğer'
}

export default function OnlineMeeting() {
  const { t } = useTranslation()
  const { calSessions, darkMode: dm } = useStore()
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)
  const [copied, setCopied] = useState(false)
  // Filter online sessions and sort by time
  const onlineSessions = calSessions
    .filter(s => s.isOnline && s.meetingLink)
    .sort((a, b) => {
      const dayOrder = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'].indexOf(a.day) -
                       ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'].indexOf(b.day)
      return dayOrder !== 0 ? dayOrder : a.time.localeCompare(b.time)
    })

  const nextSession = onlineSessions[0]
  const pastSessions = onlineSessions.slice(1)

  // Calculate countdown
  useEffect(() => {
    if (!nextSession) {
      setTimeLeft(null)
      return
    }

    const calculateTimeLeft = () => {
      const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz']
      const dayIndex = days.indexOf(nextSession.day)
      const dayOfWeek = (dayIndex + 1) % 7

      const now = new Date()
      const currentDay = now.getDay()

      let daysUntilSession = dayOfWeek - currentDay
      if (daysUntilSession < 0) {
        daysUntilSession += 7      } else if (daysUntilSession === 0) {
        const [sessionHour, sessionMin] = nextSession.time.split(':').map(Number)
        const sessionTime = new Date()
        sessionTime.setHours(sessionHour, sessionMin, 0)
        if (now > sessionTime) {
          daysUntilSession = 7
        }
      }

      const targetDate = new Date(now)
      targetDate.setDate(targetDate.getDate() + daysUntilSession)
      const [sessionHour, sessionMin] = nextSession.time.split(':').map(Number)
      targetDate.setHours(sessionHour, sessionMin, 0, 0)

      const diff = targetDate.getTime() - now.getTime()

      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft(null)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [nextSession])
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (onlineSessions.length === 0) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className={`p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}
      >
        <h3 className="font-display text-xl font-semibold mb-4">Online Dersler</h3>
        <div className={`flex items-center justify-center py-12 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
          <p className="text-center">Yaklaşan online ders yok</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >      {/* Next Session */}
      {nextSession && (
        <div className={`p-8 rounded-2xl border relative overflow-hidden ${dm ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20' : 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'}`}>
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-primary/60' : 'text-primary/70'}`}>Sonraki Ders</p>
                <h4 className="text-2xl font-display font-bold mt-1">{nextSession.name}</h4>
              </div>
              <span className="text-4xl">{meetingTypeIcons[nextSession.meetingType || 'zoom']}</span>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>Gün</p>
                <p className="text-lg font-semibold mt-1">{nextSession.day}</p>
              </div>
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>Saat</p>
                <p className="text-lg font-semibold mt-1">{nextSession.time}</p>
              </div>
              <div>
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>Platform</p>
                <p className="text-lg font-semibold mt-1">{meetingTypeLabels[nextSession.meetingType || 'zoom']}</p>
              </div>
            </div>
            {/* Countdown */}
            {timeLeft && (
              <div className="mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'} mb-2`}>Başlıyor</p>
                <div className="flex gap-3">
                  {[
                    { value: timeLeft.hours, label: 'Saat' },
                    { value: timeLeft.minutes, label: 'Dakika' },
                    { value: timeLeft.seconds, label: 'Saniye' }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className={`text-2xl font-bold tabular-nums ${dm ? 'text-primary' : 'text-primary'}`}>
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <p className={`text-[0.65rem] font-medium mt-1 ${dm ? 'text-white/40' : 'text-stone-500'}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Note */}
            {nextSession.meetingNote && (
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'} mb-2`}>Not</p>
                <p className={`text-sm ${dm ? 'text-white/70' : 'text-stone-600'}`}>{nextSession.meetingNote}</p>
              </div>
            )
            {/* Action Buttons */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <motion.a
                href={nextSession.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-full bg-primary text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                <span>🎯</span> Derse Katıl
              </motion.a>

              <motion.button
                onClick={() => handleCopyLink(nextSession.meetingLink!)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 rounded-full font-semibold border transition-all ${
                  copied
                    ? 'bg-primary/20 border-primary text-primary'
                    : (dm ? 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]' : 'border-stone-200 bg-stone-50 hover:bg-stone-100')
                }`}
              >
                {copied ? '✓ Kopyalandı' : 'Linki Kopyala'}
              </motion.button>
            </div>
          </div>
        </div>
      )}
      {/* Upcoming Sessions List */}
      {pastSessions.length > 0 && (
        <div className={`p-6 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
          <h4 className="font-display font-semibold text-lg mb-4">Diğer Online Dersler</h4>
          <div className="space-y-3">
            {pastSessions.slice(0, 4).map((session, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border-l-4 border-primary flex items-center justify-between group hover:translate-x-1 transition-transform ${dm ? 'bg-white/[0.02]' : 'bg-stone-50'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{meetingTypeIcons[session.meetingType || 'zoom']}</span>
                    <p className="font-semibold">{session.name}</p>
                  </div>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-500'}`}>{session.day} • {session.time}</p>
                </div>

                <motion.a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
                >
                  Katıl                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
