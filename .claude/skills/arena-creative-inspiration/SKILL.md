---
name: arena-creative-inspiration
description: ARENA Performance icin 2026 creative-coding toolkit teardown'lari — String Tune (CSS-first scroll lib), Astrodither (WebGPU + TSL dither/fluid), Smooothy (drag-momentum carousel), Particles (WebGPU AI swarm). Her tool icin konsept, gorsel dil, teknik stack, performans, erisilebilirlik, ARENA port plani. Tetikleyici: "creative tool", "string tune", "astrodither", "smooothy", "particles", "casberry", "webgpu", "tsl shader", "dither", "chromatic aberration", "lerp carousel", "particle swarm", "creative coding", "shader", "motion library", "scroll library".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
companion_skills:
  - arena-motion-lab
  - arena-site-references
  - arena-3d-animation
  - emil-kowalski-motion
---

# ARENA × Creative Inspiration Lab

Hedef: 4 yuksek-sinyalli creative-coding toolu (Sebastien Jefferies / crew derlemesi) derin incele, her birinden ARENA'ya konkret pattern cek. Clone yok — pattern donustur, ARENA estetiginde yeniden uret.

## 0) Kopyalama Felsefesi — Yeniden

1. **Kopya degil okuma**: Pixel-clone yasak. Gerekli olan: interaksiyon gramerini, timing fonksiyonunu, fizik modelini ve gorsel dilin *spirit*ini cozmek.
2. **Dugmeleri degistir, iskeleti tut**: Astrodither'in dither overlay'ini al, ama ARENA terracotta/sage paletinde; Smooothy'nin lerp fizigini al, ama voleybol drill kartiyla.
3. **Bir siteden >=1 pattern**: Her tool'dan minimum 1 somut ARENA component/sayfa cikar.
4. **Performans once**: Her pattern `prefers-reduced-motion`, mobile battery, 60fps kontrolunden gecer.
5. **Lisans**: MIT/Apache libraries icin credit (package.json + about page). GitHub repo demo kodunu direkt kopyalamak YASAK — kendine yeniden yaz.

## 1) String Tune — https://string-tune.fiddle.digital/

### 1.1 Konsept
CSS-first, attribute-driven JavaScript animasyon kutuphanesi (@fiddle-digital/string-tune). Felsefesi: "Once browser'in native'ine guven, sonra library". Hedef: sifir layout shift, CLS=0, reduced-motion dostu.

### 1.2 Gorsel Dil
- Tipografi agirligi: ust tipo (display sans) + yardimci ince sans
- Tipik layout: edge-to-edge hero, scroll-linked tipo reveal, madde-hac olcek
- Mikro-detay: attribute-driven `data-string-tune="fade-up"` tarzi deklaratif
- Palet: koyu nötr + canli accent (minimal, tipo agirlikli site)

### 1.3 Interaksiyon Grameri
| Pattern | Tetik | Sonuc |
|---|---|---|
| `scroll-reveal` | IntersectionObserver | Ogenin Y translate + opacity |
| `scroll-stick` | scroll offset | Position: sticky mimikri |
| `scroll-scrub` | scroll progress | Transform = progress * range |
| `parallax` | scroll delta | y = scroll * 0.2..0.8 |
| `hover-tilt` | pointermove | CSS var + rotateX/Y |

### 1.4 Teknik Stack
- ES6 modulu, framework-agnostic (React/Vue/Svelte bagimsiz)
- Sadece CSS transform + opacity (GPU friendly)
- `IntersectionObserver` + `requestAnimationFrame` loop
- Attribute parser: `data-st-*` ile config tasiyor
- npm paket: `@fiddle-digital/string-tune`

### 1.5 Performans
- 60fps hedef, GPU compositing
- Tree-shakeable (>50kb degil)
- Lazy init: ilk viewport only, digerleri IO ile
- Passive listeners

### 1.6 A11y
- `prefers-reduced-motion: reduce` -> `duration: 0`
- Content her zaman DOM'da, opacity sadece transform
- `aria-hidden` dekor OK

### 1.7 ARENA Uygulamasi — Konkret
| ARENA yer | String Tune pattern | Neden |
|---|---|---|
| Landing Hero kelimeleri | `scroll-reveal` + stagger 40ms | BlurText + scroll entry bridge |
| Stats sayilari | `scroll-scrub` + CountUp | Kullanici scroll'u = progres |
| Gallery sticky caption | `scroll-stick` | Foto kayar, caption sabit |
| Assessment Progress | `scroll-scrub` bar | 7 sorunun progresi |
| About timeline | `parallax` arka katman | Derinlik hissi |

