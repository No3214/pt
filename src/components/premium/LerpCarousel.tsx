// Smooothy-inspired minimal drag carousel.
// Framework-agnostic lerp fiziginin React versiyonu:
//   - Drag: pointerdown/move/up -> target += delta
//   - Release: momentum (velocity) lerp damping ile sifirlanir
//   - Snap: en yakin slide'a settle
//   - Wheel: horizontal scroll katkisi
// Reduced-motion: drag kapali, snap instant, keyboard navigation.
//
// A11y: role="region" aria-roledescription="carousel", tabindex=0, ok tuslari.

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
  type KeyboardEvent,
  type WheelEvent,
} from 'react'

export interface LerpCarouselProps {
  slides: ReactNode[]
  /** px, slide genisligi. Sabit genislik varsayilir (mobile icin responsive wrap icinde) */
  slideWidth?: number
  gap?: number
  damping?: number
  ariaLabel?: string
  className?: string
  /** Snap sonrasi tetik (slide settled) */
  onSettled?: (index: number) => void
}

export default function LerpCarousel({
  slides,
  slideWidth = 320,
  gap = 24,
  damping = 14,
  ariaLabel = 'carousel',
  className = '',
  onSettled,
}: LerpCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pos = useRef(0) // current rendered offset
  const target = useRef(0) // desired offset
  const dragStart = useRef<{ x: number; pos: number } | null>(null)
  const lastSettled = useRef<number>(-1)
  const frame = useRef<number>(0)
  const [active, setActive] = useState(0)

  const stride = slideWidth + gap
  const maxIndex = slides.length - 1

  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false
    return matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Frame loop: lerp pos toward target, write transform, detect settled.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (prefersReduced) {
      pos.current = target.current
      track.style.transform = `translate3d(${-pos.current}px,0,0)`
      return
    }

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000)
      last = now
      const k = 1 - Math.exp(-damping * dt)
      pos.current += (target.current - pos.current) * k
      track.style.transform = `translate3d(${-pos.current}px,0,0)`

      const idx = Math.round(target.current / stride)
      if (Math.abs(target.current - pos.current) < 0.5 && idx !== lastSettled.current) {
        lastSettled.current = idx
        setActive(idx)
        onSettled?.(idx)
      }

      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [damping, prefersReduced, stride, onSettled])

  const snapToIndex = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(maxIndex, i))
      target.current = idx * stride
      if (prefersReduced && trackRef.current) {
        pos.current = target.current
        trackRef.current.style.transform = `translate3d(${-pos.current}px,0,0)`
        lastSettled.current = idx
        setActive(idx)
        onSettled?.(idx)
      }
    },
    [maxIndex, stride, prefersReduced, onSettled],
  )

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    dragStart.current = { x: e.clientX, pos: target.current }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    target.current = dragStart.current.pos - dx
  }

  const onPointerUp = () => {
    if (!dragStart.current) return
    dragStart.current = null
    const idx = Math.round(target.current / stride)
    snapToIndex(idx)
  }

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return
    target.current = Math.max(0, Math.min(maxIndex * stride, target.current + e.deltaX))
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); snapToIndex(active + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); snapToIndex(active - 1) }
    else if (e.key === 'Home') { e.preventDefault(); snapToIndex(0) }
    else if (e.key === 'End') { e.preventDefault(); snapToIndex(maxIndex) }
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      aria-live="polite"
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0"
            style={{ width: slideWidth }}
            aria-hidden={i !== active}
            aria-label={`slide ${i + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}
