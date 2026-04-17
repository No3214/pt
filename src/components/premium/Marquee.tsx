import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  speed?: number
  reverse?: boolean
  className?: string
}

export default function Marquee({ children, speed = 40, reverse = false, className = '' }: Props) {
  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        <div className="flex gap-12 shrink-0">{children}</div>
        <div className="flex gap-12 shrink-0" aria-hidden>{children}</div>
      </motion.div>
    </div>
  )
}
