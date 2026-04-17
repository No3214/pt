/**
 * Card3D — Aceternity UI tarzi 3D tilt card (WebGL DEGIL, CSS transform based)
 *
 * Hafif, her yerde calisir, GPU-accelerated.
 * Programs, Testimonials, Pricing gibi kartlar icin.
 *
 * Kullanim:
 *   <Card3D>
 *     <Card3DContent>
 *       <img src="..." />
 *       <h3>Title</h3>
 *     </Card3DContent>
 *   </Card3D>
 */

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { createContext, useContext, useRef, type PropsWithChildren } from 'react'

type TiltContextValue = {
  rx: MotionValue<number>
  ry: MotionValue<number>
}
const TiltCtx = createContext<TiltContextValue | null>(null)

export function Card3D({
  children,
  className = '',
  intensity = 12,
}: PropsWithChildren<{ className?: string; intensity?: number }>) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rxRaw = useTransform(y, [-0.5, 0.5], [intensity, -intensity])
  const ryRaw = useTransform(x, [-0.5, 0.5], [-intensity, intensity])
  const rx = useSpring(rxRaw, { stiffness: 180, damping: 18 })
  const ry = useSpring(ryRaw, { stiffness: 180, damping: 18 })

  return (
    <motion.div
      ref={ref}
      className={`relative [perspective:1200px] ${className}`}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <TiltCtx.Provider value={{ rx, ry }}>
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}>
          {children}
        </motion.div>
      </TiltCtx.Provider>
    </motion.div>
  )
}

/** Layer — kart icinde Z-ekseninde offset yaratir (deeper = on planda) */
export function Card3DLayer({
  children,
  depth = 40,
  className = '',
}: PropsWithChildren<{ depth?: number; className?: string }>) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}

/** Shine — parlak yuzey efekti, mouse ile hareket eder */
export function Card3DShine({ className = '' }: { className?: string }) {
  const ctx = useContext(TiltCtx)
  if (!ctx) return null
  const mx = useTransform(ctx.ry, [-12, 12], ['30%', '70%'])
  const my = useTransform(ctx.rx, [-12, 12], ['30%', '70%'])
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{
        background: useTransform([mx, my] as any, ([x, y]: any) =>
          `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22), transparent 55%)`,
        ) as any,
        mixBlendMode: 'overlay',
      }}
      aria-hidden
    />
  )
}
