---
name: web-performance
description: 2026 Core Web Vitals v4 + React 19 performance PT. Triggers on performance, hız, speed, optimize, LCP, INP, CLS.
autoTrigger: true
---
# Web Performance — 2026 PT

## Core Web Vitals v4 (2026 Target)
- **LCP** ≤ 2.0s (önceki 2.5s)
- **INP** ≤ 150ms (FID deprecate)
- **CLS** ≤ 0.05 (önceki 0.1)
- **TTFB** ≤ 600ms (Cloudflare edge)
- **FCP** ≤ 1.2s
- **Bundle** ≤ 180KB gzip initial

## Image (LCP Critical)
- **Format priority**: AVIF > WebP > JPEG/PNG fallback
- **Explicit dimensions** — width + height (CLS prevent)
- **Lazy**: `loading="lazy"` fold dışı; `fetchpriority="high"` LCP image
- **Preload** LCP: `<link rel="preload" as="image" fetchpriority="high" imagesrcset="...">`
- **Responsive srcset**: `1x`, `2x`, `3x` veya `w` descriptor + `sizes`
- **Size**: hero ≤200KB, card ≤50KB, thumbnail ≤20KB
- **CDN**: Cloudflare Images on-the-fly transform
- **Decoding async**: `decoding="async"`

## Code Splitting
- **Route-level** — React.lazy every page
- **Heavy deps** chunk: framer-motion, recharts, three, pdfjs
- **Locale lazy** — 13 dil dynamic import (sadece active yüklenir)
- **Vite manualChunks** — vendor/ui/chart separate
- **Preload critical** — `<link rel="modulepreload">`
- **Prefetch idle** — `<link rel="prefetch">` next route

## Bundle Budget
- Initial JS ≤180KB gzip
- Route chunk ≤100KB
- CSS ≤30KB
- Font ≤40KB subset + `font-display: swap`
- Total transfer ≤500KB homepage

## CSS Performance
- **contain**: `layout paint` scroll container
- **content-visibility: auto** — fold dışı section
- **Container queries** > media queries
- **@layer** cascade order kontrol
- **CSS nesting** native (SCSS kaldır, bundle −0)
- **Scroll-driven animation** CSS native (JS yok)

## JavaScript
- **Tree-shake**: direct import (no barrel)
- **Defer analytics + non-critical script**
- **React Compiler** — auto memo (Vite plugin)
- **Debounce + useDeferredValue** search
- **Throttle scroll handler** 16ms (60fps)

## Network (Cloudflare)
- **HTTP/3 + QUIC** default
- **Early Hints 103** — preload hint before HTML
- **preconnect** critical origin (Supabase, CDN)
- **dns-prefetch** tertiary
- **Cache-Control** immutable static, SWR HTML
- **Brotli** compression (vs gzip daha küçük)

## Font Loading
- `font-display: swap` (block YASAK)
- Subset `unicode-range: U+0000-00FF, U+0100-017F` (Turkish)
- `<link rel="preload" as="font" crossorigin>` critical
- Variable font (tek dosya weight range)
- Self-host (Google Fonts → local + PrivacyPreservingFetch)

## Supabase
- Single realtime channel + cleanup
- Pagination cursor-based (no offset)
- Select only needed columns `.select('id, name')`
- Row-level cache (TanStack Query `staleTime`)

## React 19 Performance
- **React Compiler** auto-memoize
- **use() + Suspense** parallel data fetch
- **useTransition** — heavy compute pending
- **useDeferredValue** — throttle input → list
- **Concurrent rendering** auto priority

## Monitoring
- **web-vitals v4** (INP + LCP + CLS report)
- **RUM**: Cloudflare Web Analytics (free, privacy-safe)
- **Lighthouse CI** PR gate score ≥95
- **Bundle analyzer** `rollup-plugin-visualizer`
- **Chrome DevTools Performance** panel

## Optimization Order
1. **Measure first** — profiler, tahmin yok
2. **LCP image** optimize — en büyük kazanç
3. **Route split** — initial JS küçült
4. **Third-party kaldır** (Google Fonts self-host)
5. **Image CDN + AVIF**
6. **Prefetch/preload** critical
7. **React Compiler + React 19 pattern**

## Tooling
```bash
npm run build                      # bundle report
npm run preview                    # prod build test
npx lighthouse https://... --view
npx vite-bundle-visualizer
npx @unlighthouse/cli --site ...   # site-wide
```

## PT Ölçülmüş Hedefler
- Landing: LCP 1.4s, INP 80ms, CLS 0.02
- Portal: LCP 1.8s (auth overhead), INP 120ms
- Admin: route-lazy 85KB chunk, TTI 2.5s

## Anti-Pattern
- Premature useMemo/useCallback (profile first)
- Synchronous DOM access in render
- Large list no virtualization
- Image no dimension (CLS bomb)
- Font-display block (FOIT)
- Inline `<script>` large (block parser)
- Third-party no async/defer
- Missing HTTP/2 push → preload hint instead
