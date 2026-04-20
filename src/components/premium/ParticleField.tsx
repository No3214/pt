// Casberry Particles-inspired ambient particle field.
// Canvas 2D tabanli — Three.js yok, <2kb gzip, mobilde battery-kind.
// Felsefe: text-to-particle yerine ambient swarm, kullanici dikkatini yumusakca cek.
//
// ARENA kullanimi:
//   <div className="relative">
//     <ParticleField count={500} color="#C2684A" />
//     <div className="relative z-10">Content</div>
//   </div>

import { useEffect, useRef } from 'react'

export interface ParticleFieldProps {
  /** Particle adedi — mobilde otomatik yariya iner */
  count?: number
  /** CSS color string (hex/rgb/hsl) */
  color?: string
  /** Max particle radius (px) */
  size?: number
  /** Hareket hizi carpani */
  speed?: number
  /** Pointer attract (0 = kapali, 1 = guclu) */
  attract?: number
  className?: string
  /** Saydamlik */
  opacity?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
}

/**
 * Lightweight canvas 2D particle ambient. Reduced-motion'da statik noise.
 */
export default function ParticleField({
  count = 500,
  color = '#C2684A',
  size = 1.6,
  speed = 0.35,
  attract = 0.0,
  className = '',
  opacity = 0.6,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = matchMedia('(max-width: 768px)').matches
    const effectiveCount = prefersReduced ? Math.floor(count * 0.15) : isMobile ? Math.floor(count * 0.5) : count

    // dpr + size
    let dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = canvas.clientWidth
    let h = canvas.clientHeight

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    resize()

    // init particles
    const particles: Particle[] = []
    for (let i = 0; i < effectiveCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * size + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
      })
    }

    let frame = 0
    let running = true

    const render = () => {
      if (!running) return
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        // attract (opsiyonel)
        if (attract > 0 && pointer.current.active) {
          const dx = pointer.current.x - p.x
          const dy = pointer.current.y - p.y
          const dist2 = dx * dx + dy * dy + 1
          const force = (attract * 12) / dist2
          p.vx += dx * force * 0.01
          p.vy += dy * force * 0.01
        }

        p.vx *= 0.99 // damping
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        // wrap edges
        if (p.x < 0) p.x = w
        else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        else if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = color
        ctx.globalAlpha = p.alpha * opacity
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      frame = requestAnimationFrame(render)
    }

    if (prefersReduced) {
      // tek seferlik statik render
      render()
      running = false
    } else {
      frame = requestAnimationFrame(render)
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.current.x = e.clientX - rect.left
      pointer.current.y = e.clientY - rect.top
      pointer.current.active = true
    }
    const onLeave = () => { pointer.current.active = false }

    if (attract > 0 && !prefersReduced) {
      canvas.addEventListener('pointermove', onPointer)
      canvas.addEventListener('pointerleave', onLeave)
    }

    window.addEventListener('resize', resize, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointer)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [count, color, size, speed, attract, opacity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: 'block' }}
    />
  )
}
