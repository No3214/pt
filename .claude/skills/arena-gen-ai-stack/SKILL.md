---
name: arena-gen-ai-stack
description: ARENA icin generative AI repository'lerinin (image, video, lip-sync, voice clone, music, motion transfer) degerlendirilmesi + lisans matrisi + ARENA stack'e port plani. Hangi repo kopyalanacak, hangisi skip, hangisi sadece referans. Muapi.ai vendor'larindan kacinma, self-host vs API trade-off.
---

# ARENA Generative AI Stack — Repository Evaluation

Elite voleybol / performans markasi icin uygun open-source generative AI repo'larinin detayli degerlendirmesi. Her repo icin: lisans, olculum, ARENA'da ne kopyalanacak, kacinilacak noktalar, maliyet karsilasi.

## Hizli karar matrisi

| Repo | Lisans | ARENA'da kullanim | Oncelik |
|---|---|---|---|
| ComfyUI | GPL-3.0 | Training illustration + poster generation | P1 |
| SadTalker | Apache-2.0 | Coach/athlete testimonial video | P1 (iter 16'da prompt library'de) |
| LivePortrait | MIT | Athlete face motion transfer | P2 |
| F5-TTS | MIT | Coach voice cloning (multilingual) | P2 |
| CogVideoX | Apache-2.0 | Self-hosted video fallback (Veo 3 backup) | P3 |
| Mochi-1 | Apache-2.0 | Long-form training video generation | P3 |
| AnimateAnyone | non-commercial | - skip | - |
| V-Express | MIT | Alternative lip-sync | P3 |
| Anil-matcha/Open-Generative-AI | MIT | Pattern reference only (Muapi.ai vendor) | P4 |
| elder-plinius/G0DM0D3 | AGPL-3.0 | **SKIP — jailbreak/redteam repo, ARENA brand ile uyumsuz** | - |

## 1. ComfyUI (comfyanonymous/ComfyUI)

**URL:** https://github.com/comfyanonymous/ComfyUI
**Lisans:** GPL-3.0
**Yildiz:** 70K+
**Kategori:** Node-based image/video generation with Stable Diffusion, Flux, SD3.5

### ARENA'da nerede
- Training pozisyon illustrasyonlari (setter/spiker/libero)
- Blog gorselleri (voleybol equipment close-up, action shots)
- Landing page static hero alternatives
- PDF raporlarda sekil

### Kopyalama plani
```
scripts/ai-image/
  generate-pose-diagram.ts     # ComfyUI workflow JSON -> pose render
  comfy-workflows/
    volleyball-pose.json       # node graph, reusable
    equipment-closeup.json
    action-blur.json
```

### Deployment
- Self-host: GPU VPS (Vast.ai ~$0.30/saat A100, ComfyUI Docker image)
- Cloud: RunComfy / ComfyCloud / Replicate
- Maliyet/image: ~$0.003-0.008 (SD) vs ~$0.04 (OpenAI DALL-E)

### API adaptor (minimal)
```ts
// scripts/ai-image/comfy-client.ts
interface ComfyRequest {
  workflow: object   // node graph
  client_id: string
}

export async function queueComfy(workflow: object, baseUrl = 'http://localhost:8188'): Promise<string> {
  const res = await fetch(`${baseUrl}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflow, client_id: crypto.randomUUID() }),
  })
  const data = await res.json()
  return data.prompt_id as string
}

export async function pollComfy(promptId: string, baseUrl = 'http://localhost:8188'): Promise<string[]> {
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2500))
    const res = await fetch(`${baseUrl}/history/${promptId}`)
    const data = await res.json()
    const item = data[promptId]
    if (!item?.outputs) continue
    return Object.values(item.outputs)
      .flatMap((o: any) => o.images ?? [])
      .map((img: any) => `${baseUrl}/view?filename=${img.filename}&type=${img.type}`)
  }
  throw new Error('Comfy timeout')
}
```

### Tuzaklar
- GPL-3.0 viral lisans — ARENA'ya linklemeyeceksin, ayri microservice olarak cagir (HTTP barrier GPL'i izole eder)
- Self-host GPU maliyeti — Vast.ai spot instance + idle shutdown kritik
- Workflow JSON'larini versiyonla — model/node guncellemeleri break edebilir

## 2. SadTalker (OpenTalker/SadTalker)

**URL:** https://github.com/OpenTalker/SadTalker
**Lisans:** Apache-2.0
**Yildiz:** 13K+
**Kategori:** Audio-driven single image -> talking head video

### ARENA'da nerede
- Coach testimonial videolari (tek fotograf + ses -> konusan coach)
- Mac oncesi motivasyon videosu (yildiz oyuncu fotografi + yerel ses)
- Cok dilli selamlama (tek sporcu, 13 dil audio ile)

### Iter 16 durumu
Zaten `arena-prompt-library/avatar-prompts.json` icinde referans var. Bu sekil bir adim daha:
```
scripts/ai-video/
  sadtalker-client.py           # Python (HuggingFace inference)
  generate-coach-testimonial.ts # TS orchestrator, HF Inference API cagrisi
