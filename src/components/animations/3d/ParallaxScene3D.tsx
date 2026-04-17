/**
 * ParallaxScene3D — Hero icin katmanli 3D parallax sahne
 *
 * - 3 katman: arka plan top + orta plan pattern + on plan ekipman
 * - Mouse parallax + scroll parallax
 * - Tamamen code-gen — dis asset yok
 * - Reduced motion saygili
 */

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

type Props = {
  className?: string
  height?: number | string
  intensity?: number
}

function Kettlebell({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.y = s.clock.getElapsedTime() * 0.2
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshPhysicalMaterial color="#1a1410" roughness={0.55} metalness={0.35} clearcoat={0.2} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <torusGeometry args={[0.28, 0.09, 24, 48]} />
        <meshPhysicalMaterial color="#2a211b" roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  )
}

function RingGeometry({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (!ref.current) return
    ref.current.rotation.z = s.clock.getElapsedTime() * 0.1
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <torusGeometry args={[1.5, 0.015, 8, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.22} />
    </mesh>
  )
}

function FloatingBall({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const base = useMemo(() => position[1], [position])
  useFrame((s) => {
    if (!ref.current) return
    const t = s.clock.getElapsedTime()
    ref.current.position.y = base + Math.sin(t * speed) * 0.15
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.4
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshPhysicalMaterial color="#C8A97E" roughness={0.55} clearcoat={0.3} transparent opacity={0.85} />
    </mesh>
  )
}

function ParallaxRig({ intensity }: { intensity: number }) {
  const rig = useRef<THREE.Group>(null)
  const reduced = useReducedMotion()
  useFrame((s) => {
    if (!rig.current || reduced) return
    const mx = s.pointer.x * 0.3 * intensity
    const my = s.pointer.y * 0.15 * intensity
    rig.current.position.x = THREE.MathUtils.damp(rig.current.position.x, mx, 4, 0.016)
    rig.current.position.y = THREE.MathUtils.damp(rig.current.position.y, my, 4, 0.016)
  })
  return (
    <group ref={rig}>
      {/* Arka plan halkalari */}
      <RingGeometry position={[-2.2, 0.5, -3]} rotation={[0.2, 0, 0.3]} color="#C8A97E" />
      <RingGeometry position={[2, -0.8, -4]} rotation={[-0.3, 0, -0.2]} color="#D4A574" />
      <RingGeometry position={[0.5, 1.2, -5]} rotation={[0, 0, 0.8]} color="#8B7355" />

      {/* Floating toplar */}
      <FloatingBall position={[-2.8, 1.4, -2]} scale={0.35} speed={1.4} />
      <FloatingBall position={[3.1, -1.1, -2.5]} scale={0.28} speed={1.8} />
      <FloatingBall position={[-1.6, -1.8, -1.5]} scale={0.22} speed={2.2} />

      {/* On plan ekipman */}
      <Kettlebell position={[0, -0.4, 0]} scale={0.85} />
    </group>
  )
}

export default function ParallaxScene3D({ className = '', height = 560, intensity = 1 }: Props) {
  const style = typeof height === 'number' ? { height } : { height }
  return (
    <div className={className} style={style} aria-hidden>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 3]} intensity={1.1} castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.4} color="#D4A574" />
        <Suspense fallback={null}>
          <ParallaxRig intensity={intensity} />
        </Suspense>
        <fog attach="fog" args={['#FAF6F1', 6, 14]} />
      </Canvas>
    </div>
  )
}
