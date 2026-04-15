import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 400, damping: 28, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 400, damping: 28, mass: 0.4 })
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Sadece fine pointer (mouse) cihazlarda
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    setVisible(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [role="button"], input, textarea, select')) setHover(true)
      else setHover(false)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [x, y])

  if (!visible) return null

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: hover ? 2.2 : 1, opacity: hover ? 0.4 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-3 h-3 rounded-full bg-white mix-blend-difference"
        />
      </motion.div>
    </>
  )
}
