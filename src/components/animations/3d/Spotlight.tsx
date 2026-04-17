/**
 * Spotlight — Aceternity UI spotlight efekti (pure SVG/CSS, no WebGL)
 *
 * Hero sectioni uzerinde cinematic isik spotu yaratir.
 * Light-weight, mobile friendly.
 */

import { motion } from 'framer-motion'

type Props = {
  className?: string
  /** Spot rengi */
  color?: string
  /** 0-1 opaklik */
  opacity?: number
  /** Loop animation on|off */
  animate?: boolean
}

export default function Spotlight({
  className = '',
  color = '#D4A574',
  opacity = 0.28,
  animate = true,
}: Props) {
  return (
    <motion.svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      aria-hidden
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity } : { opacity }}
      transition={{ duration: 1.6, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="spot-a" cx="30%" cy="20%" r="60%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spot-b" cx="80%" cy="80%" r="55%">
          <stop offset="0%" stopColor="#8B7355" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8B7355" stopOpacity="0" />
        </radialGradient>
        <filter id="spot-blur">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>
      <motion.ellipse
        cx="360"
        cy="180"
        rx="520"
        ry="280"
        fill="url(#spot-a)"
        filter="url(#spot-blur)"
        animate={animate ? { cx: [360, 380, 340, 360], cy: [180, 200, 170, 180] } : undefined}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="900"
        cy="620"
        rx="420"
        ry="240"
        fill="url(#spot-b)"
        filter="url(#spot-blur)"
        animate={animate ? { cx: [900, 880, 920, 900], cy: [620, 600, 640, 620] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
