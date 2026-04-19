---
name: arena-motion-lab
description: ARENA Performance icin Framer Motion 11 + CSS premium motion choreography playbook. BlurText, StaggeredFadeUp, LiquidGlass, ScrollReveal, parallax, magnetic cursor, reveal-on-scroll, layout transitions, shared elements, reduced-motion patterns. Tetikleyici anahtarlar: "animasyon", "motion", "framer", "scroll reveal", "parallax", "transition", "choreography", "liquid glass", "blur text", "stagger", "magnetic", "3d", "tilt".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Motion Lab

Premium, proje-ozel motion playbook'u. Hedef: Akdeniz sicakligi + sporcu enerjisi + zarafet. Fragman hizi: 60fps'de duraksiz.

## 0) Temel Prensipler

1. **Niyet**: Her motion bir anlami guclendirir — dekor degil.
2. **Zaman**: `0.16–0.48s` aralik; tipik `0.28`. Easing: `[0.22, 1, 0.36, 1]` (out-expo) hero icin, `[0.4, 0, 0.2, 1]` (material) UI icin.
3. **Gecikme**: Choreography icin `0.04–0.08s` stagger.
4. **Reduced motion**: `prefers-reduced-motion: reduce` ise `transition={{ duration: 0 }}` + statik visibility.
5. **GPU**: `transform` + `opacity` only. `box-shadow`, `filter` animasyonu 60fps'yi kirar.
6. **Layout cinayetleri**: `width/height/top/left` animasyonu yok → `scale`, `x/y` kullan.

## 1) Import Katmani

```ts
import { motion, useReducedMotion, useScroll, useTransform, useSpring, AnimatePresence, LayoutGroup } from 'framer-motion'
```

## 2) Proje Pattern'leri

### BlurText (src/components/sprint2/BlurText.tsx)
Kelime-kelime blur + y transform ile reveal.

```tsx
<BlurText text={t.hero.title} delay={0.08} />
```

Kullanim: hero title, section baslik, CTA alt metin.

### LiquidGlassCard (src/components/sprint2/LiquidGlassCard.tsx)
Backdrop blur + ince gradient border + soft inner shadow. Motion: `whileHover={{ y: -4 }}`.

### ScrollWordReveal
Paragraftaki kelimeler scroll progress'e gore fade-in.

## 3) Koreograf Patternleri

### Stagger Container

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
}

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10%' }}>
  {items.map(x => <motion.li key={x.id} variants={item}>...</motion.li>)}
</motion.ul>
```

### Scroll-linked Parallax

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
return <motion.div ref={ref} style={{ y }}>...</motion.div>
```

Hero background + Gallery thumbnail + Stats number counter icin ideal.

### Magnetic Button

```tsx
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 260, damping: 20 })
  const y = useSpring(0, { stiffness: 260, damping: 20 })
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25)
  }
  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.div>
  )
}
```

### 3D Tilt (CSS-only, three.js yok)

```tsx
function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 220, damping: 20 })
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    rotateY.set(px * 10)
    rotateX.set(-py * 10)
  }
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}
```

### Shared Layout (hero → detail)

```tsx
<LayoutGroup>
  <motion.div layoutId={`program-${id}`}>...</motion.div>
</LayoutGroup>
```

### AnimatePresence (route / modal)

```tsx
<AnimatePresence mode="wait">
  {open && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

## 4) Reduced Motion Pattern

```tsx
const reduce = useReducedMotion()
const t = reduce ? { duration: 0 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
```

Test: Chrome DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion.

## 5) ARENA Koreograf Tarifleri

### Hero Giris (ilk paint sonrasi)
1. Logo: `opacity 0 → 1` + `scale 0.96 → 1`, 0.32s ease-out
2. Title: BlurText, kelime stagger 0.06s
3. Subtitle: fade + y 8px → 0, 0.4s, delay 0.24s
4. CTA: scale 0.94 → 1 + opacity, 0.48s, delay 0.36s
5. Volleyball orb: continuous subtle rotation `repeat: Infinity, duration: 24s`

### Section Reveal (her below-fold section)
- `initial={{ opacity: 0, y: 32 }}`
- `whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true, margin: '-15%' }}`
- `transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}`

### Stats Sayac (counter)
`useMotionValue` + `useTransform` + `animate()` ile progress counter:

```tsx
const count = useMotionValue(0)
const rounded = useTransform(count, v => Math.round(v))
useEffect(() => {
  const controls = animate(count, target, { duration: 1.2, ease: [0.22, 1, 0.36, 1] })
  return controls.stop
}, [target])
return <motion.span>{rounded}</motion.span>
```

### Marquee (brand bar)
`animate={{ x: [0, -100 + '%'] }}` + `transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}`. Pause-on-hover: `whileHover={{ animationPlayState: 'paused' }}`.

## 6) Perf Onlem

- `useInView({ triggerOnce: true })` — aninca one-shot
- `will-change: transform` sadece aktif animasyon suresince; sonra kaldir
- Layout thrash: `layout` prop yalnizca gercekten layout degisen element'e
- Framer import'u named: `import { motion } from 'framer-motion'` — tree-shake

## 7) Debug

- Chrome DevTools > Performance > Record > animation tetikle > frame drop kontrol
- `<motion.div transition={{ duration: 3 }} />` — slo-mo debug
- `useReducedMotion()` manual override: `document.documentElement.style.setProperty('animation', 'none')`

## 8) Kompleks Ornekler

### Scroll-linked Text (kelime kelime fade-in)

```tsx
function ScrollText({ text }: { text: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.4'] })
  const words = text.split(' ')
  return (
    <p ref={ref}>
      {words.map((w, i) => {
        const start = i / words.length
        const end = (i + 1) / words.length
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1])
        return <motion.span key={i} style={{ opacity }}>{w} </motion.span>
      })}
    </p>
  )
}
```

### Gallery Image Swap (crossfade)

```tsx
<AnimatePresence mode="popLayout">
  <motion.img
    key={currentSrc}
    src={currentSrc}
    initial={{ opacity: 0, scale: 1.05 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  />
</AnimatePresence>
```

### Page Transition

`src/App.tsx` icinde:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

## 9) Akdeniz / Sporcu Dili

- Yay: `cubic-bezier(0.34, 1.56, 0.64, 1)` — hafif overshoot, top sekmesi hissi
- Hiz: Sert aksiyonlarda (skor, set cevrilir) 0.18–0.24s; yumusak girislerde 0.48–0.72s
- Renk darbe (attention): primary rengin glow + 1px scale + fade-out 1.2s, pace `[1, 1.04, 1]`

## 10) i18n Dili Yonu (RTL)

Arapca locale aktif oldugunda: `x` yerine `-x` kullan veya `useReducedMotion` tuzagini tekrar et:

```tsx
const isRtl = document.dir === 'rtl'
const xInit = isRtl ? 24 : -24
```

## 11) Kullanim Protokolu

1. Skill invoke → hedefi tanimla (hangi section, hangi event)
2. Pattern sec (liste yukari)
3. Reduced-motion + RTL dogrula
4. `npm run dev` + 60fps kontrol (Chrome Performance recording)
5. Gate: bundle delta < 5KB? (framer zaten chunk'ta)

## 12) Red Flags

- `animate` prop'unu render icinde `new Object` ile yaratma → her render'da re-anim
- `layout` + ag ir DOM → CLS patlar
- `scale` > 1.5 + text → bulanik
- `opacity` only fade → kimliksiz hissettirir; y veya scale ekle

---

Sonuc: her ARENA section'i icin 2–3 catkili choreography karisik → sade ama unutulmaz.
