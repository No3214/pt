---
name: arena-content-automation
description: ARENA Performance icin uctan uca icerik uretim otomasyonu. Brief -> research -> draft -> review -> publish pipeline. Landing copy, blog, email sequence, push, social reel, hero video, SEO sayfa batch uretimi. n8n, Make, GitHub Actions, Supabase edge functions orchestration. Scheduled content calendar, approval workflow, A/B variant generation, multi-locale fan-out (13 dil), CDN push, analytics tagging. Tetikleyici: "content automation", "otomasyon", "icerik pipeline", "batch generate", "n8n", "make", "workflow", "content calendar", "editorial calendar", "approval flow".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Content Automation

Hedef: Haftalik 1 hero video + 3 social reel + 1 blog + 3 email + 7 push + 10 sosyal post -> 25 adet icerik / hafta tek kisi overhead'siz uretilsin.

## 0) Pipeline Genel Bakis

```
Content Brief
  ↓
Research (web scrape + Gemini summary)
  ↓
Generate (LLM + prompt library)
  ↓
Multi-locale fan-out (13 dil)
  ↓
Quality Gate (auto + human review)
  ↓
Asset render (Veo/Imagen/SadTalker)
  ↓
Supabase storage + metadata
  ↓
Platform publish (CMS / social API / email provider)
  ↓
Analytics tagging (PostHog / UTM)
  ↓
Performance review (weekly)
```

## 1) Arac Stack

| Katman | Arac | Amac |
|---|---|---|
| Orchestration | n8n (self-host) veya Make.com | Workflow + cron |
| LLM | Claude + Gemini + OpenAI | Generate / review |
| Video | Veo 3 / Runway / Higgsfield | Visual assets |
| Image | Imagen 4 / Flux | Posters |
| Audio | ElevenLabs TR voices | Voice-over |
| CMS | Contentful veya Supabase tables | Metin + meta |
| Email | Resend + Loops.so | Transactional + nurture |
| Push | OneSignal + Web Push (VAPID) | Engagement |
| Social | Buffer + Meta Graph API + LinkedIn API | Auto-post |
| Analytics | PostHog + GA4 | Event tracking |
| Storage | Supabase Storage + Cloudflare R2 | Media |

## 2) Content Brief Schema

```ts
// src/types/content-brief.ts
export interface ContentBrief {
  id: string
  kind: 'blog' | 'email' | 'push' | 'social_post' | 'reel' | 'hero_video'
  title: string
  goal: 'awareness' | 'consideration' | 'conversion' | 'retention' | 'evangelism'
  persona: 'parent_13_17' | 'coach' | 'athlete_teen' | 'club_owner'
  key_message: string
  keywords?: string[]             // SEO
  cta: { label: string; url: string }
  constraints?: {
    wordLimit?: number
    charLimit?: number
    tone?: string[]
    avoid?: string[]
  }
  references?: string[]           // URLs veya Notion page
  locales: Array<'tr'|'en'|'ar'|'de'|'es'|'fr'|'it'|'nl'|'pl'|'pt'|'ru'|'uk'|'zh'>
  publishAt?: string              // ISO
  author: string
  approvalRequired: boolean
}
```

## 3) n8n Workflow: Blog Generation

`n8n-flows/blog-generator.json`:
```
Trigger: Webhook POST /api/content/brief
  ↓
Code Node: Validate brief schema (zod)
  ↓
HTTP: Google Custom Search (top 10 articles on keyword)
  ↓
HTTP: Readability API (extract clean text from each)
  ↓
Gemini: "Synthesize research in 300 words, cite sources"
  ↓
Claude Opus: Generate blog outline (prompt from arena-prompt-library 3.8)
  ↓
Claude Opus: Generate full draft (1200 words)
  ↓
Gemini: Self-critique + revise
  ↓
Fork to 13 locales (parallel):
  Claude Sonnet: Translate+localize
  ↓
Supabase: Insert into blog_drafts table
  ↓
Slack webhook: Review request to editorial channel
  ↓
(Manual approval)
  ↓
Contentful / Supabase: Publish
  ↓
Webhook: CDN cache invalidation
  ↓
PostHog: content_published event
```

