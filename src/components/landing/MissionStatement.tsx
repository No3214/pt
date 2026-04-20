// ARENA Landing — cinematic scroll-scrub manifesto.
// String Tune-inspired: viewport progress -> --scrub CSS var
// layered with ParticleField (ambient) + DitherOverlay (texture).
//
// Yerlestirme: Marquee ile About arasinda, trust koprusu gorevi.

import { useTranslation } from '../../locales'
import ScrollScrub from '../premium/ScrollScrub'
import ParticleField from '../premium/ParticleField'
import DitherOverlay from '../premium/DitherOverlay'

type MissionDict = {
  badge?: string
  line1?: string
  line2?: string
  tagline?: string
}

function getMissionDict(t: unknown): MissionDict {
  const mission = (t as { mission?: MissionDict }).mission
  return mission ?? {}
}

export default function MissionStatement() {
  const { t } = useTranslation()
  const dict = getMissionDict(t)

  const badge = dict.badge ?? 'ARENA FELSEFESİ'
  const line1 = dict.line1 ?? 'Sporcu doğmaz, sporcu olunur.'
  const line2 = dict.line2 ?? 'Her antrenman, daha güçlü bir yarının tohumudur.'
  const tagline = dict.tagline ?? 'Sistemli ilerleme · Ölçülebilir sonuç'

  return (
    <ScrollScrub
      start="enter"
      end="exit"
      className="relative isolate overflow-hidden"
    >
      {/* viewport-height stage; scroll over it to scrub --scrub 0..1 */}
      <section
        aria-labelledby="mission-title"
        className="relative min-h-[100svh] flex items-center justify-center py-24 md:py-36 px-6"
      >
        {/* ambient particle layer */}
        <div className="absolute inset-0 -z-20 pointer-events-none">
          <ParticleField
            count={420}
            color="#4A6D88"
            size={1.4}
            speed={0.22}
            opacity={0.5}
          />
        </div>

        {/* radial depth */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-5xl aspect-square rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(closest-side, rgba(194,104,74,0.12), rgba(122,158,130,0.06) 40%, transparent 70%)',
              filter: 'blur(40px)',
              opacity: 'calc(0.35 + var(--scrub, 0) * 0.45)',
            }}
          />
        </div>

        {/* cinematic bayer dither */}
        <DitherOverlay intensity={0.08} tile={4} blend="soft-light" />

        {/* content stack — scrubs in as section enters viewport */}
        <div className="relative z-10 max-w-4xl w-full text-center">
          <p
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.68rem] font-semibold tracking-[0.28em] uppercase bg-accent/10 text-accent ring-1 ring-accent/20 mb-10"
            style={{
              opacity: 'calc(var(--scrub, 0) * 2.5)',
              transform: 'translateY(calc((1 - var(--scrub, 0)) * 20px))',
              transition: 'opacity 120ms linear',
            }}
          >
            <span className="w-1 h-1 rounded-full bg-accent" />
            {badge}
          </p>

          <h2
            id="mission-title"
            className="font-display font-semibold text-text-main tracking-[-0.03em] leading-[1.05] text-[clamp(2.2rem,5.2vw,4.2rem)]"
            style={{
              opacity: 'calc(0.15 + var(--scrub, 0) * 1.6)',
              transform: 'translateY(calc((1 - var(--scrub, 0)) * 32px))',
              filter: 'blur(calc((1 - var(--scrub, 0)) * 8px))',
            }}
          >
            {line1}
          </h2>

          <p
            className="mt-6 md:mt-8 text-text-main/70 font-display leading-[1.35] text-[clamp(1.1rem,2.2vw,1.6rem)] max-w-2xl mx-auto"
            style={{
              opacity: 'calc(var(--scrub, 0) * 1.8 - 0.15)',
              transform: 'translateY(calc((1 - var(--scrub, 0)) * 24px))',
            }}
          >
            {line2}
          </p>

          <div
            className="mt-12 flex items-center justify-center gap-4"
            style={{
              opacity: 'calc(var(--scrub, 0) * 2 - 0.4)',
            }}
          >
            <span
              className="h-[1px] bg-primary/40 rounded-full"
              style={{
                width: 'calc(32px + var(--scrub, 0) * 120px)',
              }}
            />
            <span className="text-[0.68rem] uppercase tracking-[0.28em] font-semibold text-primary/80">
              {tagline}
            </span>
            <span
              className="h-[1px] bg-primary/40 rounded-full"
              style={{
                width: 'calc(32px + var(--scrub, 0) * 120px)',
              }}
            />
          </div>
        </div>
      </section>
    </ScrollScrub>
  )
}
