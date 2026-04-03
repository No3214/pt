import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const dm = useStore(s => s.darkMode)

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', toggle, { passive: true })
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Yukarı çık"
          className={`fixed bottom-8 left-8 z-[98] w-11 h-11 rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-300 backdrop-blur-xl shadow-float ${
            dm
              ? 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
              : 'bg-white/80 text-[#1C1917]/40 hover:bg-white hover:text-[#1C1917]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
