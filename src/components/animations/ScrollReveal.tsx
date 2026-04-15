import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, scaleIn, viewportOnce } from '../../lib/motion';

type Preset = 'fadeUp' | 'scaleIn';

interface Props {
  children: ReactNode;
  preset?: Preset;
  className?: string;
}

export default function ScrollReveal({ children, preset = 'fadeUp', className }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const variants = preset === 'scaleIn' ? scaleIn : fadeUp;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
