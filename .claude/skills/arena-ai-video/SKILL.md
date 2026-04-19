---
name: arena-ai-video
description: ARENA Performance icin AI video + image + avatar uretim pipeline. Google Flow (Veo 3, Imagen 4, Gemini), Higgsfield, SadTalker, HY-Motion 1.0, champ, DECA, Mesh2Motion, Runway, Pika, Luma Dream Machine. Video prompt engineering (cinematography, camera movement, lighting, style), image prompt engineering, talking-head avatar, motion capture, text-to-3D, batch automation. Tetikleyici: "ai video", "video generation", "veo", "flow", "imagen", "sadtalker", "avatar", "prompt engineering", "text-to-video", "image-to-video", "talking head", "motion capture", "higgsfield".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × AI Video & Visual Pipeline

Hedef: Hero reels, landing video'lari, social clips, antrenor tanitim avatar'lari, urun demo video'lari — hepsi AI-destekli uretim hatlari uzerinden, cekim/stok maliyeti olmadan.

## 0) Arac Matrisi — Ne Icin Hangisi?

| Ihtiyac | Birincil | Ikincil | Ucret |
|---|---|---|---|
| 8s cinematic hero clip (text-to-video) | Google Flow / Veo 3 | Runway Gen-3 | $0.05-0.30/s |
| Still hero poster (text-to-image) | Imagen 4 / Flow | Midjourney v7, Flux.1 Pro | $0.02-0.08/img |
| Talking-head antrenor avatar | HeyGen / Synthesia | SadTalker (self-host) | $29+/ay / ucretsiz |
| Tek foto -> konusan yuz | SadTalker | D-ID | ucretsiz / $5+/ay |
| Vucut animasyonu (mocap-like) | champ / HY-Motion 1.0 | Move.ai | self-host / $10+/ay |
| 3D yuz rig (FLAME) | DECA | MetaHuman Animator | self-host / ucretsiz |
| 2D/3D mesh -> rigged skeleton | Mesh2Motion | Mixamo | self-host / ucretsiz |
| Marka-tutarli kisa urun demo | Higgsfield | Runway Motion Brush | $29/ay |
| Image-to-video (foto hareket) | Luma Dream Machine | Pika 1.5 | $9-35/ay |
| Uzun-form script narration | Gemini 2.5 Pro + TTS (ElevenLabs) | OpenAI Sora + TTS | $0.30+/dk |

### Karar Algoritmasi
1. Cekim gerekmeyen hero video (8 sn)? -> **Veo 3**
2. Markali tekrarli demolar? -> **Higgsfield** (brand-consistent)
3. Antrenor konusma klibi (50 sn+)? -> **HeyGen** (ticari), **SadTalker** (self-host)
4. Mevcut bir sporcu foto'sunu hareket ettir? -> **Luma / Pika**
5. 3D model -> oyuncu animasyonu? -> **champ** + **Mesh2Motion**

## 1) Google Flow + Veo 3 Pipeline

Google Flow (2025 I/O lansman): Veo 3 + Imagen 4 + Gemini orkestrasyon.
Erisim: https://labs.google/flow (Google AI Ultra / Pro abonelik).

### 1.1 Auth
```
# env
GOOGLE_API_KEY=xxxx    # Vertex AI icin (production)
FLOW_COOKIE=...        # Labs icin (manuel)
```

Production: Vertex AI (veo-3.0-generate-preview).
```bash
gcloud auth application-default login
gcloud config set project arena-prod
```

### 1.2 Veo 3 Prompt Anatomisi
Iyi bir Veo 3 prompt 5 katman icerir:

```
[Subject + Action] +
[Scene / Environment] +
[Camera Movement + Shot Size] +
[Lighting + Color Palette] +
[Style + Reference + Constraints]
```

### 1.3 Altin Prompt Sablonu
```
A {age} Turkish {athlete_type} {action_verb} on a {surface} court,
captured in {shot_size} with {camera_move},
{lighting_description} creating {mood},
color palette: warm terracotta, sage, coastal blue, rich sand,
cinematic 35mm film aesthetic, shallow depth of field,
slow motion 120fps feel, 8 seconds, horizontal 16:9,
photorealistic, high detail skin texture, Mediterranean atmosphere.
```

### 1.4 ARENA Hero Video — 8 Saniye Prompt Ornekleri

