# Skill Index - Auto-Trigger Reference

## ARENA-Specific Skills (Production-Grade Playbooks)

| Skill | Tetikleyici | Amac |
|---|---|---|
| arena-supabase-master | supabase, rls, migration, auth, realtime | Supabase 2 mastery: RLS, migrations, realtime, edge functions, storage |
| arena-motion-lab | motion, animation, framer, stagger, parallax | Framer Motion 11 choreography: easing, stagger, scroll-linked, tilt |
| arena-i18n-ops | i18n, ceviri, locale, rtl, lokalizasyon | 13-locale ops: tr source-of-truth, RTL, Intl.NumberFormat |
| arena-a11y-wcag | a11y, wcag, focus, screen reader, keyboard | WCAG 2.2 AA: focus trap, ARIA, landmark, axe/pa11y |
| arena-pwa-craft | pwa, offline, service worker, push, install | PWA: caching, UpdatePrompt, Web Push VAPID, background sync |
| arena-form-craft | form, zod, validation, react-hook-form, input | Forms: zod + RHF, async validation, wizard, file upload |
| arena-chart-craft | chart, grafik, recharts, radar, viz | Recharts with ARENA tokens: line, bar, area, radar, heatmap |
| arena-lighthouse | lighthouse, performance, cwv, lcp, inp, cls | Lighthouse 4x >= 95 + CWV: image, font, bundle, RUM |
| arena-tenant-whitelabel | white-label, tenant, multi-tenant, reseller | Multi-tenant SaaS: brand tokens, RLS, custom domain, billing |
| arena-3d-animation | 3d, three, r3f, vanta, webgl, animation | 3D pipeline: R3F, drei, DRACO, GSAP scroll, Vanta |
| arena-billing-stripe | billing, stripe, iyzico, subscription, payment | Stripe + iyzico: subscription, webhook idempotency, MRR, tax |
| arena-analytics-growth | analytics, posthog, funnel, retention, cac | PostHog taxonomy, A/B, cohort, email seq, paid ads, CAC/LTV |
| arena-ai-video | ai video, veo, flow, imagen, sadtalker, avatar | AI video: Veo 3, Higgsfield, SadTalker, HY-Motion, champ, DECA |
| arena-prompt-library | prompt, template, headline, caption, copy | Kanitlanmis prompt kutuphanesi: video/image/copy/code/design |
| arena-content-automation | automation, pipeline, n8n, batch, calendar | Uctan uca icerik: brief -> generate -> review -> publish |
| arena-site-references | teardown, referans, benzer site, copy site | 30+ premium site teardown + OSS repo listesi + lisans matrisi |
| arena-competitor-teardowns | competitor, teardown, linear gibi, whoop gibi | Satir satir competitor analizi + ARENA'ya port edilecek kod |

## Community Skills (Iter 17-18 Installed)

### Design & UI (anthropics / vercel / figma / mblode / zarazhangrui)
| Skill | Kaynak | Tetikleyici |
|---|---|---|
| frontend-design | anthropics/skills | premium UI, design review, visual hierarchy |
| frontend-slides | zarazhangrui | deck, sunum, slide |
| web-design-guidelines | vercel-labs/agent-skills | web design principles, layout, typography |
| ui-animation | mblode/agent-skills | animation, motion, micro-interaction |
| figma-implement-design | figma/mcp-server-guide | figma to code, design handoff |

### Impeccable Design Suite (pbakaus)
| Skill | Amac |
|---|---|
| impeccable | Ana orkestra: overall design polish |
| impeccable-adapt | Responsive adaptation |
| impeccable-animate | Animation polish |
| impeccable-audit | Design audit pass |
| impeccable-bolder | Boldness enhancement |
| impeccable-clarify | Content clarity |
| impeccable-colorize | Color palette optimization |
| impeccable-critique | Design critique |
| impeccable-delight | Micro-delight additions |
| impeccable-distill | Essence distillation |
| impeccable-layout | Layout composition |
| impeccable-optimize | Performance optimization |
| impeccable-overdrive | Premium polish mode |
| impeccable-polish | Final polish pass |
| impeccable-quieter | Reduce visual noise |
| impeccable-shape | Shape language refinement |
| impeccable-typeset | Typography set-up |

### Growth / GTM (Varnan-Tech/opendirectory — MIT)
| Skill | Tetikleyici | Amac |
|---|---|---|
| pricing-page-psychology-audit | pricing, plan card, conversion | Pricing page psikolojik audit (ARENA Starter/Pro/Elite/Ent icin) |
| brand-alchemy | brand identity, messaging | Marka tonu + mesajlasma stratejisi |
| linkedin-post-generator | linkedin, B2B post | Akademi B2B satis icin LinkedIn posts |
| outreach-sequence-builder | cold email, B2B outreach | Kulupler/akademiler icin cold email seq |
| newsletter-digest | newsletter, digest, email | Haftalik ARENA newsletter otomasyonu |
| meeting-brief-generator | meeting prep, call brief | Demo call oncesi brief (satis karsi) |
| reddit-icp-monitor | reddit, icp, icerik fikri | r/volleyball, r/parenting, r/turkey monitoring |
| cook-the-blog | blog post, content polish | Raw not -> publish-ready blog post |
| human-tone | tone fix, jargon, robotic | AI-generated metin'i insanilestir |

## General-Purpose Skills

| Trigger | Skill(s) |
|---|---|
| component / olustur | component-builder + frontend-design + react-components |
| deploy / push | deploy-check + smart-commit + auto-audit |
| audit / kontrol | auto-audit + auditcodex + arena-verify |
| ceviri / i18n | i18n-manager + arena-i18n-ops |
| tasarim / design | frontend-design + ui-ux-pro-max + impeccable-design + taste |
| performans / speed | performance-audit + web-performance + arena-lighthouse |
| guvenlik / security | code-audit + code-reviewer |
| AI / council | ai-council + prompt-engineering + arena-prompt-library |
| bug / hata | systematic-debugging |
| test / e2e | webapp-testing |
| SEO | seo-optimizer + arena-analytics-growth |
| commit / git | smart-commit |
| gorsel / image | optimize-images script + arena-ai-video |
| motion / animation | emil-kowalski-motion + arena-motion-lab |
| supabase | arena-supabase-master |
| a11y / erisilebilirlik | arena-a11y-wcag |
| pwa | arena-pwa-craft |
| form | arena-form-craft |
| chart / grafik | arena-chart-craft |
| tenant / white-label | arena-tenant-whitelabel |
| 3d / three | arena-3d-animation |
| billing / stripe | arena-billing-stripe |
| analytics / buyume | arena-analytics-growth |
| ai video | arena-ai-video |
| prompt | arena-prompt-library |
| icerik / content pipeline | arena-content-automation |

## Combined Flows (Coklu Skill Zinciri)

- **Yeni feature**: arena-supabase-master -> component-builder -> arena-motion-lab -> arena-i18n-ops -> arena-a11y-wcag -> deploy-check
- **White-label launch**: arena-tenant-whitelabel -> arena-billing-stripe -> arena-analytics-growth -> arena-content-automation
- **Landing optimize**: arena-lighthouse -> arena-motion-lab -> arena-a11y-wcag -> arena-analytics-growth
- **Hero video refresh**: arena-prompt-library -> arena-ai-video -> arena-content-automation
- **Perf degradation**: arena-lighthouse -> performance-audit -> systematic-debugging
