---
name: arena-a11y-wcag
description: ARENA Performance icin WCAG 2.2 AA + AAA hedefli accessibility playbook. Keyboard navigation, focus management, ARIA patterns, color contrast, screen reader (NVDA/JAWS/VoiceOver), reduced motion, RTL, form errors, skip links, landmark regions, dialog/menu/tab patterns, axe-core + pa11y entegrasyonu. Tetikleyici: "a11y", "accessibility", "wcag", "ekran okuyucu", "klavye", "focus", "aria", "contrast", "screen reader", "kor", "gorme engelli".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × A11y WCAG Playbook

Hedef: WCAG 2.2 AA (AAA where possible). Hukuki zorunluluk + kullanici saygisi + SEO bonusu.

## 0) WCAG Ozet

| Prensip | Anlami | ARENA Pratik |
|---|---|---|
| Perceivable | Algilanabilir | Contrast 4.5:1 text, 3:1 UI |
| Operable | Kullanilabilir | Klavye 100%, no-traps |
| Understandable | Anlasilir | Acik dil, hata aciklama |
| Robust | Uyumlu | Semantic HTML + valid ARIA |

## 1) Semantic-First HTML

Once semantic, sonra ARIA:
- `<button>` yerine `<div onClick>` YASAK
- `<a>` yerine `<span>` navigasyon YASAK
- `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` landmark zorunlu
- `<h1..h6>` hierarsik, atlanmadan

Yanlis / Dogru:
```tsx
// YANLIS
<div className="btn" onClick={save}>Kaydet</div>
// DOGRU
<button type="button" onClick={save}>Kaydet</button>
```

## 2) Focus Management

### Görünür focus ring
```css
*:focus-visible {
  outline: 2px solid theme(colors.primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

Tailwind: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2`.

### Focus trap (modal)
```tsx
import { useEffect, useRef } from 'react'

function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const prev = document.activeElement as HTMLElement
    const focusable = el.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault() }
      if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prev?.focus() }
  }, [active])
  return ref
}
```

### Skip link
Landing `<body>` ustune:
```tsx
<a href="#ana-icerik" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-bg focus:px-4 focus:py-2 focus:rounded">
  {t.a11y.skipToContent}
</a>
<main id="ana-icerik">...</main>
```

## 3) Keyboard Patterns

- `Tab` / `Shift+Tab`: linear nav
- `Enter` / `Space`: activate button
- `Esc`: close dialog / menu / toast
- `Arrow keys`: radio, tab, menu, slider, treeview
- `Home` / `End`: list start/end
- Custom component → WAI-ARIA Authoring Practices sablonu (combobox, menu, tabs)

### Dropdown menu (`role="menu"`)
```tsx
<button aria-haspopup="menu" aria-expanded={open} onClick={toggle}>Menu</button>
{open && (
  <ul role="menu" aria-labelledby="menu-btn">
    <li role="menuitem" tabIndex={focus === 0 ? 0 : -1}>Item 1</li>
    ...
  </ul>
)}
```

### Tabs
```tsx
<div role="tablist" aria-label={t.a11y.tabs}>
  <button role="tab" aria-selected={active === 0} aria-controls="panel-0" id="tab-0" tabIndex={active === 0 ? 0 : -1}>...</button>
</div>
<div role="tabpanel" id="panel-0" aria-labelledby="tab-0" tabIndex={0}>...</div>
```

## 4) Screen Reader Pattern

### Aria-live
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {toast && toast.message}
</div>
```

Polite = kullanici beklesin. Assertive = kritik hata (form submission fail).

### Label
```tsx
// DOGRU: explicit label
<label htmlFor="email">{t.form.email}</label>
<input id="email" type="email" />

// DOGRU: aria-label (ikonlu buton)
<button aria-label={t.a11y.close}><XIcon aria-hidden /></button>

// DOGRU: aria-labelledby (kart baslik)
<article aria-labelledby="card-1-title">
  <h3 id="card-1-title">Program 1</h3>
</article>
```

### Hidden for AT
```tsx
<IconDecoration aria-hidden="true" /> // dekoratif
<span className="sr-only">{t.a11y.loadingSubtitle}</span> // sadece SR
```

## 5) Form Hata Pattern

```tsx
<label htmlFor="email">{t.form.email}</label>
<input
  id="email"
  type="email"
  required
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-err' : 'email-hint'}
/>
<p id="email-hint" className="text-sm text-muted">{t.form.emailHint}</p>
{errors.email && (
  <p id="email-err" role="alert" className="text-sm text-error">
    {t.errors[errors.email]}
  </p>
)}
```

Submit fail: focus'u ilk hatali field'a al, `aria-live="assertive"` banner goster.

## 6) Color Contrast

- Normal text: ≥ 4.5:1
- Large text (18pt+ veya 14pt bold+): ≥ 3:1
- UI component (border, icon): ≥ 3:1

ARENA tokens kontrolu:
- `#C2684A` primary on `#FAF6F1` bg = 4.82 — AA pass (AAA icin 7 gerek)
- `#7A9E82` secondary on `#FAF6F1` = 3.24 — KUCUK metin AA fail, buton/ikon OK
- `#4A6D88` accent on `#FAF6F1` = 5.78 — AA pass

