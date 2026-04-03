import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function CookieConsent() {
  const [show, setShow] = useState(false)
  const dm = useStore(s => s.darkMode)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('ela-cookie-ok')) setShow(true)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const accept = () => {
    localStorage.setItem('ela-cookie-ok', '1')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-[420px] z-[300] p-6 rounded-2xl border backdrop-blur-2xl shadow-float ${
            dm
              ? 'bg-[#111]/95 border-white/[0.06] text-white'
              : 'bg-white/95 border-black/[0.06] text-[#1C1917]'
          }`}
        >          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mt-0.5">
              <svg className="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-display text-[1rem] font-semibold mb-1.5">Gizlilik & Çerezler</h4>
              <p className={`text-[0.8rem] leading-[1.7] mb-4 ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>
                Bu site deneyiminizi iyileştirmek için çerez kullanmaktadır. KVKK kapsamında verileriniz korunmaktadır.
              </p>
              <div className="flex gap-3">
                <button onClick={accept}
                  className="px-5 py-2.5 bg-terracotta text-white rounded-full text-[0.78rem] font-medium border-none cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_rgba(194,104,74,0.25)]">
                  Kabul Et
                </button>
                <button onClick={accept}
                  className={`px-5 py-2.5 rounded-full text-[0.78rem] font-medium border cursor-pointer bg-transparent transition-all duration-300 ${
                    dm ? 'border-white/10 text-white/50 hover:text-white/70' : 'border-black/10 text-[#1C1917]/40 hover:text-[#1C1917]/60'
                  }`}>
                  Sadece Gerekli
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
