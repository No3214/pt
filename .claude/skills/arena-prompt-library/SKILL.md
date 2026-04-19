---
name: arena-prompt-library
description: ARENA Performance icin kanitlanmis prompt kutuphanesi. Video (Veo 3, Runway, Higgsfield), image (Imagen 4, Midjourney, Flux), copy (landing headline, email, push, social caption, SEO title/meta), code (React component, SQL query, test case), design (Figma, Shadcn theme). Prompt engineering best practices, few-shot, chain-of-thought, role-playing, constraint engineering. Tetikleyici: "prompt library", "prompt template", "prompt engineering", "copy prompt", "caption", "headline", "email prompt", "veo prompt", "imagen prompt", "midjourney prompt", "runway prompt".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Prompt Library

Hedef: Her iterasyonda sifirdan prompt yazmak yerine, kanitlanmis sablonlar. `{}` ile parametre, `[]` ile opsiyonel.

## 0) Prompt Engineering Kurallari

1. **Role first**: "Act as a {role}..." -> konteks kilitlenir
2. **Context second**: Hedef kitle, amac, constraint
3. **Task third**: Net action verb
4. **Format last**: Cikti sekli (JSON, Markdown, bullet)
5. **Few-shot ornekler**: 2-3 iyi ornek + 1 kotu ornek (negative example)
6. **Constraints explicit**: Uzunluk, dil, ton, tablolar yasakti vs
7. **Chain-of-thought**: "Adim adim dusun" karmasik problemde
8. **Iteration loop**: Output + revise prompt (v2, v3)

## 1) Video Prompt Sablonlari

### 1.1 Veo 3 — Hero Cinematic
```
A {age}-year-old {nationality} {role} {action_verb} on a {surface},
captured in {shot_size} with {camera_move},
{lighting} creating {mood},
color palette: terracotta #C2684A, sage #7A9E82, coastal blue #4A6D88,
{style_tag: cinematic 35mm film aesthetic, shallow DOF, 120fps slow-motion},
{duration: 8} seconds, {aspect: 16:9}, photorealistic,
Mediterranean atmosphere, natural skin texture, no watermarks, no text.
```

Parametre ornekleri:
- `age`: 14-19
- `nationality`: Turkish, Mediterranean, Greek, Italian
- `role`: female volleyball player, male volleyball player, volleyball coach, young athlete
- `action_verb`: executing a powerful spike, serving from the baseline, blocking at the net, diving for a dig
- `surface`: indoor hardwood court, beach sand court, outdoor clay court
- `shot_size`: ECU, CU, MS, MWS, WS, EWS
- `camera_move`: locked-off, subtle dolly-in, orbit, gimbal tracking, drone aerial orbit
- `lighting`: golden hour rim-lit, overcast softbox, motivated-source window light, stadium sodium vapor
- `mood`: determined focus, joyful energy, calm concentration, triumphant release

### 1.2 Runway Gen-3 — Social Reel
```
{PRODUCT} reveal in cinematic style. Tracking shot follows a {hero}
moving through {environment}. Slow motion 60fps. Warm Mediterranean
color grade. Soft volumetric light. 4-second seamless loop.
Horizontal 16:9 or vertical 9:16 for stories.
```

### 1.3 Higgsfield — Character Lock
```
{hg_char_ID} {action} in {location}, {camera_move},
{time_of_day}, {emotion}, {wardrobe: ARENA terracotta polo and sage shorts},
no third-party logos, photoreal, 8 seconds, 16:9.
```

### 1.4 Luma Dream Machine — Foto Hareketlendir
Image upload + text:
```
Camera slowly dollies in while the subject's hair naturally moves
in a gentle Mediterranean breeze, warm light flickers subtly on
her face, eyes slowly blink, calm confident expression, 5 seconds.
```

## 2) Image Prompt Sablonlari

