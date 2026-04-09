import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'

const slideUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 40, filter: 'blur(10px)', transition: { duration: 0.3 } },
}

export default function ReloadPrompt() {
  const { darkMode: dm } = useStore()
  const [showReload, setShowReload] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowReload(true)
      })
    }
  }, [])

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {showReload && (
        <motion.div
          initial="hidden"
          animate="show"
          exit="exit"
          variants={slideUp}
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50 p-4 rounded-xl border backdrop-blur-sm ${
            dm
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-blue-50 border-blue-200 shadow-lg'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`flex-1 ${dm ? 'text-white' : 'text-blue-900'}`}>
              <p className="text-sm font-medium">App updated</p>
              <p className={`text-xs mt-0.5 ${dm ? 'text-white/70' : 'text-blue-700'}`}>
                A new version is available.
              </p>
            </div>
            <button
              onClick={handleReload}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                dm
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
              Reload
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}