## 4) Supabase Schema

```sql
CREATE TABLE content_briefs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL,
  title text NOT NULL,
  goal text,
  persona text,
  brief jsonb NOT NULL,
  status text DEFAULT 'queued',  -- queued | generating | review | approved | published | failed
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE content_drafts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brief_id uuid REFERENCES content_briefs(id),
  locale text NOT NULL,
  body_md text,
  title text,
  meta_description text,
  status text DEFAULT 'draft',  -- draft | reviewing | approved | rejected
  model text,
  tokens_used int,
  cost_usd numeric,
  reviewer_id uuid,
  review_notes text,
  approved_at timestamptz,
  UNIQUE (brief_id, locale)
);

CREATE TABLE content_published (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draft_id uuid REFERENCES content_drafts(id),
  platform text,  -- blog | email | push | instagram | linkedin | x | tiktok
  external_id text,
  url text,
  published_at timestamptz DEFAULT now(),
  metrics jsonb  -- impressions, clicks, CVR — guncel
);
```

## 5) Edge Function: Generate Draft

`supabase/functions/generate-draft/index.ts`:
```ts
import { serve } from 'std/http/server.ts'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
const sb = createClient(Deno.env.get('SB_URL')!, Deno.env.get('SB_SERVICE_ROLE')!)

serve(async (req) => {
  const { briefId } = await req.json()
  const { data: brief } = await sb.from('content_briefs').select().eq('id', briefId).single()

  for (const locale of brief.brief.locales) {
    const prompt = buildPrompt(brief, locale)
    const t0 = Date.now()
    const res = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
    const body = res.content[0].type === 'text' ? res.content[0].text : ''

    await sb.from('content_drafts').insert({
      brief_id: briefId,
      locale,
      body_md: body,
      model: 'claude-opus-4-7',
      tokens_used: res.usage.input_tokens + res.usage.output_tokens,
      cost_usd: calcCost(res.usage),
    })
  }

  await sb.from('content_briefs').update({ status: 'review' }).eq('id', briefId)
  return new Response(JSON.stringify({ ok: true }))
})

function buildPrompt(brief: any, locale: string) {
  // prompt library'den template + parametrize
  return `Act as a Turkish sports content strategist. ...`
}
```

## 6) Approval Workflow (React Admin Panel)

`src/pages/admin/content-review.tsx`:
```tsx
export default function ContentReview() {
  const { data: drafts } = useDrafts('reviewing')
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1>Icerik Onay Kuyrugu</h1>
      {drafts?.map(d => <DraftCard key={d.id} draft={d} />)}
    </div>
  )
}

function DraftCard({ draft }: { draft: Draft }) {
  const approve = async () => {
    await sb.from('content_drafts').update({ status: 'approved', approved_at: new Date() }).eq('id', draft.id)
    await fetch('/api/publish-draft', { method: 'POST', body: JSON.stringify({ id: draft.id }) })
  }
  const reject = async () => {
    const note = prompt('Neden reddedildi?')
    await sb.from('content_drafts').update({ status: 'rejected', review_notes: note }).eq('id', draft.id)
  }
  // diff preview, inline edit, approve/reject buttons
}
```

## 7) Multi-locale Fan-out

TR draft uretilince 12 locale'e paralel cevir.
```ts
const base = await generateTR(brief)
const localeJobs = [
  'en','ar','de','es','fr','it','nl','pl','pt','ru','uk','zh'
].map(l => translateDraft(base, l))
await Promise.all(localeJobs)
```

