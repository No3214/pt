# UI Design System Skill

Design tokens and component patterns for PT platform.

## Color Tokens
- --color-primary: #C2684A (terracotta) - CTAs, highlights
- --color-secondary: #7A9E82 (sage) - success, health
- --color-accent: #5e8fa8 (ocean) - info, links
- --color-sand: #D4C4AB - warm neutral
- --color-bg: #FAF6F1 (light) / #050505 (dark)
- --color-surface: #FFFFFF (light) / #0c0c0c (dark)
- --color-text: #1C1917 (light) / #e6e6e6 (dark)

## Typography
- Display: Cormorant Garamond, Georgia, serif
- Body: Outfit, system-ui, sans-serif
- Hero: clamp(3rem, 6vw, 5.5rem)
- Section title: clamp(2.5rem, 4vw, 3.8rem)
- Badge: 0.75rem uppercase tracking-[0.2em]

## Spacing (8pt grid)
- Section padding: px-8 md:px-12, py-32 md:py-40
- Card radius: rounded-3xl or rounded-[2.5rem]
- Container: max-w-[1400px] mx-auto

## Motion
- --transition-speed: 0.4s
- --transition-ease: cubic-bezier(0.22, 1, 0.36, 1)
- Spring: stiffness 400, damping 25

## Component Patterns
- Glass card: card-glass rounded-3xl backdrop-blur-12px
- Gradient text: apple-gradient-text class
- Section: py-32 md:py-40 bg-bg-alt border-y border-text-main/5
