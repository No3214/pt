// ARENA Landing — assessment CTA band.
// Trust -> conversion bridge: placed between Testimonials and Programs.

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from '../../locales'

type LandingCTADict = {
  badge?: string
  title?: string
  desc?: string
  cta?: string
  meta?: string
}

function getCTADict(t: unknown): LandingCTADict {
  const assessment = (t as { assessment?: { landingCTA?: LandingCTADict } }).assessment
  return assessment?.landingCTA ?? {}
}

export default function AssessmentCTA() {
  const { t } = useTranslation()
  const dict = getCTADict(t)

  const badge = dict.badge ?? '2 DAKIKA'
  const title = dict.title ?? 'Sana en uygun programı bulalım'
  const desc =
    dict.desc ??
    'Voleybol pozisyonun, hedefin ve takviminin haritasını çıkaralım. 7 soru sonunda ARENA Starter, Pro veya Elite programlarından biri sana özel önerilir.'
  const cta = dict.cta ?? 'Ücretsiz Değerlendirmeyi Başlat'
  const meta = dict.meta ?? 'Kart gerekmez · 2 dakika · kişisel plan'

  return (
    <section
      aria-labelledby="assessment-cta-title"
      className="relative overflow-hidden py-20 md:py-28 px-5"
    >
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-3xl aspect-square rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto"
      >
        <div
          className={[
            'relative overflow-hidden rounded-3xl p-8 md:p-14 text-center',
            'bg-white/50 dark:bg-white/[0.03] backdrop-blur-2xl',
            'ring-1 ring-primary/20 shadow-[0_24px_80px_rgba(194,104,74,0.18)]',
          ].join(' ')}
        >
          <div className="absolute -inset-px -z-10 bg-gradient-to-br from-primary/25 via-accent/10 to-secondary/20 blur-2xl" />

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.65rem] font-semibold tracking-[0.22em] uppercase bg-primary/15 text-primary">
            {badge}
          </span>

          <h2
            id="assessment-cta-title"
            className="mt-5 text-3xl md:text-5xl font-bold tracking-tight text-text-main"
          >
            {title}
          </h2>

          <p className="mt-4 text-base md:text-lg text-text-main/70 leading-relaxed max-w-xl mx-auto">
            {desc}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              to="/assessment"
              className={[
                'inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold',
                'bg-primary text-white shadow-[0_14px_40px_rgba(194,104,74,0.4)]',
                'hover:-translate-y-0.5 hover:shadow-[0_18px_55px_rgba(194,104,74,0.5)]',
                'transition-all duration-300',
              ].join(' ')}
            >
              <span>{cta}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <p className="text-xs text-text-main/50 tracking-wide">{meta}</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
