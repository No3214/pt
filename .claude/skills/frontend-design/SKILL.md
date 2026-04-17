---
name: frontend-design
description: 2026 frontend aesthetic direction for PT. Triggers on tasarım, design, UI, aesthetic, look, stil.
autoTrigger: true
---
# Frontend Design — 2026 Aesthetic

Distinctive, production-grade interfaces. AI-slop aesthetic YASAK (purple gradient + Inter + generic cards).

## 2026 Design Trends (Uygula)
1. **Bento grid asymmetric** — farklı boyut cell, düzensiz ama dengeli
2. **Liquid glass + backdrop-blur** — Apple visionOS etkisi. `backdrop-filter: blur(24px) saturate(180%)`
3. **Conic gradient borders** — ShineBorder pattern, 10-20s rotate
4. **Noise/grain overlay** — `mix-blend-overlay` + SVG noise, texture + filmic feel
5. **Scroll-driven animations** — CSS `animation-timeline: scroll()` (native, JS yok)
6. **View Transitions API** — page/route geçişleri smooth (`document.startViewTransition`)
7. **Dynamic color P3** — `color(display-p3 ...)` wide gamut
8. **Container queries** — `@container (width > 480px)` — media query ötesinde
9. **CSS @scope + nesting** — component-scoped stil SCSS olmadan
10. **Text-wrap: balance / pretty** — başlık/paragraf tipografi polish

## Design Thinking Pipeline
- **Purpose**: Kullanıcı hangi duyguyu hissetmeli? (güven, akdeniz sıcaklığı, sporcu enerjisi, premium sessizlik)
- **Tone extreme**: Pick ONE. Akdeniz editorial / brutalist minimal / retro-futuristic / luxury quiet. Orta yol YASAK.
- **Differentiation**: Rakip PT siteleri ne yapıyor? Bunun tam zıttını yap.
- **Constraint**: 3 font max, 5 renk max. Aksi halde noise.

## Typography
- **Display**: Cormorant Garamond (serif, italic vurgu). Clamp `clamp(2.5rem, 5vw, 5.5rem)`
- **Body**: Outfit / Satoshi / Geist Sans
- **Mono**: JetBrains Mono / Berkeley Mono (sayı, metrik)
- **YASAK**: Arial, Roboto, Inter (default AI), Helvetica Neue generic
- **text-wrap: balance** h1/h2'de, `pretty` paragraph'ta

## Color — PT Tokens
```css
--primary: #C8A97E;    /* Akdeniz kum */
--secondary: #8B7355;   /* Koyu toprak */
--accent: #D4A574;      /* Sıcak altın */
--sand: #D4C4AB;
--bg-light: #FAF6F1;
--bg-dark: #050505;
--success: #7A9E82;     /* Sage */
--focus: #5e8fa8;       /* Ocean */
```
- P3 gamut: `color(display-p3 0.78 0.66 0.49)` primary
- Opacity layer: `color-mix(in oklch, var(--primary) 20%, transparent)`
- Oklch manipulation: `oklch(from var(--primary) calc(l * 1.1) c h)`

## Motion — Framer Motion 11 + CSS scroll()
- Transform + opacity YALNIZCA (GPU). Layout prop YASAK hotpath'te
- Stagger: 0.08–0.12s child delay
- Spring: `{ type: 'spring', stiffness: 380, damping: 28 }`
- Scroll reveal: `whileInView + viewport={{ once: true, amount: 0.3 }}`
- CSS native: `animation-timeline: scroll()` — progress bar, parallax, fade-on-scroll
- `prefers-reduced-motion` RESPECT — animation-duration: 0.01ms

## Composition
- **Bento asymmetric grid** — `grid-template: 2fr 1fr 1.5fr / repeat(3, 1fr)` gibi düzensiz
- **Overlap + z-index story** — kartlar üst üste, scroll ile açılır
- **Diagonal flow** — `transform: rotate(-2deg)` section'larda, eyeline kırılır
- **Negative space aggressive** — 40-60% whitespace, cluttered YASAK
- **Viewport sectioning** — her section kendine ait visual moment

## Backgrounds
- Mesh gradient: `radial-gradient` stack 3-4 adet, blur-3xl
- SVG noise overlay: 0.03 opacity, `mix-blend-overlay`
- Geometric: grid/dot pattern `url("data:image/svg+xml...")`
- Grain: `filter: contrast(1.1) brightness(0.98)` + noise texture

## PT Project Uygulama
- Hero: Cormorant serif headline + Spotlight SVG + volleyball floaters (parallax)
- Programs: ShineBorder popular card (conic gradient 10s rotate)
- BookingCTA: Card3D tilt (mouseMove → rotateX/Y + translateZ)
- Stats: Counter + progress bar scaleX on enter
- About: TiltCard + trust indicator stack

## Anti-Patterns (YASAK)
- Inter + purple gradient + white bg (AI slop signature)
- Bootstrap/Material pattern kopyası
- Generic card: white bg + gray border + drop shadow + rounded-lg
- Emoji icon (✓ ✗ → SVG icon kullan)
- `#000` text on `#FFF` bg (use warm tones: `#1a1a1a` on `#FAF6F1`)
- Stock aesthetic (gradient button + generic illustration)
- Aynı font tüm site (display/body ayrımı olmalı)

## Quality Gates
- Chrome DevTools → Rendering → Paint flashing (minimal)
- Lighthouse Design score ≥95
- Motion audit: 60fps sabit, jank yok
- Color contrast WCAG AA (4.5:1) her text/bg kombinasyonu
- Mobile 375px perfect (touch 44x44 min)