`translateDraft` prompt:
```
You are translating ARENA Performance content from Turkish to {locale}.
Keep:
- Brand name "ARENA"
- Tagline "Guclu Ol. Kendine Guven." adapt localized equivalent
- Numbers, dates (format per locale)
- Tone: warm, calm authority

Adapt (don't literal translate):
- Idioms
- Cultural references (Mediterranean context may need adaptation for RU/UK)
- CTAs (action verbs appropriate to locale conventions)

Source: {tr_body}

Output JSON: {"title": "...", "body_md": "...", "meta": "..."}
```

## 8) Social Reel Generation Pipeline

### 8.1 Brief -> Storyboard
```
Input: ContentBrief kind=reel
  ↓
Claude: "Generate a 4-shot storyboard (15s total):
  shot 1 (0-3s) hook, shot 2 (3-7s) setup, shot 3 (7-11s) payoff,
  shot 4 (11-15s) CTA + brand. For each shot: visual description,
  voice-over (TR max 8 words), camera direction, music cue."
  ↓
4 x Veo 3 generate (3-4s clips)
  ↓
ElevenLabs TR voice-over per shot
  ↓
ffmpeg concat + subtitle burn-in + music bed
  ↓
9:16 vertical mp4
```

### 8.2 ffmpeg Composite
```bash
ffmpeg -i shot1.mp4 -i shot2.mp4 -i shot3.mp4 -i shot4.mp4 \
  -filter_complex "[0][1][2][3]concat=n=4:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" reel.mp4

ffmpeg -i reel.mp4 -i vo.wav -c:v copy -c:a aac -shortest reel_with_vo.mp4

ffmpeg -i reel_with_vo.mp4 -vf "subtitles=subs.srt:force_style='FontName=Manrope,FontSize=36,PrimaryColour=&Hffffff&,Outline=2,OutlineColour=&H000000&'" reel_final.mp4
```

## 9) Email Sequence Automation

Loops.so + Supabase trigger:
```sql
-- profiles.trial_started_at column
-- Supabase trigger: her gece 03:00 UTC

CREATE OR REPLACE FUNCTION schedule_trial_emails() RETURNS void AS $$
BEGIN
  -- Day 1 welcome
  INSERT INTO email_queue (user_id, template, send_at)
  SELECT id, 'trial_day1', now()
  FROM profiles
  WHERE trial_started_at::date = current_date
  ON CONFLICT DO NOTHING;

  -- Day 3 success story
  INSERT INTO email_queue (user_id, template, send_at)
  SELECT id, 'trial_day3', now()
  FROM profiles
  WHERE trial_started_at::date = current_date - 3
  ON CONFLICT DO NOTHING;

  -- ... day 7, 10, 13 (pre-end), 14 (convert/lose)
END; $$ LANGUAGE plpgsql;

SELECT cron.schedule('trial-emails', '0 3 * * *', 'SELECT schedule_trial_emails()');
```

