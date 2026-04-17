---
name: i18n-manager
description: 2026 13-language i18n PT. Triggers on çeviri, translation, dil, language, i18n.
autoTrigger: true
---
# i18n Manager — 2026 PT (13 dil)

## Diller
tr (source) · en · es · fr · de · it · pt · ru · zh · ja · ar · ko · hi

Türkçe source of truth. Diğer 12 dil TR'den türev.

## Files
- `src/locales/*.ts` — dil başına tek dosya
- `src/locales/index.ts` — export + type
- `src/locales/types.ts` — `Translations` interface

## Pattern
```ts
// src/locales/tr.ts
export const tr = {
  hero: {
    title: 'Güçlü Sporcu',
    subtitle: 'Bilim tabanlı antrenman',
    btnStart: 'Başla'
  },
  programs: {
    badge: 'Programlar',
    title: 'Sana Uygun Plan',
    popular: 'Popüler',
    ...
  }
} as const satisfies Translations

// Hook
import { useTranslation } from '@/locales'
const { t } = useTranslation()
<h1>{t.hero.title}</h1>
```

## Tip Güvenliği (TS 5.6)
```ts
// types.ts
export type Translations = {
  hero: { title: string; subtitle: string; btnStart: string }
  programs: { ... }
}

// Template literal type — key eksik yakalar
export type I18nKey = DeepPath<Translations>
```

## Kurallar
1. **Hardcoded string YASAK** — `t.xxx` pattern zorunlu
2. **Her yeni key 13 dosyada var** — CI gate
3. **TR first** — source değişince diğerleri update
4. **Pluralization**: `Intl.PluralRules(lang).select(n)`
5. **Date/Number**: `Intl.DateTimeFormat(lang)` + `Intl.NumberFormat(lang)`
6. **RTL Arabic**: `document.dir = 'rtl'` + logical CSS property (margin-inline-start)
7. **ICU MessageFormat** variable: `t.greeting.hello({ name: 'Yunuscan' })`

## Hook
```ts
export function useTranslation() {
  const lang = useStore(s => s.language)
  return useMemo(() => ({ t: translations[lang], lang }), [lang])
}
```

## Code Split (Lazy Load Locale)
```ts
const loadLocale = (lang: Lang) =>
  import(`./locales/${lang}.ts`).then(m => m[lang])

// TanStack Query cache
const { data: t } = useQuery({
  queryKey: ['locale', lang],
  queryFn: () => loadLocale(lang),
  staleTime: Infinity
})
```

Initial bundle: sadece `tr` yüklenir; diğer diller dinamik import.

## RTL Arabic
```tsx
useEffect(() => {
  document.dir = lang === 'ar' ? 'rtl' : 'ltr'
}, [lang])
```
- Margin/padding: `me-4` / `ms-4` logical (not mr/ml)
- Icon mirror: `scale-x-[-1] rtl:scale-x-100`
- Text align: `text-start` (not text-left)

## Audit
```bash
npm run audit:i18n
```
- 13 dosya parity check
- Missing key listele
- Extra key fail
- CI gate PR

## Tooling
- `i18n-ally` VS Code extension
- DeepL API auto-translate TR → diğer diller
- `@formatjs/intl-*` polyfill older browser

## Nested Structure
```ts
{
  section: {
    subsection: {
      key: 'value'
    }
  }
}
```
Dot path: `t.section.subsection.key`

## Example (New Text)
1. Add TR → `locales/tr.ts`
2. Translate DeepL → EN, ES, FR, DE, IT, PT, RU
3. Human review → ZH, JA, AR, KO, HI
4. `npm run audit:i18n` — parity check
5. Use `t.section.key` in component
