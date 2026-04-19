---
name: arena-3d-animation
description: ARENA Performance 3D animasyon + WebGL + cinematic motion playbook. Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Vanta.js, GSAP ScrollTrigger, Lottie, CSS 3D transforms, WebGPU preview, model loading (GLTF/DRACO), physics (cannon/rapier), performance budget, lazy-loading strategy, AI-generated content pipeline (SadTalker, HY-Motion, champ, DECA, Mesh2Motion). Tetikleyici: "3d", "three", "r3f", "threejs", "webgl", "vanta", "gsap", "scroll animation", "lottie", "model", "gltf", "cinema", "parallax 3d", "webgpu".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × 3D Animation Playbook

Hedef: Landing ve premium portal section'larinda AAA seviyeli 3D. Ama bundle disciplini: 3D sadece opt-in, lazy, Elite plan.

## 0) Teknoloji Karar Matrisi

| Ihtiyac | Cozum | Bundle | Complexity |
|---|---|---|---|
| Animated BG (nebula, net, birds) | Vanta.js | ~60KB gz | Dusuk |
| Scroll-linked 3D (skate/ball camera move) | R3F + GSAP | ~200KB gz | Orta |
| Full 3D scene (stadium, product viewer) | R3F + drei | ~250KB gz | Yuksek |
| Cinematic sport clip | Pre-rendered video | ~300KB | Sifir (runtime) |
| Vector icon / badge animation | Lottie | ~30KB gz | Dusuk |
| CSS 3D card flip / tilt | Vanilla CSS | 0KB | Sifir |

## 1) Reference Repositories (inceleme + kilavuz)

### pmndrs/react-three-fiber
React deklaratif Three.js. Modern 3D icin standart.
```bash
npm i three @react-three/fiber @react-three/drei
```
Gotcha: three.js ayri peer dep; bundle icin three core + orbitcontrols vb. sadece kullanilanlar.

### pmndrs/drei
R3F helpers: `Environment`, `Float`, `Sparkles`, `Text3D`, `useGLTF`, `Scroll`, `ScrollControls`, `useCursor`, `PresentationControls`, `MeshDistortMaterial`. Cogu durumda 50+ helper'dan 3–5 kullanilir.

### tengbao/vanta
Plug-and-play 3D background. NET, BIRDS, FOG, WAVES, GLOBE gibi preset'ler.
```bash
npm i vanta three
```
Hero background icin ideal, lazy import et. Bundle: ~60KB gz + three ~120KB gz (zaten varsa ayni instance).

### fireship-io/threejs-scroll-animation-demo
Camera scroll linkage pattern rehberi. ARENA'da scroll-driven ball trajectory icin ornek.

### adrianhajdin/project_3D_developer_portfolio
Product stand pattern (3D sphere/cube showcase + rim light + bloom). Program card'i 3D olarak gostermek icin.

### Naresh-Khatri/3d-portfolio
Interactive 3D scene layout.

### galacean/engine
Alternative Three.js: daha kompakt; TypeScript-first. Enterprise tenant icin degerlendirilebilir.

### o3de/o3de
Full game engine — web'de KULLANILMAZ, sadece mobile native app icin. ARENA scope disinda.

### kakajika/FragmentAnimations
iOS framework — web scope disinda.

### AI-Generated Motion Pipeline (content creation, runtime degil)

Bunlar browser'da degil, **icerik uretim asamasinda** kullanilir. Cikan video/image CDN'e konur ve `<video>` veya `<img>` olarak sunulur.

- **Tencent-Hunyuan/HY-Motion-1.0** — Text-to-motion AI
- **OpenTalker/SadTalker** — Audio → talking head video (testimonial generic → kisisellesmis)
- **fudan-generative-vision/champ** — Human animation synthesis
- **yfeng95/DECA** — Face capture (avatar uretimi)
- **Mesh2Motion/mesh2motion-app** — 3D mesh → animation
- **heygen-com/hyperframes** — HeyGen ecosystem / framing tool

### workflow
1. Hero icin 6–12 sn cinematic generate et (SadTalker / champ)
2. MP4 (AV1 veya h265) export, <500KB
3. CDN'e yukle
4. Landing'de `<video autoplay muted playsinline loop poster>` ile goster
5. `prefers-reduced-motion: reduce` ise poster gorseli

## 2) Lazy Loading Stratejisi

`three` ve R3F bundle'a eager eklemek YASAK. Islemler:

```tsx
// src/components/three/HeroScene.tsx
import { lazy, Suspense } from 'react'
const Scene = lazy(() => import('./SceneImpl'))

export function HeroScene({ fallback }: { fallback?: React.ReactNode }) {
  return (
    <Suspense fallback={fallback ?? <Poster />}>
      <Scene />
    </Suspense>
  )
}
```

vite.config.ts `manualChunks` ekle:
```ts
if (
  id.includes('three') ||
  id.includes('@react-three/') ||
  id.includes('vanta')
) return 'three'
```

Lazy chunk'lar audit-bundle.ts regex'inde zaten izinli (`three` eklenmis).

## 3) R3F Temel Sahne