#### Prompt A — Spike Action
```
A 17-year-old Turkish female volleyball player mid-air executing a powerful
spike, slow-motion 120fps, dramatic side-angle medium-close shot with a
subtle dolly-in, rim-lit by golden afternoon Mediterranean sun filtering
through an open gymnasium, warm terracotta walls and sage-green floor
lines in background, sweat droplets visible in the light, color palette
terracotta #C2684A + sage #7A9E82 + coastal blue #4A6D88, cinematic 35mm
film grain, shallow depth of field, determined expression, 8 seconds,
horizontal 16:9, photorealistic, premium sports commercial aesthetic.
```

#### Prompt B — Training Serve
```
Wide aerial drone shot orbiting slowly around a young Turkish volleyball
player serving on an outdoor beach court at golden hour, Aegean Sea behind,
sand kicking up from her feet, camera rises 2 meters as ball launches,
warm amber lighting with long shadows, color grade terracotta + sand +
coast blue, 8 seconds, horizontal 16:9 cinematic, photoreal, calm
determined face, Mediterranean coastal breeze moving her hair naturally.
```

#### Prompt C — Team Moment
```
Medium close-up shot, six diverse young athletes in terracotta and sage
training kits high-fiving in slow-motion after winning a point, indoor
academy with wooden accents and warm sand-colored walls, backlit by soft
daylight through large windows, shallow depth of field, camera locked-off
steady, color palette terracotta + sage + sand, joyful authentic emotion,
natural skin tones, cinematic 35mm, 8 seconds, 16:9.
```

#### Prompt D — Coach Teaching
```
A 42-year-old Turkish male volleyball coach demonstrating a block technique
to two teenage athletes on an indoor academy court, tracking shot from
behind at chest-height, warm natural lighting through skylights, walls in
warm terracotta and sand tones, sage-green court lines, coach wears ARENA
branded polo, students focused and respectful, cinematic calm pace,
documentary style, 8 seconds, 16:9, photorealistic.
```

### 1.5 Veo 3 Negative Prompts (built-in'e ek)
```
[NEGATIVE] cartoon, 3D render look, blurry face, extra fingers,
warped body proportions, watermarks, text overlays, oversaturated,
plastic skin, uncanny valley, logo placement, brand names visible,
copyright-protected team jerseys, identifiable public figures.
```

### 1.6 Veo 3 API Code (Vertex)
```ts
// src/lib/ai/veo3.ts
import { VertexAI } from '@google-cloud/vertexai'

const vertex = new VertexAI({
  project: process.env.GCP_PROJECT!,
  location: 'us-central1',
})

const model = vertex.getGenerativeModel({ model: 'veo-3.0-generate-preview' })

export async function generateVeoClip(opts: {
  prompt: string
  aspectRatio?: '16:9' | '9:16' | '1:1'
  duration?: 4 | 6 | 8
  audio?: boolean
}) {
  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
    generationConfig: {
      aspectRatio: opts.aspectRatio ?? '16:9',
      durationSeconds: opts.duration ?? 8,
      audioGeneration: opts.audio ?? true,
    },
  })
  // operation LongRunning: poll ettin mi?
  const videoUri = res.response.candidates[0].content.parts[0].fileData?.fileUri
  return videoUri
}
```

Operation genellikle async. Long-running: 30-90 sn bekleme.

### 1.7 Imagen 4 — Hero Poster
```
A dramatic cinematic portrait of a 17-year-old Turkish female volleyball
player, three-quarter profile looking confidently off-camera, soft rim
lighting from warm Mediterranean sunset, terracotta and sage uniform
(no logos), natural freckled skin with subtle sweat sheen, shallow
depth of field, background gymnasium bokeh in sage and sand tones,
shot on Hasselblad X2D medium format, 80mm lens f/2.0, color graded
for warm Mediterranean athleticism, 4:5 portrait orientation.
```

### 1.8 Gemini 2.5 — Script/Narration
```
Prompt: Write a 20-second voice-over narration for a volleyball academy
video targeting parents of 13-17 year olds in Turkey. Tone: warm,
aspirational, calm authority. Language: Turkish. Mention: kendine guven,
guclu ol, Mediterranean context. Max 55 Turkish words. End with a
single-sentence call to peaceful strength.
```

Generated output -> feed to ElevenLabs Turkish voice (Burcu/Yunus v2).

## 2) Higgsfield Pipeline

Higgsfield-kit zaten projede mevcut (`higgsfield-kit/`). Seedance 2.0 + character-lock icin.

### 2.1 Character Lock Pattern
Marka-tutarli tekrarli avatar: ayni yuz birden cok videoda.
```
1. Hero avatar foto yukle (Lora training icin)
2. LoRA uret (30 dk)
3. Character ID kullan: hg_char_01J7...
4. Prompt: "{hg_char_01J7} executing volleyball spike..."
```

