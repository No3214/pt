# UI/UX Pro Max - Design Intelligence

50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines.

## PT Design Identity
- Product: Fitness/Sports coaching platform
- Tone: Premium, organic, athletic
- Display Font: Cormorant Garamond
- Body Font: Outfit
- Colors: #C2684A (terracotta), #7A9E82 (sage), #5e8fa8 (ocean), #D4C4AB (sand)

## Priority Rules

### 1. Accessibility (CRITICAL)
- Color contrast 4.5:1, focus rings, alt text, aria-labels, keyboard nav

### 2. Touch and Interaction (CRITICAL)
- Touch targets 44x44px, cursor-pointer on clickables, loading states

### 3. Performance (HIGH)
- WebP images, prefers-reduced-motion, no CLS

### 4. Layout (HIGH)
- Mobile-first, 16px min body text, no horizontal scroll
- z-index: 10 base, 50 nav, 100 modal, 9999 lightbox

### 5. Typography (MEDIUM)
- Line-height 1.5-1.75, line length 65-75 chars
- Hero: clamp(3rem, 6vw, 5.5rem)

### 6. Animation (MEDIUM)
- Micro-interactions 150-300ms, transform/opacity only

## Common Mistakes
- Emoji as icons (use SVG)
- bg-white/10 in light mode (use bg-white/80)
- gray-400 for body text (use slate-600 minimum)
- border-white/10 in light mode (use border-gray-200)