```tsx
// src/components/three/SceneImpl.tsx
import { Canvas } from '@react-three/fiber'
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'

export default function SceneImpl() {
  return (
    <Canvas camera={{ position: [0, 1.2, 3], fov: 35 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} castShadow />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <PresentationControls global polar={[-0.3, 0.3]} azimuth={[-0.6, 0.6]}>
          <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
            <Volleyball />
          </Float>
        </PresentationControls>
        <ContactShadows opacity={0.5} blur={2} />
      </Suspense>
    </Canvas>
  )
}
```

### Volleyball component (basit procedural)

```tsx
function Volleyball() {
  return (
    <mesh castShadow>
      <sphereGeometry args={[0.7, 64, 64]} />
      <meshStandardMaterial color="#FAF6F1" roughness={0.4} metalness={0.1} />
      {/* panel gaplari ince tubeGeometry ile */}
    </mesh>
  )
}
```

Gercek GLTF asset kullanmak isteriz:

```tsx
import { useGLTF } from '@react-three/drei'
function VolleyballGLTF() {
  const { scene } = useGLTF('/models/volleyball-draco.glb')
  return <primitive object={scene} />
}
useGLTF.preload('/models/volleyball-draco.glb')
```

## 4) DRACO Compression

Model dosyalari 1–5MB default. DRACO ile %90 kisilir:

```bash
# glTF-Transform ile sikistir
npx @gltf-transform/cli draco input.glb output.glb --compress-meshes
```

```tsx
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
```

## 5) Scroll-linked Camera (Fireship pattern)

```tsx
import { useScroll, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll as dreiUseScroll } from '@react-three/drei'

function ScrollScene() {
  return (
    <ScrollControls pages={4} damping={0.15}>
      <CameraController />
      <Volleyball />
    </ScrollControls>
  )
}

function CameraController() {
  const scroll = dreiUseScroll()
  useFrame((state) => {
    const p = scroll.offset
    state.camera.position.x = Math.sin(p * Math.PI * 2) * 3
    state.camera.position.z = Math.cos(p * Math.PI * 2) * 3
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
```

Alternatif: GSAP ScrollTrigger (DOM-driven).

## 6) GSAP ScrollTrigger

```tsx
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

useEffect(() => {
  gsap.to(meshRef.current.position, {
    x: 5,
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.5,
    },
  })
}, [])
```

GSAP bundle etkisi ~50KB gz. Mevcut scrolling Lenis varsa duplicate etmeyin.

## 7) Vanta.js Hero Background

```tsx
import { useEffect, useRef } from 'react'

export function VantaHero({ effect = 'NET' as 'NET' | 'BIRDS' | 'FOG' | 'WAVES' }) {
  const ref = useRef<HTMLDivElement>(null)
  const vantaRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false
    async function init() {
      const THREE = await import('three')
      const VANTA_EFFECT = effect === 'NET'
        ? (await import('vanta/dist/vanta.net.min')).default
        : effect === 'BIRDS'
        ? (await import('vanta/dist/vanta.birds.min')).default
        : effect === 'FOG'
        ? (await import('vanta/dist/vanta.fog.min')).default
        : (await import('vanta/dist/vanta.waves.min')).default

      if (disposed) return
      vantaRef.current = VANTA_EFFECT({
        el: ref.current,
        THREE,
        color: 0xC2684A,
        backgroundColor: 0x050505,
        mouseControls: true,
        touchControls: true,
        points: 10,
        maxDistance: 22,
        spacing: 16,
      })
    }
    init()
    return () => { disposed = true; vantaRef.current?.destroy() }
  }, [effect])

  return <div ref={ref} className="absolute inset-0 -z-10" aria-hidden="true" />
}
```

`prefers-reduced-motion: reduce` check:
```ts
if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null
```

## 8) Lottie Icon Animation

```bash
npm i lottie-react
```

```tsx
import Lottie from 'lottie-react'
import volleyballAnim from './volleyball.json'

<Lottie animationData={volleyballAnim} loop autoplay style={{ width: 120, height: 120 }} />
```

Lottie files: https://lottiefiles.com/search?q=volleyball

## 9) CSS 3D (Sifir Bundle)

Card flip:
```tsx
<div className="group perspective-1000">
  <div className="relative preserve-3d duration-700 group-hover:rotate-y-180">
    <div className="backface-hidden">Front</div>
    <div className="absolute inset-0 rotate-y-180 backface-hidden">Back</div>
  </div>
</div>
```

Tailwind plugin: `tailwindcss-3d` veya manual utilities:
```css
.perspective-1000 { perspective: 1000px; }
.preserve-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }
```

## 10) Postprocessing Effects

```tsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom intensity={0.8} luminanceThreshold={0.3} />
  <ChromaticAberration offset={[0.001, 0.001]} />
  <Vignette offset={0.5} darkness={0.5} />
</EffectComposer>
```

Cost: ~50KB gz + GPU fillrate (~30% frame time).

## 11) Physics

ARENA icin fizik opsiyonel (top zipla demo):
```bash
npm i @react-three/rapier
```

