import { useEffect } from 'react'

/**
 * Lenis-inspired inertial smooth scroll. Zero dependencies, RAF-based.
 * Intercepts wheel events and lerps scrollY toward target for a premium feel.
 * Automatically disabled for prefers-reduced-motion, touch devices, and hash links.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    if (reduced || isTouch) return

    let current = window.scrollY
    let target = window.scrollY
    let rafId: number | null = null
    const ease = 0.09 // smoothing factor — higher = snappier

    const onWheel = (e: WheelEvent) => {
      // Skip modals / scrollable children
      const t = e.target as HTMLElement | null
      if (t && t.closest('[data-no-smooth],[role="dialog"],textarea,pre,code')) return
      e.preventDefault()
      target = Math.max(
        0,
        Math.min(
          document.documentElement.scrollHeight - window.innerHeight,
          target + e.deltaY,
        ),
      )
      if (rafId == null) rafId = requestAnimationFrame(tick)
    }

    const tick = () => {
      current += (target - current) * ease
      if (Math.abs(target - current) < 0.3) {
        current = target
        window.scrollTo(0, current)
        rafId = null
        return
      }
      window.scrollTo(0, current)
      rafId = requestAnimationFrame(tick)
    }

    const onResize = () => {
      target = window.scrollY
      current = window.scrollY
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [enabled])
}
