---
name: senior-frontend
description: 2026 senior-level frontend toolkit PT (React 19 + TS 5.6 + Vite 6). Triggers on frontend, UI, component, performance.
---
# Senior Frontend — 2026 PT

## Stack (Locked)
React 19 · TS 5.6 · Vite 6 · Tailwind 3 · Zustand 5 · Framer Motion 11 · Supabase 2 · Cloudflare Pages

## Component Architecture
- **Functional + hooks only**
- **React.lazy + Suspense** route
- **ErrorBoundary** route-level
- **'use client' minimal** — only interactive
- **ref as prop** — forwardRef YASAK (React 19 deprecate)
- **Actions + useActionState** form native
- **useOptimistic** instant UI
- **use() + Suspense** data fetch
- **React Compiler** auto-memoize (Vite plugin)

## TypeScript 5.6 Rules
- Strict + `noUncheckedIndexedAccess`
- `any` YASAK; `unknown` + type guard
- Interface for object shape, type for union
- Event typing: `React.FormEvent`, `React.MouseEvent<HTMLButtonElement>`
- `satisfies` widening guard
- `const T extends ...` inference
- `using` Symbol.dispose cleanup
- Template literal type i18n key safety

## Performance (Core Web Vitals v4)
- LCP ≤2.0s, INP ≤150ms, CLS ≤0.05
- Route code-split + Suspense skeleton
- Image WebP/AVIF, width/height, `loading="lazy"`, `fetchpriority="high"` LCP
- `useMemo`/`useCallback` only when profiled (React Compiler handles most)
- Bundle ≤180KB gzip initial
- CSS `contain` + `content-visibility`
- `prefers-reduced-motion` respect
- Debounce + `useDeferredValue`

## State (Zustand 5)
```ts
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

type AppState = {
  darkMode: boolean
  language: Lang
  toggleDarkMode: () => void
  setLanguage: (l: Lang) => void
}

export const useStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        darkMode: false,
        language: 'tr',
        toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
        setLanguage: (l) => set({ language: l })
      }),
      {
        name: 'pt-store',
        partialize: (s) => ({ darkMode: s.darkMode, language: s.language })
      }
    )
  )
)

// Selector focused
const darkMode = useStore(s => s.darkMode)
// Multi-field + shallow
const { darkMode, language } = useStore(
  s => ({ darkMode: s.darkMode, language: s.language }),
  shallow
)
```

## A11y (WCAG 2.2 AA)
- Semantic HTML
- `aria-label` icon button
- `role="dialog"` + focus trap + Esc close
- `prefers-reduced-motion`, `focus-visible`
- Keyboard nav (Tab/Shift+Tab/Arrow/Esc)
- Contrast ≥4.5:1 text, ≥3:1 UI
- Touch ≥44x44px
- Screen reader live region (toast, alert)

## i18n
- `useTranslation()` hook
- `t.section.key` pattern
- 13 dil parity (CI check)
- RTL: `document.dir` + logical CSS
- `Intl.PluralRules`, `Intl.DateTimeFormat`, `Intl.NumberFormat`

## Animation (Framer Motion 11)
- Transform + opacity only (compositor)
- `whileInView + viewport={{ once: true, amount: 0.3 }}`
- Spring `{ type: 'spring', stiffness: 380, damping: 28 }`
- Stagger 0.08–0.12s child
- `prefers-reduced-motion` respect
- CSS native `animation-timeline: scroll()` alternative

## Build (Vite 6)
```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    react({ babel: { plugins: ['babel-plugin-react-compiler'] } }),
    tailwindcss()
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'framer': ['framer-motion'],
          'charts': ['recharts'],
          'three': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
})
```

## Testing
- **Unit**: Vitest — store action, util
- **Component**: React Testing Library — role-based query
- **E2E**: Playwright — critical user flow
- **Visual**: Playwright screenshot regression

## Checklist (Senior Gate)
- [ ] Props interface exported
- [ ] ref as prop (not forwardRef)
- [ ] Suspense boundary + ErrorBoundary
- [ ] A11y attributes
- [ ] i18n keys 13 dil
- [ ] Mobile 375px perfect
- [ ] LCP ≤2.0s, INP ≤150ms
- [ ] Bundle impact <5KB
- [ ] Test coverage critical path
