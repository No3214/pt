import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from './stores/useStore'
import Landing from './pages/Landing'
import Toast from './components/Toast'
import Preloader from './components/Preloader'
import CookieConsent from './components/CookieConsent'
import ScrollToTop from './components/ScrollToTop'
import NotFound from './pages/NotFound'
import WhatsAppWidget from './components/WhatsAppWidget'
import ScrollProgress from './components/ScrollProgress'
import { tenantConfig } from './config/tenant'

// Lazy-loaded pages (reduces initial bundle by ~60%)
const AdminLayout = lazy(() => import('./pages/admin/Layout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Clients = lazy(() => import('./pages/admin/Clients'))
const Assessment = lazy(() => import('./pages/admin/Assessment'))
const Builder = lazy(() => import('./pages/admin/Builder'))
const Nutrition = lazy(() => import('./pages/admin/Nutrition'))
const FoodTracker = lazy(() => import('./pages/admin/FoodTracker'))
const CalendarPage = lazy(() => import('./pages/admin/Calendar'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const Portal = lazy(() => import('./pages/Portal'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <p className="text-text-main/30 text-sm font-medium">Yükleniyor...</p>
      </div>
    </div>
  )
}

export default function App() {
  const darkMode = useStore(s => s.darkMode)
  const location = useLocation()

  useEffect(() => {
    // Dynamic Theme Injection (God Tier SaaS Architecture)
    const root = document.documentElement
    const themeColors = tenantConfig.theme.colors
    
    // Inject brand colors
    root.style.setProperty('--color-primary', themeColors.primary)
    root.style.setProperty('--color-secondary', themeColors.secondary)
    root.style.setProperty('--color-accent', themeColors.accent)
    root.style.setProperty('--color-sand', themeColors.sand || '#D4C4AB')
    
    // Derived colors for premium aesthetics
    root.style.setProperty('--color-glow', `${themeColors.primary}26`) // 15% opacity primary glow
    root.style.setProperty('--shadow-color', darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)')
    
    root.classList.toggle('dark', darkMode)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', darkMode ? '#050505' : '#FAF6F1')
  }, [darkMode])

  return (
    <>
      <Preloader />
      <ScrollProgress />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="builder" element={<Builder />} />
              <Route path="nutrition" element={<Nutrition />} />
              <Route path="food-tracker" element={<FoodTracker />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/portal" element={<Portal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Toast />
      <WhatsAppWidget />
      <CookieConsent />
    </>
  )
}

