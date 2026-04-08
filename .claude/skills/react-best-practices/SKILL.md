# React Best Practices - Performance

40+ rules organized by impact for the PT React app.

## Critical
1. Parallel fetches: Promise.all() not sequential awaits
2. Direct imports, avoid barrel files
3. Dynamic imports: React.lazy for heavy components
4. Strategic Suspense boundaries

## High
5. Images: WebP/AVIF, explicit dimensions, loading=lazy, srcset
6. Memoize only when measured improvement exists

## Medium
7. No inline object literals in JSX props
8. Stable key props (IDs, not index)
9. Effect cleanup (clearInterval, unsubscribe)
10. Debounce user input (300ms)

## PT-Specific
- Zustand selectors: useStore(s => s.darkMode) not useStore()
- Framer Motion: prefer transform/opacity, respect reduced-motion
- Bundle budget: initial JS under 200KB, LCP under 2.5s, CLS under 0.1

## Anti-Patterns
- console.log in production
- any type
- Inline arrows in JSX props
- useEffect for derived state
- index as key on dynamic lists