### 1.8 Port Kodu (ARENA style, custom)
```ts
// src/lib/stringTune.ts — native kod, library import etmiyoruz
export function scrollReveal(el: HTMLElement, opts?: { delay?: number; distance?: number }) {
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) { el.style.opacity = '1'; return }

  const { delay = 0, distance = 24 } = opts ?? {}
  el.style.cssText += `opacity:0; transform:translateY(${distance}px); transition:opacity .6s ease-out ${delay}ms, transform .6s cubic-bezier(.16,1,.3,1) ${delay}ms; will-change:transform,opacity;`

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      io.disconnect()
    }
  }, { rootMargin: '-10% 0px' })
  io.observe(el)
}
```

## 2) Astrodither — https://astrodither.robertborghesi.is/

### 2.1 Konsept
Robert Borghesi'nin WebGPU + Three.js TSL shader ile kodladigi yaratici lab. Felsefe: "Sinyal kaybi = guzellik". Dijital gurultu (dithering, chromatic aberration, bloom) cosmic akiskanligi taklit ediyor. Tagline: "HOLD FOR SPEED / CLICK FOR SPEED".

### 2.2 Gorsel Dil
- **Monokrom yuksek kontrast**: siyah + beyaz + tek accent (cyan/magenta chroma split)
- **Bayer-matrix dither**: pikseli stilize eden low-pass filter, retro + kozmik
- **Chromatic aberration**: R/G/B kanallarin kaydiriminda alchemy
- **Single-pass bloom**: agir HDR yerine ucuz parlaklik
- **Tipo**: mono-space veya display serif + sayac rakamlari

### 2.3 Interaksiyon Grameri
| Pattern | Tetik | Efekt |
|---|---|---|
| **Hold**: mouse down | duruma bak | Hiz/force artar, dither inceltir |
| **Click**: kisa tik | tek seferlik puls | Fluid impulse |
| **Mouse move** | her pointermove | Fluid velocity input |
| **Idle** | ~500ms hareket yok | Daha yumusak ambient mode |

### 2.4 Teknik Stack
- **WebGPU** (fallback: WebGL2)
- **Three.js r170+** + **TSL (Three.js Shading Language)**
- **Compute pass**: fluid velocity field, Jacobi iteration pressure solve
- **Render pass**: dither shader (Bayer 4x4 ya da 8x8 matrix)
- **Post-FX**: chromatic aberration + bloom tek pass
- Audio-reactive hook: Web Audio API FFT -> shader uniform

### 2.5 Sader Ozet (TSL pseudo)
```ts
// pseudo, gerek anlamak icin
const velocity = uniform('vec2').onRenderUpdate((u) => pointerVelocity)
const density = storageTexture(...)

// compute — fluid advect
computeFn(() => {
  const newPos = currentPos.add(velocity.mul(deltaTime))
  density.store(newPos, sample(density, newPos))
})

// render — Bayer dither
const bayerMatrix = mat4(/* 4x4 Bayer */)
const threshold = bayerMatrix.element(uv.mod(4))
fragColor = step(threshold, density.r).mul(color)
```

### 2.6 Performans
- WebGPU avantaji: compute shader paralel, CPU'dan gelmez
- 60fps de 1920x1080 olcekte cozulur (yuksek GPU)
- Mobilde: WebGPU destegi iOS 17+, Android Chrome
- Fallback yoksa HTML/CSS gradient kondru degil - graceful degradation sart

### 2.7 A11y
- Audio-reactive mod opt-in (mikrofon izni yalnizca aktif olunca)
- `prefers-reduced-motion` -> statik cover imaji
- Keyboard alt: `space` hold = hold-for-speed

### 2.8 ARENA Uygulamasi — Konkret
| ARENA yer | Astrodither pattern | Neden |
|---|---|---|
| Hero arka plan | **dither shader** kumas/ten texture'inda | Sporcu fotografini sinematik hale getir, palet korunur |
| Assessment geciş | **chromatic aberration** 200ms puls | Soru gecişinde "enerji" hissi |
| Result reveal | **fluid impulse** + dither | Plan adi cikinca tek puls, kullanici "bu benim icin" hissi |
| Stats rakamlari | **bloom** sadece buyuk rakamda | "+28%" vb. sozel vurgu |
| Video hero fallback | static dither poster | WebGPU yoksa, statik poster ile ayni tat |

