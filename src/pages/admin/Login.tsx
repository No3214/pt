import { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { tenantConfig } from '../../config/tenant'

/* ═══════ Floating orb component ═══════ */
function FloatingOrb({ delay, size, x, y, color, dm }: {
  delay: number; size: number; x: string; y: string; color: string; dm: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0, dm ? 0.06 : 0.08, dm ? 0.03 : 0.05, dm ? 0.06 : 0.08],
        scale: [0.6, 1, 0.85, 1],
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: color,
      }}
    />
  )
}

/* ═══════ Animated grid lines ═══════ */
function GridBackground({ dm }: { dm: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke={dm ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

/* ═══════ PIN dot indicator ═══════ */
function PinDots({ length, max, error, dm }: {
  length: number; max: number; error: boolean; dm: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      {Array.from({ length: max }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i < length ? 1.15 : 1,
            backgroundColor: error
              ? '#ef4444'
              : i < length
                ? '#C2684A'
                : dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="w-2.5 h-2.5 rounded-full"
        />
      ))}
    </div>
  )
}

/* ═══════ Main Login Component ═══════ */
export default function AdminLogin() {
  const { loginAdmin, darkMode, showToast } = useStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const dm = darkMode

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin || loading) return
    
    const rateData = JSON.parse(localStorage.getItem('auth_rate_limit') || '{"attempts": 0, "lockUntil": null}')
    // Bypass lock check for testing
    // if (rateData.lockUntil && Date.now() < rateData.lockUntil) {
    //   showToast("Çok fazla deneme! Lütfen 15 dakika bekleyin.")
    //   setPin('')
    //   setError(true)
    //   return
    // }
    
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // Fake latency

    const isValid = await loginAdmin(pin)
    
    if (isValid) {
      localStorage.setItem('auth_rate_limit', JSON.stringify({ attempts: 0, lockUntil: null }))
      setSuccess(true)
      setError(false)
    } else {
      const newData = { ...rateData, attempts: (rateData.attempts || 0) + 1 }
      if (newData.attempts >= 5) {
        newData.lockUntil = Date.now() // Disable 15 mins lock for now
        showToast("Hatalı giriş sayısı aşıldı ancak test için kilit devre dışı bırakıldı.")
      }
      localStorage.setItem('auth_rate_limit', JSON.stringify(newData))
      
      setError(true)
      setShake(true)
      setTimeout(() => { setShake(false); setPin(''); setError(false) }, 800)
    }
    setLoading(false)
  }

  /* ═══ Time display ═══ */
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = time.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden ${
      dm ? 'bg-[#050505]' : 'bg-[#F7F5F2]'
    }`}>
      {/* ═══ Background Layer ═══ */}
      <GridBackground dm={dm} />
      <FloatingOrb delay={0} size={500} x="-10%" y="-20%" color="#C2684A" dm={dm} />
      <FloatingOrb delay={3} size={400} x="70%" y="60%" color="#7A9E82" dm={dm} />
      <FloatingOrb delay={6} size={300} x="50%" y="-10%" color="#5e8fa8" dm={dm} />

      {/* ═══ Noise texture overlay ═══ */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══ Success overlay ═══ */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{ background: dm ? '#050505' : '#F7F5F2' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/15 flex items-center justify-center"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7A9E82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`font-display text-2xl font-semibold ${dm ? 'text-white' : 'text-[#1C1917]'}`}
              >
                Hoş Geldiniz
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Main Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-[420px] overflow-hidden ${
          dm
            ? 'bg-white/[0.03] border border-white/[0.06]'
            : 'bg-white/70 border border-black/[0.04]'
        } backdrop-blur-2xl rounded-3xl shadow-2xl`}
      >
        {/* Top accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />

        <div className="px-8 md:px-10 pt-10 pb-8">
          {/* ═══ Time + Date ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <p className={`text-[2.5rem] font-light tracking-tight leading-none mb-1 ${
              dm ? 'text-white/80' : 'text-[#1C1917]/70'
            }`}>
              {timeStr}
            </p>
            <p className={`text-[0.78rem] tracking-wide capitalize ${
              dm ? 'text-white/25' : 'text-[#1C1917]/25'
            }`}>
              {dateStr}
            </p>
          </motion.div>

          {/* ═══ Logo + Title ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-5">
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', damping: 15 }}
                className={`w-[72px] h-[72px] rounded-[22px] flex items-center justify-center relative ${
                  dm ? 'bg-gradient-to-br from-primary/15 to-primary/5' : 'bg-gradient-to-br from-primary/10 to-primary/[0.02]'
                }`}
              >
                <div className={`absolute inset-0 rounded-[22px] ${
                  dm ? 'ring-1 ring-inset ring-white/[0.06]' : 'ring-1 ring-inset ring-black/[0.04]'
                }`} />
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="#C2684A" strokeWidth="1.5" fill="none" />
                  <path d="M4 10L16 16L28 10" stroke="#C2684A" strokeWidth="0.8" opacity="0.3" />
                  <path d="M16 16V28" stroke="#C2684A" strokeWidth="0.8" opacity="0.3" />
                  <circle cx="16" cy="16" r="3" fill="#C2684A" opacity="0.2" />
                  <circle cx="16" cy="16" r="1.5" fill="#C2684A" />
                </svg>
              </motion.div>
            </div>

            <h1 className={`font-display text-[1.75rem] md:text-[2rem] font-semibold tracking-[-0.02em] mb-1.5 ${
              dm ? 'text-white' : 'text-[#1C1917]'
            }`}>
              Koç Paneli
            </h1>
            <p className={`text-[0.8rem] tracking-wide ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>
              {tenantConfig.brand.name}
            </p>
          </motion.div>

          {/* ═══ Form ═══ */}
          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}
            >
              <label className={`block mb-2.5 text-[0.72rem] font-medium uppercase tracking-[0.12em] ${
                dm ? 'text-white/35' : 'text-[#1C1917]/35'
              }`}>
                Şifre
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="password"
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError(false) }}
                  placeholder="••••••••"
                  className={`w-full px-5 py-4 rounded-2xl border outline-none text-center text-[1.1rem] tracking-[0.3em] transition-all duration-300 ${
                    error
                      ? 'border-red-400/40 bg-red-400/[0.03]'
                      : dm
                        ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:bg-white/[0.05]'
                        : 'bg-black/[0.02] border-black/[0.06] focus:border-primary/40 focus:bg-white/60'
                  } ${dm ? 'text-white placeholder:text-white/15' : 'text-[#1C1917] placeholder:text-[#1C1917]/20'}`}
                />
                {pin && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary/60" />
                  </motion.div>
                )}
              </div>
              <PinDots length={Math.min(pin.length, 8)} max={8} error={error} dm={dm} />
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="text-red-400/80 text-[0.78rem] text-center"
                >
                  Hatalı şifre. Lütfen tekrar deneyin.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              type="submit"
              disabled={loading || !pin}
              className={`w-full py-4 rounded-2xl text-[0.88rem] font-medium border-none cursor-pointer transition-all duration-500 relative overflow-hidden ${
                loading || !pin
                  ? dm
                    ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                    : 'bg-black/[0.04] text-[#1C1917]/20 cursor-not-allowed'
                  : 'bg-primary text-white hover:shadow-[0_20px_40px_rgba(194,104,74,0.3)]'
              }`}
            >
              {/* Button shine effect */}
              {!loading && pin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span className="text-white/70">Doğrulanıyor...</span>
                  </>
                ) : 'Giriş Yap'}
              </span>
            </motion.button>
          </form>

          {/* ═══ Divider + Back link ═══ */}
          <div className={`mt-8 pt-6 border-t ${dm ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
            <div className="flex items-center justify-between">
              <NavLink
                to="/"
                className={`text-[0.78rem] tracking-wide no-underline transition-all duration-300 flex items-center gap-2 py-2 ${
                  dm ? 'text-white/25 hover:text-white/60' : 'text-[#1C1917]/25 hover:text-[#1C1917]/60'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Ana Siteye Dön
              </NavLink>
              <span className={`text-[0.65rem] flex items-center gap-1.5 ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Şifreli
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
        />
      </motion.div>
    </div>
  )
}