### 2.2 ARENA Higgsfield Fiyat Modeli
- Basic: $29/ay — 150 sn/ay
- Pro: $99/ay — 750 sn/ay
- Enterprise: $499/ay — 5000 sn/ay

Hero + 3 sosyal clip = ~120 sn. Basic plan landing icin yeter.

## 3) SadTalker (Self-host) — Tek Foto + Ses = Konusan Yuz

Repo: https://github.com/OpenTalker/SadTalker

### 3.1 Kurulum
```bash
git clone https://github.com/OpenTalker/SadTalker
cd SadTalker
conda create -n sadtalker python=3.10 -y
conda activate sadtalker
pip install torch==2.0.1+cu118 torchvision==0.15.2+cu118 --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
bash scripts/download_models.sh
```

### 3.2 Run
```bash
python inference.py \
  --driven_audio examples/voice.wav \
  --source_image examples/coach.jpg \
  --enhancer gfpgan \
  --preprocess full \
  --still \
  --result_dir ./out
```

### 3.3 ARENA Kullanim: Antrenor Tanitim
1. Antrenor profil foto (1024x1024, front-facing, neutral)
2. Gemini narration script TR
3. ElevenLabs TR voice -> WAV
4. SadTalker render -> MP4
5. ffmpeg ile ARENA intro/outro bindir
6. S3 upload + Supabase storage signed URL

### 3.4 Docker Wrapper (Production)
```dockerfile
FROM nvidia/cuda:11.8.0-cudnn8-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y git python3.10 ffmpeg wget
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "inference.py"]
```

## 4) HY-Motion 1.0 (Tencent Hunyuan)

Repo: https://github.com/Tencent-Hunyuan/HY-Motion-1.0
Vucut-level animasyon uretimi. Veo 3 yuz + HY-Motion body sinerji.

```bash
git clone https://github.com/Tencent-Hunyuan/HY-Motion-1.0
cd HY-Motion-1.0
pip install -r requirements.txt
python demo.py --text "A volleyball player spiking the ball at the net" \
               --output spike.mp4 --frames 120 --fps 30
```

### Prompt Stil
```
"Standing ready stance, weight on balls of feet, then explosive vertical
jump with arms swinging, right arm cocks back, full body rotation,
arm swings forward across body, contacting ball at peak of jump."
```

## 5) champ (Fudan) — Ref Video + Ref Image = Animate

Repo: https://github.com/fudan-generative-vision/champ

Bir kaynak foto ve bir referans hareket videosu verirsin -> ayni harekete transfer.

Kullanim: antrenorun foto'suna pro'nun spike hareketini giydirmek.
```bash
python inference.py \
  --source athlete.jpg \
  --driving spike_reference.mp4 \
  --output out.mp4 \
  --scale 1.0
```

## 6) DECA — 3D Yuz Rig (FLAME model)

Repo: https://github.com/yfeng95/DECA

Tek foto'dan 3D yuz mesh'i cikarir. MetaHuman / Unreal / Blender pipeline'a entegre.

### ARENA Kullanim
Antrenor avatari -> DECA -> Unreal Engine MetaHuman -> 3D interaktif rehber karakter.

## 7) Mesh2Motion — Generic 3D Mesh Rigging

Repo: https://github.com/Mesh2Motion/mesh2motion-app

Rigsiz FBX/OBJ mesh yukle -> otomatik skeleton + weight paint.
ARENA 3D logo maskot animasyonu icin ideal.

## 8) Batch Automation — ARENA Pipeline

### 8.1 End-to-End Script
`scripts/ai-video/generate-hero.ts`:
```ts
import { generateVeoClip } from '../../src/lib/ai/veo3'
import { uploadToStorage } from '../../src/lib/ai/storage'
import fs from 'fs'

const prompts = JSON.parse(fs.readFileSync('prompts/hero-campaigns.json', 'utf-8'))

for (const p of prompts) {
  console.log(`Generating: ${p.id}`)
  const uri = await generateVeoClip({
    prompt: p.text,
    aspectRatio: p.aspect,
    duration: 8,
    audio: true,
  })
  const url = await uploadToStorage(uri, `hero/${p.id}.mp4`)
  console.log(`Saved: ${url}`)
}
```

