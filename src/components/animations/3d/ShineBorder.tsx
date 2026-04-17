/**
 * ShineBorder — Magic UI tarzi animated shine border
 * https://magicui.design/docs/components/shine-border
 *
 * Kullanim:
 *   <ShineBorder borderRadius={16} color={['#C8A97E','#D4A574','#8B7355']}>
 *     <Card>...</Card>
 *   </ShineBorder>
 */

import type { PropsWithChildren, CSSProperties } from 'react'

type Props = {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: string | string[]
  className?: string
  style?: CSSProperties
}

export default function ShineBorder({
  children,
  borderRadius = 14,
  borderWidth = 1.2,
  duration = 12,
  color = ['#C8A97E', '#D4A574', '#8B7355'],
  className = '',
  style,
}: PropsWithChildren<Props>) {
  const colorStr = Array.isArray(color) ? color.join(', ') : color
  return (
    <div
      className={`relative isolate ${className}`}
      style={{
        borderRadius,
        ...style,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          borderRadius,
          padding: borderWidth,
          background: `conic-gradient(from 0deg, ${colorStr}, ${Array.isArray(color) ? color[0] : color})`,
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `shine-border-spin ${duration}s linear infinite`,
        }}
      />
      <div className="relative z-10" style={{ borderRadius }}>
        {children}
      </div>
      <style>{`
        @keyframes shine-border-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[aria-hidden] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
