---
name: arena-i18n-ops
description: ARENA Performance 13-locale i18n operasyon playbook'u. Yeni key ekleme, tum dillere propagate, missing-key detection, ICU pluralization, RTL handling, lazy-loading stratejisi, otomatik ceviri onerileri, sync validator, lokalize format (date/number/currency). Tetikleyici anahtarlar: "i18n", "translation", "locale", "ceviri", "lokalizasyon", "rtl", "arabic", "turkce", "multi-language", "pluralization", "t.section.key".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × i18n Ops

13 dil: `tr, en, ar, de, es, fr, it, nl, pl, pt, ru, uk, zh`. Altyapi: custom hook `useTranslation()` → `src/locales/<lang>.ts` → tek tip `Locale` interface.

## 0) Gold Rule

- **Hardcoded string YASAK** (CLAUDE.md kurali). Ne JSX'de, ne alt/title/aria'da.
- Yeni string → 13 locale dosyasina eksiksiz eklenecek. Eksikse CI/precheck `check-i18n.ts` kirar.

## 1) Yeni Key Ekleme Akisi

1. `src/locales/tr.ts` → yeni key ekle (kaynak dil, editoryal onayli metin)
2. `src/locales/en.ts` → profesyonel ceviri
3. Kalan 11 locale icin ceviri (once fallback to en; sonra native uzman revizyonu)
4. `npx tsx scripts/check-i18n.ts` → tum diller sync mi?
5. Commit: `i18n: add <section>.<key> across locales`

## 2) Tip Guvenligi

`tr.ts`'i "source of truth" kabul et. Digerleri typeof tr olmali:

```ts
// src/locales/tr.ts
export const tr = {
  hero: { title: 'Guclu ol. Kendine guven.', cta: 'Hemen basla' },
  errors: { required: '{field} zorunlu', minLength: 'En az {n} karakter' },
} as const
export type Locale = typeof tr

// src/locales/en.ts
import type { Locale } from './tr'
export const en: Locale = {
  hero: { title: 'Be strong. Trust yourself.', cta: 'Get started' },
  errors: { required: '{field} is required', minLength: 'At least {n} characters' },
}
```

Bu sayede yeni key eklendiginde TS, eksik locale'i derleme hatasina cevirir.

## 3) ICU / Placeholder Pattern

Custom (basit) interpolasyon:

```ts
function format(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))
}

t.errors.required // '{field} zorunlu'
format(t.errors.required, { field: 'Isim' }) // 'Isim zorunlu'
```

Pluralization (ICU-like):

```ts
errors: {
  items: '{n, plural, =0 {Hic urun yok} one {# urun} other {# urun}}',
}

const n = count
const key = n === 0 ? 'zero' : n === 1 ? 'one' : 'other'
// ceviri dosyasinda ayri key'ler tut: items_zero, items_one, items_other
```

Turkce'de plural one/other ayni; Arapca'da zero/one/two/few/many/other. Ceviri dosyalarinda her dil icin tam set.

## 4) RTL Handling

Arapca icin:

```ts
// src/main.tsx veya layout'ta
useEffect(() => {
  const rtl = ['ar'].includes(locale)
  document.dir = rtl ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
}, [locale])
```

Tailwind RTL: `rtl:ml-auto ltr:mr-auto` pattern'i veya `logical properties` (`ms-4` `me-4` yerine `ml/mr`). Tailwind 3.3+ logical support icin `tailwindcss-rtl` plugin opsiyonel.

Icon flip: ok ve breadcrumb chevron → `rtl:-scale-x-100`.

## 5) Lazy Loading Stratejisi

`tr` ve `en` `i18n-base` chunk'inda eager. Digerleri dynamic import:

```ts
const loaders: Record<Lang, () => Promise<{ default: Locale }>> = {
  tr: () => import('./locales/tr').then(m => ({ default: m.tr })),
  en: () => import('./locales/en').then(m => ({ default: m.en })),
  ar: () => import('./locales/ar').then(m => ({ default: m.ar })),
  // ...
}

async function setLocale(lang: Lang) {
  const { default: locale } = await loaders[lang]()
  useStore.getState().setLocale(lang, locale)
}
```

`vite.config.ts` icindeki manualChunks kurali bu akisi destekliyor.

## 6) Format Helper'lar

```ts
export const fmt = {
  date: (d: Date, lang: Lang) =>
    new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(d),
  time: (d: Date, lang: Lang) =>
    new Intl.DateTimeFormat(lang, { timeStyle: 'short' }).format(d),
  currency: (n: number, lang: Lang, ccy = 'TRY') =>
    new Intl.NumberFormat(lang, { style: 'currency', currency: ccy }).format(n),
  number: (n: number, lang: Lang, opts?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(lang, opts).format(n),
  relative: (d: Date, lang: Lang) => {
    const diff = Math.round((d.getTime() - Date.now()) / 86400000)
    return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(diff, 'day')
  },
}
```

## 7) Missing-Key Detection

`scripts/check-i18n.ts` pattern:

```ts
import { tr } from '../src/locales/tr'
import { en } from '../src/locales/en'
// ... import all 13

const langs = { tr, en, ar, de, es, fr, it, nl, pl, pt, ru, uk, zh }

function flatten(obj: any, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatten(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  )
}

const trKeys = new Set(flatten(tr))
let errors = 0

for (const [name, locale] of Object.entries(langs)) {
  if (name === 'tr') continue
  const keys = new Set(flatten(locale))
  const missing = [...trKeys].filter(k => !keys.has(k))
  const extra = [...keys].filter(k => !trKeys.has(k))
  if (missing.length) { console.error(`${name}: missing ${missing.join(', ')}`); errors++ }
  if (extra.length) { console.error(`${name}: extra ${extra.join(', ')}`); errors++ }
}

process.exit(errors > 0 ? 1 : 0)
```

CI'da pre-deploy pipeline'inin parcasi.

## 8) Otomatik Ceviri Onerileri

Workflow: TR veya EN kaynak → LLM'den diger 11 icin oneri iste → native revizyon.

Prompt pattern:

```
Sen profesyonel spor/fitness ceviri uzmani. Aragon tono: dostane ama rekabetci, Akdeniz sicakligi. "Guclu ol. Kendine guven." cumlesini Arapca'ya cevir. Kelime kelime degil, kultürel kontekst koru.
```

Brand terimlerini ASLA ceviriye birakma: "ARENA", "Performance", "Coach", "Program" gibi ozel isimler.

## 9) Brand / Terim Sozlugu

`src/locales/glossary.ts`:

```ts
export const DO_NOT_TRANSLATE = ['ARENA', 'Higgsfield', 'Supabase'] as const
export const CANON = {
  coach: { tr: 'Antrenor', en: 'Coach', ar: 'مدرب', ... },
  program: { tr: 'Program', en: 'Program', ar: 'برنامج', ... },
  performance: { tr: 'Performans', en: 'Performance', ar: 'أداء', ... },
}
```

LLM'ye prompt'ta "kesinlikle su terimleri kullan" olarak ver.

## 10) SEO / hreflang

Landing'de `<head>` icine:

```tsx
{LOCALES.map(l => (
  <link key={l} rel="alternate" hrefLang={l} href={`https://arena-performance.com/${l}/`} />
))}
<link rel="alternate" hrefLang="x-default" href="https://arena-performance.com/" />
```

URL stratejisi: `tr` default (root); digerleri `/<lang>/...`. Router config'te `/:lang?/...`.

## 11) Accessibility × i18n

- `lang` attribute her zaman aktif locale
- `aria-label`'lar cevrilir; `t.aria.closeMenu` gibi
- Ekran okuyucusu: `dir="rtl"` + `lang="ar"` Arapca'da dogru okur

## 12) Tenant Overlay (White-label icin)

ARENA → baska spor markasi satinca, locale + brand string'leri tenant config'ten merge edilir:

```ts
// tenant.config.ts
export const tenantConfig = {
  brand: 'ARENA',
  colors: { primary: '#C2684A', ... },
  copyOverrides: {
    hero: { title: 'Guclu ol. Kendine guven.' },
  },
}

// useTranslation
const t = merge(base[lang], tenantConfig.copyOverrides)
```

## 13) QA Checklist

- [ ] 13 locale sync (scripts/check-i18n.ts yesil)
- [ ] `tr` source updated
- [ ] RTL preview test (ar locale)
- [ ] Uzun metin test (de, ru — tipik en uzun diller) → overflow / truncation
- [ ] Kisa metin test (zh) → hizalama
- [ ] Pluralization test (en, ar, ru farkli)
- [ ] Date/number format test (en-US vs en-GB vs tr-TR)
- [ ] hreflang + canonical
- [ ] Font: aktif locale icin glyph destek (ar, zh, ru farkli stack)

## 14) Font Stack per Locale

```css
:root { --font-body: 'Manrope', system-ui, sans-serif; }
:root[lang='ar'] { --font-body: 'Noto Sans Arabic', 'Manrope', sans-serif; }
:root[lang='zh'] { --font-body: 'Noto Sans SC', 'Manrope', sans-serif; }
:root[lang='ru'], :root[lang='uk'] { --font-body: 'Manrope', 'Noto Sans', sans-serif; }
```

`vite-plugin-pwa` workbox runtime caching Google Fonts icin konfig edildi (vite.config.ts:44-50).

## 15) Red Flags

- `t.hero.title || 'Fallback'` — fallback hardcode kirali yok
- Concatenation: `t.hello + ', ' + name` yerine `format(t.hello, { name })` (dile gore word order)
- Tarih stringi manuel formatlama — Intl kullan
- `toLocaleString('tr-TR')` yerine Intl.NumberFormat (SSR/tree-shake)

## 16) Hizli Komutlar

```bash
npm run i18n:check   # sync validation
npm run i18n:extract # src'den t.x.y referanslari topla (opsiyonel gelecek script)
```

---

Her yeni UI metni → 13 dosyada eksiksiz + tr.ts source of truth. Bu kural kirilirsa build CI kiriyor.