### 8.2 Prompt JSON
```json
[
  { "id": "hero-spike-v1", "aspect": "16:9", "text": "A 17-year-old..." },
  { "id": "hero-spike-v1-mobile", "aspect": "9:16", "text": "..." },
  { "id": "hero-team-v1", "aspect": "16:9", "text": "..." }
]
```

### 8.3 Quality Gate
Her render icin:
1. Loom inspector (bounds, frame count)
2. Manuel review (Slack webhook ile gonder)
3. Approve -> CDN push
4. Reject -> prompt revise + retry

## 9) Prompt Engineering Best Practices

### 9.1 Temel Kurallar
1. **Specific > Vague**: "volleyball player" YERINE "17-year-old Turkish female volleyball player"
2. **Concrete adjectives**: "beautiful" yerine "rim-lit, shallow DOF, 35mm film grain"
3. **Camera language kullan**: dolly-in, orbit, locked-off, handheld, drone aerial, gimbal tracking, whip-pan, rack-focus
4. **Shot size**: extreme close-up (ECU), close-up (CU), medium (MS), medium-wide (MW), wide (WS), extreme wide (EWS)
5. **Lens**: 24mm wide, 35mm classic, 50mm normal, 85mm portrait, 135mm tele
6. **Lighting**: three-point, rim-lit, motivated-source, golden hour, overcast, hard key, soft key, chiaroscuro
7. **Color palette explicit**: hex'i de soyleyebilirsin ama vendor her zaman anlamaz — renk adi ve ton (warm terracotta, sage green, coastal blue)
8. **Duration + aspect + fps** her zaman yaz
9. **Negative prompt** kullan (watermark, text, cartoon, deformed)

### 9.2 Camera Movement Kelime Haznesi
- **Static**: locked-off, tripod, steady shot
- **Slow**: slow dolly-in, subtle push-in, gentle orbit, drifting crane-up
- **Dynamic**: whip-pan, snap-zoom, crash-zoom, rapid dolly-out
- **Following**: gimbal tracking, steadicam follow, drone orbit, shoulder-mounted
- **Vertical**: crane-up, boom-down, pedestal rise
- **Combo**: push-in with slight pan, orbit while tilting up

### 9.3 Lighting Kelime Haznesi
- **Natural**: golden hour, blue hour, overcast softbox, Mediterranean noon, dappled shade
- **Studio**: three-point, butterfly, Rembrandt, loop, broad, split
- **Mood**: chiaroscuro (high contrast), low-key (dark), high-key (bright), neon backlight, cyberpunk
- **Practical**: motivated-source (window, lamp), bounce, negative fill

### 9.4 Negatifler
Her prompt'a ekle:
```
no text overlays, no watermarks, no logos, no brand names,
photorealistic skin (no waxy/plastic look), natural hands with
five fingers per hand, proportional body, no extra limbs, no
uncanny valley expressions, no cartoon aesthetic unless specified.
```

## 10) Maliyet Kontrolu

### 10.1 Butce Planlamasi
- Veo 3: $0.05-0.30/s -> 1 dk = $3-18
- Imagen 4: $0.02-0.08/img -> 100 image/ay = $2-8
- ElevenLabs: $22/ay (100k char)
- HeyGen (optional): $29/ay
- **Toplam**: $50-100/ay (landing + 2 sosyal reel haftada)

### 10.2 Re-use Strategy
1. Render bir kere -> her dile altyazi ekle (ffmpeg burn-in)
2. 8 sn clip'i 2 kez loop -> 16 sn (zero extra cost)
3. Hero video -> still frame extract -> poster image
4. Landscape render -> 1:1 ve 9:16 crop (Instagram/Stories icin)

## 11) Legal & Ethics

### 11.1 Asla Kullanma
- Tanimlanabilir kamuya mal sahsiyetler (ne LoRA ne prompt)
- Copyrighted jersey / logo / team name
- Minor (18 alti) icin yuz replication -> parent onayi zorunlu + local law check

### 11.2 Her Zaman Kullan
- Stock-looking generic athlete prompts
- ARENA brand palette only (no third-party brands visible)
- Disclaimer: "AI-generated scene, no real persons depicted" (marketing copy'e eklenmese de internal assets'e ekle)

### 11.3 Synthetic Content Labeling
EU AI Act + TR KVKK: AI-generated icerik disclose etmen gerekebilir.
- Meta tag: `<meta name="content-origin" content="ai-generated">`
- Schema: `<script type="application/ld+json">{"@type":"Claim","contentOrigin":"ai"}</script>`
- Credits: "Generated with Google Veo 3 + Imagen 4"

## 12) Veri Akisi — Hero Clip Pipeline