### 2.1 Imagen 4 — Hero Poster
```
A cinematic portrait of a {age}-year-old {nationality} {role},
{pose: three-quarter profile looking confidently off-camera},
{lighting: soft rim light from warm Mediterranean sunset},
{wardrobe: terracotta and sage training kit, no visible logos},
{skin: natural freckled, subtle sweat sheen, high-detail pores},
{dof: shallow depth of field, background bokeh in sage and sand},
shot on Hasselblad X2D medium format, 80mm f/2.0,
color graded for warm Mediterranean athleticism,
{aspect: 4:5 portrait}, no text, no watermark.
```

### 2.2 Midjourney v7 — Concept Art
```
cinematic portrait, 17yo Turkish female volleyball player,
mid-action spike, indoor academy, warm terracotta wall, sage floor lines,
rim lighting, shallow DOF, 35mm film, photorealistic, editorial sports
photography --ar 4:5 --v 7 --style raw --s 150
```

### 2.3 Flux.1 Pro — Text-friendly
Flux text render'da Midjourney'den iyi. Poster'a yazi binme ihtiyaci varsa:
```
Sports poster design: "ARENA" logo (typography clean sans-serif, terracotta
color #C2684A on sand cream background), below text "Guclu Ol. Kendine
Guven." in smaller sage green, centered, bold minimalist sports aesthetic,
negative space, editorial magazine cover style, 4:5.
```

### 2.4 Stable Diffusion XL — Local Batch
Self-host bulk generation icin:
```
Positive: "athletic portrait, volleyball player, terracotta uniform,
sage background, rim light, photoreal, 8k"
Negative: "cartoon, 3d render, watermark, text, deformed hands,
bad anatomy, extra fingers"
```

## 3) Copy Prompt Sablonlari

### 3.1 Landing Headline (A/B Test Variants)
Gemini/Claude prompt:
```
Act as an elite sports academy copywriter. Generate 5 landing page
H1 variants for ARENA Performance, a premium volleyball academy
in Turkey targeting parents of 13-17 year olds.

Brand voice: warm Mediterranean, calm authority, aspirational-but-grounded.
Constraints:
- Turkish language
- Max 7 words
- No exclamation marks
- Include "guven" OR "guclu" OR "sen" somewhere
- Avoid cliches ("hayal et", "hayatini degistir")

Return as JSON: [{"variant": "A", "text": "...", "rationale": "..."}]
```

Output ornekleri (kanitlanmis):
- "Sporcu Degil, Kendine Guvenen Insan"
- "Guclu Ol. Kendine Guven."
- "Gelecegin Sahasi Burada Kuruluyor"
- "Sporda Guven, Hayatta Cesaret"
- "Tek Bir Hedef: Kendine Inanan Cocuk"

### 3.2 Hero Subtext (8-18 kelime)
```
Write a hero subheading for {brand}, max 18 words, Turkish,
calm authoritative tone, complete the thought introduced by
the headline "{H1}". No period if the sentence flows naturally
into the CTA button. Avoid "biz", prefer "senin" focus.
```

### 3.3 CTA Button Text
```
Suggest 3 CTA button labels for {action} in Turkish, max 3 words,
active verb, no "-iniz" formality, test urgency without pressure.
Return JSON.
```
Ornek: "Randevu Al", "Deneme Dersi", "Simdi Basla"

### 3.4 Email — Trial Welcome
```
Draft a trial welcome email for ARENA Performance.
Recipient: parent of a 13-17 year old athlete just signed up.
Length: 100-140 Turkish words.
Tone: warm, respectful, informative (no salesy pressure).
Structure:
1. Greeting (first name if available)
2. What to expect next 14 days (bullet list, 3 items)
3. Action: schedule first session (link placeholder)
4. Support: reply to this email
Sign-off: Coach {name} + ARENA team.
```

### 3.5 Push Notification
```
Write a push notification, Turkish, max 80 characters (title) + 120 (body).
Purpose: {goal}. Context: user is on Day {n} of trial.
Tone: coach-like, friendly, action-oriented. No exclamations.
Return {"title": "...", "body": "...", "action": "..."}
```

