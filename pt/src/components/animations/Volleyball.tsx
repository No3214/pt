import { motion, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * Voleybol markasına özgü animasyon paketi.
 * Ela Ebeoğlu profesyonel voleybolcu — tüm bileşenler marka DNA'sına uyumlu.
 *
 * - VolleyballSVG:       Yüksek kaliteli, temaya duyarlı voleybol topu (SVG)
 * - VolleyballFloaters:  Arka planda parallax ile yüzen dekoratif toplar
 * - VolleyballSpike:     Spike (smaç) parabolik yörüngesi — hero'da dikkat çekici
 * - VolleyballDivider:   Section divider — top zıplama + net hareketi
 * - VolleyballCursorTrail: Mouse takibinde ufak top izi (desktop-only)
 *
 * Tümü `prefers-reduced-motion` saygılı. Touch cihazlarda ağır olanlar devre dışı.
 */

const easeSpike: [number, number, number, number] = [0.22, 1, 0.36, 1]
const easeBounce: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

/* ------------------------------ Temel SVG top ------------------------------ */

type BallProps = {
  size?: number
  className?: string
  /** 0-1: gölge yoğunluğu */
  shadow?: boolean
  style?: CSSProperties
}

export function VolleyballSVG({ size = 64, className = '', shadow = true, style }: BallProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
    >
      {shadow && (
        <defs>
          <radialGradient id="ballShade" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="60%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.25" />
          </radialGradient>
        </defs>
      )}

      {/* Top gövdesi */}
      <circle cx="50" cy="50" r="46" fill="var(--color-surface, #f7f5f0)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-primary)" strokeWidth="1.25" opacity="0.25" />

      {/* Üç panel ayırıcı eğrileri — klasik voleybol topu */}
      <g fill="none" stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round">
        {/* Sol panel kavisi */}
        <path d="M 12 38 Q 34 48 48 92" />
        {/* Sağ panel kavisi */}
        <path d="M 88 38 Q 66 48 52 92" />
        {/* Üst panel kavisi */}
        <path d="M 18 22 Q 50 40 82 22" />
      </g>

      {/* Iç tonlama */}
      <g stroke="var(--color-secondary)" strokeWidth="1" opacity="0.35" fill="none">
        <path d="M 18 30 Q 38 42 46 88" />
        <path d="M 82 30 Q 62 42 54 88" />
        <path d="M 22 26 Q 50 38 78 26" />
      </g>

      {shadow && <circle cx="50" cy="50" r="46" fill="url(#ballShade)" />}
    </svg>
  )
}

/* ----------------------------- Parallax floaters ---------------------------- */

type FloaterSpec = { x: string; y: string; size: number; delay: number; duration: number; drift: number }

const DEFAULT_FLOATERS: FloaterSpec[] = [
  { x: '8%',  y: '22%', size: 56, delay: 0.0, duration: 7.2, drift: 12 },
  { x: '86%', y: '18%', size: 40, delay: 0.6, duration: 8.4, drift: 18 },
  { x: '14%', y: '72%', size: 72, delay: 0.3, duration: 9.0, drift: 14 },
  { x: '78%', y: '68%', size: 48, delay: 0.9, duration: 7.8, drift: 10 },
  { x: '48%', y: '12%', size: 32, delay: 0.2, duration: 6.6, drift: 16 },
]

export function VolleyballFloaters({
  floaters = DEFAULT_FLOATERS,
  opacity = 0.08,
}: {
  floaters?: FloaterSpec[]
  opacity?: number
}) {
  const reduced = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-0" style={{ opacity }}>
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: f.x, top: f.y }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={
            reduced
              ? { opacity: 1 }
              : {
                  y: [0, -f.drift, 0, f.drift * 0.7, 0],
                  rotate: [0, 45, 90, 135, 180],
                  opacity: [0, 1, 1, 1, 1],
                }
          }
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <VolleyballSVG size={f.size} shadow={false} />
        </motion.div>
      ))}
    </div>
  )
}

/* -------------------------------- Spike arc -------------------------------- */

/**
 * Bir spike (smaç) yörüngesi. Üstten başlar, parabol çizerek karşı sahaya iner.
 * containerClass içine absolute yerleştirilir. Varsayılan 2.4s, loop.
 */
