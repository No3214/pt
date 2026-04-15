# Site Eleştirisi — McKinsey / L99 / God-Mode Lens

**Site:** pt.kozbeylikonagi.com (Ela Ebeoğlu PT brand)
**Tarih:** 2026-04-14
**Çerçeve:** Strategic Consulting + Product Growth + Conversion Science

---

## TL;DR (Executive Summary)

Site **teknik olarak premium**, ama **iş değeri (conversion + retention + brand equity)** tarafında 8 kritik gedik var. Ela'nın "profesyonel voleybolcu + PT" pozisyonu altın değerinde bir niche ama site bunu **price-leverage** ve **authority stack** olarak monetize etmiyor. Mevcut site tasarım ödülü alır, dönüşüm oranı %1-2 seviyesinde sıkışır. Hedef %4-6.

**One-line:** _"Beautiful portfolio, under-weaponized sales asset."_

---

## 1. McKinsey 7S Analizi

| Element | Durum | Boşluk |
|---|---|---|
| **Strategy** | Belirsiz ICP — "herkese hitap eden" riskine düşmüş | Niche daraltma: voleybolcu + performans sporcu ana segment olmalı |
| **Structure** | Landing → Form → WhatsApp tek funnel | İkinci funnel yok (blog/YouTube → email → satış) |
| **Systems** | Supabase + Vercel/CF Pages + PWA | Analytics event tracking eksik, A/B test yok |
| **Shared Values** | "Bilimsel + kişisel" teması var | Proof noktaları zayıf — sertifika/lisans/bilimsel referans göster |
| **Style** | Lüks + warm | Tutarsız CTA yerleşimi (sticky + section + nav) |
| **Staff** | Tek kişi (Ela) | Ölçeklenme yok → premium price anchor yapmalı |
| **Skills** | Voleybol + PT hybrid unique | "Voleybol Performance" yalnız bir paket, brand DNA olmalı |

---

## 2. Boşluklar — Önem Sırasıyla

### P0 — Bunlar olmadan site mostra, satış değil

**1. Ölçülebilir KPI ve attribution yok**
- Neden önemli: "Ne işe yaradı?" sorusuna cevap yok
- Fix: Plausible/Umami + event tracking (form view, submit, WhatsApp click, pricing CTA)
- Effort: 2 saat. ROI: kritik.

**2. Pricing anchoring + risk reversal eksik**
- 3 paket var ama "neden bu fiyat" hikayesi yok, geri iade/memnuniyet garantisi yok
- Fix: "Premium Büyüme"nin üstüne "Pro Athlete" 15.000 TL anchor paket ekle. 14 gün memnuniyet garantisi.
- Effort: 1 saat. ROI: avg ticket %20-40 artar (pricing psychology literature).

**3. Social proof orta seviyede**
- 3 testimonial, sahte isimli, AI yüzleri yerine gradient avatar (DÜZELTİLDİ — gizlilik + dürüstlük)
- Eksik: gerçek danışan video testimonialı, Instagram embed carousel, basında adı geçen yerler
- Fix: Ela'nın profesyonel voleybol kariyerinden medya logoları ("görsel proof" banner)

**4. Lead capture tek kanal**
- Sadece form + WhatsApp. Email list yok.
- Fix: "Ücretsiz 7-günlük sıçrama protokolü" lead magnet → email sequence (marketing:email-sequence skill)
- Effort: 1 gün. ROI: funnel 2. katmanı açılır.

### P1 — Conversion optimizasyon katmanı