### 3.6 Social Caption — Instagram
```
Write an Instagram caption for a short-form video (Reel) showing
{scene_summary}. Max 140 Turkish characters (+hashtags separate).
Hook in first 6 words. Include {n} hashtags mix:
1 brand (#ArenaPerformance), 3 niche (voleybol), 3 broad.
No emoji unless ":+" accent needed.
```

### 3.7 SEO Title + Meta Description
```
Generate SEO title (60 char max) and meta description (155 char max)
for page: {page_title}. Primary keyword: {keyword}.
Secondary keywords: {keywords}.
Language: Turkish. Include brand "ARENA" once.
Return JSON.
```

### 3.8 Blog Post Outline
```
Act as a sports performance content strategist. Outline a 1200-word
blog post for ARENA Performance blog.

Topic: {topic}
Target reader: {persona}
Search intent: {informational|transactional|navigational}
Primary keyword: {keyword}
Secondary keywords: {keywords}

Structure:
- Working title (60 char max)
- Meta description (155 char)
- 5-7 H2 sections with H3 subsections
- Internal link opportunities (mention other ARENA pages)
- External authoritative citations needed
- Ideal images/video suggestions

Return markdown outline.
```

### 3.9 Testimonial Rewrite
Ham sporcu quote -> parlatilmis testimonial:
```
Rewrite this raw testimonial keeping authenticity, fixing only
grammar/clarity. Preserve first-person and local expressions.
Max 40 Turkish words. Do not add claims not in original.

Raw: "{text}"
Speaker: {name}, {role}, {location}

Return: {"quote": "...", "attribution": "..."}
```

## 4) Code Prompt Sablonlari

### 4.1 React Component Scaffold
```
Generate a production-ready React 19 + TypeScript component.

Requirements:
- Name: {ComponentName}
- Purpose: {purpose}
- Props: {props_schema}
- Style: Tailwind 3 classes, use ARENA tokens (primary, secondary, accent, sand)
- i18n: useTranslation() hook, keys under t.{section}.{key}
- A11y: semantic HTML, aria attributes, keyboard accessible
- Motion: Framer Motion if animation needed (out-expo easing [0.22,1,0.36,1])
- File path: src/components/{folder}/{ComponentName}.tsx

Include:
1. Full TypeScript props interface
2. Default export
3. JSDoc for complex props
4. Usage example in a comment at bottom

Avoid:
- Inline styles
- Hardcoded Turkish/English strings (use i18n)
- any/unknown types
- useEffect for data fetching (we use Supabase hooks)
```

### 4.2 Supabase Migration
```
Generate a Supabase migration SQL file.

Goal: {goal}
Tables affected: {tables}
RLS: {required? policies?}

Constraints:
- Use gen_random_uuid() for ids
- Add created_at timestamptz DEFAULT now()
- Include indexes for foreign keys
- RLS policies: tenant_isolated (via profiles.tenant_id)
- Add a rollback section as SQL comment

File: supabase/migrations/{YYYYMMDDHHMMSS}_{slug}.sql
```

### 4.3 Playwright E2E Test
```
Write a Playwright E2E test for {flow}.

Setup:
- Base URL: http://localhost:4173
- Fixtures: authenticated user, empty state
- Viewport: mobile 375x812 AND desktop 1440x900

Assertions:
- Visible elements
- Navigation outcomes
- Accessibility (no violations via @axe-core/playwright)
- Screenshot on failure

Style: TS, async/await, Locator-based, no XPath.
```

### 4.4 Zod Schema from Figma
```
Generate a Zod v3 schema + TypeScript types for this form:

Fields: {list with type, required, validation}

Localize error messages using i18n key pattern:
z.string().min(3, { message: JSON.stringify({ key: 'form.nameShort', params: {} }) })

Return: schema export + inferred type + example of useForm integration.
```

