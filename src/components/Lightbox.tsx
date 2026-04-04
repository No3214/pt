import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

interface LightboxProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
  const [dragDir, setDragDir] = useState<'x' | 'y' | null>(null)
  const y = useMotionValue(0)
  const bgOpacity = useTransform(y, [-200, 0, 200], [0.3, 0.9, 0.3])
  const imgScale = useTransform(y, [-200, 0, 200], [0.85, 1, 0.85])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onNext()
    if (e.key === 'ArrowLeft') onPrev()
  }, [onClose, onNext, onPrev])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const { offset, velocity } = info
    if (dragDir === 'y' && (Math.abs(offset.y) > 100 || Math.abs(velocity.y) > 500)) {
      onClose()
    } else if (dragDir === 'x') {
      if (offset.x < -80 || velocity.x < -500) onNext()
      else if (offset.x > 80 || velocity.x > 500) onPrev()
    }
    setDragDir(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: useTransform(bgOpacity, v => `rgba(0,0,0,${v})`) }} />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-4 md:left-8 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Önceki"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-4 md:right-8 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center cursor-pointer text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
                aria-label="Sonraki"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Image with drag gestures */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ y, scale: imgScale }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragStart={(_, info) => {
              setDragDir(Math.abs(info.delta.x) > Math.abs(info.delta.y) ? 'x' : 'y')
            }}
            onDragEnd={handleDragEnd}
            className="relative z-[1] max-w-[90vw] max-h-[85vh] cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl select-none pointer-events-none"
              draggable={false}
            />
          </motion.div>

          {/* Counter + dots */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md"
          >
            {images.length <= 7 && images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-white scale-125' : 'bg-white/30'
              }`} />
            ))}
            <span className="text-white/60 text-[0.75rem] font-medium tabular-nums">
              {currentIndex + 1} / {images.length}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
