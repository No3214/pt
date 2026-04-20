---
name: arena-competitor-teardowns
description: ARENA icin yazilmis derin competitor teardown'lari. Her dosya bir site/app'i satir satir cozumler — hero video yapisi, pricing pattern, workout player, onboarding flow, microcopy. ARENA'ya port edilecek seyi isimli dosya + kod ornekleri ile verir. Kullanim: "Linear gibi pricing yap", "Nike gibi workout player", "Whoop gibi hero video" deyince ilgili teardown dosyasini ac.
---

# ARENA Competitor Teardowns

Premium site/app'lerin satir satir analizi + ARENA'ya port edilecek somut kod.

## Mevcut teardown'lar

| Dosya | Referans | Ne icin |
|---|---|---|
| `linear-pricing.md` | linear.app/pricing | Pricing + plan card + Stripe entegrasyonu |
| `whoop-hero-video.md` | whoop.com | Hero video loop + athlete story + data viz ring |
| `nike-training-club-pwa.md` | nike.com/ntc-app | Workout player + streak + offline PWA |

## Siradaki (backlog)

- `tb12-program-funnel.md` — Tom Brady's funnel ile assessment -> plan satisi
- `alo-yoga-product-grid.md` — product grid pattern + lookbook
- `tonal-tech-onboarding.md` — quiz-style onboarding flow
- `superhuman-feature-demo.md` — animated feature reveal section
- `stripe-docs-ux.md` — belge navigasyonu + code snippet UX
- `cal-com-booking.md` — takvim booking UX
- `cuberto-motion-vocabulary.md` — mouse follow, cursor morph, hover patterns

## Teardown yazma formati

Her teardown su yapiyi takip eder:
1. **Meta** — URL + kategori + ARENA'da ne kopyalanacak
2. **Ne iyi yapiyorlar** — 5-7 numara, her biri 2-3 satir detay
3. **Teknik pattern** — kullandiklari lib/framework/approach
4. **ARENA icin kopyalama plani** — yeni dosya path + component adlari + kod ornegi
5. **Kacinilmasi gereken tuzaklar** — neyi aynen kopyalamamak lazim
6. **Olcum** — success metric + nasil instrument edilir
7. **Kaynaklar** — canli URL, OSS muadili, ilgili best-practice linkleri

## Ne zaman kullanilir

Triggerlari:
- "X gibi yap" — `X` teardown'lardan biri
- "premium SaaS pricing pattern'i"
- "fitness app workout UX"
- "hero video best-practice"
- "onboarding flow"
- "competitor analysis"
- "teardown"

## Ne zaman kullanilmaz

- Brand-new component tasariminda (`design:design-critique` kullan)
- Kod review'de (`engineering:code-review`)
- Yeni marka sesi olustururken (`brand-voice:guideline-generation`)

## Komut kisayollari

Yeni teardown ekleme:
```bash
cat > .claude/skills/arena-competitor-teardowns/<slug>.md <<'EOF'
# <Site Name> — <Category> Teardown
...
EOF
```

Backlog'dan pick + ilerleme:
```bash
ls .claude/skills/arena-competitor-teardowns/*.md | wc -l
# mevcut teardown sayisini gosterir
```
