import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function LoadingScreen({ onComplete, duration = 2500 }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    setCount(Math.round(eased * 100));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 800);
      }, 300);
    }
  }, [duration, onComplete]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--color-primary)' }} />
          <motion.div className="relative z-10 flex flex-col items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-[clamp(4rem,12vw,8rem)] font-heading font-bold leading-none tracking-tighter text-text-main tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>
            <div className="w-48 h-[2px] bg-text-main/10 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'var(--color-primary)', width: `${count}%` }} transition={{ duration: 0.05 }} />
            </div>
            <motion.p className="text-text-main/30 text-xs font-medium uppercase tracking-[0.3em] mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              Ela Ebeoglu Performance
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
