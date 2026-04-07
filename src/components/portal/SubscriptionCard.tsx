import { motion } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'

export default function SubscriptionCard() {
  const { profile } = useStudentAuth()
  const darkMode = useStore(s => s.darkMode)

  if (!profile) return null

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    active: { label: 'Aktif', color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: '✅' },
    trial: { label: 'Deneme', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: '🆓' },
    paused: { label: 'Durduruldu', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: '⏸️' },
    expired: { label: 'Süresi Doldu', color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: '⚠️' },
  }

  const status = statusConfig[profile.subscription_status] || statusConfig.active

  const daysLeft = profile.subscription_end
    ? Math.max(0, Math.ceil((new Date(profile.subscription_end).getTime() - Date.now()) / 86400000))
    : null

  const sessionsUsed = profile.total_sessions - profile.remaining_sessions
  const sessionPercent = profile.total_sessions > 0 ? (sessionsUsed / profile.total_sessions) * 100 : 0

  // XP to Level
  const level = Math.floor(profile.xp / 1000) + 1
  const xpInLevel = profile.xp % 1000
  const xpPercent = (xpInLevel / 1000) * 100

  const levelNames: Record<number, string> = {
    1: 'Başlangıç', 2: 'Çırak', 3: 'Sporcu', 4: 'Atlet', 5: 'Savaşçı',
    6: 'Şampiyon', 7: 'Efsane', 8: 'Titan', 9: 'Efsanevi', 10: 'GOAT'
  }

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border relative overflow-hidden ${
      darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'
    }`}>
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary mb-2">Üyelik Durumu</h3>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${status.color}`}>
                {status.icon} {status.label}
              </span>
              {daysLeft !== null && daysLeft <= 7 && profile.subscription_status === 'active' && (
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                  ⏰ {daysLeft} gün kaldı
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-bold text-primary">LV.{level}</div>
            <div className={`text-[0.6rem] font-bold uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
              {levelNames[Math.min(level, 10)] || 'GOAT'}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
              Deneyim Puanı (XP)
            </span>
            <span className="text-xs font-bold text-primary">{profile.xp} XP</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
            />
          </div>
          <div className={`flex justify-between mt-1 text-[0.6rem] ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
            <span>LV.{level}</span>
            <span>{1000 - xpInLevel} XP sonraki seviye</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Sessions */}
          <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#FAF6F1] border-black/[0.04]'}`}>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke={darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="3" />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${sessionPercent}, 100` }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-sm">{profile.remaining_sessions}</span>
              </div>
            </div>
            <div className={`text-[0.6rem] font-bold uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Kalan Seans</div>
          </div>

          {/* Streak */}
          <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#FAF6F1] border-black/[0.04]'}`}>
            <div className="text-4xl mb-2">🔥</div>
            <div className="font-display text-2xl font-bold text-primary">{profile.streak}</div>
            <div className={`text-[0.6rem] font-bold uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Gün Seri</div>
          </div>

          {/* Level */}
          <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#FAF6F1] border-black/[0.04]'}`}>
            <div className="text-4xl mb-2">
              {profile.athlete_level === 'Legend' ? '👑' : profile.athlete_level === 'Elite' ? '💎' : profile.athlete_level === 'Pro' ? '⭐' : '🌱'}
            </div>
            <div className="font-bold text-sm">{profile.athlete_level}</div>
            <div className={`text-[0.6rem] font-bold uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Seviye</div>
          </div>
        </div>

        {/* Subscription End Date */}
        {profile.subscription_end && (
          <div className={`mt-6 p-4 rounded-xl border text-center ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-[#FAF6F1] border-black/[0.04]'}`}>
            <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-black/40'}`}>Üyelik bitiş: </span>
            <span className="text-xs font-bold">{new Date(profile.subscription_end).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  )
}
