import { NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../../stores/useStore'
import AdminLogin from './Login'

const tabs = [
  { to: 'dashboard', icon: '📊', label: 'Dashboard' },
  { to: 'clients', icon: '👤', label: 'Müşteriler' },
  { to: 'assessment', icon: '📐', label: 'Değerlendirme & FMS' },
  { to: 'builder', icon: '🏋️', label: 'Program Builder' },
  { to: 'nutrition', icon: '🥗', label: 'Beslenme & TDEE' },
  { to: 'food-tracker', icon: '📸', label: 'Yemek Takibi' },
  { to: 'calendar', icon: '📅', label: 'Takvim' },
  { to: 'settings', icon: '⚙️', label: 'Sistem & AI Ayarları' },
]

export default function AdminLayout() {
  const { darkMode, toggleDarkMode, isAdminAuth, logoutAdmin } = useStore()

  if (!isAdminAuth) {
    return <AdminLogin />
  }

  return (
    <div className={`min-h-screen pt-24 ${darkMode ? 'bg-[#0f0f23]' : 'bg-[#F3F4F6]'}`}>
      {/* Admin Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-[10px] border-b py-4 ${darkMode ? 'bg-[#1a1a2e]/95 border-white/5' : 'bg-[#FAF6F1]/90 border-black/5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          <NavLink to="/" className="font-display text-2xl font-bold no-underline text-inherit">
            Ela Ebeoğlu <span className="text-[0.6rem] bg-terracotta text-white px-2 py-0.5 rounded ml-2 uppercase tracking-wider">ADMIN</span>
          </NavLink>
          <div className="flex gap-3 items-center">
            <button onClick={toggleDarkMode} className="bg-transparent border-none cursor-pointer text-xl p-1" aria-label="Tema">
              {darkMode ? '🌙' : '☀️'}
            </button>
            <button onClick={logoutAdmin} className={`rounded-full px-4 py-2 text-sm border cursor-pointer bg-transparent transition-colors hover:bg-terracotta hover:text-white hover:border-terracotta ${darkMode ? 'border-white/15 text-white' : 'border-black/10 text-[#1C1917]'}`}>
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Sidebar */}
        <aside className={`rounded-md p-6 shadow-sm sticky top-28 ${darkMode ? 'bg-card-dark' : 'bg-white'}`}>
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.1em] text-[#57534E] mb-1">Sistem Yönetimi</p>
            <h3 className="font-display text-lg">Ela Ebeoğlu</h3>
          </div>
          <nav className="flex flex-col gap-1">
            {tabs.map(t => (
              <NavLink key={t.to} to={t.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-sm no-underline text-sm transition-all ${isActive
                    ? 'bg-terracotta/10 text-terracotta font-medium'
                    : `${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-[#1C1917] hover:bg-black/[0.02]'}`}`
                }>
                <span>{t.icon}</span> {t.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className={`rounded-md p-8 shadow-sm min-h-[70vh] w-full max-w-full overflow-hidden ${darkMode ? 'bg-card-dark' : 'bg-white'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
