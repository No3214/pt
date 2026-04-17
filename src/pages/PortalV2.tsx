import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../stores/studentAuth'
import { useStore } from '../stores/useStore'
import { GrainOverlay } from '../components/landing/LandingUI'
import { tenantConfig } from '../config/tenant'

// Auth
import StudentLogin from './portal/StudentLogin'

// Portal Components
import HabitCheckIn from '../components/portal/HabitCheckIn'
import FoodLog from '../components/portal/FoodLog'
import MacroTracker from '../components/portal/MacroTracker'
import WorkoutLogger from '../components/portal/WorkoutLogger'
import ProgressGallery from '../components/portal/ProgressGallery'
import GamifiedExport from '../components/portal/GamifiedExport'
import AchievementTracker from '../components/portal/AchievementTracker'
import StudentWeightChart from '../components/portal/StudentWeightChart'
import AiMacroAssistant from '../components/portal/AiMacroAssistant'
import PerformanceRadar from '../components/portal/PerformanceRadar'
import CoachVault from '../components/portal/CoachVault'
import WellnessTracker from '../components/portal/WellnessTracker'
import PathToProRoadmap from '../components/portal/PathToProRoadmap'
import LevelAtmosphere from '../components/portal/LevelAtmosphere'

// NEW V2 Components
import ChatWidget from '../components/portal/ChatWidget'
import NotificationCenter from '../components/portal/NotificationCenter'
import VideoLibrary from '../components/portal/VideoLibrary'
import OnlineMeeting from '../components/portal/OnlineMeeting'
import SubscriptionCard from '../components/portal/SubscriptionCard'
import AIWorkoutGenerator from '../components/portal/AIWorkoutGenerator'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const stagger = {
  show: { transition: { staggerChildren: 0.08 } }
}

type PortalTab = 'dashboard' | 'workouts' | 'nutrition' | 'library' | 'progress' | 'profile'

