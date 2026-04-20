// Scroll-scrub component wrapper — useScrollScrub hook'unun declarative kardesi.
// Bir elementin viewport progress'ini CSS custom property olarak set eder
// (--scrub 0..1). Children CSS'inde rahat `translate`, `scale`, `opacity` yazar.
//
// ARENA kullanimi:
//   <ScrollScrub>
//     <div style={{ transform: 'translateY(calc(var(--scrub, 0) * -40px))' }}>
//       Parallax headline
//     </div>
//   </ScrollScrub>

import { useRef, type ReactNode, type CSSProperties } from 'react'
import { useScrollScrub, type ScrollScrubOptions } from '../../hooks/useScrollScrub'

export interface ScrollScrubProps extends ScrollScrubOptions {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: keyof HTMLElementTagNameMap
}

export default function ScrollScrub({
  children,
  className,
  style,
  start,
  end,
  respectReducedMotion,
  as = 'div',
}: ScrollScrubProps) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useScrollScrub(ref, { start, end, respectReducedMotion })

  const mergedStyle: CSSProperties = {
    ...style,
    // CSS variable bridge -> children pure CSS ile parallax/scrub yapar
    ['--scrub' as string]: progress.toFixed(4),
  }

  const Tag = as as keyof React.JSX.IntrinsicElements
  return (
    // @ts-expect-error dinamik tag
    <Tag ref={ref} className={className} style={mergedStyle}>
      {children}
    </Tag>
  )
}
