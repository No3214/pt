# Whoop — Hero Video + Athlete Storytelling Teardown

**URL:** https://www.whoop.com
**Kategori:** Atletik performans markasi, fizyolojik veri + lifestyle
**ARENA'da kopyalanacak:** hero video loop, athlete story section, data visualization style

## Ne iyi yapiyorlar

1. **Hero video: 8-12 saniye loop, sessiz otomatik oynatma**
   - Atlete yakin cekim: nabiz attigi boyun damari, el kavrama, gozler
   - Ortama grainy grade: mavi-siyah + sicak cilt tonu
   - Cut ritmi: 1.5-2s per shot, hizli ama okunur
   - Text overlay minimum — sadece alt sag'da "24/7 recovery" gibi micro-copy

2. **Scroll-triggered athlete stories**
   - Her atlet: full-viewport image + 2 satir alinti + isim/unvan + sport tag
   - Parallax: image 0.5× hiz, text 1× — derinlik illuzyonu
   - 4-5 atlet rotate oluyor: NFL, golfer, CrossFit, soccer, olympian
   - ARENA: 4-5 voleybolcu + yuzucu + basketbolcu + antrenor rotate et

3. **Veri gorsellestirme — Strain / Recovery / Sleep score**
   - Ring-based gauge (0-21 scale)
   - Renk: kirmizi (dusuk) -> sari -> yesil (yuksek)
   - Tooltip'te "your body is X% recovered"
   - ARENA: AI Score (0-100) ring'le goster, benzer hierarchy

4. **Model showcase hic yok**
   - Whoop cihazi koldaykan gorunmez tasarim — site cihazi tasiyor olarak sadece 1-2 shot'ta gosteriyor
   - Anlam: "bizim icin sen onemlisin, cihaz arka plan"
   - ARENA: uygulamayi az goster, sporcuyu cok goster

5. **CTA "Start your journey"**
   - "Buy now" degil. "Start your journey". Psikolojik bagi kuruyor
   - Altta "30-day free trial" micro-text — komitman'i azaltiyor

6. **Membership framing**
   - "Join the WHOOP family" — satin alma degil, uyelik
   - Renewable-subscription psikolojisi dogal karsilaniyor
   - ARENA: "ARENA'ya katil" degil "Akademimize katil" — kulubumsu his

## Teknik pattern

- Hero video: `<video autoplay muted loop playsinline poster={posterJpg}>` + `preload="metadata"`
- H.265/HEVC + H.264 fallback `<source>` tag'leri
- CloudFront/Fastly CDN — PSI icin critical
- First-paint: poster JPG LCP'yi dusuruyor, video loaded sonrasi fade-in
- Reduced motion: `@media (prefers-reduced-motion)` -> statik poster goster

## ARENA icin kopyalama plani

**Component:** `<HeroVideo />` refactor
**Dosya:** `src/components/landing/Hero.tsx`

```tsx
// src/components/landing/Hero.tsx
import { useRef, useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'

const HERO_SOURCES = [
  { type: 'video/webm; codecs=av01', src: '/videos/hero-spike-av1.webm' },
  { type: 'video/mp4; codecs=hvc1',  src: '/videos/hero-spike-hevc.mp4' },
  { type: 'video/mp4; codecs=avc1',  src: '/videos/hero-spike-h264.mp4' },
]

export function HeroVideo() {
  const prefersReduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (prefersReduced) videoRef.current?.pause()
  }, [prefersReduced])

  if (prefersReduced) {
    return (
      <img
        src="/videos/hero-spike-poster.jpg"
        alt="ARENA voleybol atleti spike hareketi"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay muted loop playsInline
      poster="/videos/hero-spike-poster.jpg"
      preload="metadata"
      className="absolute inset-0 w-full h-full object-cover"
      aria-hidden="true"
    >
      {HERO_SOURCES.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}
```

**Veo 3 prompt ID:** `hero-spike-action-v1` (zaten prompts/video/veo-hero-library.json'da)
**Render:** `npx tsx scripts/ai-video/generate-hero.ts --filter=hero-spike-action-v1`
**Storage:** `r2://arena-media/videos/hero-spike-*.{webm,mp4}`
**CDN:** Cloudflare Pages + R2 signed URL

## Athlete story section

**Dosya:** `src/components/landing/AthleteStories.tsx`

```tsx
const ATHLETES = [
  { id: 'a1', name: 'Melis K.', sport: 'Voleybol', age: 16, quote: '...', image: '/athletes/a1.jpg' },
  { id: 'a2', name: 'Emre T.',  sport: 'Yuzme',    age: 15, quote: '...', image: '/athletes/a2.jpg' },
  // ... 4-5 atlet
]
```

Her kart: parallax layer'i (framer-motion `useScroll` + `useTransform`), quote fade-in on view.

**Data viz (Whoop-style ring):**
- `src/components/portal/AIScoreRing.tsx`
- SVG circle + `strokeDasharray` animation
- Renk gradient: `#C2684A -> #7A9E82` (ARENA terra->sage)

## Kacinilmasi gereken tuzaklar

- **Hero video > 3MB** — LCP'i olduruyor. 1080p 8s'lik video hedef 1.5MB altina AV1 codec ile
- **Autoplay with sound** — iOS'ta bloke, Chrome'da spam flag'i. Her zaman `muted`
- **"Best for athletes" claim** — FTC/Reklam Kurulu kuralina takilir. ARENA'da "sporcu dostu" gibi softer ifade
- **Veri gauge'da "your score"** — gercek bir skor yoksa dummy gosterme. Demo toggle ekle

## Olcum

- **LCP target:** < 2.0s on 3G
- **Video engagement:** scroll-depth > 50% = "viewed" event
- **CTA click rate:** hero CTA > 6% target
- **Instrument:** web-vitals + PostHog

## Kaynaklar

- https://www.whoop.com (canli)
- https://developers.google.com/web/fundamentals/media/video (best practices)
- https://github.com/vercel/next.js/blob/canary/examples/video-hero/ (benzer implementation)
