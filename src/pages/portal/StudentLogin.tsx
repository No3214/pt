import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

const fadeIn = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const slideUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function StudentLogin() {
  const { darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      // Simulate login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast('Login successful!')
      // Handle successful login
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      showToast('Please enter your email')
      return
    }
    setIsLoading(true)
    try {
      // Simulate reset - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast('Reset link sent to your email')
      setShowResetForm(false)
      setResetEmail('')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Password reset failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeIn}
      className={`min-h-screen flex items-center justify-center p-6 ${dm ? 'bg-stone-950 text-white' : 'bg-stone-50 text-stone-900'}`}
    >
      <motion.div
        variants={slideUp}
        className={`w-full max-w-md p-8 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-sm'}`}
      >
        <h1 className="font-display text-2xl font-semibold tracking-tight mb-2">Öğrenci Girişi</h1>
        <p className={`text-sm mb-6 ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hesabına giriş yap</p>

        {!showResetForm ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta"
              className={`w-full p-3.5 rounded-xl border outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className={`w-full p-3.5 rounded-xl border outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${dm ? 'text-white/50' : 'text-stone-500'}`}
              >
                {showPassword ? 'Gizle' : 'Göster'}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className={dm ? 'text-white/60' : 'text-stone-600'}>Beni Hatırla</span>
              </label>
              <button type="button" onClick={() => setShowResetForm(true)} className="text-primary hover:underline">
                Şifremi Unuttum
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-full font-medium text-white transition-all ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 cursor-pointer'}`}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="E-posta adresin"
              className={`w-full p-3.5 rounded-xl border outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-full font-medium text-white transition-all ${isLoading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 cursor-pointer'}`}
            >
              {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
            </button>
            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className={`w-full py-2 text-sm ${dm ? 'text-white/60' : 'text-stone-600'}`}
            >
              Girişe Dön
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}