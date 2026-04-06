import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { useEffect, useState } from 'react'

function VolleyballBounce({ dm }: { dm: boolean }) {
  return (
    <div className="relative w-32 h-40 mx-auto mb-6">
      {/* Shadow */}
      <motion.div
        animate={{ scaleX: [0.6, 1, 0.6], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full ${
          dm ? 'bg-white/20' : 'bg-black/15'
        }`}
      />
      {/* Ball */}
      <motion.div
        animate={{ y: [0, -50, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#C2684A" strokeWidth="3" />
            <circle cx="32" cy="32" r="24" stroke="#7A9E82" strokeWidth="1.5" opacity="0.6" />
            <path d="M2 32h60" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.5" />
            <path d="M32 2v60" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.5" />
            <path d="M8 12c12 8 24 8 48 0" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.4" />
            <path d="M8 52c12-8 24-8 48 0" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

function FloatingParticle({ delay, x, dm }: { delay: number; x: number; dm: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0.3, 0], y: [-20, -60, -100] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeOut' }}
      className={`absolute w-1.5 h-1.5 rounded-full ${dm ? 'bg-primary/40' : 'bg-primary/25'}`}
      style={{ left: `${x}%`, bottom: '30%' }}
    />
  )
}

export default function NotFound() {
  const dm = useStore(s => s.darkMode)
  const [count, setCount] = useState(5)

  useEffect(() => {
    const t = setInterval(() => setCount(c => { if (c <= 1) { window.location.href = '/'; return 0 } return c - 1 }), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center font-body px-6 relative overflow-hidden ${
      dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'
    }`}>
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: dm
          ? 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Floating particles */}
      <FloatingParticle delay={0} x={30} dm={dm} />
      <FloatingParticle delay={0.8} x={50} dm={dm} />
      <FloatingParticle delay={1.6} x={70} dm={dm} />
      <FloatingParticle delay={0.4} x={40} dm={dm} />
      <FloatingParticle delay={1.2} x={60} dm={dm} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md relative z-10"
      >
        {/* Bouncing volleyball */}
        <VolleyballBounce dm={dm} />

        {/* 404 big text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <span className={`text-[8rem] font-display font-bold leading-none tracking-tight ${
            dm ? 'text-white/[0.03]' : 'text-[#1C1917]/[0.03]'
          }`}>404</span>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl font-bold text-primary"
          >
            404
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`font-display text-2xl font-semibold mt-2 mb-3 ${
            dm ? 'text-white' : 'text-[#1C1917]'
          }`}
        >
          Sayfa bulunamadı
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`text-[0.9rem] leading-relaxed mb-8 ${
            dm ? 'text-white/35' : 'text-[#1C1917]/40'
          }`}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </motion.p>

        {/* Countdown + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4"
        >
          <Link to="/"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary text-white rounded-full text-[0.88rem] font-medium no-underline transition-all duration-300 hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)] hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <span className={`text-[0.75rem] ${dm ? 'text-white/20' : 'text-[#1C1917]/25'}`}>
            {count} saniye sonra yönlendirileceksiniz
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
