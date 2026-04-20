---
name: arena-site-references
description: ARENA Performance icin kopyalanabilir/esinlenilecek en iyi siteler + open-source repo kutuphanesi. Spor akademileri, premium athletic brand, SaaS platform, coach tooling, fitness/wellness marka. Her referansta teardown (ne kopyalanir, ne kopyalanmaz), URL, yonlendirme, uygulama sekli. Tetikleyici: "referans site", "rakip", "kopyala", "teardown", "inspiration", "best in class", "repo ornek", "baska akademi", "competitor".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Site & Repo Reference Library

Hedef: Hic bosa tirnak yok. Her pattern, her interaksiyon, her komponent — biri dunyada cok iyi yapmis. Once onu incele, sonra kendine ozellestir.

## 0) Kopyalama Felsefesi

1. **Kopyala degil, oku**: Pixel-perfect clone yasak (hem legal hem cikis yok)
2. **Kalite patterns al, stil kendi olsun**: Nike hero treatment -> ARENA terracotta palette'e cevir
3. **Yeni fikirleri yeniden birlestir**: 2+ referansi karistir (Whoop data UX + Nike brand tension = yeni sey)
4. **Copyright/trademark uyar**: Logo/marka/slogan copyright korumalidir, layout/animation pattern genellikle degil

## 1) Premium Sports Academy — Direkt Rakip

### IMG Academy (img.edu / imgacademy.com)
- **Neye bak**: Admissions flow, sport-specific landing pages, alumni showcase, facility tour video
- **Kopya-uygun pattern**: "Elit atletlerimizden" testimonial carousel, sayisal sonuc infografikleri (SAT + athletic combine stats)
- **Kopyalama**: Hero'da "Be Stronger" mesaji + split video/quote layout
- **ARENA uygulama**: Bizde "Guclu Ol" zaten ayni semantik mekanda — video hero + quote overlay alalim

### Nike Academy / Nike Football (nikefootball.com)
- **Neye bak**: Micro-interactions, video layering, multi-stage CTA
- **Kopya-uygun**: Parallax hero with subtle character motion, edge-to-edge video, "Step Into Greatness" lead gen funnel
- **ARENA uygulama**: Landing'e Nike tarzi "Step Into" -> "Sahaya Adim At" CTA wizard

### Tom Brady's TB12 Sports (tb12sports.com)
- **Neye bak**: Method-driven content, coach credibility, progressive disclosure
- **Kopya-uygun**: "The Method" page: step 1-2-3-4 vertical scroll with sticky visuals
- **ARENA uygulama**: Methodology bolumunu bu sekilde yap — 6 disiplinli gelisim esasimiz sticky scroll'a gecirilir

### Altis Performance (altis.world)
- **Neye bak**: Coach bio pages, "The Cycle" education resource, freemium model
- **Kopya-uygun**: Coach pages'in hero treatment + embedded teaching video + articles
- **ARENA uygulama**: Cakir Buruc coach sayfasi + dogrudan isterse call-to-book

