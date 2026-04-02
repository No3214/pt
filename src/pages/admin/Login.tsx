import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'

export default function AdminLogin() {
  const { loginAdmin, darkMode } = useStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const dm = darkMode

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    if (loginAdmin(pin)) {
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
    setLoading(false)
  }
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${dm ? 'bg-[#0a0a0a]' : 'bg-[#FAF6F1]'}`}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className={`absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full ${dm ? 'bg-terracotta/[0.02]' : 'bg-terracotta/[0.03]'}`}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
          className={`absolute -bottom-[200px] -left-[200px] w-[400px] h-[400px] rounded-full ${dm ? 'bg-sage/[0.02]' : 'bg-sage/[0.03]'}`}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-md p-10 rounded-2xl backdrop-blur-sm ${dm ? 'bg-[#111]/90 border border-white/5' : 'bg-white/90 border border-black/[0.04]'}`}
      >
        {/* Logo Area */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >            {/* SVG Logo Mark */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 15, stiffness: 200 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${dm ? 'bg-terracotta/10' : 'bg-terracotta/5'}`}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#C2684A" strokeWidth="1.5" fill="none" />
                  <path d="M16 4V28" stroke="#C2684A" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                  <circle cx="16" cy="16" r="4" fill="#C2684A" opacity="0.15" />
                  <circle cx="16" cy="16" r="2" fill="#C2684A" />
                </svg>
              </motion.div>
            </div>
            <h1 className={`font-display text-3xl font-semibold mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Koç Paneli
            </h1>
            <p className={`text-[0.85rem] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>
              Ela Ebeoğlu Performance Coaching
            </p>
          </motion.div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >            <label className={`block mb-2 text-[0.78rem] font-medium tracking-wide ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>
              Şifre
            </label>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(false) }}
              placeholder="Şifrenizi giriniz"
              autoFocus
              className={`w-full p-4 rounded-xl border outline-none text-center text-lg tracking-wider transition-all duration-300 focus:border-terracotta focus:ring-2 focus:ring-terracotta/10 ${
                error ? 'border-red-400/50 bg-red-400/5 animate-shake' : ''
              } ${dm ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/20' : 'bg-black/[0.02] border-black/[0.06] placeholder:text-[#1C1917]/25'}`}
            />
            <AnimatePresenceError show={error} />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            type="submit"
            disabled={loading || !pin}
            className={`w-full py-4 rounded-full text-[0.92rem] font-medium border-none cursor-pointer transition-all duration-300 ${
              loading || !pin
                ? 'bg-terracotta/50 text-white/70 cursor-not-allowed'
                : 'bg-terracotta text-white hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Doğrulanıyor...
              </span>
            ) : 'Giriş Yap'}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-10 text-center border-t pt-6 ${dm ? 'border-white/5' : 'border-black/[0.04]'}`}
        >
          <NavLink to="/" className={`text-[0.82rem] tracking-wide no-underline transition-all duration-300 ${dm ? 'text-white/30 hover:text-white' : 'text-[#1C1917]/30 hover:text-[#1C1917]'}`}>
            &larr; Ana Siteye Dön
          </NavLink>
        </motion.div>

        {/* Security Note */}
        <p className={`mt-6 text-center text-[0.65rem] ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>
          256-bit şifreli bağlantı
        </p>
      </motion.div>
    </div>
  )
}

function AnimatePresenceError({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-red-400 text-[0.78rem] text-center mt-3"
    >
      Hatalı şifre. Lütfen tekrar deneyin.
    </motion.p>
  )
}