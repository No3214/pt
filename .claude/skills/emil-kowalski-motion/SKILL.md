---
name: emil-kowalski-motion
description: 2026 Emil Kowalski motion skill — animations.dev pattern. Triggers on motion, animation, transition, micro-interaction, spring, easing.
---
# Emil Kowalski Motion — 2026 PT

Kaynak: emilkowal.ski/skill + animations.dev. Claude'un UI'ya gerçek hareket + animation eklemesi için.

## Core Philosophy
- **Motion brings life** — flat UI = AI slop
- **Physics > linear** — spring damping feels natural
- **Purposeful** — animation serves UX, not decoration
- **Respect motion preferences** — prefers-reduced-motion: 0.01ms
- **60fps only** — transform + opacity, no layout thrash

## Timing Tokens
```css
--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-spring: cubic-bezier(0.22, 1, 0.36, 1);        /* PT signature */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

--dur-instant: 100ms;    /* tooltip, hover */
--dur-fast: 200ms;       /* button, toggle */
--dur-base: 350ms;       /* modal, drawer */
--dur-slow: 600ms;       /* section reveal */
--dur-ambient: 1200ms;   /* hero, background */
```

## Spring Physics (Framer Motion)
```tsx
// Soft spring — default PT
{ type: 'spring', stiffness: 380, damping: 28 }

// Bouncy — notification, toast
{ type: 'spring', stiffness: 500, damping: 20 }

// Gentle — drawer, modal
{ type: 'spring', stiffness: 200, damping: 30 }

// Snappy — dropdown, tooltip
{ type: 'spring', stiffness: 600, damping: 35 }
```

## Essential Patterns

### 1. Button Press
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
```

### 2. Card Hover (Lift + Shadow)
```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  className="transition-shadow duration-300 hover:shadow-xl"
>
```

### 3. Stagger Reveal (viewport)
```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{
    duration: 0.6,
    delay: index * 0.08,
    ease: [0.22, 1, 0.36, 1]
  }}
>
```

### 4. Modal (scale + fade + blur backdrop)
```tsx
// backdrop
<motion.div
  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
  animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
  transition={{ duration: 0.3 }}
/>
// dialog
<motion.div
  initial={{ opacity: 0, scale: 0.96, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.96, y: 20 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
/>
```

### 5. Drawer Slide (mobile)
```tsx
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', stiffness: 350, damping: 35 }}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.3}
  onDragEnd={(e, info) => info.offset.x > 100 && onClose()}
/>
```

### 6. Number Counter (spring)
```tsx
import { useSpring, useTransform, motion } from 'framer-motion'

function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  useEffect(() => spring.set(value), [value])
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())
  return <motion.span>{display}</motion.span>
}
```

### 7. Progress Bar
```tsx
<motion.div
  className="h-1 bg-primary origin-left"
  initial={{ scaleX: 0 }}
  animate={{ scaleX: progress / 100 }}
  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
/>
```

### 8. Accordion (height auto)
```tsx
<AnimatePresence initial={false}>
  {open && (
    <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: 'hidden' }}
    >
  )}
</AnimatePresence>
```

### 9. Tab Indicator (layoutId)
```tsx
<div className="flex gap-4 relative">
  {tabs.map(tab => (
    <button key={tab.id} onClick={() => setActive(tab.id)} className="relative">
      {tab.label}
      {active === tab.id && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  ))}
</div>
```

### 10. Parallax Scroll
```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], [0, -200])
return <motion.div ref={ref} style={{ y }}>
```

## Micro-Interactions (Delight)
- **Success check** — SVG path draw 0→1 stroke
- **Heart like** — scale 1 → 1.3 → 1 spring
- **Loading dots** — stagger opacity 0.3/1 repeat
- **Shake error** — x: [-8, 8, -4, 4, 0] duration 0.4
- **Ripple** — scale 0 → 4 + opacity 0.6 → 0

## CSS Native Alternatives (bundle-free)
```css
/* Scroll-driven */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}

/* View Transition API */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
}
```

## Performance Rules
- Transform + opacity only (GPU)
- Avoid animating: width, height, top, left, margin
- `will-change: transform` sadece aktif animasyonda
- 60fps = ≤16.67ms per frame
- Complex = use Web Animations API over CSS
- Framer Motion `layout` prop'u dikkatli kullan (forced reflow)

## Accessibility
```tsx
import { useReducedMotion } from 'framer-motion'
const reduce = useReducedMotion()
<motion.div transition={{ duration: reduce ? 0 : 0.6 }}>
```

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Anti-Pattern
- Linear easing (robotic)
- 1000ms+ duration (feels slow)
- Animate on every state change (noise)
- No exit animation (jarring)
- Bounce everywhere (amateur)
- Parallax on mobile (scroll jank)
- Auto-play heavy GSAP timelines (battery drain)

## When to Use Motion
- **Always**: state change, enter/exit, hover, focus, loading
- **Often**: success feedback, scroll reveal, page transition
- **Rarely**: decorative background, loop idle
- **Never**: critical path before interaction, error state flash
