import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Animasyonlu gradient metin — premium hero başlık efekti.
 * Reduced-motion'da statik gradient gösterir.
 */
type Props = {
  children: ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  duration?: number
}

export default function GradientText({
  children,
  className = '',
  from = '#FF6B35',
  via = '#F7B801',
  to = '#FF6B35',
  duration = 6,
}: Props) {
  const reduce = useReducedMotion()
  const gradient = `linear-gradient(110deg, ${from}, ${via}, ${to})`

  if (reduce) {
    return (
      <span
        className={className}
        style={{
          backgroundImage: gradient,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </span>
    )
  }

  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: gradient,
        backgroundSize: '200% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}
