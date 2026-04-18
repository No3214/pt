---
name: arena-verify
description: ARENA Performance otomatik live-site doğrulama skili. Her push sonrasi Playwright ile siteyi acar, tum rotalari dolasir, konsol hatalarini, network hatalarini, gorsel bozulmalari yakalar. Hata bulursa otomatik fix icin arena-autopilot'u tetikler. Trigger: "verify", "dogrula", "kontrol et", "test et", "live check", "playwright", "production check".
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# ARENA Verify — Otomatik Live-Site Dogrulama

Her deploy'dan sonra otomatik devreye girer. Playwright ile `arena.kozbeylikonagi.com.tr` ve `pt.kozbeylikonagi.com.tr` domainlerini tarar, hatalari rapor eder, kritikleri otomatik duzeltir.

## Amac

Kullanici "devam", "push" veya "deploy" dediginde:
1. arena-autopilot push yapar
2. **arena-verify OTOMATIK** olarak calisir (AUTOPILOT.bat son adim)
3. Playwright tum rotalari tarar
4. Hatalari snapshot + rapor olarak verir
5. Kritik hata varsa arena-autopilot'u `fix` intent ile tekrar tetikler

## Ne Kontrol Eder

### HTTP Saglik
- 200 status: `/`, `/giris`, `/portal`, `/admin`, `/galeri`, `/programlar`, `/iletisim`
- Redirect'ler dogru mu
- HTTPS geçerli mi

### Console
- `page.on('console')` ile hata/warning yakala
- `page.on('pageerror')` ile uncaught exception yakala
- React warning'leri ayrilir

### Network
- 4xx/5xx request'ler rapor
- Failed preload'lar
- CORS ihlalleri

### Gorsel
- Blank page detection (body minHeight + text content)
- Mobil (375x667) + desktop (1440x900) screenshot
- Dark mode toggle calisiyor mu
- i18n switch: `tr -> en -> es` ilk 3 dil duman testi

### Content
- Ana bashlik rendere edildi mi
- CTA butonlari gorunur
- Galeri 9 kart render ediyor
- Footer link'leri calisiyor

## Kullanim

### Otomatik (varsayilan)
`AUTOPILOT.bat` push sonrasi step [9] olarak `VERIFY.bat` cagirir. Hicbir sey yapmaya gerek yok.

### Manuel
```
cd C:\...\PT\pt
node scripts/arena-verify.mjs
# veya
..\VERIFY.bat
```

### CI tarzi (Playwright yoksa kurar)
`scripts/arena-verify.mjs` baslarken `npx playwright install chromium` kosar.

## Intent Table

| Kullanici dedi | Ne yap |
|---|---|
| "verify" / "dogrula" / "kontrol et" | VERIFY.bat cagir |
| "hatalari goster" | Son rapor'u oku (reports/verify-latest.json) |
| "fix" (verify hatasi sonrasi) | arena-autopilot devret, son rapor'daki trace'i ver |
| "mobile test" | Sadece 375x667 taramasini kosur |
| "dark mode test" | Sadece dark mode smoke |

## Rapor Format

`pt/reports/verify-<timestamp>.json`:
```json
{
  "timestamp": "2026-04-18T...",
  "targets": ["https://arena.kozbeylikonagi.com.tr"],
  "routes": [
    {
      "path": "/",
      "status": 200,
      "consoleErrors": [],
      "networkFailures": [],
      "screenshot": "reports/shots/home-desktop.png",
      "bodyTextLength": 3421
    }
  ],
  "verdict": "PASS" | "WARN" | "FAIL",
  "failCount": 0,
  "warnCount": 0
}
```

## Auto-Fix Kurallari

Verify rapor'unda sunlar varsa arena-autopilot otomatik tetiklenir:

| Bulgu | Fix |
|---|---|
| 404 kritik route | React Router/route dosyasini ac, path kontrol |
| Console: "Cannot read property X of undefined" | Component'te optional chaining ekle |
| Network 500 /api | Supabase env degiskenlerini dogrula |
| Blank body on route | Error boundary + root mount kontrol |
| Mojibake (Ã§ Ä° gibi) | UTF-8 BOM kontrol, meta charset |
| Image 404 | public/ icinde dosya var mi, src path'i dogru mu |

## YASAK

- Kullaniciya "verify'i sen cagir" DEME. Otomatik AUTOPILOT.bat'a bagla.
- Hatayi gordugunde sadece rapor etme — fix onerisi uret ve uygulamaya hazir sunk.
- Screenshot almadan PASS verme.

## Gozeten Dosyalar

- `pt/scripts/arena-verify.mjs` — Playwright script
- `pt/reports/` — JSON rapor + PNG screenshot (gitignore'a eklenmeli)
- `VERIFY.bat` — Windows one-shot verify
- `AUTOPILOT.bat` — step [9] verify entegrasyonu
