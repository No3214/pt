---
name: code-audit
description: Audit React/TS code quality, security, performance. Triggers on review, bug, hata, güvenlik, security.
autoTrigger: true
---
# Code Audit — Ela Ebeoğlu PT
## Stack: React 19 + TS 5.8 + Vite 6 + Zustand 5 + Framer Motion + Tailwind 3
## Security: XSS .replace(/[<>]/g,''), no dangerouslySetInnerHTML, API keys via proxy only
## TS: no `any`, no @ts-ignore, explicit interfaces, strict mode
## React 19: createPortal for modals, Error boundaries per route, lazy+Suspense
## Zustand: focused selectors useStore(s=>s.field), persist essential only
## Perf: loading=lazy images, React.memo pure components, stable keys, will-change-transform