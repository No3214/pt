import { RevealSection, Counter, fadeUp } from './LandingUI';
import { landingStats } from '../../data/landingData';
import { motion } from 'framer-motion';

export default function Stats() {
  return (
    <section className="py-20 border-y border-text-main/5 bg-text-main/[0.02]">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {landingStats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="group">
              <div className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight font-display text-text-main">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[0.8rem] uppercase tracking-[0.2em] mt-2 text-text-main/40">{s.label}</div>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-[2px] bg-primary/40 mx-auto mt-4 origin-left group-hover:bg-primary group-hover:scale-x-150 transition-all duration-500"
              />
            </motion.div>
          ))}
        </RevealSection>
      </div>
    </section>
  );
}
