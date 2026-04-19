---
name: arena-analytics-growth
description: ARENA Performance icin analytics + growth playbook. PostHog/Mixpanel event taxonomy, conversion funnel, A/B testing (Split.io/PostHog), user segmentation, cohort analysis, retention curves, referral/viral loops, email automation (Resend), push notifications, landing CRO (Unbounce patterns), SEO strategy (keyword + content + backlink), paid ads (Google/Meta/LinkedIn), CAC/LTV modeling, attribution, growth experiment template. Tetikleyici: "analytics", "growth", "funnel", "conversion", "posthog", "mixpanel", "ab test", "segment", "cohort", "retention", "referral", "email", "seo", "ads", "cac", "ltv", "cro".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Analytics & Growth

Hedef: Data-driven scale. MRR $1k → $100k yolculugunda metrikler pusula.

## 0) Stack

| Amac | Urun | Fiyat |
|---|---|---|
| Product analytics | PostHog (EU host) | Free 1M events/ay |
| CRM + email | Resend + Loops.so | Free 3k/ay |
| A/B testing | PostHog (built-in) | Free |
| Attribution | PostHog + UTM | Free |
| Session replay | PostHog | Free 5k/ay |
| Ads analytics | GA4 (referral only) | Free |

## 1) Event Taxonomy

Sabit naming: `noun_verb` snake_case.

### Lifecycle events
```ts
posthog.capture('landing_viewed', { path, locale, referrer })
posthog.capture('signup_started', { step })
posthog.capture('signup_completed', { tenantId, plan })
posthog.capture('onboarding_completed', { duration })
posthog.capture('trial_converted', { plan, revenue })
posthog.capture('subscription_canceled', { reason })
```

### Product usage
```ts
posthog.capture('workout_logged', { tenantId, studentId, exerciseCount })
posthog.capture('chart_viewed', { type: 'radar' })
posthog.capture('video_watched', { videoId, duration })
```

### Monetization
```ts
posthog.capture('paywall_viewed', { feature })
posthog.capture('upgrade_clicked', { fromPlan, toPlan })
```

### Super properties (her event'e eklenir)
```ts
posthog.register({
  tenant_id, plan, role, locale, is_mobile, app_version
})
```

## 2) Conversion Funnel

```
Landing → Signup CTA → Signup Form Complete → Email Verify → Onboarding Wizard → First Workout → Trial → Paid
```

Her step'te dropout yuzdesi + time-to-next.

PostHog Funnel:
```
Step 1: landing_viewed
Step 2: signup_started
Step 3: signup_completed
Step 4: onboarding_completed
Step 5: trial_converted
```

Benchmark target:
- L→S: 8–12%
- S→O: 70%
- O→Paid: 15–25% (trial convert)

## 3) A/B Testing

```tsx
const variant = posthog.getFeatureFlag('hero_headline')
return (
  <h1>
    {variant === 'bold' ? t.hero.titleBold : variant === 'soft' ? t.hero.titleSoft : t.hero.title}
  </h1>
)
```

Dashboard'da variant'lari tanimla, target metrik (signup_started), min detectable effect seç.

Sample size: PostHog otomatik (Bayesian), ~2–4 hafta typical.

### Experiment Template
```markdown
# Experiment: Hero Headline Test
- Hypothesis: Bold numeric claim arttirir signup CTR'yi %25+
- Variant A (control): "Guclu ol. Kendine guven."
- Variant B: "1000+ sporcu ile gelecegi insa et"
- Variant C: "14 gun ucretsiz. Ilk workout bugun."
- Metric: signup_started / landing_viewed
- Duration: 14 gun veya 10k visit
- Winner criteria: p > 0.95 + effect > 10%
```

## 4) Cohort Analysis

SQL retention:
```sql
WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('week', created_at) AS cohort_week FROM profiles
),
activity AS (
  SELECT user_id, DATE_TRUNC('week', created_at) AS activity_week FROM workouts
)
SELECT c.cohort_week, a.activity_week - c.cohort_week AS week_offset,
       COUNT(DISTINCT c.user_id) AS active
FROM cohorts c JOIN activity a USING (user_id)
GROUP BY 1, 2 ORDER BY 1, 2;
```