```
Brand Brief
  ↓
Prompt (Gemini rewrite/optimize)
  ↓
Veo 3 API call (8s 16:9)
  ↓
Poll operation (30-90s)
  ↓
Download signed URL
  ↓
QA (human review + automated checks)
  ↓  Approve
Supabase storage upload
  ↓
CDN invalidation
  ↓
Landing hero_video_url update
  ↓
PostHog track video_rendered event
```

## 13) Monitoring

```sql
CREATE TABLE ai_renders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text,              -- veo3 | imagen4 | sadtalker | higgsfield
  prompt text,
  params jsonb,
  output_url text,
  duration_ms int,
  cost_usd numeric,
  status text,            -- queued | running | success | failed
  reviewer_id uuid,
  review_status text,     -- pending | approved | rejected
  created_at timestamptz DEFAULT now()
);
```

Dashboard: Cost/month, success rate, average render time, review approval rate.

## 14) Dil-Spesifik Ornekler

### 14.1 Turkce Voice-over (Gemini + ElevenLabs)
Gemini'ye:
```
Prompt: 20 saniyelik bir spor akademi reklami icin Turkce seslendirme metni yaz.
Ton: sicak, gururlu, sakin otorite. Kitle: 13-17 yas sporcu velisi.
Anahtar: kendine guven, guclu ol. Akdeniz koku olsun.
Maksimum 55 kelime. Tek cumlelik kapanis.
```

Ornek cikti:
> "Kivilcim, disiplin, tutku. Cocugunuzun ici kadar yuregi de guclensin. ARENA'da her gun bir adim daha ileri, her adimda bir adim daha kendine. Kendine guven, guclu ol. Gelecek senin icin burada."

-> ElevenLabs TR voice Burcu v2 (warm, 38y female, calm authority).

### 14.2 Multi-language Generation
```ts
const langs = ['tr', 'en', 'de', 'ar']
for (const lang of langs) {
  const script = await gemini.generate(`Translate and culturally adapt:
    "${baseScriptTR}" to ${lang}, keep 55 word limit, warm sports academy tone.`)
  const audio = await elevenlabs.tts(script, voiceIdByLang[lang])
  // burn-in subtitle + audio swap
}
```

## 15) Video Subtitle + SRT

```ts
// ffmpeg burn-in TR subtitle
ffmpeg -i hero.mp4 -vf "subtitles=tr.srt:force_style='FontName=Manrope,FontSize=28,PrimaryColour=&Hffffff&'" -c:a copy hero_tr.mp4
```

## 16) Red Flags

- Veo 3 output'ta uncanny valley yuz -> prompt'a "natural skin pores, subtle imperfections" ekle
- Hand artifact (6 parmak) -> negative prompt + medium shot (hand fullscreen olmasin)
- Text'ler bozuk -> Veo henuz text'te zayif, text overlay'i post-production'da ekle
- API cost sisma -> rate limit ayarla, prompt tekrarlanan render'lari cache'le (hash based)
- Audio sync kayma -> 30fps sabit tut, SadTalker'da `--still` kullan

## 17) Production Checklist

- [ ] Google Cloud project + Vertex AI enabled
- [ ] Veo 3 quota ayarli
- [ ] Imagen 4 quota ayarli
- [ ] ElevenLabs API key + TR voices seçildi
- [ ] SadTalker Docker image build edildi (opsiyonel)
- [ ] Prompt template JSON klasoru hazir
- [ ] AI render Supabase tablosu migrate edildi
- [ ] QA review PostHog event eklendi
- [ ] CDN cache busting scripti var
- [ ] Cost alert Slack webhook kurulu

## 18) Iletisim Ritmi

Haftalik 1 hero + 3 kisa clip = 5 render / hafta.
Ayda 20 render × $8 ortalama = $160/ay.

## 19) Hizli Baslangic

```bash
cd /sessions/pensive-friendly-brahmagupta/mnt/PT/pt
mkdir -p scripts/ai-video prompts/ai-video
# 1. env ekle
echo "GCP_PROJECT=arena-prod" >> .env.local
echo "ELEVENLABS_API_KEY=xxxx" >> .env.local
# 2. prompt JSON olustur
# 3. generate-hero.ts calistir
npx tsx scripts/ai-video/generate-hero.ts
```

---

**Ozet**: Cekim yok, aktor yok, stok yok. Brief -> prompt -> Veo/Imagen -> QA -> CDN. Aylik $50-200 butceyle profesyonel-dengi reklam asset'leri.
