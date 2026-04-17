---
name: ui-ux-pro-max
description: 2026 UX intelligence — 99 guideline PT. Triggers on UX, UI, deneyim, kullanıcı, accessibility.
---
# UI/UX Pro Max — 2026 Design Intelligence

99 guideline, 50+ style system, 97 palette, 57 font pairing — PT'ye uygulanmış.

## PT Identity (Locked)
- **Product**: Sporcu performansı + wellness platform
- **Tone**: Premium, Akdeniz sıcaklığı, elit sporcu enerjisi
- **Display Font**: Cormorant Garamond (serif)
- **Body Font**: Outfit (sans)
- **Color Core**: #C8A97E kum + #8B7355 toprak + #D4A574 altın

## Priority Rules

### 1. Accessibility (CRITICAL) — WCAG 2.2 AA
- Contrast text ≥4.5:1, UI ≥3:1
- Focus visible custom ring
- Alt text descriptive
- `aria-label` icon button
- `role="dialog"` modal
- Keyboard nav complete (Tab/Shift-Tab/Esc/Arrow)
- Touch ≥44x44
- Screen reader live region

### 2. Touch & Interaction (CRITICAL)
- 44x44 min (w-11 h-11)
- `cursor-pointer` clickable
- Loading state (disabled + spinner)
- Tap feedback (scale 0.98 active)
- Haptic feedback mobile (if possible)

### 3. Performance (HIGH)
- Core Web Vitals v4: LCP ≤2.0s, INP ≤150ms, CLS ≤0.05
- WebP/AVIF image
- `prefers-reduced-motion` respect
- No CLS (width/height explicit)
- Route lazy + Suspense skeleton

### 4. Layout (HIGH)
- Mobile-first 375px
- Min body 16px (iOS zoom prevent)
- No horizontal scroll
- **z-index scale**: 10 base, 50 nav, 100 modal, 9999 lightbox
- Container 1400px max
- 8pt grid spacing

### 5. Typography (MEDIUM)
- Line-height 1.5–1.75 body
- Line length 65–75ch
- `text-wrap: balance` h1/h2
- `text-wrap: pretty` paragraph
- Letter spacing tight display, normal body
- Font-display swap

### 6. Animation (MEDIUM)
- Micro 150–300ms
- Transform + opacity only
- Spring physics (not linear)
- Stagger 0.08–0.12s
- `prefers-reduced-motion` 0.01ms duration

### 7. Feedback State (HIGH)
- **Loading**: skeleton, not spinner-only
- **Empty**: illustration + action
- **Error**: message + retry
- **Success**: toast + continue
- **Optimistic**: useOptimistic instant UI

### 8. Information Architecture (HIGH)
- Progressive disclosure (3-level depth max)
- Breadcrumb on deep page
- Clear navigation (icon + label)
- Search global (⌘K)

## Common Mistake (Flag)

### Color
- `bg-white/10` light mode — sadece dark mode OK; light için `bg-white/80`
- `gray-400` body text — use `slate-600`+ for readability
- `border-white/10` light mode — use `border-black/5` or `border-gray-200`
- Pure `#000` text on `#FFF` bg — use warm `#1a1a1a` on `#FAF6F1`

### Typography
- Inter / Roboto default (AI slop signature) — use Cormorant + Outfit PT
- Same font display + body — contrast needed
- Missing `text-wrap: balance` h1 — ugly line break
- Line height too tight body text

### Icon
- Emoji as icon (✓ ✗ → use SVG Lucide)
- Inconsistent size (use 16/20/24 standard)
- No `aria-label`

### Interaction
- No hover state (dead feel)
- No focus ring (keyboard user lost)
- Click target <44x44
- Missing loading state (user wonder)

### Layout
- Centered fixed-width (modern = full-width container)
- Dense + tight whitespace (premium = generous)
- Same card style everywhere (hierarchy lost)
- Symmetric perfect (editorial = asymmetric)

## 2026 UX Trends
- **View Transitions API** — page/route smooth (`document.startViewTransition`)
- **Container queries** — component intrinsic responsive
- **Scroll-driven animation** — CSS `animation-timeline: scroll()`
- **Popover API** — native popup, polyfill-free
- **Anchor positioning** — tooltip/dropdown smart position
- **CSS nesting + @scope** — component-scoped no-JS
- **Dialog element** — native modal + `::backdrop`

## Microinteraction Library
- **Button**: scale 0.98 active, shadow lift hover
- **Card**: tilt 3D (Card3D), shine border (popular)
- **Input**: floating label, error shake
- **Toast**: slide-in + fade
- **Modal**: scale 0.96 → 1, backdrop blur
- **Nav**: underline slide (active)
- **Stats counter**: animated number
- **Progress bar**: scaleX origin-left reveal

## Emotional Design
- **Delight moments** — success animation, confetti (rare + tasteful)
- **Onboarding** — progressive, not wall of text
- **Empty state** — friendly illustration + CTA
- **Loading** — skeleton > spinner (reduce perceived wait)
- **Error** — empathetic tone, clear next step

## Checklist (Every Screen)
- [ ] A11y score 100 (axe-core)
- [ ] Contrast AA all text/UI
- [ ] Touch 44x44 every clickable
- [ ] Keyboard nav complete
- [ ] Focus ring visible
- [ ] Loading state (skeleton)
- [ ] Empty state (CTA)
- [ ] Error state (retry)
- [ ] Mobile 375px perfect
- [ ] Dark mode parity
- [ ] 13 dil i18n
- [ ] Core Web Vitals v4 green
