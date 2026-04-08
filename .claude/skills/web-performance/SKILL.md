# Web Performance Optimization Skill

Performance targets and optimization for PT platform.

## Core Web Vitals Targets
- LCP: under 2.5s
- FID/INP: under 100ms
- CLS: under 0.1
- TTI: under 3.5s
- Bundle: initial JS under 200KB gzipped

## Image Optimization
- Format: WebP primary, AVIF where supported
- Lazy loading: loading="lazy" for below-fold
- Dimensions: explicit width/height (prevent CLS)
- Responsive: srcset with multiple sizes
- Compression: 80% quality WebP

## Code Splitting
- Route-level: React.lazy for admin, portal pages
- Component-level: lazy load AIChat, heavy charts
- Vendor: separate chunk for large deps

## CSS Performance
- Tailwind purge: remove unused classes in production
- Critical CSS: inline above-fold styles
- Fonts: preload display font (Cormorant Garamond)
- Avoid: layout-triggering properties in animations

## JavaScript
- Tree shaking: direct imports, no barrel files
- Defer: analytics, non-critical scripts
- Memoize: expensive computations only when measured
- Debounce: search inputs, scroll handlers

## Caching (Cloudflare)
- Static assets: Cache-Control max-age=31536000, immutable
- HTML: no-cache (always fresh)
- API: short TTL or no-cache
- Service worker: precache critical routes

## Monitoring
- Lighthouse CI in deploy pipeline
- Real User Monitoring via Cloudflare Analytics
- Bundle analyzer: npm run build -- --report