```

### Deployment
- HuggingFace Inference Endpoint (Pro plan $9/ay + pay-per-use)
- Self-host: Replicate/Fal API wrapper
- Maliyet: ~$0.05-0.15 per 30s video

### Tuzaklar
- Single image -> sadece head motion, body hareket etmez
- Lip-sync dogrulugu mukemmel degil — F5-TTS ile oncelikle audio olustur (netlik)
- 30s uzerinde uncanny valley — 10-20s clip'lerle sinirla

## 3. LivePortrait (KwaiVGI/LivePortrait)

**URL:** https://github.com/KwaiVGI/LivePortrait
**Lisans:** MIT
**Yildiz:** 14K+
**Kategori:** Driver video -> source portrait motion transfer

### ARENA'da nerede
- Historical voleybol figurleri (statik foto) -> animate (respectful kullanim)
- Antrenor ifade aktarimi (coach'un haftalik video'yu bir driver olarak kullan, farkli sporcu fotolari animate et)
- Onboarding karakter animasyonu (illustration portrait -> konusma)

### Kopyalama plani
```
scripts/ai-video/
  liveportrait-client.py
  drivers/                     # reusable driver videos (smile, nod, wink)
generate-liveportrait.ts
```

### Tuzaklar
- Gercek kisiler icin rıza KVKK zorunlu — sadece fiction/illustration karakterler icin otomasyonla uret
- Cok GPU memory — 16GB+ onerilir, T4 ile zorlanir

## 4. F5-TTS (SWivid/F5-TTS)

**URL:** https://github.com/SWivid/F5-TTS
**Lisans:** MIT
**Yildiz:** 10K+
**Kategori:** Zero-shot voice cloning, 15s referans ses yeter

### ARENA'da nerede
- 13 dil icin coach voice: TR ana sesi -> EN/AR/DE/... otomatik uret
- Program audio guide (workout voice cue, "baslat / dinlen / tekrarla")
- Podcast intro / outro (coach sesiyle)

### Deployment
```
scripts/ai-audio/
  f5-tts-client.py
  generate-voice-lines.ts      # 13 dilde batch generation
  voice-cache/                 # IDs per locale
```

### Maliyet
- Self-host: GPU 4GB yeterli (8GB rahat)
- Replicate: $0.00025/sec audio
- ARENA 100 sentence x 13 locale x 5s = 6500s = ~$1.60 batch

### Tuzaklar
- Referans ses kalitesi kritik — 16kHz+, temiz stuyo, background noise yok
- Coach'un konusma iznini yazili al (kvkk/reklama aid kisilik hakki)
- Turkce ozel karakter (c, g, s, i, o, u) isleme dogrulugunu test et

## 5. CogVideoX (THUDM/CogVideo)

**URL:** https://github.com/THUDM/CogVideo
**Lisans:** Apache-2.0 (2B), CogVideoX-Custom-License (5B)
**Yildiz:** 12K+
**Kategori:** Text-to-video (5B parametre), 6 saniye, 720p

### ARENA'da nerede
- Veo 3 fallback (vendor lock-in riskini azaltir)
- Ucuz batch video (binlerce short clip gerekirse)
- Self-host capable tek realist T2V seçenegi (Mochi-1 yanisira)

### Maliyet karsilasi (6s video)
| Model | Maliyet | Kalite | Self-host |
|---|---|---|---|
| Veo 3 | $2.10 | 9/10 | No |
| CogVideoX-5B | $0.12 (spot GPU) | 6/10 | Yes |
| Mochi-1 | $0.25 (self-host) | 7/10 | Yes |

### Kopyalama plani
```
supabase/functions/render-cogvideox/
  index.ts                     # Replicate API wrapper OR self-host proxy
scripts/ai-video/
  cogvideo-fallback.ts         # Veo 3 fail/budget exceed olunca devreye alir
