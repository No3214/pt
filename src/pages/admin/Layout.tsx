import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import AdminLogin from './Login'

const tabs = [
  { to: 'dashboard', icon: '📊', label: 'Dashboard' },
  { to: 'clients', icon: '👤', label: 'Müşteriler' },
  { to: 'assessment', icon: '📐', label: 'Değerlendirme' },
  { to: 'builder', icon: '🏋️', label: 'Program Builder' },
  { to: 'nutrition', icon: '🥗', label: 'Beslenme & TDEE' },
  { to: 'food-tracker', icon: '📸', label: 'Yemek Takibi' },
  { to: 'calendar', icon: '📅', label: 'Takvim' },
  { to: 'settings', icon: '⚙️', label: 'AI Ayarları' },
]

export default function AdminLayout() {
  const { darkMode, toggleDarkMode, isAdminAuth, logoutAdmin } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dm = darkMode

  if (!isAdminAuth) return <AdminLogin />

  return (
    <div className={`min-h-screen ${dm ? 'bg-[#0a0a0a]' : 'bg-[#F5F3EF]'}`}>
      {/* Admin Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b py-4 ${dm ? 'bg-[#0a0a0a]/90 border-white/5' : 'bg-white/80 border-black/[0.04]'}`}>
        <div className="max-w-[1500px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-transparent border-none cursor-pointer p-2"
              aria-label="Menü"
            >
              <div className="space-y-[4px]">
                <span className={`block w-5 h-[1.5px] rounded-full ${dm ? 'bg-white' : 'bg-[#1C1917]'}`} />
                <span className={`block w-5 h-[1.5px] rounded-full ${dm ? 'bg-white' : 'bg-[#1C1917]'}`} />
                <span className={`block w-5 h-[1.5px] rounded-full ${dm ? 'bg-white' : 'bg-[#1C1917]'}`} />
              </div>
            </button>
            <NavLink to="/" className={`font-display text-xl font-semibold no-underline ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Ela Ebeoğlu
              <span className="ml-2 text-[0.6rem] bg-terracotta text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-body">Admin</span>
            </NavLink>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={toggleDarkMode}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${dm ? 'bg-white/5 text-white' : 'bg-black/5 text-[#1C1917]'}`}
              aria-label="Tema">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {dm
                  ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  : <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>
                }
              </svg>
            </button>
            <button onClick={logoutAdmin}
              className={`rounded-full px-5 py-2 text-[0.78rem] border cursor-pointer bg-transparent transition-all duration-300 ${dm ? 'border-white/10 text-white/60 hover:text-white hover:border-white/30' : 'border-black/10 text-[#1C1917]/50 hover:text-[#1C1917] hover:border-black/25'}`}>
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="pt-[72px] max-w-[1500px] mx-auto px-6 flex gap-6 items-start">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`${sidebarOpen ? 'fixed inset-0 z-50 pt-20' : 'hidden'} md:block md:static md:z-auto w-[240px] flex-shrink-0 sticky top-[88px]`}
            >
              {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
              )}
              <div className={`relative z-10 rounded-2xl p-5 ${dm ? 'bg-[#111] border border-white/5' : 'bg-white border border-black/[0.04]'}`}>
                <div className="mb-5">
                  <p className={`text-[0.65rem] uppercase tracking-[0.15em] mb-1 ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>Yönetim Paneli</p>
                  <h3 className={`font-display text-lg ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Ela Ebeoğlu</h3>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {tabs.map(t => (
                    <NavLink key={t.to} to={t.to} onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl no-underline text-[0.82rem] transition-all duration-300 ${
                          isActive
                            ? `font-medium ${dm ? 'bg-terracotta/10 text-terracotta' : 'bg-terracotta/8 text-terracotta'}`
                            : `${dm ? 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]' : 'text-[#1C1917]/40 hover:text-[#1C1917]/70 hover:bg-black/[0.02]'}`
                        }`
                      }>
                      <span className="text-base">{t.icon}</span>
                      <span>{t.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className={`flex-1 min-h-[80vh] rounded-2xl p-8 my-4 w-full max-w-full overflow-hidden ${dm ? 'bg-[#111] border border-white/5' : 'bg-white border border-black/[0.04]'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}