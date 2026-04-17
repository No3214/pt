---
name: taste
description: 2026 Taste skill — anti-AI-slop premium design. Triggers on taste, premium, dark mode, AI slop, editorial, sophisticated.
---
# Taste — 2026 Anti-AI-Slop Design

Kaynak: tasteskill.dev (Leonxlnx/taste-skill). Claude'a "good design" öğretir. Generic gradient, Inter default, neon accent = AI slop. Taste bunu kırar.

## Core Principles (3)

### 1. High-Agency Design
- Default'tan kaç — hiçbir çözüm "stock" olmaz
- Her karar bilinçli (neden bu radius? neden bu spacing?)
- Cesaret > safety (editorial > corporate)
- Opinion > consensus

### 2. Dark Premium OLED
- **Base**: `#0e1011` (true black OLED, pure #000 değil)
- **Surface**: `#16181a` (card lift)
- **Border**: `rgba(255,255,255,0.06)` (whisper)
- **Text**: `#e8e6e3` (warm off-white)
- **Muted**: `#8a8680` (desaturated warm)
- **Accent**: single brand color (no rainbow)

Feel: luxury watch case, cinema darkroom, brutalist concrete.

### 3. Zero Generic Patterns
Banned list:
- Inter for body text (AI default)
- Purple → pink gradient
- Blue → cyan gradient
- Emoji as section icon
- Glassmorphism rainbow
- Neon accent without reason
- Center-aligned long paragraphs
- Rounded-full on everything
- Shadow-lg on every card
- Duolingo-style illustration
- Stock Unsplash hero
- "Tailwind UI default" layout

## 6-Category Diagnostic

### 1. Layout
- Asymmetric composition (break grid intentionally)
- Whitespace generous (premium = breathing)
- Editorial newspaper inspiration
- Hero break from container (full-bleed)
- Z-scan path engineered
- Anchor + focal point discipline

### 2. Typography
- Serif display + sans body (or mono accent)
- Custom font (not Google Fonts default)
- Weight contrast extreme (300 vs 900)
- Italic for emphasis (not bold abuse)
- Measure 55–65ch (tighter premium)
- Drop cap hero (editorial)
- Mixed alignment (not all center)

### 3. Color
- 3 tones max (mono + accent + neutral)
- OKLCH perceptual mixing
- No pure #FFFFFF bg (warm tint #FAF6F1)
- No pure #000000 text (warm black #1a1613)
- Accent used ≤5% of screen
- Semantic colors desaturated (not saturated)

### 4. Spacing
- 8pt grid strict
- Section padding 128px+ desktop (spacious)
- Card padding 32–48px (generous)
- Gap between related 16px, between sections 96px+
- Vertical rhythm baseline fixed
- Margin > padding for separation

### 5. Motion
- Subtle spring (not bounce spectacle)
- 400–600ms preferred
- Easing cubic-bezier(0.22, 1, 0.36, 1) — "premium ease"
- No parallax (overused)
- Video silent auto-play only if essential
- Scroll-driven CSS (not JS library)

### 6. Accessibility
- Contrast AAA on critical text (7:1)
- Focus ring custom (not browser default)
- Keyboard nav thoughtful order
- Screen reader tested
- Touch 48×48 (not minimum 44)
- Motion reduced respected

## 3 Adjustable Dials

### Dial 1: Contrast (0–100)
- 0: monochrome subtle
- 50: balanced
- 100: high drama (display hero)

### Dial 2: Density (0–100)
- 0: spacious luxury (PT default)
- 50: comfortable
- 100: information dense (dashboard)

### Dial 3: Warmth (0–100)
- 0: cool minimal (tech)
- 50: neutral
- 100: warm editorial (PT = 70-80, Akdeniz)

## 7 Skill Variants

### Taste: Editorial
Newspaper/magazine inspiration.
- Drop caps, pull quotes
- Mixed column width
- Serif dominant
- Hand-picked imagery

### Taste: Brutalist
Raw concrete feel.
- Mono font prominent
- Grid exposed
- Hard edges, no radius
- Black + white + one accent

### Taste: Swiss
Modernist precision.
- Helvetica/Inter restraint
- Strict grid
- Asymmetric balance
- Primary colors sparingly

### Taste: Japanese Minimal
Muji/Kinfolk aesthetic.
- Negative space dominant
- Single accent natural tone
- Thin weight typography
- Horizontal rhythm

### Taste: Dark Premium (PT preferred for admin)
OLED luxury.
- `#0e1011` base
- Single accent (#C8A97E for PT)
- Serif display
- Sharp shadows

### Taste: Editorial Warm (PT landing)
Akdeniz feel.
- Sand + gold + warm black
- Serif italic display
- Generous whitespace
- Hand-texture subtle

### Taste: Technical
Documentation/tool feel.
- Mono font heavy
- Code-as-art
- Minimal color
- Dense information

## AI Slop Signatures (Detect + Reject)

### Visual
- Default Tailwind card + shadow-lg + rounded-lg
- Inter everywhere
- Blue button primary
- Gray-50 bg, gray-900 text
- 3-column feature grid with icons + title + description
- Hero: gradient + big text + 2 buttons
- Pricing: 3 tier card with checkmarks
- Footer: 4 column links

### Code
- Every component has `cn(className, baseStyles)`
- All icons from Lucide default
- shadcn/ui unmodified
- className with 20+ utility classes inline

### Copy
- "Transform your workflow"
- "Supercharge your productivity"
- "Join thousands of users"
- "Built for modern teams"

## Fix Strategy

### From AI Slop → Taste
1. **Remove Inter** → serif display + distinctive sans
2. **Kill gradient** → solid warm surface + subtle border
3. **Break 3-col grid** → asymmetric hero
4. **Decrease radius** → sharp or signature (PT = 40px)
5. **Amplify whitespace** → section padding 128px+
6. **Single accent** → delete secondary colors
7. **Custom illustration** → photo + texture overlay
8. **Editorial copy** → specific, sensory, human

## PT Application

### Landing (Editorial Warm)
- Cormorant Garamond italic hero
- #FAF6F1 warm bg
- #C8A97E sand accent only
- Asymmetric hero (text left, image right, offset)
- Full-bleed section breaks

### Admin (Dark Premium)
- `#0e1011` base
- `#C8A97E` metric accent
- Mono font for numbers
- Sharp 16px radius cards
- Data-dense OK (density dial 70)

### Portal (Editorial + dash hybrid)
- Warm bg section + dark accent panel
- Serif welcome h1
- Sans data
- Single brand accent

## Taste Scorecard (0–100)

| Category | PT Landing Target | Admin Target |
|----------|-------------------|--------------|
| Layout   | 90                | 80           |
| Typography | 95             | 85           |
| Color    | 90                | 92           |
| Spacing  | 92                | 80           |
| Motion   | 85                | 75           |
| A11y     | 95                | 95           |
| **Total**| **91**            | **84**       |

## Anti-Slop Checklist
- [ ] No Inter on body (unless explicit choice)
- [ ] No purple/pink gradient
- [ ] No stock Unsplash hero
- [ ] Custom accent color decision documented
- [ ] Typography pair explained (why serif+sans)
- [ ] At least 1 asymmetric composition
- [ ] Whitespace > content ratio section ≥1.5
- [ ] Dark mode separate palette (not inverted)
- [ ] Motion justified (purpose per animation)
- [ ] Copy specific (no "transform workflow" slop)