```tsx
import { Physics, RigidBody } from '@react-three/rapier'

<Physics gravity={[0, -9.8, 0]}>
  <RigidBody colliders="ball" restitution={0.8}>
    <Volleyball />
  </RigidBody>
  <RigidBody type="fixed">
    <mesh position={[0, -1, 0]}>
      <boxGeometry args={[10, 0.2, 10]} />
      <meshStandardMaterial />
    </mesh>
  </RigidBody>
</Physics>
```

## 12) WebGPU Preview (2026+)

```tsx
import { WebGPURenderer } from 'three/examples/jsm/renderers/webgpu/WebGPURenderer'
<Canvas gl={(canvas) => new WebGPURenderer({ canvas, antialias: true })} />
```

Chrome/Safari/Edge destek mevcut; Firefox beta. Fallback WebGL.

## 13) Performance Budget

- Hero scene: 60fps @ iPhone 12 Pro
- Triangle count: < 50k
- Draw calls: < 20
- Texture: 1k–2k max; compressed (KTX2/Basis)
- GLTF: < 500KB
- DPR cap: `dpr={[1, 1.5]}` (retina'da kalite korunur, ama perf dusman degil)

Monitoring:
```tsx
import { Stats } from '@react-three/drei'
<Canvas><Stats /></Canvas>
```

## 14) A11y

3D decorative:
```tsx
<div role="presentation" aria-hidden="true">
  <Canvas>...</Canvas>
</div>
```

Kritik content'de 3D yok. Her 3D element'in text equivalent'i olmali.

`prefers-reduced-motion`: scene'i poster gorseliyle degistir.

## 15) Mobile Strateji

- Canvas height fixed (100svh yerine 80svh)
- DPR 1.25 max
- Basit scene (polys < 25k)
- Touch controls (pinch-zoom disabled sonsuz zoom'u engeller)
- Battery-saver mode: `(prefers-reduced-data: reduce)` ise video fallback

## 16) Loading State

```tsx
import { Html, useProgress } from '@react-three/drei'

function Loader() {
  const { progress } = useProgress()
  return <Html center><div>{progress.toFixed(0)}%</div></Html>
}

<Suspense fallback={<Loader />}><Scene /></Suspense>
```

## 17) Asset CDN

GLB modelleri Supabase Storage veya CF R2'ye koy:
- `models/volleyball-v2.glb` → CDN
- Cache-Control: `public, max-age=31536000, immutable`
- Versiyon query param: `?v=2`

## 18) Preview / Productivity Tools

- Blender (free) — mesh creation
- Mixamo — animation library (free)
- Polygon.io / Sketchfab — model library
- PolyHaven — HDRI + textures (free, CC0)
- Spline (spline.design) — visual editor; export R3F

## 19) Bundle Audit Uyum

`vite.config.ts` manualChunks + `audit-bundle.ts` LAZY_CHUNK_RE'de `three` var. Yeni 3D chunk eklenirse regex update et.

```ts
const LAZY_CHUNK_RE =
  /^assets\/(pdf-export|image-export|charts|confetti|admin(-[a-z0-9]+)?|portal|email|three|scroll|lottie|vanta)-/
```

## 20) ARENA-specific 3D Icerik Planlari

### Plan A: Hero — Animated Net + Flying Ball
- Vanta NET background + minimal R3F ball + scroll link
- ~150KB gz total, lazy
- 60fps hedef

### Plan B: Programs Showcase — 3D Card Carousel
- CSS 3D + Lottie icon overlay
- 0KB bundle impact (mevcut framer-motion ile cozum)

### Plan C: Elite Portal Dashboard — 3D Performance Orb
- R3F + shader material (dynamic color by performance)
- ~180KB gz, Elite plan opt-in

### Plan D: AI Content — Coach Avatar
- SadTalker'la audio → lip-sync avatar pre-rendered
- Runtime: sadece `<video>` ~400KB
- Yillik produksiyon kostü ~$100

## 21) Red Flags

- Eager import three — bundle +250KB
- `<Canvas>` server-render (SSR) — hydration mismatch
- HDR texture 4K+ — mobile OOM
- `requestAnimationFrame` icinde useState setter → re-render loop
- postprocessing + mobile → overheating + throttle
- `useMemo` olmayan geometry/material → her render yeniden

## 22) Pre-deploy Checklist

- [ ] 3D chunk lazy, bundle audit pass
- [ ] Reduced motion fallback
- [ ] Mobile 60fps test (iPhone 12 Pro baseline)
- [ ] DRACO compressed GLTF
- [ ] Preload hint for hero model
- [ ] `aria-hidden` on decorative
- [ ] Battery/data saver respect

## 23) Roadmap Oneri

**Q2**: Hero Vanta NET + scroll-linked ball (Plan A)
**Q3**: Programs 3D carousel (Plan B, 0 bundle)
**Q4**: Elite dashboard orb (Plan C)
**Next Year**: AI avatar coach (Plan D)

Her plan A/B test ile conversion ölçülecek — yalnizca metrige yardim eden 3D kalir.

---

3D = premium. Disiplinli kullan. Her kare 60fps kalmali yoksa kontrproduktif.
