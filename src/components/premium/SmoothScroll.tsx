import { useEffect } from 'react'

/**
 * SmoothScroll — Lenis inertial scroll wrapper.
 *
 * Lenis is ~55KB raw / ~20KB gz. Loading it synchronously from the entry
 * chunk penalizes first paint for a purely-visual enhancement, so we
 * dynamic-import after mount. The page is fully scrollable during the
 * small window before Lenis attaches (native scroll).
 *
 * Respects prefers-reduced-motion by skipping setup entirely.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let rafId = 0
    let lenisRef: { destroy(): void } | null = null
    let disposed = false

    void import('lenis').then(({ default: Lenis }) => {
      if (disposed) return
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })
      lenisRef = lenis

      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      lenisRef?.destroy()
    }
  }, [])

  return <>{children}</>
}
