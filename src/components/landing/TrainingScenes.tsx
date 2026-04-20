import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RevealSection, fadeUp } from './LandingUI';
import { useStore } from '../../stores/useStore';
import { useTranslation } from '../../locales';
import LerpCarousel from '../premium/LerpCarousel';
import DitherOverlay from '../premium/DitherOverlay';

/* ═══════════════ Brand gradient palette ═══════════════ */
const GRADIENTS = {
  primary:   { from: '#C2684A', to: '#E89572', fg: '#FFFFFF' },
  secondary: { from: '#7A9E82', to: '#A8C5AE', fg: '#FFFFFF' },
  accent:    { from: '#4A6D88', to: '#7A9BB3', fg: '#FFFFFF' },
  sand:      { from: '#D4B483', to: '#E8D0A8', fg: '#3A2E1F' },
} as const;

type AccentKey = keyof typeof GRADIENTS;

/* ═══════════════ Scene metadata — pairs with i18n captions ═══════════════ */
// Maps by index. Fallback if i18n list is shorter.
const SCENE_META: { icon: string; accent: AccentKey }[] = [
  { icon: 'sunrise',   accent: 'sand' },
  { icon: 'powerlift', accent: 'primary' },
  { icon: 'sprint',    accent: 'secondary' },
  { icon: 'jump',      accent: 'accent' },
  { icon: 'spike',     accent: 'primary' },
  { icon: 'mental',    accent: 'accent' },
  { icon: 'recovery',  accent: 'sand' },
  { icon: 'team',      accent: 'secondary' },
];

/* ═══════════════ Scene icon — minimal line SVG ═══════════════ */
function SceneIcon({ name, fg }: { name: string; fg: string }) {
  const common = 'w-16 h-16 md:w-20 md:h-20';
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: fg, strokeWidth: 1.2, className: common, 'aria-hidden': true as const };
  switch (name) {
    case 'sunrise':
      return (
        <svg {...props}>
          <path d="M3 18h18" />
          <path d="M5 14a7 7 0 0 1 14 0" />
          <path d="M12 3v3" />
          <path d="M5 7l1.5 1.5" />
          <path d="M17.5 8.5L19 7" />
        </svg>
      );
    case 'powerlift':
      return (
        <svg {...props}>
          <path d="M2 10h2v4H2z" />
          <path d="M20 10h2v4h-2z" />
          <path d="M5 7h2v10H5z" />
          <path d="M17 7h2v10h-2z" />
          <path d="M7 12h10" />
        </svg>
      );
    case 'sprint':
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="2" />
          <path d="M9 21l2-6 3 2v4" />
          <path d="M12 15l-3-4 3-3 4 2" />
          <path d="M5 11l4-1" />
        </svg>
      );
    case 'jump':
      return (
        <svg {...props}>
          <circle cx="12" cy="4" r="1.8" />
          <path d="M12 7v5l-3 4" />
          <path d="M12 12l3 4" />
          <path d="M4 20h16" />
          <path d="M8 20l-1 2M16 20l1 2" />
        </svg>
      );
    case 'spike':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12c3-3 6-3 9 0s6 3 9 0" />
          <path d="M12 3c-2 3-2 6 0 9s2 6 0 9" />
        </svg>
      );
    case 'mental':
      return (
        <svg {...props}>
          <path d="M12 3a6 6 0 0 0-6 6c0 2 1 3 1 5v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3c0-2 1-3 1-5a6 6 0 0 0-6-6z" />
          <path d="M9 18h6" />
        </svg>
      );
    case 'recovery':
      return (
        <svg {...props}>
          <path d="M21 12a9 9 0 1 1-9-9" />
          <path d="M21 4v6h-6" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'team':
      return (
        <svg {...props}>
          <circle cx="7" cy="8" r="2.5" />
          <circle cx="17" cy="8" r="2.5" />
          <circle cx="12" cy="6" r="2.5" />
          <path d="M2 20c1-4 4-6 5-6M22 20c-1-4-4-6-5-6M8 20c1-3 2-4 4-4s3 1 4 4" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3v18" />
        </svg>
      );
  }
}