```

### Tuzaklar
- 5B varyantin lisansi commercial kullanim icin THUDM onayi ister (2B apache-free)
- 720p limit — 1080p icin upscale lazim (ESRGAN ekle)

## 6. Mochi-1 (genmoai/models)

**URL:** https://github.com/genmoai/models
**Lisans:** Apache-2.0
**Yildiz:** 3K+
**Kategori:** 10B parameter open-source video model

### ARENA'da nerede
- 4090 kaliteli (5s clip) self-host
- Uzun form training video (saniyelerce mola, egzersiz transition)
- Research: Higgsfield-style motion reference

### Deployment
- Minimum 4x H100 veya A100 — ciddi altyapi
- Replicate: $0.40/5s video (Veo 3'den 5x ucuz, Mochi %75 kalite)

## 7. V-Express (Tencent/V-Express)

**URL:** https://github.com/tencent-ailab/V-Express
**Lisans:** MIT (research only — tencent commercial icin ayri anlasma)
**Kategori:** Audio + reference image + optional driver -> talking head

### ARENA'da nerede
- SadTalker alternatif (daha iyi lip sync)
- Iki sistemi AB test etmek akillica

### Skip nedeni (su an)
- Research-only flag commercial kullanimi bulandirir, SadTalker ile baslayip performance yetersizse degistir

## 8a. Higgsfield AI Açık Kaynakları (önemli netlestirme)

Yaygin yanlis anlama: "Higgsfield'in ucretsiz open-source video modeli". Gercek su:

| Repo | Lisans | Ne yapar | ARENA'ya uygun mu |
|---|---|---|---|
| `higgsfield-ai/higgsfield` | Apache-2.0 (3.6K stars) | GPU orkestrasyon/training framework (billions-trillion param modeller icin) | Altyapi, **model degil** |
| `higgsfield-ai/higgsfield-client` | Apache-2.0 (36 stars) | Python SDK (paid API icin) | SDK, model degil |
| `higgsfield-ai/higgsfield-js` | - (17 stars) | Node/TS SDK (paid API icin) | SDK, model degil |

### Sonuc
- Higgsfield'in **Soul / DoP / Creative Studios** urunleri proprietary — `api.higgsfield.ai` paid API uzerinden erisiliyor
- Acik kaynak olan sadece GPU orchestration framework (bizim kullanim senaryomuzla ilgisiz; Ray/K8s benzeri altyapi)
- "Ucretsiz model" bulunmuyor — kullanmak istersek API credit almak lazim

### Higgsfield API (paid) kullanirsak
```ts
// supabase/functions/render-higgsfield/index.ts
const HIGGSFIELD_API = 'https://api.higgsfield.ai/v1'
const res = await fetch(`${HIGGSFIELD_API}/generate`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${HIGGSFIELD_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt, model: 'soul', duration: 5 }),
})
// Maliyet: ~$0.80-1.40 per 5s video (Veo 3'den ucuz, CogVideoX'den pahali)
```

Bizim `higgsfield-kit/` alt sistemimiz zaten Seedance 2.0 uzerinden calisiyor (CLAUDE.md'de belirtilmis). Ekstra Higgsfield API ekleme onerilmez — mevcut kit'i koru.

### GERCEK ucretsiz OSS alternatifler (Higgsfield'ın yerine)
Higgsfield'in video kalitesini gerçekten ucretsiz/OSS ile karsilamak icin:
1. **CogVideoX-5B** (yukarida #5) — Apache-2.0, self-host
2. **Mochi-1** (yukarida #6) — Apache-2.0, self-host
3. **Open-Sora-Plan** (PKU-YuanGroup) — MIT, self-host
4. **HunyuanVideo** (Tencent) — Tencent Community License, 13B parametre, **60-80GB VRAM gerekir** (H100/A100 80GB), en yakin kalite. ARENA icin agirdir — CogVideoX-5B (24GB VRAM) daha uygun

Bu dortu Higgsfield Soul'un yerini tutar + tamamen ucretsiz (GPU maliyeti disinda).

## 8b. Anil-matcha/Open-Generative-AI (referans)

**URL:** https://github.com/Anil-matcha/Open-Generative-AI
**Lisans:** MIT
**Yildiz:** 5.3K
**Kategori:** Muapi.ai frontend (Image/Video/LipSync/Cinema Studio)

### Neden ARENA'ya entegre ETMIYORUZ
1. **Muapi.ai vendor lock** — bizim stack zaten Veo 3 direct + Claude direct. Ekstra vendor gereksiz
2. **"Unrestricted / no content filters" framing** — ARENA genc/aile spor markasi, uncensored repo brand imajiyla catisir
3. **Bizim pipeline daha az yuzey** — supabase edge function + Cloudflare R2 yeter. Electron app fazladan

### Neden referans olarak faydali
- **200+ model metadata structure** — models.js dump gorsel referans (bizim arena-prompt-library'de similar schema)
- **Polling pattern** — submitAndPoll helper'i bizim Veo 3 edge function'a benzer (iyi yapilmis)
- **Multi-studio UX** — 4 farkli studio UI ayirimi iyi ornek
- **Reference image handling** — 14'e kadar referans image gonderme pattern'i kopyalanabilir

### Extract edilen pattern'ler
```js
// Anil-matcha src/muapi.js'ten -> bizim yapiya uyarlanabilir
async function pollForResult(requestId, key, maxAttempts = 900, interval = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise((r) => setTimeout(r, interval))
    const res = await fetch(`${BASE_URL}/predictions/${requestId}/result`, {
      headers: { 'x-api-key': key }
    })
    const data = await res.json()
    if (data.status === 'completed') return data
    if (data.status === 'failed') throw new Error(data.error)
  }
  throw new Error('Timeout')
}
```
Bizim `render-veo3/index.ts`'deki pollOperation ile kavramsal olarak ayni, zaten dogru yoldayiz.

## 9. elder-plinius/G0DM0D3 (SKIP)

**URL:** https://github.com/elder-plinius/G0DM0D3
**Lisans:** AGPL-3.0
**Kategori:** LLM redteam/jailbreak prompt collection + multi-model evaluation

### Neden SKIP
1. **Ana amaci LLM safety bypass** — "Parseltongue: 33 trigger-word techniques for input perturbation"
2. **ARENA markasiyla catisir** — elit genc sporcu markasi, jailbreak tooling alakasiz
3. **KVKK/etik risk** — uncontrolled LLM output'u minor users'a servis etmek etik dısı
4. **AGPL-3.0 viral** — kullaninca butun ARENA stack'ı acmak gerekir

Bu repo ARENA'nin icinde yer almayacak. Claude'un safety guideline'lari da bu tur icerik ustunde calismama talimati veriyor.

## 10. Ekstra — arastirilmasi gereken repos (backlog)

| Repo | Amac | Oncelik |
|---|---|---|
| `black-forest-labs/flux` | Flux image model weights (SD3 rakibi) | P2 |
| `fal-ai/fal-js` | Fal.ai serverless inference SDK | P3 |
| `replicate/replicate-python` | Replicate Python SDK | P3 |
| `openai-python` | GPT-5/DALL-E official SDK | P2 |
| `coqui-ai/TTS` | Voice cloning (F5-TTS'den daha eski ama stabil) | P3 |
| `hacksider/Deep-Live-Cam` | Real-time face swap (etik olarak skip, deepfake riski) | skip |
| `ali-vilab/AnimateAnyone` | Ali pose-driven animation | skip (non-commercial) |
| `PKU-YuanGroup/Open-Sora-Plan` | OpenSORA (Sora rakibi) | P3 |
| `lllyasviel/Fooocus` | SD simplified UI | P4 |

## ARENA stack icin minimum viable pipeline (priority order)

1. **Veo 3** (iter 17 edge function) — hero + marketing video (zaten hazir)
2. **Claude API** (iter 17 generate-draft) — copy + blog (zaten hazir)
3. **SadTalker via Replicate** — coach testimonials
4. **F5-TTS via Replicate** — 13 dil coach voice
5. **ComfyUI self-host** — training illustration + blog image
6. **CogVideoX-2B via Replicate** — Veo 3 fallback (cost/rate-limit)

Toplam ek entegrasyon efforti: ~5 yeni supabase edge function + 3 script.
Tahmin maliyet (aylik 1000 render): $150-300.

## Lisans matrisi

| Lisans | Commercial kullanim | ARENA icin guvenli |
|---|---|---|
| MIT | Tamamen serbest | Yes |
| Apache-2.0 | Tamamen serbest + patent grant | Yes |
| GPL-3.0 | Viral — microservice olarak izole et | Conditional (HTTP barrier) |
| AGPL-3.0 | Viral + SaaS kullanimi acar | No (ARENA hosted SaaS) |
| Custom "non-commercial" | Sadece research | No |
| Custom (THUDM) | THUDM onayi ister | Conditional |

## Sonraki adim

1. SadTalker via Replicate edge function (supabase/functions/render-avatar/index.ts)
2. F5-TTS via Replicate edge function (supabase/functions/clone-voice/index.ts)
3. ComfyUI self-host POC — Vast.ai A100 spot, volleyball-pose.json workflow
4. Retry-budget logic: Veo 3 fail -> CogVideoX fallback

## Kaynaklar

- ComfyUI: https://github.com/comfyanonymous/ComfyUI
- SadTalker: https://github.com/OpenTalker/SadTalker
- LivePortrait: https://github.com/KwaiVGI/LivePortrait
- F5-TTS: https://github.com/SWivid/F5-TTS
- CogVideoX: https://github.com/THUDM/CogVideo
- Mochi-1: https://github.com/genmoai/models
- Replicate pricing: https://replicate.com/pricing
- Vast.ai GPU market: https://vast.ai
- HuggingFace Inference: https://huggingface.co/inference-endpoints