### 4.5 Bugfix — Root Cause Analysis
```
You are a senior engineer debugging a production issue.

Problem: {description}
Stack trace: {trace}
Context: {env, browser, user action}
Recent changes: {git log summary}

Task:
1. List 3 most likely root causes (ranked)
2. For each, propose a verification step
3. Suggest the minimal fix
4. Propose a regression test
5. Prevention (lint rule? test? type narrowing?)

Format: Markdown with headings.
```

## 5) Design Prompt Sablonlari

### 5.1 Figma Component Spec
```
Design a {component_type} for ARENA Performance.

Context: {usage_scenario}
States: default, hover, active, disabled, loading, error
Tokens: primary #C2684A, secondary #7A9E82, accent #4A6D88, sand #D4B483
Typography: Manrope 400-800, letter-spacing tight on display
Spacing: 4/8/12/16/24/32/48/64 scale
Radius: 8 (base), 16 (card), 24 (hero)

Accessibility:
- WCAG AA contrast
- Focus visible ring (accent color, 2px, 2px offset)
- Touch target 44x44 min

Return: description + a Tailwind class list for each state.
```

### 5.2 Shadcn Theme Config
```
Generate a Shadcn UI theme config (CSS vars) matching ARENA brand.
Primary: #C2684A (terracotta)
Secondary: #7A9E82 (sage)
Accent: #4A6D88 (coast)
Muted: #D4B483 (sand)
Background light: #FAF6F1
Background dark: #0A0A0A

Return @layer base { :root {} .dark {} } CSS.
```

## 6) Advanced Patterns

### 6.1 Few-shot Prompting
```
Task: Classify athlete feedback sentiment.

Examples:
Input: "Antrenman cok iyiydi, coach Alperen harika"
Output: {"sentiment": "positive", "target": "coach", "score": 0.92}

Input: "Sahada sicak, klima calismiyor, nefes alamadim"
Output: {"sentiment": "negative", "target": "facility", "score": 0.85}

Input: "{new_text}"
Output:
```

### 6.2 Chain-of-Thought
```
Solve this step by step.

Problem: Given a player's last 10 workouts with volume/intensity/RPE,
recommend next week's training load.

Steps:
1. Compute weekly average load
2. Assess trend (increasing/decreasing/plateau)
3. Check for fatigue markers (RPE > 8 repeated)
4. Apply 10% progression rule if stable
5. Deload week if RPE avg > 8.5

Data: {json}

Walk through each step, then give final recommendation as JSON:
{"week_plan": {...}, "rationale": "..."}
```

### 6.3 Role + Persona
```
Adopt this persona:
- Identity: Experienced Turkish volleyball coach, 48yo, Cakir Buruc
- Tone: Warm, direct, uses "kardes" naturally, no corporate jargon
- Method: Asks before prescribing, celebrates small wins
- Boundary: Declines medical/psychological questions -> refers to pro

Respond to: {user_message}
```

### 6.4 Constraint Stacking
```
Write a 60-word Turkish Instagram caption that:
- Starts with a question (not rhetorical)
- Contains exactly 3 sentences
- Uses "sen" form (informal)
- Includes "Akdeniz" metaphor
- Ends with a call to action (without exclamation)
- Avoids: "hayal", "basari", "simdi"
- Tone: warm but grounded

Return only the caption.
```

### 6.5 Self-critique Loop
```
Step 1: Draft a landing H1 for {brand}.
Step 2: Critique your own draft on 5 dimensions:
  - Specificity (not generic)
  - Emotional resonance
  - Brevity (<8 words)
  - Originality
  - Brand fit (warm Mediterranean, calm authority)
Step 3: Rewrite addressing weaknesses.
Return final only.
```

## 7) Model Routing Tablo