### 2.9 Implementation Yol Haritasi
```
Faz 1 (1-2 gun): dither post-process react-three-fiber + TSL
Faz 2 (1 gun): hero arkaplan texture swap
Faz 3 (yarim gun): reduced-motion fallback poster
Faz 4 (1 gun): mobil fallback WebGL shader
```

Bagimlilik: `three@0.170+`, `@react-three/fiber@9+`, TSL imports (`import { mix, step, texture, uv } from 'three/tsl'`).

## 3) Smooothy — https://smooothy.federic.ooo/

### 3.1 Konsept
Federico Valla'nin framework-agnostic drag-carousel kutuphanesi. Felsefe: "Momentum ile pozisyon arasinda yumusak ipucu". Brutalist katalog estetigi: ¥ fiyatli numaralarmis gibi bilesenler (0000-0005), live telemetri (SPEED/CURRENT/TARGET/PROGRESS).

### 3.2 Gorsel Dil
- **Brutalist katalog**: serif/grotesk mix, sayisal indeks
- **Black/white + tek accent** (turkuaz veya sari)
- **Monospace** telemetri degerleri
- Kaydirma: sonsuz dongu, her kart fiyatlandirilmis sanki urun
- Tipografi agirligi: Light 300 + Heavy 900 karsitliği

### 3.3 Interaksiyon Grameri
| Pattern | Tetik | Efekt |
|---|---|---|
| **Drag** | pointerdown + move | Velocity + position birikti |
| **Release** | pointerup | Momentum devam, lerp damping |
| **Snap** | settle yakin | En yakin slide'a lerp |
| **Wheel** | horizontal scroll | Velocity katkisi |
| **Parallax** | per-slide depth | İç ögeler farkli hizda |

### 3.4 Teknik Stack
- Framework-agnostic ES6 (React/Vue wrapperlar)
- `requestAnimationFrame` loop, frame-rate independent damping
- Matris transform: `transform: translateX(...)` + `will-change`
- Event API: `[SLIDE] SETTLED`, `[SLIDER] IN VIEW`, `[SLIDER] INITIALISED`
- State: `speed`, `current`, `target`, `progress`

### 3.5 Frame-Rate Independent Lerp — Anahtar Formul
```ts
// Bad: 60fps'de bir hiz, 120fps'de cift
pos += (target - pos) * 0.1

// Good: dt ile normalize
const damping = 12 // birim: 1/sn
pos += (target - pos) * (1 - Math.exp(-damping * dt))
```
Her rAF tick `deltaTime` alinir, damping sabitiyle carpan hesaplanir. 60Hz/120Hz/144Hz ayni.

### 3.6 Performans
- GPU transform only, layout tetigi yok
- Tree-shakeable, <8kb gzip (slim build)
- Passive pointer listeners
- Wheel debounce/RAF batch

### 3.7 A11y
- `tabindex` + Arrow keys
- `aria-roledescription="carousel"`, `aria-live="polite"` aktif slide numarasi
- `prefers-reduced-motion` -> snap instant, drag disabled
- Klavye: `→ / ←` adim adim; `Home/End` uc
- Screen reader: aktif slide haric `aria-hidden`

### 3.8 ARENA Uygulamasi — Konkret
| ARENA yer | Smooothy pattern | Neden |
|---|---|---|
| Programlar carousel | **drag + snap** + ¥ fiyat estetigi | Starter/Pro/Elite momentum ile gezilir |
| Gallery yatay scroll | **infinite drag** | Voleybol fotograf seridi |
| Coach/Takim uyeleri | **parallax slide** | İç foto + dis isim farkli hiz |
| Position-specific drills | **brutalist index** (0001-0012) | Libero, Setter, Outside Hitter drill seri |
| Testimonial slider | **wheel + drag** | 6 yorum momentum ile |

### 3.9 Port Kodu — Custom Lerp Hook
```ts
// src/lib/useSmoothLerp.ts
import { useEffect, useRef } from 'react'

export function useSmoothLerp(initial: number, damping = 12) {
  const current = useRef(initial)
  const target = useRef(initial)
  const frame = useRef<number>(0)

  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.064, (now - last) / 1000) // 64ms clamp
      last = now
      const k = 1 - Math.exp(-damping * dt)
      current.current += (target.current - current.current) * k
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [damping])

  return {
    setTarget: (v: number) => { target.current = v },
    get value() { return current.current }
  }
}
```

