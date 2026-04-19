/**
 * ParallaxScene3D — deprecated
 *
 * Removed 2026-04 (iter 9). Originally a three.js + @react-three/fiber parallax scene,
 * but never wired into the landing. 3D deps pruned to shrink install + install-time.
 * Kept as a no-op stub so any straggling imports don't break the build.
 */
type Props = { className?: string; height?: number; intensity?: number }

export default function ParallaxScene3D({ className }: Props) {
  return <div className={className} aria-hidden />
}
