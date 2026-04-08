# Senior Frontend Skill

Complete toolkit for senior-level frontend development.

## PT Stack
- React 19 + TypeScript 5.8+ + Vite 6 + Tailwind CSS 3
- Zustand 5 (persist middleware) for state
- Framer Motion for animations
- 13-language i18n (TR, EN, ES, FR, DE, IT, PT, RU, ZH, JA, AR, KO, HI)
- Cloudflare Pages (auto-deploy from main)

## Component Architecture
- Functional components with hooks only
- Custom hooks for shared logic (useStore, useTranslation)
- React.lazy + Suspense for code splitting
- Error boundaries at route level

## TypeScript Rules
- Strict mode, no any
- Interface for objects, type for unions
- Proper event typing (React.FormEvent, React.MouseEvent)

## Performance
- Code splitting per route
- Images: WebP/AVIF, lazy loading, explicit dimensions
- useMemo/useCallback only when measured
- Bundle target: initial JS under 200KB gzipped

## Accessibility
- Semantic HTML, ARIA attributes
- prefers-reduced-motion, focus-visible
- Keyboard navigation, color contrast 4.5:1+

## Zustand Pattern
```typescript
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({ /* state + actions */ }),
    { name: 'key', partialize: (s) => ({ /* selective */ }) }
  )
)
```
