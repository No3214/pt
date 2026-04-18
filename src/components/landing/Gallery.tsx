import { useRef, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';
import { tenantConfig } from '../../config/tenant';

interface GalleryItem {
  caption: string;
  icon?: string;
  accent?: 'primary' | 'secondary' | 'accent' | 'sand';
}

/* ─── Gradient palette (brand tokens) ─── */
const GRADIENTS: Record<string, { from: string; to: string; fg: string }> = {
  primary:   { from: '#C2684A', to: '#E89572', fg: '#FFFFFF' },
  secondary: { from: '#7A9E82', to: '#A8C5AE', fg: '#FFFFFF' },
  accent:    { from: '#4A6D88', to: '#7A9BB3', fg: '#FFFFFF' },
  sand:      { from: '#D4B483', to: '#E8D0A8', fg: '#3A2E1F' },
};

/* ─── Icon renderer — large, centered, brand-toned ─── */
function GalleryIcon({ name, fg }: { name?: string; fg: string }) {
  const common = 'w-24 h-24 md:w-32 md:h-32';
  switch (name) {
    case 'spike':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12c3-3 6-3 9 0s6 3 9 0" />
          <path d="M12 3c-2 3-2 6 0 9s2 6 0 9" />
          <path d="M12 3c2 3 2 6 0 9s-2 6 0 9" />
        </svg>
      );
    case 'block':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <path d="M6 4v16" />
          <path d="M18 4v16" />
          <path d="M3 8h18" />
          <path d="M3 16h18" />
        </svg>
      );
    case 'serve':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <circle cx="9" cy="9" r="5" />
          <path d="M13 13l6 6" />
          <path d="M17 17l3-1-1 3" />
        </svg>
      );
    case 'strength':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <path d="M3 10h2v4H3z" />
          <path d="M19 10h2v4h-2z" />
          <path d="M6 7h2v10H6z" />
          <path d="M16 7h2v10h-2z" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'power':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <path d="M13 2L3 14h8l-1 8 10-12h-8z" />
        </svg>
      );
    case 'team':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <circle cx="7" cy="8" r="3" />
          <circle cx="17" cy="8" r="3" />
          <circle cx="12" cy="6" r="3" />
          <path d="M2 20c1-4 4-6 5-6M22 20c-1-4-4-6-5-6M8 20c1-3 2-4 4-4s3 1 4 4" />
        </svg>
      );
    case 'warmup':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'elite':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      );
    case 'mental':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <path d="M12 3a6 6 0 00-6 6c0 2 1 3 1 5v3a2 2 0 002 2h6a2 2 0 002-2v-3c0-2 1-3 1-5a6 6 0 00-6-6z" />
          <path d="M9 18h6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={1.3} className={common} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3v18" />
        </svg>
      );
  }
}

/* ─── Placeholder card ─── */
const GalleryCard = memo(function GalleryCard({ item, index, dm }: {
  item: GalleryItem;
  index: number;
  dm: boolean;
}) {
  const { t } = useTranslation();
  const palette = GRADIENTS[item.accent || (['primary','secondary','accent','sand'][index % 4] as 'primary'|'secondary'|'accent'|'sand')];

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`group relative overflow-hidden ${
        index === 0 ? 'md:col-span-2 md:row-span-2' : ''
      } rounded-[2rem] border ${dm ? 'border-white/5' : 'border-black/[0.04]'}`}
      aria-label={item.caption}
    >
      <div
        className={`relative ${index === 0 ? 'aspect-[4/3]' : 'aspect-[3/4]'} flex flex-col items-center justify-center p-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        style={{
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
        }}
      >
        {/* Soft grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${palette.fg} 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, ${palette.fg} 0 1px, transparent 1px 40px)`,
          }}
        />
        {/* Subtle radial glow */}
        <div
          className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"
          style={{ background: palette.fg }}
        />

        <div className="relative z-10 flex-1 flex items-center justify-center">
          <GalleryIcon name={item.icon} fg={palette.fg} />
        </div>

        <div className="relative z-10 mt-6 text-center">
          <p className="font-display text-xl md:text-2xl font-bold tracking-tight" style={{ color: palette.fg }}>
            {item.caption}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-[2px] rounded-full" style={{ background: palette.fg, opacity: 0.5 }} />
            <span className="text-[0.7rem] uppercase tracking-[0.2em] font-medium" style={{ color: palette.fg, opacity: 0.7 }}>
              {t.gallery.badge}
            </span>
            <div className="w-8 h-[2px] rounded-full" style={{ background: palette.fg, opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function Gallery() {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  const items: GalleryItem[] = t.gallery.items || [];

  return (
    <section ref={sectionRef} id="galeri" className="py-32 md:py-40 bg-bg relative overflow-hidden">
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[25vw] h-[25vw] bg-secondary/5 rounded-full blur-[100px]" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
        <RevealSection className="text-center mb-20">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6">
            {t.gallery.badge}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[1] tracking-[-0.04em] text-text-main mb-8">
            {t.gallery.title1}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-[0.85rem] md:text-base text-text-main/60 max-w-xl mx-auto mb-6">
            {t.gallery.desc}
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="w-20 h-1 bg-primary/20 mx-auto rounded-full" />
        </RevealSection>

        <RevealSection className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto">
          {items.map((item, i) => (
            <GalleryCard key={i} item={item} index={i} dm={dm} />
          ))}
        </RevealSection>

        <RevealSection className="mt-16 text-center">
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-text-main/40 mb-6">
            {t.gallery.soon || 'Galeri yakinda guncellenecek'}
          </motion.p>
          <motion.a
            variants={fadeUp}
            custom={1}
            href={`https://instagram.com/${tenantConfig.brand.contact.socials.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[0.85rem] font-bold uppercase tracking-widest no-underline transition-all duration-500 border ${
              dm
                ? 'border-white/10 text-white/50 hover:text-white hover:border-primary/40 hover:bg-primary/5'
                : 'border-text-main/10 text-text-main/40 hover:text-text-main hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            {t.gallery.followIg}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </RevealSection>
      </div>
    </section>
  );
}