Retention curve hedef: Week 1 > 40%, Week 4 > 25%, Week 12 > 15%.

## 5) Email Automation (Resend + Loops)

Sequence ornek: **14-gun trial flow**

- Day 0: Welcome + "Ilk workout'unu logla"
- Day 2: "Nasil gidiyor? Ipuclari" (5 ipucu)
- Day 5: "Siz bir hafta icinde x kaloride yaktiniz" (kullanici verisi)
- Day 7: Mid-trial check-in + testimonial
- Day 11: "Trial bitiyor — %20 indirim kuponu"
- Day 13: Cancel uyari + kart ekleme CTA
- Day 15 (converted): "Host! Sampiyonluga hos geldin"
- Day 15 (churned): "Zi yarafla birkac soru 30sn"

### Resend send
```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)
await resend.emails.send({
  from: 'ARENA <hello@arena.app>',
  to: userEmail,
  subject: t.email.welcome.subject,
  react: <WelcomeEmail firstName={firstName} />,
})
```

React email templates: https://react.email

## 6) Push Notifications

Arena-pwa-craft skill ile entegre. Timing best practice:
- Weekly recap Cuma 18:00 local
- Trial reminder 10:00 local
- Workout streak broken 1 gun sonra sabah
- Coach message gerceklesince hemen
- Marketing max 1/hafta

Segmentation: aktif kullanici → sadece product; pasif kullanici → reactivation content.

## 7) Referral / Viral Loop

### Mekanik
- Davet eden kullanici: 1 ay ucretsiz Pro
- Davet edilen: ekstra 7 gun trial
- Davet URL: `arena.app/ref/{userCode}`
- Signup'da `referredBy` kaydi, conversion'da her iki taraf reward

### Code
```tsx
<button onClick={async () => {
  const link = `https://arena.app/ref/${user.refCode}`
  if (navigator.share) {
    await navigator.share({ title: 'ARENA', text: t.referral.share, url: link })
  } else {
    navigator.clipboard.writeText(link)
    toast.success(t.referral.copied)
  }
  posthog.capture('referral_shared')
}}>{t.referral.invite}</button>
```

K-factor hedef: 0.3+ (her kullanici 0.3 kisi getirir → viral).

## 8) Landing CRO

### Patterns
- Clear value prop yukarida
- Social proof (logos, numbers, testimonials)
- Single primary CTA, secondary muted
- Urgency: "14 gun ucretsiz", "100+ kulup kullaniyor"
- Trust: SSL badge, GDPR compliance note
- FAQ (objection handling)
- Sticky CTA footer mobile

### Test edilecekler
- Headline copy
- Hero image/video
- CTA text ("Basla" vs "14 gun ucretsiz")
- Form field sayi (email-only vs full)
- Pricing visibility (upfront vs CTA-after)
- Video vs static hero

### Heatmap
PostHog Toolbar → heatmap mode. Scroll depth, click distribution.

## 9) SEO Strategy

### Keyword research
- "voleybol antrenman programi" (TR, 2k/ay)
- "elite spor platformu" (TR, 800/ay)
- "volleyball training app" (EN, 15k/ay)
- "sports performance software" (EN, 5k/ay)

Arac: Google Keyword Planner, Ahrefs free tools.

### Content marketing
- Blog: haftada 2 post (2026 roadmap)
  - "10 voleybol koca nasil antrenman plani yapar"
  - "Sporcularda toparlanmanin bilimi"
  - "ARENA ile xyz kulubu %40 performans artisi" (case study)
- YouTube: aylik 2 video tutorial
- LinkedIn: 3/hafta yonetici content
- TikTok: haftalik 3 sporcu tip video

### Teknik SEO
- Schema.org structured data
- Sitemap.xml (dynamic)
- Robots.txt
- hreflang (i18n)
- Canonical URL
- 301 redirects (old paths)

### Backlink strategy
- Guest post: spor medyasi
- Podcast: spor girisim podcast'lari
- Directory: G2, Capterra, ProductHunt
- Community: Reddit r/volleyball, Discord

## 10) Paid Ads

### Google Ads
- Search: "voleybol programi", "spor kulubu yazilimi" (TR), "volleyball training app" (EN)
- Budget: $20/gun test, $100/gun scale
- Quality Score 7+ hedef
- Landing page match keyword

### Meta (FB/IG)
- Interest: "volleyball", "sports team management"
- Lookalike audience 1% from paying customers
- Creative: UGC-style video + testimonial carousel
- Budget: $30/gun test

### LinkedIn
- Enterprise tier icin (kulup directorleri)
- Job title: "sports director", "head coach"
- Budget: $50/gun, yuksek CPM ama target net

### TikTok
- Gen-Z sporcular icin
- Creator partnership + spark ads
- Organik-native content (UGC)

## 11) CAC / LTV Modeling

```
CAC = Ads spend / Paid signups
LTV = ARPU × Gross margin × 1/churn
LTV:CAC target ≥ 3:1 (sustain), 5:1 (growth)