export default function PortalV2() {
  const { user, profile, isLoading, initialize, subscribeToRealtime, logout } = useStudentAuth()
  const { darkMode: dm } = useStore()
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    if (user) {
      const unsub = subscribeToRealtime()
      return unsub
    }
    return undefined
  }, [user])

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dm ? 'bg-bg' : 'bg-bg'}`}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className={`text-sm font-medium ${dm ? 'text-white/30' : 'text-black/30'}`}>Portal yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Not authenticated — show login
  if (!user) {
    return <StudentLogin />
  }

  const tabs: { key: PortalTab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'workouts', label: 'Antrenman', icon: '💪' },
    { key: 'nutrition', label: 'Beslenme', icon: '🥗' },
    { key: 'library', label: 'Kütüphane', icon: '📚' },
    { key: 'progress', label: 'Gelişim', icon: '📈' },
    { key: 'profile', label: 'Profil', icon: '👤' },
  ]

  return (
    <div className={`min-h-screen font-body overflow-x-hidden relative ${dm ? 'dark bg-bg text-white' : 'bg-bg text-text-main'}`}>
      <LevelAtmosphere />
      <GrainOverlay />

      {/* Top Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b ${
        dm ? 'bg-bg/80 border-white/[0.06]' : 'bg-bg/80 border-black/[0.06]'
      }`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold tracking-tight hidden sm:block">{tenantConfig.brand.name}</span>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : dm ? 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]' : 'text-black/40 hover:text-black/60 hover:bg-black/[0.04]'
                  }`}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <NotificationCenter />

              {/* Profile Dropdown */}
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <button
                  onClick={logout}
                  className={`p-2 rounded-xl transition-colors ${dm ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'}`}
                  title="Çıkış Yap"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={dm ? 'text-white/30' : 'text-black/30'}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl ${dm ? 'hover:bg-white/[0.06]' : 'hover:bg-black/[0.04]'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={dm ? 'text-white/50' : 'text-black/50'}>
                  {isMobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /></>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`md:hidden border-t overflow-hidden ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}
            >
              <div className="p-4 grid grid-cols-3 gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setIsMobileMenuOpen(false) }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      activeTab === tab.key
                        ? 'bg-primary text-white'
                        : dm ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.04] text-black/50'
                    }`}
                  >
                    <span className="text-xl block">{tab.icon}</span>
                    <span className="text-[0.6rem] font-bold mt-1 block">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-20">
        <AnimatePresence mode="wait">
          {/* ═══════ DASHBOARD TAB ═══════ */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              {/* Welcome */}
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tighter leading-none">
                  Merhaba, {profile?.name?.split(' ')[0] || 'Şampiyon'} 👋
                </h1>
                <p className={`mt-3 text-sm font-medium max-w-lg ${dm ? 'text-white/30' : 'text-black/30'}`}>
                  Bugün hedeflerine bir adım daha yaklaşma zamanı. Disiplin, motivasyonun bittiği yerde başlar.
                </p>
              </motion.section>

              {/* Quick Stats Row */}
              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
                <SubscriptionCard />
                <PathToProRoadmap />
              </motion.div>

              {/* Daily Actions */}
              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
                <HabitCheckIn />
                {/* Coach Note */}
                <div className={`p-10 rounded-[2.5rem] border flex flex-col justify-center relative overflow-hidden ${
                  dm ? 'bg-primary/5 border-primary/20' : 'bg-white border-black/[0.04] shadow-2xl'
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-6xl text-primary font-display font-bold">"</span>
                  </div>
                  <h4 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary mb-4">Koçundan Not 💎</h4>
                  <p className="font-display text-xl md:text-2xl font-bold italic tracking-tight leading-snug">
                    {profile?.personal_note || "Yeni haftaya hazır mısın? Hedeflerin için bugün harika bir gün!"}
                  </p>
                  <div className="mt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`https://wa.me/${tenantConfig.brand.contact.socials.whatsapp.replace('+', '')}?text=Selam Ela! Portaldan yazıyorum...`, '_blank')}
                      className="px-6 py-2.5 rounded-full bg-primary text-white text-[0.7rem] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 w-fit"
                    >
                      <span>Koça Mesaj At</span>
                      <span className="text-base">💬</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Gamified Export */}
              <motion.div variants={fadeUp}>
                <GamifiedExport />
              </motion.div>

              {/* Performance Row */}
              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8">
                <WellnessTracker />
                <PerformanceRadar />
                <CoachVault />
              </motion.div>

              {/* Online Meeting */}
              <motion.div variants={fadeUp}>
                <OnlineMeeting />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ WORKOUTS TAB ═══════ */}
          {activeTab === 'workouts' && (
            <motion.div key="workouts" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-3xl font-bold tracking-tighter">Antrenman Merkezi 💪</h1>
                <p className={`mt-2 text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>AI destekli programlar, antrenman kaydı ve gelişim takibi.</p>
              </motion.section>

              <motion.div variants={fadeUp}>
                <AIWorkoutGenerator />
              </motion.div>

              <motion.div variants={fadeUp}>
                <WorkoutLogger />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ NUTRITION TAB ═══════ */}
          {activeTab === 'nutrition' && (
            <motion.div key="nutrition" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-3xl font-bold tracking-tighter">Beslenme Takibi 🥗</h1>
                <p className={`mt-2 text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>Makro takibi, AI besin asistanı ve günlük kayıt.</p>
              </motion.section>

              <motion.div variants={fadeUp} className="grid lg:grid-cols-3 gap-8">
                <MacroTracker />
                <AiMacroAssistant />
                <FoodLog />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ LIBRARY TAB ═══════ */}
          {activeTab === 'library' && (
            <motion.div key="library" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-3xl font-bold tracking-tighter">Egzersiz Kütüphanesi 📚</h1>
                <p className={`mt-2 text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>Video rehberli egzersizler, teknik ipuçları.</p>
              </motion.section>

              <motion.div variants={fadeUp}>
                <VideoLibrary />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ PROGRESS TAB ═══════ */}
          {activeTab === 'progress' && (
            <motion.div key="progress" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-3xl font-bold tracking-tighter">Gelişim Takibi 📈</h1>
                <p className={`mt-2 text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>Kilo takibi, başarılar ve fotoğraf galerisi.</p>
              </motion.section>

              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
                <StudentWeightChart />
                <AchievementTracker athleteLevel={profile?.athlete_level || 'Rookie'} />
              </motion.div>

              <motion.div variants={fadeUp}>
                <ProgressGallery />
              </motion.div>
            </motion.div>
          )}

          {/* ═══════ PROFILE TAB ═══════ */}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial="hidden" animate="show" exit="hidden" variants={stagger} className="space-y-8">
              <motion.section variants={fadeUp}>
                <h1 className="font-display text-3xl font-bold tracking-tighter">Profil & Ayarlar 👤</h1>
              </motion.section>

              <motion.div variants={fadeUp} className="max-w-2xl">
                <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'}`}>
                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-primary font-display text-3xl font-bold border border-primary/10">
                      {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight">{profile?.name}</h2>
                      <p className={`text-sm ${dm ? 'text-white/30' : 'text-black/30'}`}>{profile?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{profile?.athlete_level}</span>
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{profile?.xp || 0} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    {[
                      { label: 'Hedef', value: profile?.goal || 'Belirlenmedi' },
                      { label: 'Telefon', value: profile?.phone || 'Eklenmedi' },
                      { label: 'Alerjenler', value: profile?.allergens?.join(', ') || 'Yok' },
                      { label: 'Kalori Hedefi', value: profile?.nutrition_goals ? `${profile.nutrition_goals.cal} kcal` : '2000 kcal' },
                      { label: 'Üyelik Durumu', value: profile?.subscription_status === 'active' ? '✅ Aktif' : profile?.subscription_status || 'Belirsiz' },
                    ].map((field, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-white/[0.02]' : 'bg-bg'}`}>
                        <span className={`text-sm ${dm ? 'text-white/40' : 'text-black/40'}`}>{field.label}</span>
                        <span className="text-sm font-medium">{field.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Danger Zone */}
                  <div className={`mt-10 pt-8 border-t ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                    <button
                      onClick={logout}
                      className="w-full py-3.5 rounded-xl border border-red-500/20 text-red-500 font-bold text-sm hover:bg-red-500/5 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t backdrop-blur-xl ${
        dm ? 'bg-bg/90 border-white/[0.06]' : 'bg-bg/90 border-black/[0.06]'
      }`}>
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.slice(0, 5).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                activeTab === tab.key
                  ? 'text-primary'
                  : dm ? 'text-white/30' : 'text-black/30'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[0.5rem] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