### Parisi School of Speed (parisischool.com)
- **Neye bak**: Franchise/tenant model (bizim white-label'imizla birebir aynisi)
- **Kopya-uygun**: Find-a-location map, Franchise sell page
- **ARENA uygulama**: Tenant directory + Franchise sales page (arena-tenant-whitelabel skill'i aktive)

## 2) Premium Athletic Brand

### Nike (nike.com)
- **Kopya-uygun patterns**:
  - Product carousel: horizontal snap-scroll with 3D-esque hover
  - Filters: side-drawer, animated badge count
  - Editorial: grid story pages with full-bleed images
- **Don't copy**: Swoosh, "Just Do It" anything close
- **Stack ipucu**: Next.js + Shopify backend, animation frame-motion

### Alo Yoga (aloyoga.com)
- **Kopya-uygun**:
  - Premium product tile with 2-image hover (front + back)
  - Sticky add-to-cart with size/color swatches
  - Breathing text animations ("Fascia" style subtle)
- **ARENA uygulama**: Training kit / merchandise section'a Alo patterns

### Lululemon (lululemon.com)
- **Kopya-uygun**:
  - Community event tile + RSVP modal
  - Guide pages: "How to start yoga"-style explainer
  - Quiz funnel: "Find your perfect..." -> product match
- **ARENA uygulama**: "Profiline Uygun Antrenman Bul" quiz — 5 sorulu, ucretsiz trial'a yonlendirir

### Whoop (whoop.com)
- **Kopya-uygun**:
  - Interactive data visualizations (Recovery/Strain grafikler)
  - Dark mode first, data-forward
  - "The Science" sayfa: whitepaper quality
- **ARENA uygulama**: Portal'da Whoop-level data visualization — arena-chart-craft skill'e dayali

### Tonal (tonal.com)
- **Kopya-uygun**:
  - "How it works" 3D walkthrough (Three.js)
  - Form interaction: workout builder UX
  - Subscription bundle clarity ($49/month shown everywhere)
- **ARENA uygulama**: 3D salon tour + plan karsilatirma kartlari

### Peloton (onepeloton.com)
- **Kopya-uygun**:
  - Instructor grid with filters (class type, duration, difficulty)
  - Live leaderboard mini
  - Class detail modal with thumbnail + duration + difficulty pill
- **ARENA uygulama**: Coach directory + class library (Pro plan feature)

## 3) Sports Tech SaaS

### TeamSnap (teamsnap.com)
- **Kopya-uygun**: Parent scheduling UX, RSVP flow, team roster management
- **ARENA uygulama**: parentPortal feature flag'de bu pattern

### Hudl (hudl.com)
- **Kopya-uygun**: Video analysis timeline, coach annotation layer
- **ARENA uygulama**: Elite plan feature — match video review tool

### MaxPreps (maxpreps.com)
- **Kopya-uygun**: Athlete stats profile sayfasi, season summary cards
- **ARENA uygulama**: Athlete public profile (portfolio) — SEO icin + scout'lari cekmek icin

### Volo (volo.co, eski VoloSports)
- **Kopya-uygun**: League sign-up flow, calendar integration
- **ARENA uygulama**: Tournament/scrimmage registration flow (Elite feature)

### CoachUp (coachup.com)
- **Kopya-uygun**: Coach marketplace, review + rating, book session flow
- **ARENA uygulama**: "Private Coach Bul" marketplace — revenue share %20

## 4) SaaS Pricing + Onboarding Mastery

### Linear (linear.app)
- **Kopya-uygun**:
  - Keyboard-first UX
  - Changelog (dev log, transparency)
  - Subtle but polished page transitions
- **ARENA uygulama**: Admin panel keyboard shortcuts (Cmd+K command palette)

### Vercel (vercel.com)
- **Kopya-uygun**:
  - Deployment-style animated hero (real-time data visualization)
  - Dark-first brand, neon accent
  - Pricing 3-tier + enterprise "Contact Sales"
- **ARENA uygulama**: Billing page — Vercel pricing aesthetic'i ARENA tokens'la

### Stripe (stripe.com)
- **Kopya-uygun**:
  - Hero with code/dashboard side-by-side
  - Animated product cards (scroll-triggered)
  - "Why Stripe" testimonial + logo wall
- **ARENA uygulama**: "Why ARENA" sayfasi (scroll-triggered reveal)

### Notion (notion.so)
- **Kopya-uygun**:
  - Template gallery with preview modal
  - Multi-persona landing (for teams/students/designers)
  - AI assistant embedded
- **ARENA uygulama**: "Role ile baslayin" — parent/coach/athlete her birine ayri landing

### Superhuman (superhuman.com)
- **Kopya-uygun**:
  - Onboarding concierge (real human intro call)
  - Exclusive invite-only waitlist
  - Manifesto page ("Why we exist")
- **ARENA uygulama**: "ARENA Manifesto" sayfasi + Elite tier icin 1-on-1 onboarding call

## 5) Design/Portfolio Quality Benchmarks

### Awwwards Winners — Sports category
URL: https://awwwards.com (filter: sports + site of day)
- Bak: Her ay top 5 sports site
- Kopya-uygun: Grid/typography/motion trend'leri
- Kural: tam scroll tracing yap, sonra parcalari kendi palette'ine geri kur

### Cuberto / Obys Agency portfolios
- URL: cuberto.com, obys.agency
- Neye bak: Premium motion, curated case studies
- Kopya-uygun: Case study presentation format
- ARENA: Basari hikayesi sayfalarini bu formatta yapalim (Sporcu -> Once -> Gelisim -> Sonuc)

### Apple Sport Watch (apple.com/apple-watch)
- Neye bak: Product page scroll storytelling, sticky imagery
- Kopya-uygun: Feature teaser + scroll-unfold gallery
- ARENA: Portal feature showcase sayfasi Apple-level scroll deneyimi

## 6) Open-Source Template Repos (Gercek Starter'lar)

### Free + MIT

#### T3 Stack (create-t3-app)
- URL: https://create.t3.gg/
- Stack: Next.js, Prisma, tRPC, Tailwind
- Kullanim: Genel SaaS scaffolding icin referans (biz Vite kullaniyoruz ama patterns benzer)

#### Shadcn UI + Taxonomy
- URL: https://tx.shadcn.com/, github.com/shadcn-ui/taxonomy
- Stack: Next.js 14, Shadcn, Stripe, NextAuth
- Kopya-uygun: Pricing page, dashboard layout, auth UI
- ARENA cevirme: Shadcn UI bilesenleri zaten ARENA tokens'la tema-uygun

#### Supabase Next.js Starter
- URL: github.com/vercel/next.js/tree/canary/examples/with-supabase
- Bize Vite version: github.com/supabase/supabase/tree/master/examples/with-vite
- Kopya-uygun: RLS yapilandirmasi, auth provider, Realtime hook
- Bizde zaten bu patterns var, ama yeni Supabase release'leri kontrol

#### Precedent (Vercel)
- URL: github.com/steven-tey/precedent
- Stack: Next.js + Tailwind + NextAuth + Prisma
- Kopya-uygun: Dashboard layout, dark mode, modal system
- ARENA: Admin panel sayfalari

### Portfolio Starter'lar (3D/Animation)

#### adrianhajdin/project_3D_developer_portfolio
- URL: github.com/adrianhajdin/project_3D_developer_portfolio
- Stack: React + Three.js + Framer Motion
- Kopya-uygun: 3D hero canvas, experience section
- ARENA: Landing hero 3D canvas — arena-3d-animation skill'in referans repo'su

#### Naresh-Khatri/3d-portfolio
- URL: github.com/Naresh-Khatri/3d-portfolio
- Stack: React Three Fiber + drei + GLTF models
- Kopya-uygun: Scroll-triggered 3D transitions
- ARENA: Landing video yerine 3D model interaktif (hero section variant)

#### kakajika/FragmentAnimations
- URL: github.com/kakajika/FragmentAnimations
- Kopya-uygun: Shader fragment examples
- ARENA: Hero arka plan animated shader (dusuk perf cost)

#### fireship-io/threejs-scroll-animation-demo
- URL: github.com/fireship-io/threejs-scroll-animation-demo
- Kopya-uygun: Scroll-linked camera path
- ARENA: "ARENA Journey" scroll-triggered 3D tur (elit plan landing)

#### pmndrs/react-three-fiber + drei
- URL: github.com/pmndrs/react-three-fiber
- Kopya-uygun: Tum R3F ecosystem
- Ana kitaplik — arena-3d-animation skill'i buna dayaniyor

#### tengbao/vanta
- URL: github.com/tengbao/vanta
- Kopya-uygun: 2-satir 3D background (WAVES, FOG, BIRDS, RINGS, CLOUDS)
- ARENA: Dusuk effort, yuksek impact hero background (lazy load)

### Landing Page Starter'lar

#### Tailwind Plus / Tailwind UI (eski Tailwind UI)
- URL: tailwindcss.com/plus (ucretli $299)
- Kopya-uygun: Marketing components, application UI, e-commerce
- ARENA: Tum landing ogeler (pricing, features, hero) hazir — lisans gerekli

#### Landingfolio
- URL: landingfolio.com (ucretsiz + pro)
- Kopya-uygun: 100+ landing ornek per kategori
- ARENA: "Fitness" + "SaaS" + "Education" kategorileri ozel tara

#### Saas UI
- URL: saas-ui.dev
- Stack: Chakra UI, Next.js
- Kopya-uygun: Auth flows, dashboards

#### Midday (open source SaaS)
- URL: github.com/midday-ai/midday
- Stack: Next.js 14, Tailwind, Supabase, React Email
- Kopya-uygun: Admin panel, invoice flow (gelecekte ARENA'ya gerekli)

#### Cal.com (open source Calendly)
- URL: github.com/calcom/cal.com
- Kopya-uygun: Availability UX, booking widget embed
- ARENA: "Deneme dersi randevusu" Cal.com-style widget (embed veya clone)

### Design System Repos

#### radix-ui/primitives
- URL: github.com/radix-ui/primitives
- Kullanim: Shadcn bunun uzerine — accessible base components
- ARENA: Bizim form + dialog + tooltip zaten Radix uzerine

#### DesignBackground/Zaboot
- URL: github.com/DesignBackground/Zaboot
- Kopya-uygun: Premium marketing template
- ARENA: Footer + newsletter section pattern

### 3D + Animation Lib Specific

#### greensock/gsap-trial
- URL: github.com/greensock/gsap-trial (ticari lisans)
- Kopya-uygun: ScrollTrigger example patterns
- ARENA: MotionPath + ScrollTrigger kombinasyonlari (kisitli kullanimda)

#### pmndrs/drei
- URL: github.com/pmndrs/drei
- Kopya-uygun: Helpers, abstractions, scroll controls
- ARENA: <ScrollControls> ile landing scroll narrative

#### mrdoob/three.js examples
- URL: threejs.org/examples
- Kopya-uygun: Shader, post-processing, physics patterns
- ARENA: ornek galeri — prod'a adapte et

### AI/Media Generation (User'in Paylasti)

| Repo | Amac | ARENA Kullanim |
|---|---|---|
| heygen-com/hyperframes | Synthetic video frames | Antrenor avatar fallback |
| Tencent-Hunyuan/HY-Motion-1.0 | Body motion generation | Spike/serve hareket clipleri |
| OpenTalker/SadTalker | Foto + ses = konusan yuz | Coach tanitim video (ucretsiz) |
| fudan-generative-vision/champ | Ref-driven animation | Pro hareket transferi |
| yfeng95/DECA | 3D yuz rig | MetaHuman pipeline |
| Mesh2Motion/mesh2motion-app | 3D mesh -> rigged skeleton | 3D mascot animasyonu |
| galacean/engine | Web-based 3D engine | R3F alternatifi (Chinese market) |
| o3de/o3de | Full 3D engine | Uzun vade simulasyon (scope out for now) |

## 7) Blog/Content Reference

### The Players' Tribune (theplayerstribune.com)
- Kopya-uygun: Long-form athlete essay format
- ARENA uygulama: Blog'da "Sporcu Günlükleri" — Türkçe original essays

### GQ Sports (gq.com/sports)
- Kopya-uygun: Editorial photography + deep bio pieces
- ARENA: Aylik "ARENA Dergi" format (PDF + web)

### Men's Health (menshealth.com)
- Kopya-uygun: Workout programming cards ("8-Week Program")
- ARENA: "8 Haftalik Gelisim Programi" free + paid tier

### Outside Online (outsideonline.com)
- Kopya-uygun: Longform + typography + photo-led
- ARENA: Tum content.arena.kozbeylikonagi.com.tr alt domain

## 8) TR-Spesifik Rakipler

### Acibadem Spor (acibademspor.com)
- Medical + sports combine; premium pozisyonlama
- Kopya-uygun: Fizyoterapi + performans paket tanitimi
- ARENA uygulama: Medical partner (fizyoterapist) referans ekle

### ONS Spor (ons.com.tr)
- Franchise model, cocuk odakli
- Kopya-uygun: Franchisee basvuru flow
- ARENA uygulama: White-label launch landing format referans

### Sportsacademy.com.tr
- Beach volleyball + indoor volleyball karisim
- Kopya-uygun: Branch directory
- ARENA: Tenant list + location map

### Doga Koleji Sports
- Scholar-athlete entegrasyon
- Kopya-uygun: "Parent testimonial + success story" layout
- ARENA: Sporcu + akademik basari testimonial combo

## 9) Teardown Template

Her referans icin bu sablonu doldur (arena-competitor-teardowns/ klasorunde):

```md
# [Site Adi]

## Meta
- URL:
- Taken: YYYY-MM-DD
- Stack tahmin: (Wappalyzer/view-source)
- Monthly traffic: (SimilarWeb)

## Hero
- Video/Image/3D:
- CTA: (exact text)
- Subtext len:
- Animation:

## Pricing
- Tier sayisi:
- Fiyat (monthly/yearly):
- Trial var mi:
- Contact sales kime:

## Onboarding
- Signup step sayisi:
- Required fields:
- Social login:
- Email verify:

## Key Pages
- /features:
- /pricing:
- /about:
- /blog:

## UX Highlights
- 3 en iyi interaction:
- 2 copy pattern:
- 1 negative (what they did wrong):

## Kopya Plan
- [ ] Pattern A -> ARENA component X
- [ ] Pattern B -> ARENA page Y
- [ ] Avoid: Z (because...)
```

## 10) Automated Discovery

### BuiltWith Tech Lookup
URL: builtwith.com/{domain}
- React/Next/Vite? Stripe/iyzico? Google Analytics/PostHog?
- ARENA: rakipleri tara, tech stack kaydet (spreadsheet)

### SimilarWeb
URL: similarweb.com/website/{domain}
- Traffic source breakdown (organic/direct/social/referral)
- Top pages
- ARENA: content strategy planla (hangi sayfalar trafik cekiyor)

### Ahrefs / SEMrush (ucretli)
- Backlink analizi + keyword gap
- ARENA: rakiplerin sirali oldugu Turkce keyword'ler -> icerik plani

### Wappalyzer Browser Extension
- Real-time tech stack detect
- ARENA: her referans site'i aciarak otomatik stack al

### Figma Community
URL: figma.com/community
- "Sports academy" + "SaaS dashboard" + "Fitness app" -> free templates
- ARENA: Figma Community'den mesela "Peloton-style workout app UI" kopyala (lisans uyar)

## 11) Copy-to-ARENA Workflow

```
1. Referans site'i tara (teardown doldur)
  ↓
2. 3 en onemli pattern'i belirle
  ↓
3. Her pattern icin ARENA transform:
  - Palette change: terracotta/sage/coast
  - Copy change: Turkish, warm Mediterranean voice
  - Feature change: volleyball/youth context
  ↓
4. Staging branch'te prototype
  ↓
5. A/B test (mevcut vs yeni)
  ↓
6. Winner -> production
```

## 12) Red Flags

- **Pixel-clone = legal risk**: Layout pattern OK, exact copy degil
- **Logo/mark/tagline**: ASLA kopya. Trademark hakki.
- **Copyright fotograflari**: Getty/Shutterstock unlicensed = telif ihlal
- **Font licensing**: Premium font'lari server'a yerlestirme (Adobe Fonts/Google Fonts OK)
- **Code olarak copy**: GPL/AGPL repo'yu kapali kaynakta kullanamazsin (MIT/Apache OK)

## 13) Lisans Matrisi (Ortak Open Source)

| Lisans | Ticari? | Kaynak Ac? | Notlar |
|---|---|---|---|
| MIT | Evet | Hayir | En permissive, credit yeter |
| Apache 2.0 | Evet | Hayir | Patent koruma + credit |
| BSD 3-Clause | Evet | Hayir | MIT benzeri |
| ISC | Evet | Hayir | MIT ile esit |
| GPL v3 | Evet | EVET | Turetilmis ad kapali kaynak OK DEGIL |
| AGPL v3 | Evet | EVET (SaaS dahil) | SaaS yayinlayinca source release zorunlu |
| Unlicense / CC0 | Evet | Hayir | Public domain |

Karar: MIT/Apache/BSD = yesil. GPL/AGPL = dikkat (ARENA SaaS icin AGPL sorun). Repo lisansini her zaman kontrol et.

## 14) Sprint Plani

### Hafta 1
- 10 referans site teardown
- 3 pattern ARENA'ya import (hero video, pricing cards, testimonial)

### Hafta 2
- Portfolio 3D repo fork
- Landing hero 3D canvas prototype
- A/B 2d vs 3d test

### Hafta 3
- Cal.com embed test / buyuk ihtimalle kendi randevu widget
- parentPortal screen adaption (TeamSnap/Peloton mix)

### Hafta 4
- Blog content 10 makale (Players' Tribune + Men's Health format)
- SEO page generation start (arena-content-automation skill)

## 15) Ozet

Sifirdan baslamak aptalca. 30+ yil deney edilmis patterns var. Biz akilli olanlari alip ARENA'nin Akdeniz sicakligi + Turkce sesi + voleybol uzmanligiyla yeniden dokuyacagiz.

**Primary referans rotasyonu (haftalik)**:
- Pazartesi: Nike / Whoop (premium brand)
- Sali: TB12 / Altis (academy)
- Carsamba: Linear / Vercel (SaaS polish)
- Persembe: Peloton / Lululemon (community + product)
- Cuma: Awwwards top pick (motion + design)

Her hafta 1 pattern -> ARENA implement.

## 16) Varnan-Tech/opendirectory (MIT) — Skill Marketplace

**URL:** https://github.com/Varnan-Tech/opendirectory
**Lisans:** MIT (ARENA SaaS icin uyumlu)
**Star:** 55+ (Apr 2026)
**Dil:** TypeScript %25 + JS %36 + Python %39
**Kullanim:** `npx skills add Varnan-Tech/opendirectory@<skill-name> -g -y`

30+ GTM/marketing/SEO/lead-gen odakli skill registry'si. ARENA tarafinda 9 tanesini iter 18'de yukledik:

### Yuklenen (ARENA icin kritik)
| Skill | ARENA kullanimi |
|---|---|
| pricing-page-psychology-audit | Starter/Pro/Elite/Enterprise kart pattern audit'i |
| brand-alchemy | Akdeniz sicakligi + sporcu enerjisi messaging refine |
| linkedin-post-generator | Kulup/akademi sahiplerine B2B satis |
| outreach-sequence-builder | 5-step cold email to 1000+ TR kulupleri |
| newsletter-digest | Haftalik "ARENA Inside" email digest |
| meeting-brief-generator | Demo call oncesi 1-pager |
| reddit-icp-monitor | r/volleyball, r/parenting, r/turkey signal monitoring |
| cook-the-blog | Coach notlari -> publish-ready blog post |
| human-tone | AI-generated TR metni insanilestirme (robotik ton kirma) |

### Atlanan (ARENA icin uygun degil)
- kill-the-standup (dev team process) — voleybol akademisi icin relevant degil
- pr-description-writer (sadece git) — teknik ekip mikrodan yonetimi
- yc-intent-radar-skill (B2B startup-odakli) — ICP farkli
- producthunt-launch-kit — ARENA consumer+B2B hibrit, PH eslesmiyor
- show-hn-writer — hacker news audience ICP disi
- twitter-GTM-find-skill — LinkedIn + Instagram oncelikli

### Nasil entegre ettik
1. `npx skills add Varnan-Tech/opendirectory@<name> -g -y` ile `~/.agents/skills/`'e yukledik
2. Her birini `.claude/skills/`'e kopyaladik ki proje repo'sunda commit olsun
3. SKILL-INDEX'e "Community Growth/GTM" bolumu olarak ekledik (tetikleyici + amac)

### Onemli not
Opendirectory skill'leri **bizim 15 ARENA-specific skill'imizin yerine gecmez** — yardimci kutuphane olarak kullanilir. Ornek:
- arena-analytics-growth (ana funnel + CAC/LTV stratejisi) + pricing-page-psychology-audit (spesifik pricing audit)
- arena-content-automation (pipeline) + cook-the-blog (tekil blog post refine)
- arena-prompt-library (master prompt template) + human-tone (AI metin insanilastirma)

## 17) Skill Ekosistemi Ozet (Apr 20, 2026)

- **Toplam proje skill:** 88 (iter 18 sonrasi)
- **ARENA-specific:** 17 (15 eski + arena-site-references + arena-competitor-teardowns)
- **Community design:** 23 (frontend-design, frontend-slides, web-design-guidelines, ui-animation, figma-implement-design, impeccable + 17 sub)
- **Community GTM (opendirectory):** 9
- **Mevcut mixed:** 39 (emil-kowalski-motion, taste, ai-council, stitch-loop, vb.)

