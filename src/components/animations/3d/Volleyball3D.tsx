/**
 * Volleyball3D — deprecated
 *
 * Removed 2026-04 (iter 9). Originally a three.js procedural volleyball, but the
 * landing ships with 2D animated placeholders instead. 3D deps pruned to shrink
 * install. No-op stub kept so any straggling imports don't break the build.
 */
type Props = {
  className?: string
  size?: number | string
  autoRotate?: boolean
}

export default function Volleyball3D({ className }: Props) {
  return <div className={className} aria-hidden />
}