## 4) Particles — https://particles.casberry.in/

### 4.1 Konsept
Casberry (Eswar Prasaath) — "AI Particle Simulator" / "Professional 3D Swarm Simulator". Kullanici JS function body yaziyor, 20,000+ particle swarm browser'da simule ediyor. Felsefe: "Text to particle, visual response in real time, fast iteration".

### 4.2 Gorsel Dil
- **Derin uzay estetigi**: siyah + glowing particle cluster
- **HDR parlaklik + bloom**: noktalar parlak, arka plan nötr
- **Volumetrik hissi**: z-depth'e duyarli transparanlik
- **Gradient particle renk**: kullanici paleti, tipik radial gradient koyudan aydinligina
- **Minimal UI**: orta panel code editor, sag panel preset kutuphanesi

### 4.3 Interaksiyon Grameri
| Pattern | Tetik | Efekt |
|---|---|---|
| **Code write** | Kullanici JS fonk | Hemen canli preview |
| **Mouse move** | Scene uzerinde | Particle attractor |
| **Click** | Scene'de | Impulse (patlama) |
| **Scroll/Zoom** | Wheel | Camera dolly |
| **Drag** | right-button | Camera orbit |
| **Preset select** | Panel | Degisim animasyonu (smooth interp) |

### 4.4 Teknik Stack (Cikarim)
- **WebGPU** compute shader: particle pozisyon/hiz GPU'da
- **Instanced billboard quads** (point primitive degil - 1x1 plane + billboard)
- **WGSL**: kullanici JS'i WGSL'e compile eden IR (buyuk ihtimal)
- **Spatial hashing/binning** (20k particle icin neighbor sort)
- Fallback: WebGL 2 transform feedback
- Three.js veya native WebGPU renderer

### 4.5 Shader Mimari (Cikarim)
```wgsl
// compute.wgsl — her frame her particle
@compute @workgroup_size(64)
fn update(@builtin(global_invocation_id) id: vec3u) {
  var p = particles[id.x];
  let userForce = runUserLogic(p.pos, p.vel, time);
  p.vel += userForce * dt;
  p.vel *= damping;
  p.pos += p.vel * dt;
  particles[id.x] = p;
}
```

### 4.6 Performans
- 20k particle @60fps orta GPU
- Mobilde: duser ya da sampling strategy (5k only)
- WebGPU degilse: WebGL transform feedback ile benzer, biraz daha yavas
- Memory: 20k * 8 float = ~640kb GPU buffer

### 4.7 A11y
- `prefers-reduced-motion` -> statik poster
- Kod editor ekran okuyucu icin label
- Klavye: Tab ile preset panel navigasyonu
- Mikrofon/kamera istemez (pure GPU)

### 4.8 ARENA Uygulamasi — Konkret
| ARENA yer | Particles pattern | Neden |
|---|---|---|
| Hero arkaplan | **particle cloud** top/antrenman renginde | Terracotta + sage particle akisi |
| Assessment sonuç reveal | **impulse burst** plan aciklandiginda | "Seni sectik" hissi, yildiz/konfeti degil, zarif swarm |
| 404 sayfasi | **interactive particles** mouse follow | Kullanici tutulsun, hemen cikma |
| Stats section | **aggregation animation** sayilar icinde particle toplaniyor | "28%" sayisi noktalardan olusuyor |
| Programs card hover | **local attractor** | Kart folonde particle toplanisor |

### 4.9 Minimal ARENA Particle Component
```tsx
// src/components/premium/ParticleField.tsx
import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function ParticleField({ count = 2000 }) {
  const points = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 10
      arr[i*3+1] = (Math.random() - 0.5) * 10
      arr[i*3+2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  return (
    <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
      <Points ref={points} positions={positions} stride={3}>
        <PointMaterial
          transparent
          size={0.015}
          color="#C2684A" // ARENA terracotta
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Canvas>
  )
}
```
Mobilde: `dpr={[1, 1.5]}` + `count=800`; `prefers-reduced-motion` ise Canvas = null.

## 5) Sentez: 4 Tool'dan Ortak ARENA Patternleri

