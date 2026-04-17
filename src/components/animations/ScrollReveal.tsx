import { motion, useReducedMotion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

type Preset = 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft' | 'slideRight'
type Props = {
  children: ReactNode
  preset?: Preset
  delay?: number
  className?: string
}

const VARIANTS: Record<Preset, Variants> = {
  fadeUp:     { hidden: { opacity: 0, y: 24 },  visible: { opacity: 1, y: 0 } },
  fadeIn:     { hidden: { opacity: 0 },          visible: { opacity: 1 } },
  scaleIn:    { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  slideLeft:  { hidden: { opacity: 0, x: 32 },   visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: -32 },  visible: { opacity: 1, x: 0 } },
}

export default function ScrollReveal({ children, preset = 'fadeUp', delay = 0, className }: Props) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <div className={className}>{children}</div>
  const variants = VARIANTS[preset] || VARIANTS.fadeUp
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
