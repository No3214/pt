import { motion } from 'framer-motion';
import { useTranslation } from '../../locales';

function MarqueeRow({ badges, direction = 'left', speed = 30 }: { badges: string[]; direction?: 'left' | 'right'; speed?: number }) {
  const doubled = [...badges, ...badges];
  const duration = badges.length * speed / 10;

  return (
    <div className="relative overflow-hidden py-3">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((badge, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 py-3 rounded-full border border-text-main/[0.06] bg-text-main/[0.02] backdrop-blur-sm shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            <span className="text-[0.82rem] font-medium tracking-wide text-text-main/50">
              {badge}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  const { t } = useTranslation();
  const badges = t.marquee;

  return (
    <section className="relative py-6 overflow-hidden border-y border-text-main/[0.04]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-bg to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-bg to-transparent" />

      <MarqueeRow badges={badges} direction="left" speed={35} />
      <MarqueeRow badges={[...badges].reverse()} direction="right" speed={40} />
    </section>
  );
}
