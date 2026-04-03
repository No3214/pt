import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './stores/useStore'
import Landing from './pages/Landing'
import AdminLayout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import Clients from './pages/admin/Clients'
import Assessment from './pages/admin/Assessment'
import Builder from './pages/admin/Builder'
import Nutrition from './pages/admin/Nutrition'
import FoodTracker from './pages/admin/FoodTracker'
import CalendarPage from './pages/admin/Calendar'
import Settings from './pages/admin/Settings'
import Portal from './pages/Portal'
import NotFound from './pages/NotFound'
import Toast from './components/Toast'
import Preloader from './components/Preloader'

export default function App() {
  const darkMode = useStore(s => s.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', darkMode ? '#050505' : '#FAF6F1')
  }, [darkMode])
  return (
    <>
      <Preloader />
      <Routes>
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
      <Toast />
    </>
  )
}
