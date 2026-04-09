import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function Toast() {
  const msg = useStore(s => s.toastMsg)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (msg) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(t)
    }
    return undefined
  }, [msg])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 bg-text-main text-white px-6 py-4 rounded-full shadow-2xl shadow-black/10 z-[2000] font-medium text-[0.875rem] flex items-center gap-3 border border-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
