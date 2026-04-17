---
name: component-builder
description: 2026 React 19 component builder PT. Triggers on component, bileşen, sayfa, page, ekle, oluştur.
autoTrigger: true
---
# Component Builder — 2026 PT

## Template (React 19 + TS 5.6)
```tsx
import { memo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/stores/useStore'
import { useTranslation } from '@/locales'

interface CardProps {
  title: string
  description?: string
  onClick?: () => void
  ref?: React.Ref<HTMLDivElement>  // React 19: ref as prop
}

function Card({ title, description, onClick, ref }: CardProps) {
  const { darkMode } = useStore()
  const { t } = useTranslation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`p-8 rounded-3xl border transition-all duration-500 ${
        darkMode
          ? 'bg-white/[0.03] border-white/5 hover:border-primary/20'
          : 'bg-white border-black/[0.04] hover:border-primary/20'
      }`}
    >
      <h3 className="font-display text-2xl font-bold mb-3 text-text-main">{title}</h3>
      {description && <p className="text-text-main/40 leading-relaxed">{description}</p>}
    </motion.div>
  )
}

export default memo(Card)
```

## Dirs
- `src/components/landing/` — public (Hero, About, Programs, Stats, ...)
- `src/components/admin/` — coach dashboard
- `src/components/portal/` — client portal
- `src/components/common/` — Toast, Skeleton, Modal, Button
- `src/components/animations/3d/` — Spotlight, Card3D, ShineBorder

## Design Tokens (Tailwind)
```
text-text-main text-text-main/40 text-text-main/60
bg-bg bg-bg-alt bg-surface
text-primary bg-primary border-primary/10 border-primary/20
rounded-2xl rounded-3xl rounded-[2.5rem]
shadow-sm(rest) shadow-md(hover) shadow-2xl(modal)
p-4 p-6 p-8 p-10 p-12
```

## Motion Defaults
- Initial: `{ opacity: 0, y: 20 }`
- Animate/whileInView: `{ opacity: 1, y: 0 }`
- Viewport: `{ once: true, amount: 0.3, margin: '-50px' }`
- Transition: `{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }`
- Spring: `{ type: 'spring', stiffness: 380, damping: 28 }`
- Stagger child: 0.08–0.12s
- Respect `prefers-reduced-motion`

## A11y
- Semantic HTML (`<section>`, `<article>`, `<nav>`)
- Alt text TR (i18n)
- `aria-label` icon button
- `role="dialog"` + `aria-modal="true"` modal
- Focus ring custom (outline YASAK)
- Touch target ≥44x44 (w-11 h-11)
- Keyboard: Tab/Shift+Tab/Esc/Arrow

## i18n Kullanım
```tsx
const { t } = useTranslation()
<h2>{t.programs.title}</h2>
<button>{t.hero.btnStart}</button>
```
13 locale senkronu zorunlu (CI).

## React 19 Özel
- `'use client'` sadece interactive component
- `use(promise)` + Suspense data fetch
- `useActionState` + `useOptimistic` form
- `useFormStatus` submit button
- `useTransition` + `useDeferredValue` heavy compute
- Document metadata in-component: `<title>`, `<meta>`

## Yeni Component Checklist
- [ ] Props interface export
- [ ] `memo()` pure component
- [ ] `ref as prop` (React 19)
- [ ] Motion `whileInView` + `once: true`
- [ ] Dark mode conditional
- [ ] i18n: all strings via `t`
- [ ] A11y: aria, role, focus
- [ ] Responsive mobile 375px
- [ ] 13 locale key added
