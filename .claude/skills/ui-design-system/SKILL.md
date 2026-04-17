---
name: ui-design-system
description: 2026 PT design system — tokens, components, motion. Triggers on design system, token, component, UI.
---
# UI Design System — 2026 PT

## Design Tokens

### Color (OKLCH-ready, P3 gamut)
```css
:root {
  /* Brand */
  --color-primary: #C8A97E;          /* Akdeniz kum */
  --color-primary-dark: #B09566;
  --color-secondary: #8B7355;         /* Koyu toprak */
  --color-accent: #D4A574;            /* Sıcak altın */
  --color-sand: #D4C4AB;

  /* Semantic */
  --color-success: #7A9E82;           /* Sage */
  --color-info: #5e8fa8;              /* Ocean */
  --color-warning: #E3A04F;
  --color-danger: #C85450;

  /* Surface (light) */
  --color-bg: #FAF6F1;
  --color-bg-alt: #F5EFE8;
  --color-surface: #FFFFFF;
  --color-text-main: #1C1917;
  --color-text-muted: #6B6561;
}

.dark {
  --color-bg: #050505;
  --color-bg-alt: #0c0c0c;
  --color-surface: #121212;
  --color-text-main: #E6E6E6;
  --color-text-muted: #A0A0A0;
}
```

### Typography
- **Display**: Cormorant Garamond (serif, italic vurgu)
- **Body**: Outfit (sans)
- **Mono**: JetBrains Mono (sayı, metrik)

### Scale (Perfect Fourth 1.333)
```
Hero: clamp(3rem, 6vw, 5.5rem)       — 48–88px
H1: clamp(2.5rem, 4.5vw, 4rem)        — 40–64px
H2: clamp(2rem, 3.5vw, 3.2rem)        — 32–51px
H3: clamp(1.5rem, 2.5vw, 2.2rem)      — 24–35px
Body-L: 1.15rem (18px)
Body: 1rem (16px)
Small: 0.875rem (14px)
Badge: 0.75rem uppercase tracking-[0.3em]
```

### Spacing (8pt grid)
```
xs: 0.25rem  (4px)
sm: 0.5rem   (8px)
md: 1rem     (16px)
lg: 2rem     (32px)
xl: 4rem     (64px)
2xl: 8rem    (128px)
3xl: 10rem   (160px)
```

### Radius
```
sm: 0.5rem    (8px)
md: 1rem      (16px)
lg: 1.5rem    (24px)
xl: 2rem      (32px)
2xl: 2.5rem   (40px) — PT card signature
full: 9999px
```

### Shadow Elevation
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 8px 24px rgba(0,0,0,0.06);
--shadow-xl: 0 20px 50px rgba(0,0,0,0.1);
--shadow-2xl: 0 30px 80px rgba(0,0,0,0.15);
--shadow-glow: 0 20px 50px color-mix(in oklch, var(--color-primary) 30%, transparent);
```

## Motion Tokens
```css
--transition-fast: 150ms;
--transition-base: 400ms;
--transition-slow: 600ms;

--ease-brand: cubic-bezier(0.22, 1, 0.36, 1);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--spring-soft: stiffness 380 damping 28;
--spring-bouncy: stiffness 500 damping 20;
```

## Component Patterns

### Glass Card (Liquid)
```css
.card-glass {
  background: color-mix(in oklch, var(--color-surface) 60%, transparent);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid color-mix(in oklch, var(--color-text-main) 5%, transparent);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
}
```

### Gradient Text (Apple)
```css
.text-gradient {
  background: linear-gradient(180deg,
    var(--color-text-main) 0%,
    color-mix(in oklch, var(--color-text-main) 60%, transparent) 100%);
  background-clip: text;
  color: transparent;
}
```

### Button Primary
```html
<button class="px-8 py-4 rounded-2xl bg-primary text-white font-semibold
               shadow-lg shadow-primary/30
               hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5
               active:translate-y-0
               transition-all duration-300
               focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
```

### Section (PT Standard)
```html
<section class="py-32 md:py-40 bg-bg border-y border-text-main/5">
  <div class="max-w-[1400px] mx-auto px-8 md:px-12">
    <!-- content -->
  </div>
</section>
```

### Skeleton Loader
```html
<div class="animate-pulse rounded-2xl bg-text-main/5 h-40">
```

## Breakpoints
```
sm: 640px    (large phone)
md: 768px    (tablet)
lg: 1024px   (laptop)
xl: 1280px   (desktop)
2xl: 1536px  (large desktop)
```

## Container Queries (2026)
```html
<div class="@container">
  <div class="grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
```

## Accessibility (WCAG 2.2 AA)
- Contrast text ≥4.5:1, UI ≥3:1
- Focus ring custom (2px solid primary + 2px offset)
- Touch target ≥44x44
- `prefers-reduced-motion` respect
- `prefers-color-scheme` respect

## Icon System
- SVG stroke-based
- 24x24 viewBox standard
- 1.5–2.5 strokeWidth
- `currentColor` tint
- Lucide React library
- No emoji as icon

## Component Library
- **Button** — primary, secondary, ghost, icon
- **Card** — default, glass, elevated, 3D tilt
- **Modal** — Dialog with focus trap + Esc
- **Toast** — success, error, info (4s auto-dismiss)
- **Skeleton** — text, card, avatar variants
- **Spinner** — primary color
- **Input** — text, textarea, select, checkbox, radio
- **Badge** — solid, outline, soft
- **Tooltip** — hover + focus trigger
- **Dropdown** — menu with arrow key nav
