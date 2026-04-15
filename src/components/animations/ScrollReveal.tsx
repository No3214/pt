import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, fadeUpSm, fadeIn, scaleIn, stagger, viewportOnce } from '../../lib/motion'

type Preset = 'fadeUp' | 'fadeUpSm' | 'fadeIn' | 'scaleIn' | 'stagger'

interface Props {
  children: ReactNode
  preset?: Preset
  delay?: number
  className?: string
  as?: keyof HTMLElementTagNameMap
  /** Stagger only: space between children (seconds) */
  staggerGap?: number
  /** Override viewport margin */
  margin?: string
  /** Re-animate on every scroll into view */
  repeat?: boolean
}

const presets: Record<Preset, Variants> = {
  fadeUp,
  fadeUpSm,
  fadeIn,
  scaleIn,
  stagger: stagger(),
}

/**
 * Drop-in scroll-triggered reveal. Respects `prefers-reduced-motion`.
 *
 * @example
 * <ScrollReveal preset="fadeUp" delay={0.1}>
 *   <h2>Heading</h2>
 * </ScrollReveal>
 */
export default function ScrollReveal({
  children,
  preset = 'fadeUp',
  delay = 0,
  className,
  as = 'div',
  staggerGap,
  margin,
  repeat = false,
}: Props) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as as 'div'] as typeof motion.div

  // Short-circuit for reduced motion
  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>
  }

  const variants =
    preset === 'stagger' && staggerGap != null ? stagger(staggerGap) : presets[preset]

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={margin ? { once: !repeat, margin } : { ...viewportOnce, once: !repeat }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Individual item inside a <ScrollReveal preset="stagger">.
 * Inherits the parent's `show` variant via framer's variant propagation.
 */
export function RevealItem({
  children,
  className,
  preset = 'fadeUp',
}: {
  children: ReactNode
  className?: string
  preset?: Exclude<Preset, 'stagger'>
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div className={className} variants={presets[preset]}>
      {children}
    </motion.div>
  )
}
