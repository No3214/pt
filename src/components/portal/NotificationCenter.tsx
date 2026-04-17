import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'

const typeIcons: Record<string, string> = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  workout: '💪',
  message: '💬',
  payment: '💳',
  achievement: '🏆',
  reminder: '⏰'
}

const typeColors: Record<string, string> = {
  info: 'from-blue-500/20 to-blue-500/5',
  success: 'from-green-500/20 to-green-500/5',
  warning: 'from-amber-500/20 to-amber-500/5',
  workout: 'from-primary/20 to-primary/5',
  message: 'from-purple-500/20 to-purple-500/5',
  payment: 'from-emerald-500/20 to-emerald-500/5',
  achievement: 'from-yellow-500/20 to-yellow-500/5',
  reminder: 'from-orange-500/20 to-orange-500/5'
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useStudentAuth()
  const darkMode = useStore(s => s.darkMode)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const timeAgo = (dateStr: string) => {
    const now = Date.now()
    const diff = now - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Şimdi'
    if (mins < 60) return `${mins}dk`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}sa`
    const days = Math.floor(hours / 24)
    return `${days}g`
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Bildirimler${unreadCount > 0 ? ` (${unreadCount} okunmamış)` : ''}`}
        className={`relative p-2.5 rounded-xl transition-colors ${
          darkMode ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={darkMode ? 'text-white/50' : 'text-black/50'}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[0.55rem] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-32px)] max-h-[480px] rounded-2xl border shadow-2xl z-50 overflow-hidden flex flex-col ${
                darkMode
                  ? 'bg-surface border-white/[0.08] shadow-black/40'
                  : 'bg-white border-black/[0.06] shadow-black/10'
              }`}
            >
              {/* Header */}
              <div className={`px-5 py-4 border-b flex items-center justify-between ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                <div>
                  <h3 className="font-bold text-sm">Bildirimler</h3>
                  <p className={`text-[0.6rem] uppercase tracking-widest mt-0.5 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                    {unreadCount > 0 ? `${unreadCount} okunmamış` : 'Tümü okundu'}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Tümünü oku
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <p className="font-bold text-sm mb-1">Bildirim yok</p>
                    <p className={`text-xs ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                      Yeni bildirimler burada görünecek.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {notifications.map(notif => (
                      <motion.button
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`w-full text-left px-5 py-4 transition-colors ${
                          !notif.is_read
                            ? darkMode ? 'bg-primary/[0.03]' : 'bg-primary/[0.02]'
                            : ''
                        } ${darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-black/[0.02]'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-b ${typeColors[notif.type] || typeColors.info} flex items-center justify-center text-lg flex-shrink-0`}>
                            {typeIcons[notif.type] || '📢'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm truncate">{notif.title}</span>
                              {!notif.is_read && (
                                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 line-clamp-2 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                              {notif.body}
                            </p>
                            <p className={`text-[0.6rem] mt-1.5 ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
                              {timeAgo(notif.created_at)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