Ornek:
ARPU: $99/ay = $1188/yil
Gross margin: 80% (cloud + payment + support)
Churn: 5%/ay → avg lifetime 20 ay
LTV = $99 × 0.8 × 20 = $1584
CAC target < $528 per paying customer
```

Payback period hedef: < 6 ay.

## 12) Attribution

UTM pattern:
- utm_source: google / facebook / newsletter / partner
- utm_medium: cpc / social / email / referral
- utm_campaign: brand / launch / trial_reactivation / q1_growth
- utm_term: keyword (Google Ads)
- utm_content: ad variant / creative id

PostHog captures UTM auto; Multi-touch attribution icin `first_touch` + `last_touch` super property.

## 13) Dashboards

### Exec weekly
- MRR (curr / last / delta)
- New trials / conversions / cancels
- CAC / LTV ratio
- Top 3 growth experiments status

### Marketing daily
- Visits by source
- Signup funnel conversion %
- Paid campaign ROAS
- Top organic keyword rank change

### Product weekly
- Active users (DAU/WAU/MAU)
- Feature adoption %
- Retention cohort curve
- Session replay top 10 bug candidates

## 14) Retention Hooks

- Gamification: badge, streak, level (PathToProRoadmap mevcut)
- Weekly Insights email (kullanici verisi gosterimli)
- Social: coach comment, teammate leaderboard
- Reminder: workout schedule, hydration
- Progress photo comparison (before/after)

## 15) Churn Prevention

Signals:
- Login freq azalisi (last 7d < 2)
- Workout log yok (last 14d)
- Email open yok (last 3)
- Feature depth azalisi

Automation: risk score > threshold → personalized outreach email + CS Slack ping.

Exit survey: niye iptal edildi? 6 option + free text. Quarterly review.

## 16) Pricing Experimentation

- Anchor high (Elite $199) ortalamayi aklilmasini saglar
- Tiered value: her tier'da onceki + X yenilikler
- Yearly discount %20 (retention + cashflow)
- Add-on: custom coaching $49/ay extra
- One-time: setup fee $299 (Enterprise)

## 17) GDPR / KVKK

- Cookie banner (mandatory EU)
- Data export: kullanici istegiyle 30 gun icinde
- Delete: soft 30-day + hard delete
- DPA: Enterprise tenant icin
- PostHog EU host kullan (privacy-first)

## 18) Red Flags

- Event naming inconsistent → data bozulur
- UTM yok → attribution kayip
- Retention sadece DAU (kaliteli tanim degil)
- Vanity metric (page view, follower) peshinde → hibis
- A/B winner declare early (stat sig degilken)
- Email spray-and-pray → spam flag + unsubscribe surge

## 19) North Star Metric

ARENA icin oneri: **Weekly Active Tenants (WAT)**
= haftada en az 3 farkli kullanici workout loglamis tenant sayisi

Bu metrik = product-market fit + revenue health composite.

## 20) Checklist (Launch)

- [ ] PostHog installed + event whitelist
- [ ] Session replay active
- [ ] Funnel defined
- [ ] Email automation scheduled
- [ ] Referral mechanic live
- [ ] SEO audit (Lighthouse SEO 100)
- [ ] UTM parameters in all campaigns
- [ ] A/B test infrastructure ready
- [ ] Dashboard Exec / Marketing / Product
- [ ] Attribution model documented

---

Metrik kurgusu olmadan scale kumar. Bu playbook kurar.
