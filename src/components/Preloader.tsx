import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

/* Branded volleyball spinning SVG */
function VolleyballSpinner({ dm }: { dm: boolean }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      className="w-16 h-16 relative mb-8"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="none"
          stroke={dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="2" />
        <circle cx="50" cy="50" r="46" fill="none"
          stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="72 217" />
        <circle cx="50" cy="50" r="46" fill="none"
          stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="40 249" strokeDashoffset="-90" />
        <circle cx="50" cy="50" r="46" fill="none"
          stroke="var(--color-sand)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="30 259" strokeDashoffset="-180" />
        {/* Center dot */}
        <circle cx="50" cy="50" r="4" fill="var(--color-primary)" opacity="0.6" />
      </svg>
    </motion.div>
  )
}

export default function Preloader() {
  // Only show on first visit per session — skip on route changes
  const alreadyShown = sessionStorage.getItem('ela-preloader-shown') === '1'
  const [show, setShow] = useState(!alreadyShown)
  const [progress, setProgress] = useState(alreadyShown ? 100 : 0)
  const [phase, setPhase] = useState<'loading' | 'complete'>(alreadyShown ? 'complete' : 'loading')
  const dm = useStore(s => s.darkMode)

  useEffect(() => {
    if (alreadyShown) return
    const start = performance.now()
    const duration = 1800
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(Math.round(eased * 100))
      if (p < 1) requestAnimationFrame(tick)
      else {
        setPhase('complete')
        sessionStorage.setItem('ela-preloader-shown', '1')
        setTimeout(() => setShow(false), 400)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
            'bg-bg'
          }`}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle, ${dm ? '#fff' : '#000'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Volleyball spinner */}
          <VolleyballSpinner dm={dm} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center"
          >
            <h1 className={`font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] ${
              dm ? 'text-white' : 'text-text-main'
            }`}>
              Ela Ebeoğlu
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-[0.7rem] uppercase tracking-[0.3em] mt-2 ${
                dm ? 'text-white/25' : 'text-text-main/25'
              }`}
            >
              Performance Coach
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 mt-10 relative">
            <div className={`h-[2px] rounded-full overflow-hidden ${
              dm ? 'bg-white/5' : 'bg-text-main/5'
            }`}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                style={{ transition: 'width 0.1s linear' }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-[0.6rem] tracking-[0.1em] uppercase ${
                  dm ? 'text-white/10' : 'text-text-main/10'
                }`}
              >
                {phase === 'complete' ? t.common.ready : t.common.loading}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`text-[0.65rem] tabular-nums ${
                  dm ? 'text-white/15' : 'text-text-main/15'
                }`}
              >
                {progress}%
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
