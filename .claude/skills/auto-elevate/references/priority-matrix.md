# Priority Matrix — Hangi İşe Önce Bak

Otonom döngüde bir sonraki iterasyonda "ne yapayım" sorusunu cevaplar.

## ROI Formula

```
ROI = (Impact × Urgency) / Effort

Impact  = 1..10 (1 = kozmetik, 10 = ciddi kullanıcı kaybı)
Urgency = 1..10 (1 = bekleyebilir, 10 = prod down)
Effort  = 1..10 (1 = 5 dakika, 10 = 1 hafta)
```

Her aday task'ı puanla, yüksek ROI → öncelik.

## Kategori Öncelikleri (tie-breaker)

Aynı ROI'de şu sırayı izle:

1. **P0 — Security**
   - Secret leak, exposed API key
   - SQL injection, XSS
   - Auth bypass
   - Critical npm vuln

2. **P0 — Correctness**
   - Runtime error (Sentry'den gelen)
   - Build broken on main
   - Broken core flow (signup, checkout, login)
   - Data loss bug

3. **P1 — Accessibility (yasal + etik)**
   - Kritik a11y violation (keyboard nav, color contrast, ARIA)
   - Screen reader broken
   - Form label eksik

4. **P1 — Core Performance**
   - LCP > 2.5s mobilde
   - INP > 200ms
   - Bundle size budget exceeded %50+
   - Runtime JS error during hydration

5. **P2 — SEO (business impact)**
   - Missing meta tags
   - Missing sitemap
   - Non-canonical URL issues
   - Broken structured data

6. **P2 — UX Polish**
   - Missing loading states
   - Harsh transitions
   - Poor empty states
   - Error messages unclear

7. **P3 — DX (devs için)**
   - Outdated linter config
   - Test coverage gap
   - Docs outdated
   - Missing CI step

8. **P3 — Stack Freshness**
   - Minor deps behind
   - Pattern modernization
   - Config cleanup

9. **P4 — Micro-interactions / Visual**
   - Motion polish
   - Typography rhythm
   - Color consistency
   - Icon consistency

## Decision Shortcuts

| Durum | Öncelik |
|---|---|
| User "şu bozuk" dedi | P0, hemen |
| Prod'da error spike | P0, hemen |
| Lighthouse skoru <70 | P1 |
| Accessibility CI fail | P1 |
| npm audit critical | P0 |
| npm audit high | P1 |
| Stack 2+ minor behind | P3 |
| Stack major behind | Rapor + onay |
| New feature request | Backlog'a, acil değilse |

## Context Awareness

- **Deploy freshness:** Son deploy başarılı mı? Fail'se önce o.
- **Last error:** Son Playwright raporu/verify FAIL varsa önce o.
- **Outstanding TODOs:** İlk commit'te `git grep -n "TODO\|FIXME"` —
  3+ TODO varsa önce bunları temizle veya ticket'la.
- **User's explicit roadmap:** `CLAUDE.md`, `ROADMAP.md`, `.auto-memory/`
  dosyalarına bak — user'ın planı belliyse ona uy.

## Skip Conditions

Şu durumlarda bir task'ı skip edip devam et:

- Gerekli external service yok (ör: PostHog key kurulmamışsa
  analytics task'ı skip)
- Diğer task'ı bloke eden dep eksik
- Breaking change gerekli ama onay verilmemiş

## Prioritization Output Format

Her iterasyonun başında kısa karar yaz (private, user'a gösterme):

```
Audit sonuçları:
- Lighthouse perf 78 (target 95) — gap 17 puan
- Bundle 420KB (budget 250KB) — %68 over
- 2 critical a11y violation (keyboard trap + focus loss)
- TS hatası yok, build green
- Last push OK, verify OK

Candidate tasks:
[A] a11y fix keyboard trap     I=9 U=9 E=2 → ROI 40.5
[B] route code split            I=8 U=6 E=3 → ROI 16
[C] OG image add                I=3 U=2 E=1 → ROI 6

Chose: A (highest ROI, blocker for a11y gate)
```

Sonra [A]'ya odaklan. Tamamlayınca bir sonraki iterasyonda yeniden
audit.