### 5.1 Ortak Estetik Dil
- **Monokrom + Tek Accent**: 3/4 tool (Astrodither, Smooothy, Particles). ARENA zaten sekize bir palet (terracotta ana). Bu bize dayanak.
- **GPU-only transform/opacity**: Hepsinde GPU. Bizde de `arena-motion-lab` zaten bu prensibi diyor.
- **Attribute/code-driven**: Tools deklaratif veya programatik API veriyor. ARENA'da `data-*` attribute'lariyla String Tune tarzi scroll patterns.

### 5.2 Ortak Motion Fizigi
```
Giris:       scrollReveal (String Tune) — IO + transform
Devamli:     lerp (Smooothy) — frame-rate independent damping
Etkilesim:   impulse (Astrodither, Particles) — click/hold pulse
Ambient:     ozel texture/effect (dither, bloom, particle)
```

### 5.3 Stack Onerisi
- **three@0.170+** + **@react-three/fiber@9+** + **@react-three/drei** — Astrodither ve Particles icin altlik
- **TSL imports** (`three/tsl`) — dither, fluid post-FX
- **`framer-motion`** (zaten var) — yuksek seviye layout, transition
- **Custom hooks**: useSmoothLerp, useScrollReveal, useMousePosition — zaten yazilabilir, library'siz

### 5.4 ARENA Motion Playbook'a Eklenecek Yeni 4 Pattern
1. **DitherOverlay** (Astrodither) — hero foto ya da video'yu sinematik yapar
2. **LerpCarousel** (Smooothy) — drag + momentum program carousel'i
3. **ScrollScrub** (String Tune) — sayi/progress bar scroll'a bagli
4. **ParticleField** (Particles) — hero ambient + CTA impulse

Hepsi `src/components/premium/` altina eklenir, `arena-motion-lab` SKILL'ine import pattern'i konulur.

### 5.5 Performans Budgetesi (ARENA Lighthouse hedefi)
| Component | Mobil TBT | LCP etkisi | CPU | GPU |
|---|---|---|---|---|
| ScrollReveal | 0ms | - | dusuk | sifir |
| LerpCarousel | 5-10ms | - | dusuk | dusuk |
| DitherOverlay (WebGPU) | 0ms (GPU) | - | sifir | orta |
| DitherOverlay fallback (WebGL2) | 10ms | - | dusuk | dusuk |
| ParticleField (2k) | 8ms | - | dusuk | orta |
| ParticleField (20k) | 25ms | risk | dusuk | yuksek |

Kural: Mobilde `ParticleField` >= 2000 particle YASAK; hero'da hemen initial paint sonrasi lazy init.

### 5.6 Rollout Plani (4 iter)
```
Iter 24 (bu): teardown skill - dokuman
Iter 25:    DitherOverlay + ScrollScrub pattern components
Iter 26:    LerpCarousel + Programs carousel gecisi
Iter 27:    ParticleField + Assessment reveal entegrasyonu
```

### 5.7 A11y Guvenlik Kemerleri (hepsinin zorunlu baseline)
```tsx
const reduced = useReducedMotion()
if (reduced) return <StaticPoster src={fallback} />
```
- Her motion component'te `useReducedMotion()` ilk satir
- Her shader/particle: fallback statik poster asset hazir
- Keyboard: tab order kesilmez, focus ring korunur
- Screen reader: `role`, `aria-label`, `aria-live` neredeyse her yerde

## 6) Yasal / Lisans

- String Tune: MIT (npm), credit package.json
- Astrodither: proje kaynak acik degil — tekniksel *pattern* ogrenilir, direkt kod kopyalama YASAK
- Smooothy: GitHub repo var (kontrol et), MIT/ISC ise wrapper OK
- Particles (Casberry): web app, kod acik degil — *pattern* olarak al

Her halukarda: Three.js TSL shader ornekleri Three.js dokumanindan veya R3F community'den alinir, attribution korunur.

## 7) Referans Kaynaklar

- String Tune: https://string-tune.fiddle.digital/ — Fiddle Digital
- Astrodither: https://astrodither.robertborghesi.is/ — Robert Borghesi
- Smooothy: https://smooothy.federic.ooo/ — Federico Valla
- Particles: https://particles.casberry.in/ — Casberry (Eswar Prasaath)
- Three.js TSL: https://threejs.org/docs/#api/en/nodes/
- Field Guide to TSL: https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
- WebGPU MDN: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API

## 8) Kisa Ozet (tweet-lik)
```
String Tune = scroll grameri
Astrodither = GPU shader sanat
Smooothy   = drag fizigi
Particles  = swarm siir
ARENA birlestirir: Akdeniz + atletik + premium
```
