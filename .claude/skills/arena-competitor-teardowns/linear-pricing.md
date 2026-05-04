# Linear — Pricing + Onboarding Teardown

**URL:** https://linear.app/pricing
**Kategori:** SaaS pricing sayfasi best-practice
**ARENA'da kopyalanacak:** tenant onboarding + plan secim sayfasi

## Ne iyi yapiyorlar

1. **Kart 3-sutunlu (Free / Standard / Plus / Enterprise) — 4. kart "custom" CTA**
   - En sag card hep "contact sales" — Enterprise revenue'yi kaciriyor ama yuksek-intent lead yakaliyor
   - ARENA: Starter / Pro / Elite / Enterprise pattern'i aynen al

2. **"Most popular" rozeti Pro kart'ta**
   - Gozu yonlendiren tek unsur. Diger kartlarda hicbir goz yakalayici yok
   - Conversion'i %20-30 yukseltir (A/B kanitlari var)

3. **Annual/Monthly toggle ustte** + indirim yuzdesi "Save 20%" badge
   - Default "Annual" secili geliyor — psikolojik olarak buyuk rakam gosteriyor, sonra /yil
   - ARENA: default aylik goster (TR pazari yilliga direnc gosterir), ama toggle koy

4. **Feature matrix COLLAPSED by default**
   - "Compare all features" link'i altta. Sayfayi kisa tutuyor
   - Matrix acilinca 40+ satir, her biri tooltip'li

5. **Her plan'da "what's included" 4-5 bullet**
   - En guclu 4 ozellik, hepsi ikon + kisa ifade
   - Uzun aciklama yok. Tooltip'e gomulu detay

6. **"Start free trial" CTA her kart'ta ayni renk (siyah)**
   - "Contact sales" CTA farkli renk (gri outline) — hierarchy belli
   - ARENA: primary #C2684A dolu buton + sage outline "Iletisim"

## Teknik pattern

- Framer Motion fade-in-up staggered (sira: header -> toggle -> kartlar)
- `@container` query kullanimi — 3 kart 4 kart'a mobile'da donusmuyor, stacklenyor
- Intersection Observer ile FAQ section'u yaratiliyor
- Stripe checkout redirect — plan id URL'de (`?plan=pro&interval=annual`)

## ARENA icin kopyalama plani

**Dosya:** `src/pages/Pricing.tsx` (yeni)
**Component'ler:**
- `<PricingHero />` — H1 + aylik/yillik toggle
- `<PlanCard />` × 4 — tenant.plan'a gore CTA
- `<FeatureMatrix />` — collapsed, "tum ozellikleri gor" CTA ile
- `<FAQ />` — 8 soru, accordion

**Route:** `/fiyatlar` (TR), `/pricing` (EN), `/الأسعار` (AR)
**i18n:** plan adlari, feature labels, FAQ, CTA'lar — 13 locale eksiksiz
**Stripe:**
- Starter: `price_starter_monthly` / `price_starter_annual`
- Pro: `price_pro_monthly` / `price_pro_annual`
- Elite: `price_elite_monthly` / `price_elite_annual`
- Enterprise: CTA mailto'ya sales@arena-performance.com

**Design tokens:**
- Seçili plan karti: `border-2 border-primary shadow-xl`
- "Populer" rozet: `bg-primary text-white`
- Annual savings: `text-secondary font-semibold`
- Background: `bg-bg-light` + subtle terracotta radial gradient (%6 opacity)

## Kacinilmasi gereken tuzaklar

- **Fiyati gizleme** — Linear'in "contact sales" Enterprise disinda hepsi acik. TR pazarinda fiyat gizlemek sperilik sinyali verir. Goster.
- **"Unlimited" sozu** — Linear'in plus kart'inda "Unlimited users" yaziyor ama altta "fair use" tooltip var. Legal koy.
- **Toggle animasyonu agir** — Linear'in toggle'i 300ms ease-out. Daha hizli yapma, okuma surecini boz.

## Olcum

- **Conversion target:** trial signup rate %4-8 organic, %8-12 paid
- **Metric:** `plan_viewed` -> `plan_selected` -> `trial_started` funnel
- **Instrument:** PostHog events, Stripe conversion tracking

## Kaynaklar

- https://linear.app/pricing (canli)
- https://github.com/vercel/commerce (open-source benzer pattern)
- https://ui.shadcn.com/examples/cards (kart base'i)
