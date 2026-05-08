---
name: seo-optimizer
description: 2026 SEO + schema + Core Web Vitals v4 for ARENA. Triggers on SEO, google, ranking, meta, schema.
---
# SEO Optimizer — 2026 ARENA

## On-Page (2026)
- **Title** ≤60 char, primary kw near start
- **Meta description** 150-160 char, compelling, kw included
- **H1** primary kw, single per page
- **H2/H3 hierarchy** logical
- **URL slug** readable + kw (`/blog/voleybol-sicrama-programi`)
- **Image alt** descriptive + kw (Turkish semantic)
- **Internal link** 3-5 per 1000 word
- **Canonical** set correctly
- **text-wrap: balance** h1/h2 (2026 native)
- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness
- **Author schema** + expert bio (Elite Coaches 12y+ + certifications)

## Technical SEO
- **Schema.org JSON-LD**:
  - `Article` + `Author` + `DatePublished`
  - `FAQPage` + `Question/Answer`
  - `LocalBusiness` + `Service` (ARENA Performance)
  - `BreadcrumbList`
  - `Review` + `AggregateRating`
  - `VideoObject` for Reels embed
- **robots.txt**: Disallow /admin/, /api/; Allow /*
- **sitemap.xml** lastmod ISO
- **llms.txt** (2026 new!) — AI crawler (ChatGPT, Claude, Gemini) guide
- **Canonical** tag duplicate prevent
- **Open Graph** + **Twitter Card**
- **Favicon** SVG + PNG fallback

## Core Web Vitals v4 (Ranking Factor)
- **LCP** ≤2.0s
- **INP** ≤150ms
- **CLS** ≤0.05
- **TTFB** ≤600ms

## Image SEO
- WebP/AVIF format
- Descriptive filename (`voleybol-sicrama-antrenmani.webp` not `IMG_001.jpg`)
- Alt text full sentence
- Width + height explicit (CLS prevent)
- `loading="lazy"` for below-the-fold
- `fetchpriority="high"` for LCP image
- Structured data `ImageObject`

## Multilingual SEO
- `<link rel="alternate" hreflang="tr" href="...">`
- `<link rel="alternate" hreflang="x-default" href="...">` (TR)
- Content localized (cultural + semantic)

## Local SEO
- Google Business Profile optimization
- NAP consistency (Name, Address, Phone)
- Local schema: `address`, `geo`, `areaServed`
- Turkish content primary
- Embedded Google Map

## Content Strategy 2026
- **Long-tail kw cluster**:
  - "voleybol antrenman programı"
  - "sıçrama egzersizleri"
  - "performans beslenmesi"
  - "yaralanma önleme voleybol"
  - "kadın sporcu beslenme"
- **Topic cluster** (pillar + supporting)
- **Long-form** 1500-2500 word
- **Featured snippet** target (H2 question + concise answer)
- **Video content** (YouTube + Reels)

## Monitoring
- **Google Search Console**
- **Bing Webmaster Tools**
- **Cloudflare Web Analytics**
- **Lighthouse CI**
- **Schema validator**

## AI Crawler (2026 New)
- **llms.txt** — content index for LLM crawler
- **User-Agent allowlist**: GPTBot, ClaudeBot, Google-Extended, PerplexityBot
- **Schema AI-friendly**
- **Conversational Q&A** format

## Checklist PR Gate
- [ ] Title ≤60 char
- [ ] Meta ≤160 char
- [ ] H1 unique + kw
- [ ] Alt text every image
- [ ] Schema JSON-LD valid
- [ ] Canonical present
- [ ] Lighthouse SEO ≥95
- [ ] LCP/INP/CLS green
