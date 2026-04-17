---
name: performance-audit
description: 2026 Core Web Vitals + React 19 performans audit for PT. Triggers on hız, performans, speed, slow, yavaş, LCP, INP, CLS, lighthouse.
autoTrigger: true
---
# Performance Audit — 2026 (Core Web Vitals v4)

## Targets (2026 Aggressive)
- **LCP** ≤ 2.0s (önceki 2.5s deprecate)
- **INP** ≤ 150ms (FID yerine primary; 200ms yeşil → 150ms excellent)
- **CLS** ≤ 0.05 (önceki 0.1)
- **TTFB** ≤ 600ms (Cloudflare edge ile 200ms mümkün)
- **FCP** ≤ 1.2s
- **TBT** ≤ 150ms

## Images (LCP Critical)
- **Format**: AVIF > WebP > JPEG. `<picture>` fallback
- **Sizing**: explicit width + height (CLS önler)
- **Lazy**: `loading="lazy"` fold dışı; `fetchpriority="high"` LCP image
- **Responsive**: `srcset` + `sizes` ile 1x/2x/3x
- **Boyut**: hero ≤200KB, card ≤50KB, icon inline SVG
- **CDN**: Cloudflare Images / imgproxy transform
- **Preload**: LCP image `<link rel="preload" as="image" fetchpriority="high">`

## React 19 Performance
- **React Compiler** — Vite plugin aktif (`babel-plugin-react-compiler`). useMemo/useCallback çoğu yerde gereksiz
- **use() + Suspense** — waterfall kır, parallel data fetch
- **Server Components** gelecek (SSR gerektiğinde)
- **useTransition** — heavy computation pending state
- **useDeferredValue** — input → list filter throttle
- **Concurrent rendering** — automatic prioritization

## Code Splitting
- **Route-level**: `React.lazy(() => import('./pages/Admin'))`
- **Heavy deps**: framer-motion + recharts + three → ayrı chunk
- **Locale**: 13 dil dynamic import (`import(\`./locales/\${lang}.ts\`)`)
- **Vite manualChunks**: vendor/ui/chart ayrıştır
- **Preload critical**: `<link rel="modulepreload">`

## Bundle Budget
- **Initial JS** ≤ 180KB gzip (önceki 200)
- **Route chunk** ≤ 100KB gzip
- **CSS** ≤ 30KB gzip
- **Font** ≤ 40KB subset + `font-display: swap` + `unicode-range`
- **Total transferred** ≤ 500KB homepage

## Animations
- **Transform + opacity** only (compositor layer)
- **will-change**: sadece aktif animasyon boyu, sonra kaldır
- **CSS animation-timeline: scroll()** — native, JS listener yok
- **Framer Motion**: `layoutId` dikkatli (reflow), `viewport={{ once: true }}` reveal
- **prefers-reduced-motion** respect: 0.01ms duration
- **60fps sabit** — Chrome Rendering Paint flashing gözlem

## CSS Performance
- **contain**: `layout paint` scroll container
- **content-visibility: auto** — fold dışı section (render budget)
- **container queries** > media query (layout native responsive)
- **@layer** cascade order kontrol
- **CSS nesting** native (SCSS kaldır, bundle +0)

## Network
- **HTTP/3 + QUIC** (Cloudflare default)
- **Early Hints** 103 (preload hint before HTML)
- **Preconnect**: `<link rel="preconnect" href="https://supabase.co">`
- **DNS-prefetch**: tertiary domain
- **Cache-Control**: immutable static asset, stale-while-revalidate HTML

## Supabase
- Single realtime channel (birden fazla sub yük)
- Cleanup `removeChannel` unmount
- Row-level cache + `staleTime` TanStack Query
- Pagination cursor-based (offset YASAK)
- Select `.select('id, name')` sadece gerekli alanlar

## Font Loading
- `font-display: swap` (block YASAK)
- Subset: `unicode-range: U+0000-00FF, U+0100-017F` (Turkish)
- `<link rel="preload" as="font" crossorigin>` critical font
- Variable font tek dosya (weight range)

## Monitoring
- **web-vitals** lib v4 (INP + LCP + CLS track)
- **RUM**: Cloudflare Web Analytics (zero-cost)
- **Lighthouse CI**: PR gate score ≥95
- **Bundle analyzer**: `rollup-plugin-visualizer`
- **Chrome DevTools Performance panel** (Scripting vs Rendering)

## PT Ölçülmüş Hedefler
- Landing: LCP 1.4s, INP 80ms, CLS 0.02
- Portal: LCP 1.8s (auth overhead), INP 120ms
- Admin: route-lazy 85KB chunk, TTI 2.5s

## Audit Komutları
```bash
npm run build                     # bundle report
npm run preview                   # prod build test
npx lighthouse http://localhost:4173 --view
npx vite-bundle-visualizer        # chunk analizi
```

## Optimizasyon Sırası
1. **Measure first** — tahmin yok, profiler sonucu
2. **LCP image** optimize → en büyük kazanç
3. **Route split** → initial JS küçült
4. **Third-party kaldır** (Google Fonts → self-host)
5. **Image CDN** + AVIF
6. **Prefetch/preload** critical
7. **Compiler + React 19 pattern**
