import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function RevealMask({ children, direction = 'up', delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const initial = {
    up:    { clipPath: 'inset(100% 0 0 0)' },
    down:  { clipPath: 'inset(0 0 100% 0)' },
    left:  { clipPath: 'inset(0 100% 0 0)' },
    right: { clipPath: 'inset(0 0 0 100%)' },
  }[direction]

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={initial}
        animate={inView ? { clipPath: 'inset(0 0 0 0)' } : initial}
        transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}