/* ═══════════════ Individual slide card ═══════════════ */
function SceneCard({ meta, caption, time, index }: { meta: { icon: string; accent: AccentKey }; caption: string; time: string; index: number }) {
  const palette = GRADIENTS[meta.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[3/4] rounded-[1.75rem] overflow-hidden border border-white/10 shadow-xl"
      style={{ background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)` }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${palette.fg} 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, ${palette.fg} 0 1px, transparent 1px 36px)`,
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full blur-3xl opacity-35"
        style={{ background: palette.fg }}
      />
      {/* Astrodither-style cinematic overlay */}
      <DitherOverlay intensity={0.16} tile={4} blend="overlay" />

      {/* Time / index badge */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <span
          className="text-[0.65rem] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm"
          style={{ color: palette.fg, borderColor: `${palette.fg}55`, background: `${palette.fg}10` }}
        >
          {time}
        </span>
      </div>
      <div className="absolute top-5 right-5 text-[0.7rem] font-bold tabular-nums" style={{ color: palette.fg, opacity: 0.75 }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Content stack */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-7">
        <div className="flex-1 flex items-center justify-center">
          <SceneIcon name={meta.icon} fg={palette.fg} />
        </div>
        <div>
          <div className="w-10 h-[2px] rounded-full mb-3" style={{ background: palette.fg, opacity: 0.5 }} />
          <p
            className="font-display text-lg md:text-xl font-bold leading-tight tracking-tight"
            style={{ color: palette.fg }}
          >
            {caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════ Section ═══════════════ */
export default function TrainingScenes() {
  const { darkMode } = useStore();
  const { t } = useTranslation();
  const dm = darkMode;

  // Pull scenes dict (falls back gracefully if locale is missing new keys)
  const dict = ((t as unknown) as {
    trainingScenes?: { badge?: string; title?: string; desc?: string; scenes?: { caption: string; time: string }[] };
  }).trainingScenes;

  const badge = dict?.badge ?? 'GÜNLÜK RİTM';
  const title = dict?.title ?? 'Antrenman Anları';
  const desc  = dict?.desc  ?? 'Sabah ısınmadan akşam soğuk terapisine — elit sporcunun 24 saatlik ritmi.';
  const scenes = dict?.scenes ?? [
    { caption: 'Sabah Isınma',        time: '06:30' },
    { caption: 'Güç Antrenmanı',      time: '08:00' },
    { caption: 'Sprint Serisi',       time: '10:00' },
    { caption: 'Sıçrama Çalışması',   time: '11:30' },
    { caption: 'Vuruş Antrenmanı',    time: '14:00' },
    { caption: 'Mental Odak',         time: '16:00' },
    { caption: 'Toparlanma',          time: '18:00' },
    { caption: 'Takım Analizi',       time: '20:00' },
  ];

  // LerpCarousel ister ReactNode[] slides — memoize to avoid re-creation.
  const slides = useMemo(() => {
    return scenes.map((s, i) => {
      const meta = SCENE_META[i % SCENE_META.length];
      return <SceneCard key={i} meta={meta} caption={s.caption} time={s.time} index={i} />;
    });
  }, [scenes]);

  return (
    <section
      id="antrenman-anlari"
      className={`py-28 md:py-36 relative overflow-hidden ${dm ? 'bg-bg' : 'bg-bg-alt'} border-y ${dm ? 'border-white/[0.03]' : 'border-black/[0.03]'}`}
      aria-labelledby="training-scenes-title"
    >
      {/* Background ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[5%] w-[30vw] h-[30vw] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <RevealSection className="text-center md:text-left mb-14">
          <motion.p
            variants={fadeUp}
            className="text-[0.75rem] uppercase tracking-[0.3em] font-bold text-primary mb-6"
          >
            {badge}
          </motion.p>
          <motion.h2
            id="training-scenes-title"
            variants={fadeUp}
            custom={1}
            className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-text-main mb-6 max-w-[720px]"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-[0.95rem] md:text-base text-text-main/60 max-w-[620px]"
          >
            {desc}
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-6 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-text-main/40">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
              </svg>
              <span>Sürükle</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-text-main/30" />
            <span>Kaydır</span>
          </motion.div>
        </RevealSection>

        {/* LerpCarousel — responsive via wrapper max-width + fixed slide width.
            On mobile slideWidth stays 260, on desktop it scales up via aspect. */}
        <RevealSection>
          <LerpCarousel
            slides={slides}
            slideWidth={260}
            gap={20}
            damping={14}
            ariaLabel={title}
            className="py-4"
          />
        </RevealSection>
      </div>
    </section>
  );
}