| Task | Best Model | Fallback | Ucret/1M token |
|---|---|---|---|
| Strateji + design karar | Claude Opus 4.7 | Gemini 2.5 Pro | $15/$75 |
| Component kodu | Claude Sonnet 4.6 | Gemini 2.5 Flash | $3/$15 |
| Copy + email | Claude Opus 4.7 | GPT-4.5 | $15/$75 |
| Bulk SEO meta | Haiku 4.5 | Gemini Flash | $0.80/$4 |
| Lint fix | Haiku 4.5 | Cursor inline | $0.80/$4 |
| Bug debug | Opus 4.7 | o1-preview | $15/$75 |
| Video prompt optimize | Gemini 2.5 Pro | Claude Opus | $1.25/$5 |
| Translation | Claude Sonnet | DeepL | $3/$15 |

## 8) Output Guards

Her LLM output'u shipping oncesi:
- [ ] Halusinasyon check (brand, rakip adi, numara, tarih)
- [ ] Dil check (TR mu, EN mu, karisik mi?)
- [ ] Uzunluk check (kelime/karakter limit)
- [ ] Ton check (resmi/samimi hedef uymus mu)
- [ ] Erisilebilirlik (reading level, avoid idiom)
- [ ] Legal (claim + disclaimer)
- [ ] Brand voice (enforce-voice skill ile dogrula)

## 9) Versioning

Her prompt JSON/MD olarak `prompts/` klasorunde:
```
prompts/
├── video/
│   ├── veo-hero-cinematic-v3.md
│   ├── runway-reel-v1.md
│   └── higgsfield-character-lock-v2.md
├── copy/
│   ├── landing-h1-v5.md
│   ├── email-trial-welcome-v2.md
│   └── push-notification-v1.md
├── code/
│   └── react-component-v4.md
└── design/
    └── figma-component-spec-v1.md
```

Git commit her revizyonda -> A/B test sonuclarini commit message'a yaz.

## 10) Prompt Eval Matrisi

Her yeni prompt icin 5 kriter 1-5 skor:
- Clarity (net mi?)
- Specificity (somut mu?)
- Consistency (tekrar edilebilir mi?)
- Efficiency (token verimli mi?)
- Output Quality (ham cikti kalitesi)

Matrix 4.0+ uzerine koy, aksi halde iterasyon.

## 11) Red Flags

- Cok uzun prompt (>3000 token) -> model takes first instructions, drops rest
- Cok fazla kiyaslama ornegi -> few-shot overfit, diversity kaybi
- Belirsiz "make it better" -> spesifik kriter yaz
- Prompt icinde model adi var ("ChatGPT olarak...") -> yanlis yonlendirir
- Assumption: "kullanici bunu biliyor" -> actikca yaz

## 12) Hizli Baslangic

```bash
cd /sessions/pensive-friendly-brahmagupta/mnt/PT/pt
mkdir -p prompts/{video,copy,code,design}
# sablonlar buradaki skill'den kopyalanir + parametrize edilir
```

## 13) Canli Ornek: ARENA Landing H1 Iterasyonu

**v1**: "ARENA Performance Academy" (generic, reddedildi)

**v2**: "Sporcunu burada gelistir" (imperative, 'biz' bakisli)

**v3**: "Guclu Ol. Kendine Guven." (brand tagline — CLAUDE.md'de tescilli)

**v4 (A/B test'le)**: "Sahada Guc, Hayatta Guven."

Sonuc: v3 bounce %22, v4 bounce %19 (test 4 hafta n=2400) -> v4 kazandi.

## 14) Prompt Sharing Discipline

- Her basarili prompt'u team'le paylas (Slack #prompts-library)
- Failed prompt'u da paylas (why not?)
- `prompt-id` hashi analytics'te gonder -> hangi prompt kac conversion yapti
- Haftalik "prompt of the week" retro

---

**Kisa ozet**: Prompt = kod. Versionla, testle, itere et. Bu library sifirdan hic baslamayacagimizi garanti eder.