Her email TR + EN lokalize (profil language'e gore).

## 10) Push Notification Batch

```ts
// scripts/automation/daily-push.ts
const segments = [
  { name: 'stale_users', filter: 'last_workout > 3 days ago', template: 'comeback' },
  { name: 'weekly_streak', filter: 'streak = 7', template: 'celebrate' },
  { name: 'pre_match', filter: 'has_match_tomorrow', template: 'match_prep' },
]

for (const seg of segments) {
  const users = await querySegment(seg.filter)
  const message = await generatePushCopy(seg.template)  // Claude prompt
  await onesignal.sendPush({ userIds: users.map(u => u.onesignal_id), ...message })
}
```

## 11) SEO Batch Page Generation

Programmatic SEO — sehir+voleybol kombinasyonlari (81 sehir × 3 kategori = 243 sayfa):
```ts
const cities = await sb.from('tr_cities').select('*')
const categories = ['voleybol-akademisi', 'voleybol-kursu', 'voleybol-antrenor']

for (const c of cities) {
  for (const cat of categories) {
    const brief: ContentBrief = {
      kind: 'blog',
      title: `${c.name} ${cat}`,
      keywords: [`${c.name} ${cat}`, `${c.name} voleybol`],
      persona: 'parent_13_17',
      goal: 'awareness',
      locales: ['tr'],
      // ...
    }
    await fetch('/api/content/brief', { method: 'POST', body: JSON.stringify(brief) })
  }
}
```

Quality gate: %95+ unique content, cross-link 3 siblings, schema.org LocalBusiness.

## 12) A/B Variant Generation

```ts
async function generateVariants(brief: ContentBrief, n = 3): Promise<Variant[]> {
  const prompts = Array.from({ length: n }, (_, i) =>
    buildPrompt(brief, `variant_${i+1}`, differenceInstruction(i))
  )
  const results = await Promise.all(prompts.map(p => claude.complete(p)))
  return results.map((r, i) => ({ id: `v${i+1}`, body: r }))
}

function differenceInstruction(i: number): string {
  return [
    'Emphasize community belonging',
    'Emphasize individual growth',
    'Emphasize competitive excellence',
  ][i]
}
```

Posthog experiment flag'i -> 3 variant, 33%/33%/34% split. 14-day run.

## 13) Content Calendar Notion Sync

```ts
import { Client } from '@notionhq/client'
const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DB_ID = 'xxxx-editorial-calendar'

// Notion -> Supabase sync (cron hourly)
export async function syncNotionToSupabase() {
  const pages = await notion.databases.query({ database_id: DB_ID, filter: { property: 'Status', select: { equals: 'Ready to Generate' }}})
  for (const page of pages.results) {
    const brief = extractBrief(page)
    await sb.from('content_briefs').insert(brief)
    await notion.pages.update({ page_id: page.id, properties: { Status: { select: { name: 'In Queue' }}}})
  }
}
```

## 14) Cost Tracking

```sql
CREATE VIEW content_cost_daily AS
SELECT
  date_trunc('day', created_at) as day,
  count(*) as drafts,
  sum(tokens_used) as tokens,
  sum(cost_usd) as cost
FROM content_drafts
GROUP BY 1
ORDER BY 1 DESC;
```

Alert Slack webhook $50/gun asildiysa.

## 15) Quality Gates

Auto (pre-review):
- Length within limit
- No banned words (kompet ad, plagiarism check via Copyscape API)
- Reading level <= target (Flesch)
- CTA present
- Keyword density 1-2%
- Image alt text present
- Meta description 155 char

Manual (in review UI):
- Fact-check claim
- Brand voice vibe
- Visual quality
- Localization nuance

## 16) Publishing Adaptors

```ts
// src/lib/publishers/index.ts
export interface Publisher {
  publish(draft: ApprovedDraft): Promise<{ url: string; externalId: string }>
}

export const publishers: Record<string, Publisher> = {
  blog: { async publish(d) { /* Contentful */ return { url, externalId } } },
  email: { async publish(d) { /* Loops campaign */ } },
  push: { async publish(d) { /* OneSignal */ } },
  instagram: { async publish(d) { /* Meta Graph API */ } },
  linkedin: { async publish(d) { /* LinkedIn API */ } },
  x: { async publish(d) { /* X API v2 */ } },
  tiktok: { async publish(d) { /* TikTok Marketing API */ } },
}
```

## 17) Analytics & Feedback Loop

Her yayin sonrasi 7-gun metric topla:
```sql
UPDATE content_published
SET metrics = jsonb_build_object(
  'impressions', {from_platform_api},
  'clicks', {from_utm_tracker},
  'cvr', {converted_users / clicks}
)
WHERE published_at > now() - interval '7 days';
```

Haftalik rapor: En iyi performans gostermis 3 + en kotu 3 -> prompt iterasyonu.

## 18) n8n Workflow: Weekly Report

```
Cron Monday 08:00 TR
  ↓
Supabase query: last week content_published + metrics
  ↓
Claude: "Summarize performance, top/bottom, 3 recommendations"
  ↓
Slack post #content-team channel
  ↓
Notion create page "Haftalik Rapor — {week}"
```

## 19) Security & Secrets

```
supabase functions secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions secrets set GEMINI_API_KEY=...
supabase functions secrets set ELEVENLABS_API_KEY=...
supabase functions secrets set ONESIGNAL_KEY=...
supabase functions secrets set NOTION_TOKEN=...
```

Rotation: 90 gun. Audit log her generate'de user_id + prompt hash.

## 20) Failure Recovery

```ts
// retry with exponential backoff
async function generateWithRetry(brief: ContentBrief, attempt = 1): Promise<Draft> {
  try {
    return await generateDraft(brief)
  } catch (err) {
    if (attempt >= 3) throw err
    await sleep(1000 * Math.pow(2, attempt))
    return generateWithRetry(brief, attempt + 1)
  }
}

// DLQ if 3x failed
await sb.from('content_dlq').insert({ brief_id, error: err.message })
```

## 21) Rate Limit Respect

- Claude: 50 RPM free, 5000 Tier 4 -> self-throttle 3 RPS guvenli
- Veo 3: 10 request/day free, higher quota'da 100/day
- Imagen: 1000/day default
- ElevenLabs: 100k char/ay Pro

p-queue veya bottleneck kullan:
```ts
import pQueue from 'p-queue'
const queue = new pQueue({ concurrency: 2, interval: 1000, intervalCap: 3 })
```

## 22) Operator Dashboard

Admin panel: `/admin/content-ops`:
- Queue depth per kind
- Drafts awaiting review (age + SLA warning)
- Cost today / week / month
- Model distribution (Opus vs Sonnet vs Haiku)
- Error rate per source
- Top-10 content ROI

## 23) Governance

- ARENA Editorial Board: haftalik 30-dk retro
- Content Policy doc: neye evet / neye hayir (politics, medical, minor depictions)
- Disclosure: AI-assisted icerik her zaman meta'da isaretlenir

## 24) Roadmap

- **Faz 1 (hafta 1-2)**: brief schema, Supabase tablolar, n8n basic blog flow (TR only)
- **Faz 2 (hafta 3-4)**: locale fan-out, approval UI, email + push generation
- **Faz 3 (hafta 5-6)**: video reel pipeline (Veo + ElevenLabs + ffmpeg)
- **Faz 4 (hafta 7-8)**: social auto-publish (Buffer), SEO programmatic (81 sehir)
- **Faz 5 (hafta 9-12)**: A/B variant, analytics loop, weekly retro automation
- **Faz 6 (ay 4+)**: tenant-scoped (white-label icin her tenant kendi icerigini uretir)

## 25) Hizli Baslangic

```bash
cd /sessions/pensive-friendly-brahmagupta/mnt/PT/pt

# 1. migration
supabase migration new content_automation_schema
# content_briefs, content_drafts, content_published tablolar yukarida

# 2. edge function
supabase functions new generate-draft
# kod section 5'ten

# 3. n8n
docker run -d --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n

# 4. import workflow
# n8n UI > Import > n8n-flows/blog-generator.json

# 5. cron schedule
# supabase SQL editor'de section 9 cron.schedule
```

## 26) Red Flags

- Icerik asiri formulaic -> human editing layer birak
- Auto-publish onay'siz -> fact error + brand risk
- Tek kaynaktan bilgi -> triangulate (research step 3+ source)
- Prompt herkes tarafindan degistirilebilir -> git-versioned + review
- Cost monitoring yok -> surpriz fatura
- SEO spam risk (programmatic 1000+ sayfa thin content) -> unique depth olmadan Google penalize eder

## 27) Ozet

Bu pipeline 1 brief -> 13 dil -> 7 platform fan-out yapar. Operator haftada 5 saat yerine 2 saat review'a harcar. ROI: $200/ay tooling + $400/ay LLM + $200/ay video = $800/ay / $25k/ay icerik gucu.

---

**Birlikte kullan:**
- arena-prompt-library (sablonlar)
- arena-ai-video (visual uretim)
- arena-analytics-growth (metric feedback)
- arena-i18n-ops (13 locale sync)
