# Tailwind Patterns Skill

Tailwind CSS patterns used in the PT project.

## Theme Integration
All colors via CSS variables, consumed by Tailwind:
- bg-bg, bg-bg-alt, bg-surface
- text-text-main, text-text-main/40 (opacity)
- bg-primary, text-primary, border-primary/10

## Common Patterns

### Responsive Container
```html
<div class="max-w-[1400px] mx-auto px-8 md:px-12">
```

### Glass Card
```html
<div class="card-glass rounded-3xl p-8 border border-text-main/5">
```

### Fluid Typography
```html
<h2 class="font-display text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
```

### Badge
```html
<span class="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary">
```

### Dark Mode Conditional
```html
<div class={dm ? 'bg-white/[0.03] border-white/5' : 'bg-white shadow-2xl border-black/[0.04]'}>
```

### Button Primary
```html
<button class="bg-primary text-white px-8 py-4 rounded-2xl font-medium hover:shadow-[0_20px_40px_rgba(194,104,74,0.3)] transition-all duration-300">
```

### Section Spacing
```html
<section class="py-32 md:py-40 bg-bg-alt border-y border-text-main/5">
```

## Avoid
- @apply (breaks purging, harder to read)
- !important (specificity wars)
- Arbitrary values when Tailwind class exists
- Inline styles when Tailwind can do it
