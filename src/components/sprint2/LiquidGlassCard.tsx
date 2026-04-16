import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'warm' | 'strong';
  hover?: boolean;
  as?: 'div' | 'section' | 'article';
}

/**
 * LiquidGlassCard — Reusable glassmorphism container
 * Inspired by 6/16 MotionSites references
 * Dark mode: white glass | Light mode: warm terracotta-tinted glass
 */
export default function LiquidGlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  as: Tag = 'div',
}: LiquidGlassCardProps) {
  const { darkMode } = useStore();
  const dm = darkMode;

  const glassClass =
    variant === 'strong'
      ? 'liquid-glass-strong'
      : variant === 'warm' || (!dm && variant === 'default')
      ? 'liquid-glass-warm'
      : 'liquid-glass';

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } : undefined}
      className={`${glassClass} rounded-2xl ${
        dm
          ? 'border border-white/10'
          : 'border border-black/[0.06]'
      } ${hover ? 'transition-shadow duration-500' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
