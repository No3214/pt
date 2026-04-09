import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

const slideUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 40, filter: 'blur(10px)', transition: { duration: 0.3 } },
}

export default function CookieConsent() {
  const { darkMode: dm } = useStore()
  const [showConsent, setShowConsent] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem('cookieConsent')
    if (savedConsent) {
      setConsentGiven(true)
    } else {
      // Show consent banner after a delay
      const timer = setTimeout(() => setShowConsent(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setConsentGiven(true)
    setShowConsent(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false')
    setConsentGiven(true)
    setShowConsent(false)
  }

  if (consentGiven) return null

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial="hidden"
          animate="show"
          exit="exit"
          variants={slideUp}
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-sm z-50 p-5 rounded-2xl border backdrop-blur-sm ${
            dm
              ? 'bg-white/[0.08] border-white/[0.12] text-white'
              : 'bg-white border-black/[0.08] text-stone-900 shadow-lg'
          }`}>
          <h3 className="font-semibold text-sm mb-2">Cookie Consent</h3>
          <p className={`text-xs mb-4 leading-relaxed ${dm ? 'text-white/70' : 'text-stone-600'}`}>
            We use cookies to enhance your experience. By continuing, you consent to our use of cookies.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                dm
                  ? 'bg-white/[0.05] hover:bg-white/[0.1] text-white/70'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}>
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-all">
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}