// Astrodither-inspired dither overlay — WebGL gerektirmez, saf SVG + CSS blend.
// Bayer 4x4 matrix pattern'i SVG olarak tekrarlanir, mix-blend-mode: overlay ile hero
// arka plan ya da foto uzerine sinematik dokusu verir. <100 bytes JS, 0 runtime cost.
//
// ARENA kullanimi:
//   <div className="relative">
//     <img src="/hero.jpg" ... />
//     <DitherOverlay intensity={0.35} />
//   </div>

import { useMemo } from 'react'

export interface DitherOverlayProps {
  /** 0..1 — mix-blend opacity ile shade sikligi */
  intensity?: number
  /** Tile boyutu px — kucuk = ince grenli, buyuk = retro chunky */
  tile?: number
  /** Blend modu */
  blend?: 'overlay' | 'multiply' | 'screen' | 'soft-light'
  /** Ekstra tailwind sinifi */
  className?: string
}

/**
 * Classic Bayer 4x4 threshold matrix / 16
 * [ 0, 8, 2,10]
 * [12, 4,14, 6]
 * [ 3,11, 1, 9]
 * [15, 7,13, 5]
 */
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
] as const

function buildDitherSvg(tile: number): string {
  // 4x4 grid -> each cell is tile/4 px
  const cell = tile / 4
  let rects = ''
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const v = BAYER_4X4[y][x]
      const alpha = (v + 0.5) / 16
      rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="rgba(0,0,0,${alpha.toFixed(3)})"/>`
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">${rects}</svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

export default function DitherOverlay({
  intensity = 0.35,
  tile = 4,
  blend = 'overlay',
  className = '',
}: DitherOverlayProps) {
  const bg = useMemo(() => buildDitherSvg(tile), [tile])
  const opacity = Math.max(0, Math.min(1, intensity))

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: bg,
        backgroundSize: `${tile}px ${tile}px`,
        mixBlendMode: blend,
        opacity,
        willChange: 'opacity',
      }}
    />
  )
}
