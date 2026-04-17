import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
export { fadeUp, staggerContainer, scaleIn, letterReveal } from '../../lib/animations';
import { staggerContainer, letterReveal } from '../../lib/animations';

/* ═══════════════ Reveal Section Component ═══════════════ */
export function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════ Smooth Counter ═══════════════ */
export function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const duration = 1400;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); 
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ═══════════════ Magnetic Button ═══════════════ */
export function MagneticButton({ children, className = '', href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  const handleLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; }
  return (
    <a ref={ref} href={href} onMouseMove={handleMouse} onMouseLeave={handleLeave} className={`inline-block transition-transform duration-300 ${className}`} {...props}>
      {children}
    </a>
  );
}

/* ═══════════════ 3D Tilt Card ═══════════════ */
export function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y]);

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`${className}`}>
      {children}
    </motion.div>
  );
}

/* ═══════════════ Scroll Progress Bar ═══════════════ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-gradient-to-r from-primary via-secondary to-accent shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]"
    />
  );
}

/* ═══════════════ Grain Overlay ═══════════════ */
export function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[150] opacity-[0.03] select-none"
      style={{
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXVdfX1tfX1scXFzcXF0dXV2dndtcXF3d3d1dXVtfX1ycXF0dXVzclZ0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dXV0dX")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

/* ═══════════════ Animated Text ═══════════════ */
export function AnimatedHeading({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={className} style={{ perspective: '600px' }}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i} custom={i} variants={letterReveal}
          className="inline-block mr-[0.3em]" style={{ transformOrigin: 'bottom' }}>
          {word}
        </motion.span>
      ))}
    </span>
  );
}
