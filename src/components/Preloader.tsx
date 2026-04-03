import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function Preloader() {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)
  const dm = useStore(s => s.darkMode)

  useEffect(() => {
    const start = performance.now()
    const duration = 1800
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(Math.round(eased * 100))
      if (p < 1) requestAnimationFrame(tick)
      else setTimeout(() => setShow(false), 300)
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${
            dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'
          }`}
        >          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10"
          >
            <h1 className={`font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] ${
              dm ? 'text-white' : 'text-[#1C1917]'
            }`}>
              Ela Ebeoğlu
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-center text-[0.7rem] uppercase tracking-[0.3em] mt-2 ${
                dm ? 'text-white/25' : 'text-[#1C1917]/25'
              }`}
            >
              Performance Coach
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 relative">
            <div className={`h-[2px] rounded-full overflow-hidden ${
              dm ? 'bg-white/5' : 'bg-black/5'
            }`}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-terracotta via-sage to-coast rounded-full"
              />
            </div>            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`absolute -bottom-6 right-0 text-[0.65rem] tabular-nums ${
                dm ? 'text-white/15' : 'text-[#1C1917]/15'
              }`}
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