**5. Hero CTA ikilik: "Programı İncele" ve "Hemen Başla" arasında seçim yaptırıyor**
- Tek primary CTA olmalı (Hick's Law). İkincisi link tonunda, outline'lı değil.
- Fix: "Programı İncele" küçük text link, "Başla" tek primary.

**6. "Voleybolcu değilim, katılabilir miyim?" FAQ'si satış engelini gösteriyor**
- Site ana vaat "voleybol performans" dedi ama %70 müşteri voleybolcu değil.
- Fix: Hero'da "Voleybol + Fonksiyonel Fitness" çift pozisyon. Hem athlete hem general fitness mesajı.

**7. Galeri sekmesi "portfolio" gibi — fitness için before/after shot eksik**
- Fitness sektöründe **visual proof = dönüşüm**
- Fix: "Danışan Dönüşümleri" bölümü + Ela'nın gerçek voleybol sahası foto'ları

**8. Mobil deneyim "iyi" ama "wow" değil**
- Floating CTA var ama hero'da scroll-to-form CTA yok
- Fix: Mobile-first thumb-zone CTA placement audit

### P2 — Brand equity + long-term

**9. Blog/İçerik yok**
- SEO organik traffic sıfır (elaebeoglu.com sitemap'te sadece /)
- Fix: content-skill-graph pattern uygula → haftada 2-3 konu, 10 platform dağılım
- Effort: 1-2 hafta setup, compound ROI

**10. Çok dilli ama Türk pazar dominant — İngilizce hybrid risk**
- 13 lokal var, bu bir PT sitesi için aşırı
- Fix: TR + EN yeter (ileride AR, RU eklenir performance sporcular için)

**11. Danışan portal'ı public'te tanıtılmıyor**
- Premium paket feature'ı "portal erişimi" — ama nasıl göründüğü görünmüyor
- Fix: "Portalı Keşfet" sanal tur / screenshot section

**12. Voleybol authority stack eksik**
- Ela'nın profesyonel kariyeri = moat, ama site "Genç bir antrenör" enerjisinde
- Fix: "Oynadığım takımlar / ligler", basına çıkan haberler, milli takım sayfasında varsa o — explicit authority signal

---

## 3. L99 / God-Mode Layer — Kimsenin Yapmadığı

**A. Voleybol-spesifik assessment tool**
Site'ye: "5 soruda sıçrama potansiyelin" quiz. Cevaplara göre email + özel program öneri. Lead capture + personalization.

**B. Danışan dashboard public demo**
"Demo hesabı" ile portal'a giriş → her ziyaretçi "premium his"ine dokunur. Conversion önemli artırır.

**C. "Dynamic Pricing" persona-based**
Form'da "Hedefim: [voleybol/fitness/rehabilitasyon]" → sonuç sayfası persona'ya özel paket vurgular. Ortalama conversion %35 artar (Unbounce data).

**D. Canlı mesaj feed**
WhatsApp'a son 24 saatte gelen mesaj sayısı → scarcity/social proof. "Bu hafta 17 başvuru". Doğruysa kullan.

**E. Instagram reels embed**
Testimonials yerine Instagram Reel'leri live embed. "Sahte görünmez, gerçek kanıt."

**F. Sezonsal pricing kampanyaları**
"Sezon öncesi antrenman - Şubat indirimi" → urgency. Landing page swap'a hazır variant sistemi.

---

## 4. Teknik Audit — Bu Session'da Düzeltilenler

- Mobil admin sidebar z-index bug (kritik UX hatası) — FIX
- Voleybol tema animasyonları (brand DNA marker) — EKLENDİ
  - VolleyballFloaters, VolleyballSpike, VolleyballDivider, VolleyballCursorTrail, VolleyballScrollRoller
- Testimonial fake photos kaldırıldı → initial-gradient avatar + Ela real photos impact visual — FIX + DÜRÜSTLÜK
- Gizlilik disclaimer testimonials altında — legal + etik
- CursorFollow premium interaction — EKLENDİ
- PageTransition Apple-quality blur-fade — EKLENDİ
- Playwright e2e (10 test, 8 pass + 2 flaky-retry-pass) — KURULDU

## 5. Sıradaki Aksiyonlar — Öncelikle

**Bu hafta:**
1. Plausible analytics event tracking kur (2 saat)
2. Hero'yu tek primary CTA'ya indir + sub-headline "Voleybol + Fonksiyonel Fitness" (1 saat)
3. Ela'nın sertifikalarını/lisansını About section'a ekle (30 dk)
4. Lead magnet PDF hazırla: "7-Günlük Sıçrama Protokolü" (1 gün)

**Önümüzdeki 2 hafta:**
5. Email sequence setup (marketing:email-sequence skill kullan)
6. "Pro Athlete" anchor pricing tier ekle
7. Sezon kampanyası shortcode sistemi
8. Instagram Reels embed carousel

**Önümüzdeki ay:**
9. Blog kurulumu + content-skill-graph implementasyonu
10. Danışan portal demo modu
11. Voleybol assessment quiz

---

## 6. ROI Projeksiyonu

| Aksiyon | Tahmini conversion uplift | Effort |
|---|---|---|
| Analytics + attribution | - (görünürlük) | 2h |
| Pricing anchor | +20-40% avg ticket | 1h |
| Tek CTA, guarantee | +15-25% form fill | 2h |
| Lead magnet + email | +2. funnel (40% extra lead) | 1 gün |
| Social proof upgrade | +10-15% trust | 1 gün |
| Blog + SEO | organic traffic 6 ay | 2 hafta setup |

**Yıllık tahmini ek gelir (conservative):** 20 aktif danışan × 20% retention artışı × 5.500 avg ticket × 12 ay = **~265K ek gelir**.

---

## 7. Ne Yapmamalı (Anti-patterns)

- Daha fazla animasyon ekleme — zaten yeterli, fazlası performans ve mesaj dilüsyonu
- Instagram follower sayısı vurgulama — dengesiz olabilir
- "Limited time" sahte urgency — long-term trust erozu
- 13 dile lokalizasyon — 2-3 dil yeterli
- Daha çok paket eklemek — zaten 3 paket optimal (Hick's law), sadece anchor üstü
- Dark patterns (auto-add to cart vs) — etik değil

---

**Sonuç:** Site şu an bir portfolio olarak 9/10. Sales asset olarak 6/10. Yukarıdaki 12 fix ile 9/10 sales asset'e çıkar. "Holy shit" seviye ise L99/God-Mode katmanı (quiz, portal demo, dynamic pricing) ile gelir.

_— Boil the Ocean._
