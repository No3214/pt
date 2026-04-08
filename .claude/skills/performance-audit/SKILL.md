---
name: performance-audit
description: Web performance and Core Web Vitals optimization. Triggers on hız, performans, speed, slow, yavaş.
autoTrigger: true
---
# Performance — Ela Ebeoğlu PT
## Targets: LCP<2.5s, FID<100ms, CLS<0.1, INP<200ms
## Images: WebP, loading=lazy, explicit width/height, <100KB
## Code split: React.lazy admin/portal pages, Suspense+Skeleton
## Animations: only transform+opacity, will-change, viewport once, prefers-reduced-motion
## Bundle: <200KB gzipped initial, tree-shake icons, dynamic import heavy libs