export function VolleyballSpike({
  size = 44,
  duration = 2.4,
  delay = 0.2,
  loop = true,
  /** Başlangıç (sol üst) — yüzde */
  from = { x: '6%', y: '12%' },
  /** Bitiş (sağ alt) — yüzde */
  to = { x: '82%', y: '68%' },
  /** Kavis yüksekliği (px) — yüksekse daha yüksek parabol */
  arc = 120,
}: {
  size?: number
  duration?: number
  delay?: number
  loop?: boolean
  from?: { x: string; y: string }
  to?: { x: string; y: string }
  arc?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return null

  // Yörünge: x lineer, y parabolik (offset üstten aşağı)
  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{ left: from.x, top: from.y, willChange: 'transform' }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
      animate={{
        x: ['0%', '50%', '100%'],
        y: [0, -arc, 0],
        rotate: [0, 540, 1080],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: loop ? Infinity : 0,
        repeatDelay: loop ? 1.2 : 0,
        ease: easeSpike,
        times: [0, 0.5, 1],
      }}
      // X ofsetini from→to ile eşlemek için wrapper genişliğini CSS ile verdik
      data-spike-from={JSON.stringify(from)}
      data-spike-to={JSON.stringify(to)}
    >
      {/* Motion blur tail */}
      <motion.div
        className="relative"
        animate={{ filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'] }}
        transition={{ duration, delay, repeat: loop ? Infinity : 0, repeatDelay: loop ? 1.2 : 0 }}
      >
        <VolleyballSVG size={size} shadow />
      </motion.div>

      {/* Işıltı takipi */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 24px 4px color-mix(in oklab, var(--color-primary) 55%, transparent)',
        }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration, delay, repeat: loop ? Infinity : 0, repeatDelay: loop ? 1.2 : 0 }}
      />
    </motion.div>
  )
}

/* ------------------------------ Section divider ----------------------------- */

/**
 * İki section arası zıplayan voleybol topu + stilize net.
 * Tam genişlik, 80px yükseklik, dekoratif.
 */
export function VolleyballDivider({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  return (
    <div aria-hidden className={`relative w-full h-[96px] overflow-hidden ${className}`}>
      {/* Net (çizgiler) */}
      <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="net" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 8 L 16 8 M 8 0 L 8 16" stroke="var(--color-primary)" strokeWidth="0.6" opacity="0.25" />
          </pattern>
        </defs>
        <rect x="0" y="40" width="400" height="34" fill="url(#net)" />
        <line x1="0" y1="40" x2="400" y2="40" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="74" x2="400" y2="74" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" />
      </svg>

      {/* Zıplayan top */}
      <motion.div
        className="absolute"
        style={{ top: 8, left: '10%' }}
        initial={{ x: 0, y: 0 }}
        animate={
          reduced
            ? { x: '80vw' }
            : {
                x: ['0%', '40vw', '80vw'],
                y: [0, 40, 0, 40, 0],
              }
        }
        transition={{
          duration: 3.4,
          repeat: Infinity,
          repeatDelay: 0.6,
          ease: easeBounce,
        }}
      >
        <VolleyballSVG size={40} />
      </motion.div>
    </div>
  )
}

/* --------------------------- Cursor trail (desktop) -------------------------- */

export function VolleyballCursorTrail({ size = 28 }: { size?: number }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement | null>(null)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 })
  const rotate = useTransform(sx, [-200, 200], [-60, 60])

  useEffect(() => {
    if (reduced) return
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (isTouch) return

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - size / 2)
      y.set(e.clientY - size / 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, size, x, y])

  if (reduced) return null

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9998] opacity-70 mix-blend-multiply dark:mix-blend-screen"
      style={{ x: sx, y: sy, rotate, willChange: 'transform' }}
    >
      <VolleyballSVG size={size} />
    </motion.div>
  )
}

/* -------------------------- Scroll-linked rolling ball -------------------------- */

/**
 * Sayfa aşağı kaydıkça sağa yuvarlanan top. Header altı / hero üstüne atılır.
 */
export function VolleyballScrollRoller({ top = 72, height = 8 }: { top?: number; height?: number }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '96%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1440])

  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 z-[70]" style={{ top }}>
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="absolute"
          style={{ x, rotate, top: -height * 4 }}
        >
          <VolleyballSVG size={28} />
        </motion.div>
        {/* İnce taban çizgisi */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary, #bfa46f) 40%, transparent)' }} />
      </div>
    </div>
  )
}
