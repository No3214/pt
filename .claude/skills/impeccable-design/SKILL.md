---
name: impeccable-design
description: 2026 Impeccable design vocabulary — 18 command PT. Triggers on polish, audit, typeset, critique, harden, layout, shape.
---
# Impeccable Design — 2026 PT

Kaynak: impeccable.style (pbakaus/impeccable). Design vocabulary + /polish command set. PT UI'yi "shipper" kalitesine çıkarır.

## Core Philosophy
- **Deterministic rules** — tahmin yok, ölçülmüş kural
- **Design dimensions** — typography, color, spacing, layout, motion, quality, hierarchy
- **Shipping-ready** — ESS check her polish sonrası

## Commands (18)

### /polish (primary)
Tüm 25 rule'u uygular, quick wins.
```
Execute: typography scale check + color contrast + spacing audit + hierarchy fix
Output: diff + before/after + ESS score
```

### /audit
Full design audit raporu — 7 dimension breakdown.
```
Scoring:
- Typography: scale, pairing, line-height, measure
- Color: contrast, palette, semantic
- Spacing: 8pt grid, rhythm, breathing
- Layout: composition, hierarchy, asymmetry
- Motion: timing, physics, reduced-motion
- Quality: accessibility, polish, detail
- Hierarchy: focal point, scan path, weight
```

### /typeset
Typography specialist — scale, rhythm, measure.
- Perfect Fourth (1.333) veya Major Third (1.25)
- Line-height 1.5–1.75 body, 1.1–1.3 display
- Measure 65–75ch optimal reading
- text-wrap: balance h1/h2
- text-wrap: pretty paragraph
- Font pairing serif + sans, NOT Inter everywhere

### /overdrive
Maximum polish — every detail. Bu PT landing için kullanılır.
- Kerning, tracking, leading perfect
- Micro-interactions on every clickable
- Gradient + shadow + glow composed
- Border radius scale disciplined
- Asymmetric composition when appropriate

### /distill
Minimal version — reduce to essentials.
- Remove decorative elements
- Simplify palette (3 colors max)
- One primary CTA per screen
- Whitespace dominant

### /bolder
Weight + contrast amplify.
- Display ≥64px hero
- Font-weight 800-900 display
- Color saturation bump
- Contrast ratio ≥7:1 (AAA)

### /harden
Accessibility + robustness.
- Focus ring visible all clickable
- Contrast AA minimum, AAA preferred
- Keyboard nav complete
- Screen reader tested
- prefers-reduced-motion respect
- Error state + empty state + loading state

### /layout
Composition + grid.
- 12-col grid desktop, 4-col mobile
- 8pt spacing rhythm
- Asymmetric hero (break grid)
- Z-pattern eye scan
- Fibonacci golden ratio section

### /shape
Corner radius + silhouette discipline.
- Scale: 4 / 8 / 16 / 24 / 40 (PT signature 40)
- Consistent within component
- Outer ≥ inner radius
- No jarring 4px + 32px mix

### /critique
Harsh but constructive review.
- What works
- What fails (specific + severity)
- Fix priority order
- Reference comparison

### /impeccable extract
Extract design tokens from screenshot/image.
- Color palette
- Typography scale
- Spacing rhythm
- Shadow system
- Outputs Tailwind config

## 25 Deterministic Rules

### Typography (6)
1. Max 2 font families per page (display + body)
2. Never Inter + Roboto default alone (AI slop signature)
3. text-wrap: balance h1 + h2
4. Measure 45–75ch (reading comfort)
5. Line-height 1.5+ body, 1.1–1.3 display
6. Letter-spacing: tight display (-0.02em), normal body, wide badge (0.3em uppercase)

### Color (5)
7. Contrast ≥4.5:1 text, ≥3:1 UI
8. OKLCH > HSL > HEX (perceptual)
9. Palette 3 semantic: neutral + brand + accent
10. No pure #000 on #FFF (warm #1a1a1a on #FAF6F1)
11. Dark mode = separate palette, not inverted

### Spacing (4)
12. 8pt grid strict (4, 8, 16, 32, 64, 128)
13. Section padding ≥ 64px desktop, ≥ 48px mobile
14. Card padding = 24-32px
15. Vertical rhythm = font-size × 1.5 baseline

### Layout (4)
16. Max-width 1400px container
17. Mobile-first 375px baseline
18. 12-col grid desktop
19. Asymmetric hero (editorial feel)

### Motion (3)
20. Spring physics, not linear
21. Duration 200–600ms UI, 1200ms ambient
22. Transform + opacity only (GPU)

### Quality (3)
23. Focus ring custom every clickable
24. Loading + empty + error state every fetch
25. Touch target ≥44×44px

## Anti-Patterns (Flag + Fix)

### Color
- Purple gradient hero (played out)
- Blue-to-pink gradient (Twitter 2020)
- #6B7280 text on #F9FAFB (low contrast)
- Neon green accent (unless brand)

### Typography
- Inter on everything (AI default)
- Roboto + Open Sans combo (dated)
- All uppercase body (illegible)
- Font-size <14px body
- Center-aligned long paragraphs

### Layout
- Card inside card inside card (nesting)
- Same elevation shadow everywhere
- Symmetric perfect (boring)
- No whitespace (dense)
- Fixed-width centered (not modern)

### Shape
- border-radius: 4px on everything (generic)
- Mixing 50% + 4px + 32px (chaos)
- Inner > outer radius (wrong visual)

### Motion
- Linear easing (robotic)
- Bounce everywhere
- Auto-play hero video (battery)
- Parallax on mobile (jank)

## Design Dimensions (7)

### 1. Typography
Scale, pairing, hierarchy, measure, rhythm.

### 2. Color
Palette, contrast, semantic, OKLCH, dark mode.

### 3. Spacing
8pt grid, rhythm, breathing, density.

### 4. Layout
Composition, grid, asymmetry, focal point.

### 5. Motion
Timing, physics, purpose, reduce.

### 6. Quality
A11y, polish, detail, state.

### 7. Hierarchy
Weight, size, color, position, scan path.

## Supported Color Spaces (2026)
- OKLCH (preferred) — perceptual uniform
- OKLAB — perceptual cartesian
- LCH — CIE based
- LAB — CIE cartesian
- P3 gamut — modern display
- sRGB fallback — legacy

```css
color: oklch(70% 0.12 60);
background: color-mix(in oklch, var(--primary) 80%, white);
```

## /polish Workflow (PT Specific)
1. Read target component/page
2. Run 7-dimension audit
3. Apply fixes (severity ordered)
4. Verify contrast + a11y
5. Check mobile 375px
6. Verify 13 dil i18n (PT requirement)
7. Test dark mode parity
8. Output diff + ESS score

## ESS (Execution Shipping Score)
- 90+: ship ready
- 75–89: minor polish
- 60–74: needs revision
- <60: major work required

## Integration with PT
- Use /polish on every landing section before merge
- /audit PT design tokens quarterly
- /harden all admin pages (WCAG 2.2 AA)
- /overdrive hero + booking CTA
- /typeset ElaDivider, hero h1, section headers
