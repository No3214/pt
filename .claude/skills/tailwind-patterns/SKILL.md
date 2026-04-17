---
name: tailwind-patterns
description: 2026 Tailwind 3.4+ patterns PT (CSS variables + container queries). Triggers on tailwind, css, stil, style, utility.
---
# Tailwind Patterns — 2026 PT

## Theme (CSS Variables)
Her renk token runtime değişir dark/light:
```css
:root {
  --color-primary: #C8A97E;
  --color-secondary: #8B7355;
  --color-accent: #D4A574;
  --color-bg: #FAF6F1;
  --color-text-main: #1a1a1a;
}
.dark {
  --color-bg: #050505;
  --color-text-main: #e6e6e6;
}
```
Tailwind consume: `text-primary`, `bg-bg`, `border-primary/10` (opacity).

## Common Patterns

### Responsive Container (PT Standard)
```html
<div class="max-w-[1400px] mx-auto px-8 md:px-12">
```

### Glass Card (Liquid Glass)
```html
<div class="rounded-3xl p-8 border border-text-main/5 backdrop-blur-xl bg-white/50 dark:bg-black/30 shadow-2xl">
```

### Fluid Typography (Clamp)
```html
<h1 class="font-display font-semibold leading-[1.1] tracking-[-0.02em]
           text-[clamp(2.5rem,5vw,5.5rem)]">
```

### Badge (PT Signature)
```html
<span class="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary">
```

### Dark Mode Conditional (Inline)
```tsx
<div className={dm
  ? 'bg-white/[0.03] border-white/5 text-white/90'
  : 'bg-white border-black/[0.04] text-black/90 shadow-2xl'
}>
```

### Button Primary (CTA)
```html
<a class="block text-center py-5 rounded-2xl text-[1rem] font-bold
          bg-primary text-white shadow-lg shadow-primary/30
          hover:bg-primary-dark hover:shadow-xl
          transition-all duration-500">
```

### Section Spacing (PT Standard)
```html
<section class="py-32 md:py-40 bg-bg border-y border-text-main/5">
```

### Gradient Text (Apple Style)
```html
<span class="bg-gradient-to-b from-text-main to-text-main/60 bg-clip-text text-transparent">
```

### Hover Lift
```html
<div class="transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
```

### Grid Responsive (Bento)
```html
<div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
```

### Container Query (2026 Native)
```html
<div class="@container">
  <div class="@md:grid-cols-2 @lg:grid-cols-3">
```

## 2026 Tailwind Features
- **Container queries**: `@container`, `@sm:`, `@md:`, `@lg:`
- **Logical properties**: `ms-4` (margin-inline-start), `me-4`, `pe-4`, `ps-4`
- **Has selector**: `has-[:checked]:bg-primary`
- **Nested**: `@layer components { .card { ... } }`
- **CSS variable arbitrary**: `bg-[--color-primary]`
- **Opacity separator**: `text-primary/60`
- **Color-mix**: `bg-[color-mix(in_oklch,var(--primary)_20%,transparent)]`

## Responsive Design
- **Mobile first** — default mobile, `md:` up
- **Breakpoint**: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
- **Container queries** > media queries for component-intrinsic
- **Arbitrary breakpoint**: `max-md:hidden` (2026 native)

## Animation (Tailwind + Framer combo)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className="transition-all duration-500 hover:scale-105"
>
```

## Avoid
- `@apply` — breaks purging, harder to read (Tailwind docs recommend avoid)
- `!important` — specificity war (use `!` Tailwind modifier instead)
- Arbitrary value when utility exists (`text-[#C8A97E]` → `text-primary`)
- Inline `style={}` when Tailwind class exists
- Deep `@layer` override (keeps cascade clean)
- `space-x-` / `space-y-` (use `gap-` on flex/grid parent)

## PT-Specific Class Combos
```html
<!-- Hero headline -->
<h1 class="font-display text-[clamp(3rem,6vw,6rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">

<!-- Card popular -->
<div class="bg-primary/5 border-primary/20 shadow-2xl shadow-primary/10 dark:bg-primary/10 dark:border-primary/30">

<!-- Section badge -->
<p class="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">

<!-- Divider -->
<div class="w-20 h-1 bg-primary/20 mx-auto rounded-full" />

<!-- Stat number -->
<div class="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight font-display text-text-main">
```

## Bundle Optimization
- `purge`/`content` glob specific (`src/**/*.{ts,tsx}`)
- No dynamic class string (`bg-${color}`) — fully write class
- JIT enabled default v3+
- Safelist sadece runtime-only class
