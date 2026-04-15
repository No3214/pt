import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

type Props = { children: ReactNode; delay?: number; className?: string }

export default function ScrollReveal({ children, delay = 0, className }: Props) {
  const prefersReduced = useReducedMotion()
  if (prefersReduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
