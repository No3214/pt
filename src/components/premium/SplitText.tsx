import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function SplitText({ text, className = '', delay = 0, stagger = 0.03, as = 'h1' }: Props) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    const Tag = as as any
    return <Tag className={className}>{text}</Tag>
  }

  const MotionTag: any = (motion as any)[as]

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
            {wi < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
