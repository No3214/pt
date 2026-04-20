// String Tune-inspired scroll-scrub hook.
// Bir elementin viewport-icinde-ki progress'ini 0..1 arasinda dondurur.
// IntersectionObserver + scroll listener, layout yok, GPU-only transform-friendly.

import { useEffect, useRef, useState, type RefObject } from 'react'

export interface ScrollScrubOptions {
  /** Hangi aralikta lineer 0..1 doner */
  start?: 'enter' | 'center' | 'exit'
  end?: 'enter' | 'center' | 'exit'
  /** prefers-reduced-motion ise hemen 1'e atar */
  respectReducedMotion?: boolean
}

/**
 * Element viewport'a girdiginde 0, ciktiginda 1 donduren normalized progress.
 * enter/center/exit offset'leri ile nerede baslasin/bitssin ayarlanabilir.
 */
export function useScrollScrub<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>,
  opts: ScrollScrubOptions = {},
): number {
  const { start = 'enter', end = 'exit', respectReducedMotion = true } = opts
  const [progress, setProgress] = useState(0)
  const frame = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setProgress(1)
      return
    }

    const offset = (mode: 'enter' | 'center' | 'exit', rect: DOMRect, vh: number) => {
      if (mode === 'enter') return rect.top
      if (mode === 'exit') return rect.bottom - vh
      return rect.top + rect.height / 2 - vh / 2
    }

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const startOff = offset(start, rect, vh)
      const endOff = offset(end, rect, vh)
      const span = endOff - startOff || 1
      const raw = (0 - startOff) / span
      const clamped = Math.max(0, Math.min(1, raw))
      setProgress((prev) => (Math.abs(prev - clamped) > 0.001 ? clamped : prev))
    }

    const onScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [ref, start, end, respectReducedMotion])

  return progress
}
