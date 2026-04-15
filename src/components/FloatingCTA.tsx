import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/**
 * Mobile-first sticky bottom CTA bar.
 *
 * Appears after the user scrolls past the hero (≥ 60% viewport height)
 * and hides when the footer / contact section enters the viewport.
 * Hidden on desktop (≥ md breakpoint).
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const threshold = () => window.innerHeight * 0.6

    const onScroll = () => {
      const y = window.scrollY
      const bottomReached =
        window.innerHeight + y >= document.documentElement.scrollHeight - 400
      setVisible(y > threshold() && !bottomReached)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const scrollToBooking = () => {
    const el = document.getElementById('booking')
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="md:hidden fixed bottom-4 left-4 right-4 z-[900]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center gap-3 p-2 pl-5 rounded-full bg-card/90 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-float">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-text-main/50 font-semibold leading-tight">
                Ücretsiz Ön Görüşme
              </p>
              <p className="text-sm font-display font-semibold truncate">
                Dönüşümün ilk adımı
              </p>
            </div>

            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp ile iletişim"
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#25D366] text-white shrink-0 active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607z" />
              </svg>
            </a>

            <button
              onClick={scrollToBooking}
              className="h-11 px-5 rounded-full bg-primary text-white font-semibold text-sm shrink-0 active:scale-95 transition-transform shadow-lg shadow-primary/25"
            >
              Randevu Al
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
