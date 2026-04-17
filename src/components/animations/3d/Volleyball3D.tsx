/**
 * Volleyball3D — premium 3D voleybol topu (react-three-fiber)
 *
 * - Procedural 6-panel texture (canvas ile runtime uretilir — dis asset yok)
 * - MeshPhysicalMaterial (clearcoat + subtle roughness map)
 * - Auto rotate + mouse-follow parallax tilt
 * - prefers-reduced-motion destekli
 * - Lazy loading — kendi Suspense fallback'i ile
 *
 * Kullanim:
 *   <Volleyball3D size={420} autoRotate />
 *   <Volleyball3D size="100%" className="h-[420px]" />
 */

import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

type Props = {
  size?: number | string
  className?: string
  autoRotate?: boolean
  /** 0-1 arasi mouse-follow siddeti */
  tilt?: number
  /** Aydinlatma modu */
  preset?: 'studio' | 'sunset' | 'dawn'
}

/** Canvas tabanli procedural voleybol panel texture */
function useVolleyballTexture() {
  return useMemo(() => {
    const size = 1024
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    // Base: warm cream
    const grad = ctx.createRadialGradient(size * 0.4, size * 0.35, size * 0.1, size / 2, size / 2, size * 0.75)
    grad.addColorStop(0, '#FBF6EB')
    grad.addColorStop(0.55, '#F0E4CC')
    grad.addColorStop(1, '#C8A97E')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    // 6 panel seams — yatay bantlarla hareli Mikasa stili
    ctx.strokeStyle = '#6B3E1F'
    ctx.lineWidth = 5
    ctx.globalAlpha = 0.72

    // Tekrar eden 3 kusakta 2 panel — klasik 18 panelli goruntu
    for (let band = 0; band < 6; band++) {
      const y = (size / 6) * band + 32
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= size; x += 4) {
        const wave = Math.sin((x / size) * Math.PI * 4 + band) * 18
        ctx.lineTo(x, y + wave)
      }
      ctx.stroke()
    }

    // Ikincil ince cizgiler
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 1.5
    for (let band = 0; band < 12; band++) {
      const y = (size / 12) * band + 16
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= size; x += 6) {
        const wave = Math.sin((x / size) * Math.PI * 3 + band * 0.6) * 10
        ctx.lineTo(x, y + wave)
      }
      ctx.stroke()
    }

    // Grain noise
    ctx.globalAlpha = 1
    const noise = ctx.getImageData(0, 0, size, size)
    for (let i = 0; i < noise.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14
      noise.data[i] = Math.max(0, Math.min(255, noise.data[i] + n))
      noise.data[i + 1] = Math.max(0, Math.min(255, noise.data[i + 1] + n))
      noise.data[i + 2] = Math.max(0, Math.min(255, noise.data[i + 2] + n))
    }
    ctx.putImageData(noise, 0, 0)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [])
}

function Ball({ autoRotate, tilt }: { autoRotate: boolean; tilt: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const tex = useVolleyballTexture()
  const target = useRef({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    if (autoRotate && !reduced) {
      mesh.current.rotation.y = t * 0.25
      mesh.current.rotation.x = Math.sin(t * 0.4) * 0.12
    }
    // Mouse follow (damped)
    const mx = state.pointer.x * tilt
    const my = -state.pointer.y * tilt
    target.current.x = THREE.MathUtils.damp(target.current.x, mx, 4, 0.016)
    target.current.y = THREE.MathUtils.damp(target.current.y, my, 4, 0.016)
    mesh.current.rotation.z = target.current.x * 0.3
    mesh.current.position.y = target.current.y * 0.15
  })

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[1, 96, 96]} />
      <meshPhysicalMaterial
        map={tex}
        roughness={0.38}
        metalness={0.02}
        clearcoat={0.45}
        clearcoatRoughness={0.28}
        sheen={0.25}
        sheenColor={'#D4A574'}
      />
    </mesh>
  )
}

export default function Volleyball3D({
  size = 420,
  className = '',
  autoRotate = true,
  tilt = 1,
  preset = 'sunset',
}: Props) {
  const style = typeof size === 'number' ? { width: size, height: size } : {}
  return (
    <div className={className} style={style} aria-hidden>
      <Canvas
        shadows
        camera={{ position: [0, 0.1, 3.2], fov: 35 }}
        gl={{ antialias: true, preserveDrawingBuffer: false, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.55} />
        <directionalLight
          position={preset === 'sunset' ? [3, 2, 4] : preset === 'dawn' ? [-3, 2, 3] : [2, 3, 4]}
          intensity={preset === 'studio' ? 1.2 : 1.05}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <Ball autoRotate={autoRotate} tilt={tilt} />
          <ContactShadows position={[0, -1.18, 0]} opacity={0.35} scale={6} blur={2.5} far={3} />
          <Environment preset={preset === 'dawn' ? 'dawn' : preset === 'studio' ? 'studio' : 'sunset'} />
        </Suspense>
      </Canvas>
    </div>
  )
}
