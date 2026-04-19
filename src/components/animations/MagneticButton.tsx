import { motion, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent, type ComponentType } from 'react'

type AnchorMotionProps = HTMLMotionProps<'a'>
type ButtonMotionProps = HTMLMotionProps<'button'>

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

  const common = {
    className,
    style: { x: sx, y: sy },
    onClick,
    'aria-label': ariaLabel,
    whileHover: reduce ? undefined : { scale: 1.04 },
    whileTap: reduce ? undefined : { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 320, damping: 22 },
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="inline-block"
    >
      {href ? (
        (() => {
          const A = motion.a as ComponentType<AnchorMotionProps>
          return (
            <A {...common} href={href} target={target} rel={rel}>
              {children}
            </A>
          )
        })()
      ) : (
        (() => {
          const B = motion.button as ComponentType<ButtonMotionProps>
          return <B {...common}>{children}</B>
        })()
      )}
    </div>
  )
}
