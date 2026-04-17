import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'

/**
 * Magnetic CTA — Apple/Linear seviyesinde mikroetkileşim.
 * Mouse butona yaklaştıkça spring fizik ile hafifçe çekiyor.
 * Touch ve reduced-motion'da etkisiz.
 */
type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  strength?: number
  target?: string
  rel?: string
  ariaLabel?: string
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  strength = 0.35,
  target,
  rel,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    x.set(mx * strength)
    y.set(my * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Inner = href ? motion.a : motion.button
  const innerProps: Record<string, unknown> = {
    className,
    style: { x: sx, y: sy },
    onClick,
    'aria-label': ariaLabel,
    whileHover: reduce ? undefined : { scale: 1.04 },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { type: 'spring', stiffness: 320, damping: 22 },
  }
  if (href) {
    innerProps.href = href
    if (target) innerProps.target = target
    if (rel) innerProps.rel = rel
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block"
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Inner {...(innerProps as any)}>{children}</Inner>
    </div>
  )
}
