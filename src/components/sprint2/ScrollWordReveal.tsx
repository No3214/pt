import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

/**
 * ScrollWordReveal — Scroll-driven word-by-word opacity reveal
 * Inspired by Mindloop mission section + Neuralyn testimonial
 * Each word transitions opacity from 0.15 → 1 based on scroll position
 */
export default function ScrollWordReveal({
  text,
  className = '',
  highlightWords = [],
  highlightColor,
}: ScrollWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.3'],
  });

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={className}>
      <p className="flex flex-wrap">
        {words.map((word, i) => {
          const isHighlight = highlightWords.some(
            hw => word.toLowerCase().replace(/[.,!?]/g, '') === hw.toLowerCase()
          );
          return (
            <Word
              key={`${word}-${i}`}
              word={word}
              index={i}
              total={words.length}
              scrollYProgress={scrollYProgress}
              isHighlight={isHighlight}
              highlightColor={highlightColor}
            />
          );
        })}
      </p>
    </div>
  );
}

function Word({
  word,
  index,
  total,
  scrollYProgress,
  isHighlight,
  highlightColor,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  isHighlight: boolean;
  highlightColor?: string;
}) {
  const start = index / total;
  const end = Math.min((index + 1) / total + 0.05, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{
        opacity,
        color: isHighlight ? (highlightColor || 'var(--color-primary)') : undefined,
        willChange: 'opacity',
      }}
      className={`mr-[0.3em] inline-block transition-colors duration-300 ${
        isHighlight ? 'font-semibold' : ''
      }`}
    >
      {word}
    </motion.span>
  );
}
