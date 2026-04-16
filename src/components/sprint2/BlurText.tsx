import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  staggerDelay?: number;
  highlightWords?: string[];
  highlightClass?: string;
}

/**
 * BlurText — Word-by-word blur dissolve reveal
 * Inspired by Bloom AI agency + Mindloop WordsPullUp
 * Each word transitions: blur(10px) + opacity:0 + y:20 → blur(0) + opacity:1 + y:0
 */
export default function BlurText({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  staggerDelay = 0.08,
  highlightWords = [],
  highlightClass = 'apple-gradient-text',
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const words = text.split(' ');

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        delay: delay + i * staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((word, i) => {
          const isHighlight = highlightWords.some(hw =>
            word.toLowerCase().replace(/[.,!?]/g, '') === hw.toLowerCase()
          );
          return (
            <motion.span
              key={`${word}-${i}`}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={wordVariants}
              className={`inline-block mr-[0.3em] ${isHighlight ? highlightClass : ''}`}
              style={{ willChange: 'transform, opacity, filter' }}
            >
              {word}
            </motion.span>
          );
        })}
      </Tag>
    </div>
  );
}