Hesaplama: https://webaim.org/resources/contrastchecker/ veya axe.

Dark theme: `#C2684A` on `#0A0A0A` = 7.9 — AAA pass.

## 7) Motion / Cognitive

- `prefers-reduced-motion: reduce` → tum transform animasyonlarini 0 yap
- Auto-playing video: mute + pause button
- Seizure: < 3 flash/sn
- Timeout: kullaniciya uzatma / durdurma imkani

## 8) RTL (Arapca)

- `document.dir = 'rtl'`
- `<html lang="ar" dir="rtl">`
- Tailwind: `rtl:` prefix veya logical props
- Icon flip (ok, arrow) sadece yon anlatan; check/settings donmez
- Scroll progress bar sagdan sola

## 9) Landmark Regions

```tsx
<header>{/* banner */}</header>
<nav aria-label={t.a11y.mainNav}>{/* navigation */}</nav>
<main id="ana-icerik">
  <section aria-labelledby="hero-title">...</section>
  <section aria-labelledby="programs-title">...</section>
</main>
<aside aria-label={t.a11y.sidebar}>...</aside>
<footer>{/* contentinfo */}</footer>
```

AT kullanicisi landmark listesinden zipla — ornek komut NVDA'da `D`.

## 10) Table

```tsx
<table>
  <caption>{t.stats.caption}</caption>
  <thead>
    <tr>
      <th scope="col">{t.stats.headerA}</th>
      <th scope="col">{t.stats.headerB}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">{row.name}</th>
      <td>{row.value}</td>
    </tr>
  </tbody>
</table>
```

Charts (recharts) icin `role="img"` + `aria-label`. Data table fallback eklenmeli (SR icin).

## 11) Test Araclari

### axe-core CLI
```bash
npx @axe-core/cli https://pt.kozbeylikonagi.com.tr
```

### pa11y
```bash
npx pa11y https://pt.kozbeylikonagi.com.tr --standard WCAG2AA
```

### Playwright + axe
```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('landing a11y', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

### Manuel test
- Chrome Lighthouse > Accessibility > score ≥ 95
- Klavye only nav (tab her seyi dolasir, focus kaybolmaz)
- Ekran okuyucu: NVDA (Windows), VoiceOver (macOS), TalkBack (Android)

## 12) Proje-spesifik Patterns

### Navbar mobile menu
```tsx
<button
  aria-label={t.a11y.toggleMenu}
  aria-expanded={open}
  aria-controls="mobile-menu"
  onClick={() => setOpen(v => !v)}
>
  <MenuIcon aria-hidden />
</button>
<nav id="mobile-menu" hidden={!open}>...</nav>
```

### Carousel (Gallery)
- Auto-play pause button + `aria-live="polite"`
- Prev/Next button `aria-label`
- Slide count `role="status"`: `t.a11y.slideXofY` with interpolation

### Toast
```tsx
<div role="status" aria-live="polite">...</div>   // bilgi
<div role="alert" aria-live="assertive">...</div> // hata
```

### Loading skeleton
`aria-busy="true"` container + `aria-label={t.a11y.loading}`.

## 13) Focus Visible Style (Tailwind)

`tailwind.config.js` extend:
```js
theme: {
  extend: {
    ringColor: { DEFAULT: '#C2684A' },
  },
},
plugins: [require('@tailwindcss/forms')],
```

Class kullanim:
```tsx
<button className="px-4 py-2 bg-primary text-white rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
```

## 14) Dialog (react-aria veya custom)

Native `<dialog>` + polyfill yerine `role="dialog"` pattern:
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dlg-title" ref={trapRef}>
  <h2 id="dlg-title">{t.dialog.title}</h2>
  ...
</div>
```

Body scroll lock: `document.body.style.overflow = 'hidden'` open iken.

## 15) Pre-deploy A11y Gate

`scripts/audit-a11y.ts` zaten pre-deploy suite'te. Ek olarak:
- `html-validate` (valid HTML)
- `eslint-plugin-jsx-a11y` (kodda statik check)
- Visual regression: focus ring her component'ta gorunur

## 16) Copy Guideline

- Link text: "burasi", "tikla" YASAK. Amacli: "Program detayi".
- Button: eylemi baslat (fiil): "Kaydet", "Sil".
- Hata mesaji: sorun + cozum: "E-posta gecersiz. ornek@site.com formatinda girin."
- Ikon-only button: `aria-label` zorunlu.

## 17) White-label Uyum

Tenant kendi markasi icin contrast degistirirse, token'lar otomatik WCAG gate'inden gecmeli. `scripts/check-tenant-contrast.ts` (ilerisi):

```ts
function ratio(fg: string, bg: string): number { /* WCAG formula */ }
assert(ratio(tenant.colors.primary, tenant.colors.bg) >= 4.5, 'primary/bg AA fail')
```

## 18) Red Flags

- `tabindex={5}` — asla pozitif tabindex
- `onClick` on `<div>` without `role="button"` + keyboard handler
- Placeholder-only label (placeholder label degildir)
- `alt=""` yerine `alt` kaldirma (dekoratif icin alt="" DOGRU)
- Color only (kirmizi = hata) → icon + text de ekle
- Auto-focus > 1 element/sayfa

---

Hedef: her release-te Lighthouse Accessibility ≥ 95 + axe violations = 0.
