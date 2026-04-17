---
name: react-best-practices
description: React 19 + TS 5.6 performance patterns for PT. Triggers on react, performans, rerender, memo, suspense, actions, useOptimistic.
autoTrigger: true
---
# React Best Practices — 2026 (React 19 + TS 5.6)

50+ rules organized by impact for the PT React 19 app. Opus 4.7 ile yazılmış.

## Critical (Bundle + LCP)
1. **Server/Client split belli olsun** — 'use client' sadece state/effect/event handler olan bileşenlere
2. **use() hook ile Suspense okumaları** — promise'i prop olarak geç, bileşen içinde `const data = use(promise)` (ör. useStudent profili)
3. **React.lazy + Suspense boundary** — Admin, Portal, Builder, Assessment route'ları ayrı chunk
4. **Promise.all / Promise.allSettled** — Sıralı await YASAK. Supabase fetch'leri paralel
5. **Direct imports, barrel file yok** — `import X from 'pkg/subpath'` (tree-shake kırılıyor)
6. **Dynamic import heavy deps** — framer-motion, recharts, three → route-level lazy

## High (INP + CLS + Stability)
7. **React 19 Actions + useActionState** — form submit'lerde. Pending/error state otomatik
8. **useOptimistic** — Booking create, WellnessLog save, Habit toggle için instant feedback
9. **useFormStatus** — submit button'un pending state'i form ağacından otomatik
10. **useTransition** — heavy filter/sort işlemleri (StudentManager arama)
11. **useDeferredValue** — search input → list filtresi (500+ kayıt)
12. **Images: WebP/AVIF, explicit width+height, loading=lazy, fetchpriority=high LCP'ye, srcset responsive**
13. **CSS contain: layout paint** — scroll container'larda (RecipeList, WorkoutLog)
14. **content-visibility: auto** — fold dışı section'larda (About, Programs listesi)

## Medium (DX + Correctness)
15. **ref as prop (React 19)** — `forwardRef` gerekmiyor. `function Card({ ref, ... })`
16. **Document metadata in-component** — `<title>`, `<meta>` direkt JSX'de (React 19 hoisting)
17. **Stylesheet precedence** — `<link rel="stylesheet" precedence="default">` çakışma yok
18. **No inline object/arrow in JSX props** — `onClick={handleClick}`, `style={stableStyle}`
19. **Stable keys (UUID/slug)** — index YASAK (reorder, add/remove bug)
20. **Effect cleanup + abort signal** — `fetch(url, { signal })`, return unmount
21. **Debounce user input (300ms)** + useDeferredValue kombinasyonu
22. **Suspense + ErrorBoundary** her route'ta ikili — fallback + reset action

## PT-Specific
- **Zustand selector + shallow** — `useStore(s => s.darkMode, shallow)` — tüm store değişince rerender YASAK
- **Framer Motion 11** — sadece transform+opacity, `prefers-reduced-motion` respect, `viewport={{ once: true }}`
- **Supabase realtime** — tek channel, cleanup'ta `removeChannel`, exponential backoff
- **i18n** — `useTranslation()` memoize edilmiş, locale dosyaları static import (code-split 13 dil)
- **Bundle budget** — initial JS ≤180KB gzip, LCP ≤2.0s, INP ≤150ms, CLS ≤0.05

## React 19 Yeni Pattern'ler (Kullan)
```tsx
// 1) Action + useActionState
const [state, formAction, isPending] = useActionState(saveBooking, null);
<form action={formAction}>...</form>

// 2) useOptimistic
const [optimistic, setOptimistic] = useOptimistic(bookings, (curr, newB) => [...curr, newB]);

// 3) use() + Suspense
function Profile({ promise }: { promise: Promise<Student> }) {
  const student = use(promise);
  return <div>{student.name}</div>;
}

// 4) ref as prop
function Input({ ref, ...props }: { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}
```

## Anti-Patterns (YASAK)
- `console.log` production
- `any`, `@ts-ignore`, `@ts-nocheck`
- Inline arrow/object JSX prop (memoized component'i bozar)
- `useEffect` ile derived state (use `useMemo` veya event handler)
- `useLayoutEffect` gereksiz (sadece DOM ölçümünde)
- Barrel file (`src/components/index.ts` re-export her şey)
- `forwardRef` (React 19'da deprecate — ref as prop)
- `useMemo`/`useCallback` ölçmeden (React Compiler gelecek)
- index as key, unstable sort
- Zustand'da tüm store'u `useStore()` ile çekmek

## Ölçüm
- Chrome DevTools → Performance → INP track
- `web-vitals` lib: CLS + LCP + INP raporla
- Lighthouse CI: PR gate (score ≥95)
- Bundle analyzer: `rollup-plugin-visualizer`
