/**
 * Shared Framer Motion variants & easings
 * Single source of truth for animations — import from here, don't duplicate.
 */
import type { Variants } from 'framer-motion'

// ─── Easings ──────────────────────────────────────────────
export const easeApple = [0.22, 1, 0.36, 1] as const
export const easeOutExpo = [0.16, 1, 0.3, 1] as const

// ─── Durations ────────────────────────────────────────────
export const duration = {
  micro: 0.15,
  ui: 0.25,
  transition: 0.4,
  entrance: 0.6,
  slow: 0.8,
} as const

// ─── Fade Up ──────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.entrance, ease: easeOutExpo },
  },
}

// ─── Fade Up (small) ──────────────────────────────────────
export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.transition, ease: easeOutExpo },
  },
}

// ─── Fade In ──────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.entrance, ease: easeApple } },
}

// ─── Scale In ─────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.entrance, ease: easeOutExpo },
  },
}

// ─── Stagger container ────────────────────────────────────
export const stagger = (staggerChildren = 0.08, delayChildren = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// ─── Slide (form steps, drawers) ──────────────────────────
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: duration.transition, ease: easeApple } },
  exit: { opacity: 0, x: -30, transition: { duration: duration.ui, ease: easeApple } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: duration.transition, ease: easeApple } },
  exit: { opacity: 0, y: 20, transition: { duration: duration.ui, ease: easeApple } },
}

// ─── Hover lift (cards) ───────────────────────────────────
export const hoverLift = {
  whileHover: { y: -4, scale: 1.01 },
  whileTap: { scale: 0.99 },
  transition: { duration: duration.ui, ease: easeApple },
}

// ─── Error shake ──────────────────────────────────────────
export const shake = {
  animate: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.45 },
  },
}

// ─── Success pop (checkmark) ──────────────────────────────
export const successPop: Variants = {
  hidden: { scale: 0, rotate: -90, opacity: 0 },
  show: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 14, stiffness: 280, delay: 0.1 },
  },
}

// ─── Viewport defaults for whileInView ────────────────────
export const viewportOnce = { once: true, margin: '-80px' } as const
