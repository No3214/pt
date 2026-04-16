import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeUpSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  once?: boolean;
}

export default function FadeUpSection({
  children,
  className = '',
  delay = 0,
  y = 30,
  blur = 6,
  duration = 0.7,
  once = true,
}: FadeUpSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
