import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Premium cursor-follow dot + ring with magnetic hover on interactive elements.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export default function CursorFollow() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hoverTarget, setHoverTarget] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const dotX = useSpring(mx, { stiffness: 900, damping: 40, mass: 0.3 })
  const dotY = useSpring(my, { stiffness: 900, damping: 40, mass: 0.3 })
  const ringX = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 })
  const ringY = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 })

  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (reduce) return
    const hasHover = window.matchMedia('(hover: hover)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!hasHover || !finePointer) return
    setEnabled(true)

    const move = (e: MouseEvent) => {
      if (raf.current != null) return
      raf.current = requestAnimationFrame(() => {
        mx.set(e.clientX)
        my.set(e.clientY)
        raf.current = null
      })
    }
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      setHoverTarget(
        !!el?.closest('a,button,[role="button"],input,textarea,select,[data-cursor-hover]'),
      )
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      if (raf.current != null) cancelAnimationFrame(raf.current)
    }
  }, [reduce, mx, my])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-primary mix-blend-difference"
        animate={{ scale: hoverTarget ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      <motion.div
        aria-hidden
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-primary/60 mix-blend-difference"
        animate={{
          width: hoverTarget ? 48 : 32,
          height: hoverTarget ? 48 : 32,
          opacity: hoverTarget ? 1 : 0.7,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      />
    </>
  )
}
