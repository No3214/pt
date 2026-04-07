# Design System — Ela Ebeoğlu Performance

## 1. Visual Theme & Atmosphere

Premium athletic coaching brand with Mediterranean warmth. The design merges luxury editorial aesthetics with athlete energy. Light mode uses warm cream backgrounds with terracotta and sage accents; dark mode shifts to near-black with the same palette glowing against dark surfaces. Every section alternates between dense content and generous whitespace, creating a magazine-like reading rhythm. Typography is dual-purpose: Cormorant Garamond serifs for editorial authority, Outfit sans-serif for modern UI. The overall feel: a high-end sports magazine crossed with a boutique wellness brand.

**Key Characteristics:**
- Warm cream (#FAF6F1) base with terracotta (#C2684A) as primary action color
- Parallax hero with athlete imagery at low opacity (0.15) behind text
- Ambient glow orbs using radial gradients of primary/secondary at 5-7% opacity
- Floating metric badges with backdrop-blur-xl on hero image
- 2rem border-radius on cards, 2.5rem on feature cards — soft, premium feel
- Framer Motion animations: staggered fade-ups, magnetic buttons, scroll-triggered reveals
- Dark mode via `.dark` class with #050505 background

## 2. Color Palette & Roles

### Primary
- **Terracotta** (`#C2684A`): Primary brand color — CTAs, badges, active states, gradient highlights. Warm, energetic, Mediterranean.
- **Sage Green** (`#7A9E82`): Secondary — success states, testimonial metric badges, balance/wellness contexts.
- **Coast Blue** (`#4A6D88`): Accent — informational elements, subtle highlights, third-tier actions.

### Surface & Background
- **Warm Cream** (`#FAF6F1`): Light mode primary background — warm, never cold white.
- **Cream Alt** (`#F5F0EA`): Alternate sections, testimonial backgrounds, subtle differentiation.
- **Pure White** (`#FFFFFF`): Card surfaces in light mode.
- **Near Black** (`#050505`): Dark mode primary background.
- **Dark Alt** (`#0A0A0A`): Dark mode alternate sections.

### Neutrals & Text
- **Dark Stone** (`#1C1917`): Primary text in light mode.
- **Muted Stone** (`#78716C`): Secondary text, descriptions.
- **Sand** (`#D4B483`): Decorative accent, gradient component.
- **Light Text** (`#FAFAF9`): Primary text in dark mode.

### Semantic
- **Glow**: `color-mix(in srgb, var(--color-primary) 15%, transparent)` — hover states, focus rings.
- **Gradient Text**: `linear-gradient(135deg, primary → sand → secondary → accent)` — hero highlights.

## 3. Typography Rules

### Font Families
- **Cormorant Garamond** (serif): Display headings — elegant, editorial authority. Weight 600, line-height 1.1.
- **Outfit** (sans-serif): Body text, UI elements — modern, clean. Weight 400-700, line-height 1.6.

### Hierarchy

| Role | Size | Weight | Font | Notes |
|------|------|--------|------|-------|
| Hero Title | clamp(2.5rem, 6vw, 5.5rem) | 600 | Cormorant | Tracking -0.03em, leading 1.05 |
| Section Title | clamp(2.2rem, 4vw, 3.8rem) | 600 | Cormorant | Tracking -0.02em |
| Card Heading | 1.6rem | 700 | Cormorant | Hover → primary color transition |
| Badge/Label | 0.75rem | 500-700 | Outfit | UPPERCASE, tracking 0.2-0.3em |
| Body | 1.05-1.15rem | 400 | Outfit | Leading 1.8, max-width 520px |
| Small/Caption | 0.7-0.82rem | 500 | Outfit | UPPERCASE tracking 0.12-0.15em |
| Button | 0.88rem | 500 | Outfit | Tracking normal |
| KPI Number | 2.5-3rem | 600 | Cormorant | Counter animation |

## 4. Component Styling

### Buttons
- **Primary**: `bg-primary text-white rounded-full px-8 py-4` — hover: darker shade via `::after` scale-x animation.
- **Secondary**: `border border-text-main/15 rounded-full px-8 py-4` — hover: border brightens, text brightens.
- **Magnetic**: Custom `MagneticButton` wraps anchors with subtle mouse-follow transform.

### Cards
- **Feature Card**: `rounded-[2rem] border border-text-main/5 p-8-10` — hover: `border-primary/20`, gentle y-lift.
- **Program Card**: `rounded-[2.5rem] p-10` — popular variant gets `bg-primary/10 border-primary/30 shadow-primary/15`.
- **TiltCard**: Custom 3D tilt on mouse move.

### Navigation
- Fixed top, `backdrop-blur-xl` with `bg-bg/80`.
- Language dropdown with flags, click-outside-close.
- Mobile: full-screen overlay with staggered link animations.

## 5. Layout Principles

### Spacing Scale
- Section padding: `py-32 md:py-40` (8rem / 10rem)
- Content max-width: `1400px` with `px-8 md:px-12`
- Grid gaps: `gap-8 lg:gap-12` (cards), `gap-16 lg:gap-24` (hero columns)
- Component internal: `p-8` base, `p-10 md:p-16` for feature quotes

### Grid
- Hero: `lg:grid-cols-[1.2fr_1fr]`
- Programs: `md:grid-cols-3`
- Gallery: `grid-cols-2 md:grid-cols-3` with first item spanning 2 cols
- FAQ: `lg:grid-cols-[1fr_1.5fr]`
- About: `lg:grid-cols-2`

## 6. Depth & Elevation

- **Cards**: `border border-text-main/5` (subtle) → hover: `border-primary/20` + `shadow-2xl`.
- **Floating Badges**: `shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl`.
- **Popular Program**: `shadow-2xl shadow-primary/10`.
- **Navbar**: `backdrop-blur-xl bg-bg/80`.
- **Dark mode shadows**: increased opacity (0.4 vs 0.06).

## 7. Do's and Don'ts

### Do
- Use warm, Mediterranean color palette consistently
- Maintain generous whitespace between sections
- Use staggered fade-up animations for content reveals
- Keep border-radius soft (1.5-2.5rem for containers)
- Use `backdrop-blur` for floating elements
- Support both light and dark modes

### Don't
- Use cold blues or grays as primary colors
- Hardcode language strings — always use i18n system
- Use sharp corners (avoid border-radius < 0.75rem)
- Overcrowd sections — each section is a "page" in a magazine
- Use heavy drop shadows — prefer subtle border + blur
- Mix serif and sans-serif in the same heading level

## 8. Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| < 768px | Single column, full-width cards, hamburger menu |
| 768-1024px | 2-column grids, compact spacing |
| > 1024px | Full layouts, parallax effects active |

- Touch targets: minimum 44px
- Hero image: hidden on mobile (`hidden lg:block`)
- Gallery: 2 cols mobile → 3 cols desktop
- Programs comparison table: horizontal scroll on mobile

## 9. Animation System

| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| fadeUp | Scroll into view | 0.6-0.8s | [0.16, 1, 0.3, 1] |
| staggerContainer | Parent visible | 0.05s stagger | easeInOut |
| Counter | View once | 2s | easeOut |
| Parallax | Scroll progress | continuous | linear |
| Marquee | Auto | badges.length * 3.5s | linear |
| Hover lift | Mouse enter | spring(400, 25) | spring |
| Magnetic | Mouse move | spring(150, 12) | spring |
| Shine sweep | View once | 1.5s delay 2s | [0.16, 1, 0.3, 1] |

## 10. Agent Prompt Guide

Quick reference for AI agents building UI for this project:

**Colors**: Primary `#C2684A`, Secondary `#7A9E82`, Accent `#4A6D88`, Sand `#D4B483`, Bg `#FAF6F1`, Dark `#050505`

**Fonts**: Headings = `Cormorant Garamond 600`, Body = `Outfit 400`

**Borders**: Soft — `rounded-2xl` to `rounded-[2.5rem]`, thin `border-text-main/5`

**Spacing**: Generous — `py-32 md:py-40` sections, `max-w-[1400px] px-8 md:px-12`

**Animation**: Everything fades up on scroll. Use Framer Motion `variants={fadeUp}`.

**i18n**: All text via `const { t } = useTranslation()`. 13 languages.
