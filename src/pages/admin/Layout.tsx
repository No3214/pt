import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import AdminLogin from './Login'

const tabs = [
  { to: 'dashboard', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ), label: 'Dashboard' },
  { to: 'clients', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ), label: 'Müşteriler' },
  { to: 'assessment', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ), label: 'Değerlendirme' },
  { to: 'builder', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ), label: 'Program Builder' },
  { to: 'nutrition', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ), label: 'Beslenme & TDEE' },
  { to: 'food-tracker', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
  ), label: 'Yemek Takibi' },
  { to: 'calendar', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ), label: 'Takvim' },
  { to: 'progress', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ), label: 'Ölçüm & İlerleme' },
  { to: 'leads', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  ), label: 'Başvurular' },
  { to: 'settings', icon: (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ), label: 'AI Ayarları' },
]

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
}

export default function AdminLayout() {
  const { darkMode, toggleDarkMode, isAdminAuth, logoutAdmin, toastMsg } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const dm = darkMode

  if (!isAdminAuth) return <AdminLogin />

  return (
    <div className={`min-h-screen font-body ${dm ? 'bg-[#050505]' : 'bg-[#F7F5F2]'}`}>
      {/* ═══ Top Bar ═══ */}
      <header className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-2xl border-b transition-all duration-500 ${dm ? 'bg-[#050505]/80 border-white/[0.04]' : 'bg-white/70 border-black/[0.03]'}`}>
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-transparent border-none cursor-pointer p-2 -ml-2"
              aria-label="Menü"
            >
              <div className="space-y-[5px]">
                <motion.span
                  animate={sidebarOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                  className={`block w-5 h-[1.5px] rounded-full transition-colors ${dm ? 'bg-white/70' : 'bg-[#1C1917]/70'}`}
                />
                <motion.span
                  animate={sidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`block w-5 h-[1.5px] rounded-full transition-colors ${dm ? 'bg-white/70' : 'bg-[#1C1917]/70'}`}
                />
                <motion.span
                  animate={sidebarOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                  className={`block w-5 h-[1.5px] rounded-full transition-colors ${dm ? 'bg-white/70' : 'bg-[#1C1917]/70'}`}
                />
              </div>
            </button>

            <NavLink to="/" className={`flex items-center gap-3 font-display text-lg font-semibold no-underline tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-white text-xs font-bold font-body">EE</span>
              </div>
              <span className="hidden sm:inline">Ela Ebeoğlu</span>
              <span className={`text-[0.65rem] font-body font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${dm ? 'bg-white/[0.06] text-white/40' : 'bg-primary/8 text-primary/80'}`}>Admin</span>
            </NavLink>
          </div>

          <div className="flex gap-2 items-center">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${dm ? 'bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1]' : 'bg-black/[0.04] text-[#1C1917]/50 hover:text-[#1C1917] hover:bg-black/[0.07]'}`}
              aria-label="Tema">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {dm
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                }
              </svg>
            </motion.button>

            {/* Logout */}
            <button onClick={logoutAdmin}
              className={`rounded-xl px-4 py-2 text-[0.75rem] font-medium border cursor-pointer bg-transparent transition-all duration-300 ${dm ? 'border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15' : 'border-black/[0.06] text-[#1C1917]/40 hover:text-[#1C1917]/70 hover:border-black/15'}`}>
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 max-w-[1600px] mx-auto flex">
        {/* ═══ Sidebar ═══ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside className={`${sidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto'} md:translate-x-0 fixed md:sticky top-16 left-0 z-50 md:z-auto w-[260px] h-[calc(100vh-64px)] flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-y-auto`}>
          <div className="p-4 md:p-5 h-full flex flex-col">
            <div className={`rounded-2xl p-4 flex-1 flex flex-col ${dm ? 'bg-[#0c0c0c] border border-white/[0.04]' : 'bg-white border border-black/[0.03]'}`}>
              {/* Section label */}
              <div className="px-3 mb-4 pt-1">
                <p className={`text-[0.68rem] uppercase tracking-[0.2em] font-medium ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>Yönetim</p>
              </div>

              {/* Nav items */}
              <nav className="flex flex-col gap-0.5 flex-1">
                {tabs.map(t => (
                  <NavLink key={t.to} to={t.to} onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline text-[0.8rem] transition-all duration-300 group/nav ${
                        isActive
                          ? `font-medium ${dm ? 'bg-primary/10 text-primary' : 'bg-primary/[0.06] text-primary'}`
                          : `${dm ? 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]' : 'text-[#1C1917]/35 hover:text-[#1C1917]/65 hover:bg-black/[0.02]'}`
                      }`
                    }>
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-indicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                        )}
                        <span className="flex-shrink-0 opacity-80 transition-transform duration-300 group-hover/nav:scale-110">{t.icon}</span>
                        <span>{t.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Bottom info */}
              <div className={`mt-auto pt-4 border-t ${dm ? 'border-white/[0.04]' : 'border-black/[0.03]'}`}>
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
                    <span className="text-secondary text-[0.65rem] font-bold">EE</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.75rem] font-medium truncate ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Ela Ebeoğlu</p>
                    <p className={`text-[0.68rem] ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>v2.0 Performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 min-h-[calc(100vh-64px)] p-4 md:p-6 w-full max-w-full overflow-x-hidden overflow-y-auto">
          <div className={`rounded-2xl p-6 md:p-8 min-h-[calc(100vh-96px)] ${dm ? 'bg-[#0c0c0c] border border-white/[0.04]' : 'bg-white border border-black/[0.03]'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ═══ Toast ═══ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3.5 rounded-2xl shadow-2xl text-[0.82rem] font-medium backdrop-blur-xl ${
              dm
                ? 'bg-white/95 text-[#1C1917] shadow-black/40'
                : 'bg-[#1C1917] text-white shadow-black/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              {toastMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
