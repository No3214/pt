---
name: design-audit
description: 2026 PT design audit — hierarchy, motion, accessibility. Triggers on design, layout, colors, typography, UX, UI, tasarım, görsel.
autoTrigger: true
---
# Design Audit — 2026 PT

## Brand Tokens
- Primary #C8A97E (Akdeniz kum)
- Secondary #8B7355 (koyu toprak)
- Accent #D4A574 (sıcak altın)
- Sand #D4C4AB
- BG light #FAF6F1 / dark #050505
- Focus/Ocean #5e8fa8
- Success/Sage #7A9E82

## Principles (2026 Refined)
1. **Motion physics** — spring, not linear. Framer spring {380, 28}
2. **Interactive state** — hover/focus/active her element (disabled dahil)
3. **Distinctive aesthetic** — default/template look YASAK
4. **Touch target 44x44** min, 4pt grid spacing
5. **WCAG 2.2 AA** — 4.5:1 contrast, focus visible, aria
6. **Liquid glass + Akdeniz warmth** — soft shadow, generous whitespace
7. **Core Web Vitals v4** — LCP ≤2.0s, INP ≤150ms, CLS ≤0.05
8. **View Transitions** — page/route geçişleri smooth
9. **Container queries** — component intrinsic responsive
10. **Text-wrap balance/pretty** — tipografi polish

## Audit Checklist

### Visual Hierarchy
- [ ] Primary action tek (CTA)
- [ ] Z-pattern veya F-pattern reading flow
- [ ] Font scale: 1.333 (perfect fourth) / 1.5 (perfect fifth)
- [ ] Weight contrast: 400 body, 600 subhead, 700 display
- [ ] Color contrast: text ≥4.5:1, UI ≥3:1

### Color
- [ ] Token usage (hardcoded hex YASAK runtime)
- [ ] P3 gamut `color(display-p3)` modern browser
- [ ] `color-mix(in oklch, ...)` opacity layer
- [ ] Dark mode: tokens mirror, manual hex YASAK

### Typography
- [ ] Display Cormorant Garamond, Body Outfit
- [ ] `text-wrap: balance` h1/h2
- [ ] `text-wrap: pretty` paragraph
- [ ] Line-height 1.5–1.75 body
- [ ] Line length 65-75ch

### Spacing
- [ ] 8pt grid strict
- [ ] Section `py-32 md:py-40`
- [ ] Container `max-w-[1400px] mx-auto px-8 md:px-12`
- [ ] Card `rounded-3xl p-8`

### Responsive
- [ ] Mobile 375px perfect
- [ ] Container query `@container` where needed
- [ ] Touch 44x44 min
- [ ] No horizontal scroll

### Motion
- [ ] `ease [0.22,1,0.36,1]` default
- [ ] Spring `{type:'spring', stiffness:380, damping:28}`
- [ ] `viewport={{once:true}}` reveal
- [ ] Stagger 0.08-0.12s
- [ ] `prefers-reduced-motion` respect
- [ ] 60fps sabit (Chrome Rendering)

### Loading/Empty/Error State
- [ ] Skeleton loader every async
- [ ] Empty state illustration + CTA
- [ ] Error state message + retry
- [ ] Optimistic UI (useOptimistic)

### A11y
- [ ] Semantic HTML
- [ ] Focus visible ring (custom, outline YASAK)
- [ ] Keyboard nav Tab/Shift-Tab/Esc
- [ ] Screen reader live region
- [ ] Alt text descriptive

## Elevation System
- shadow-sm (rest)
- shadow-md (hover lift)
- shadow-xl (dropdown)
- shadow-2xl (modal/lightbox)

## PT Signature Motifs
- Liquid glass card (`backdrop-filter: blur(24px) saturate(180%)`)
- ShineBorder conic gradient (popular card)
- Spotlight SVG radial glow (Hero)
- Card3D tilt CSS 3D transform
- Cormorant italic vurgu
- 1px warm border `border-text-main/5`

## Common Mistake (Flag)
- Emoji icon → SVG kullan
- bg-white/10 light mode → use bg-white/80
- gray-400 body text → slate-600+
- border-white/10 light → border-black/5
- Default font Inter/Roboto
- Purple gradient white bg (AI slop)
- Drop shadow hard (generic)
