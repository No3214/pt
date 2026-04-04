import { RevealSection, TiltCard, fadeUp } from './LandingUI';
import { programs } from '../../data/landingData';
import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';

export default function Programs() {
  const { darkMode } = useStore();
  const dm = darkMode;

  return (
    <section id="programlar" className="py-32 md:py-40 bg-bg">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <RevealSection className="text-center md:text-left">
          <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-primary mb-6">
            Programlar
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="font-display text-[clamp(2.5rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-20 text-text-main">
            Ertesi güne bırakmayacağın planlar.
          </motion.h2>
        </RevealSection>

        <RevealSection className="grid md:grid-cols-3 gap-8 items-stretch">
          {programs.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="flex h-full">
              <TiltCard
                className={`group relative flex flex-col p-10 rounded-3xl border transition-all duration-700 h-full w-full overflow-hidden ${
                  p.featured
                    ? `border-primary/30 ${dm ? 'bg-primary/[0.04]' : 'bg-primary/[0.02] shadow-xl'}`
                    : `${dm ? 'border-text-main/5 hover:border-text-main/15 bg-text-main/[0.02]' : 'border-text-main/10 hover:border-text-main/20 bg-text-main/[0.01]'}`
                }`}
              >
                {/* Shine Animation */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-20deg] group-hover:translate-x-[250%] transition-transform duration-[1.5s] ease-out" />
                  </div>
                </div>

                {p.featured && (
                  <div className="absolute -top-3 left-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-[0.7rem] font-bold uppercase tracking-[0.12em] shadow-lg">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Önerilen
                  </div>
                )}

                <h3 className="font-display text-3xl font-bold mb-4 text-text-main">{p.name}</h3>
                <p className="text-[1.05rem] leading-relaxed mb-8 text-text-main/40">{p.desc}</p>

                <div className="mb-10 space-y-4 flex-1">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[0.95rem] text-text-main/60">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-text-main/5">
                  <div className="text-[2.8rem] font-bold tracking-tight mb-8 text-text-main">
                    ₺{p.price}<span className="text-lg font-normal ml-2 text-text-main/30">/ay</span>
                  </div>
                  <a href="#iletisim"
                    className={`block text-center py-4 rounded-full text-[1rem] font-semibold no-underline transition-all duration-500 transform hover:scale-[1.02] ${
                      p.featured
                        ? 'bg-primary text-white shadow-[0_15px_30px_rgba(var(--color-primary-rgb),0.25)] hover:shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.35)]'
                        : `border border-text-main/15 text-text-main/70 hover:border-text-main/30 hover:text-text-main`
                    }`}>
                    {p.featured ? 'Hemen Başvur' : 'Başvur'}
                  </a>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </RevealSection>

        {/* Comparison Reveal */}
        <RevealSection className="mt-24">
          <div className="overflow-x-auto rounded-[2rem] border border-text-main/5 bg-text-main/[0.01] p-2 md:p-8">
            <table className="w-full min-w-[600px] text-left text-[0.95rem]">
              <thead>
                <tr className="border-b border-text-main/5">
                  <th className="p-6 font-medium text-text-main/40 uppercase tracking-widest text-[0.7rem]">Kıyasla</th>
                  {programs.map(p => (
                    <th key={p.name} className={`p-6 font-bold text-[1.1rem] space-y-1 ${p.featured ? 'text-primary' : 'text-text-main'}`}>
                      <div>{p.name}</div>
                      <div className="text-[0.7rem] font-normal text-text-main/30">{p.price}₺</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-text-main/70">
                {[
                  { feature: 'Kişiye Özel Antrenman', v: ['check', 'check', 'check'] },
                  { feature: 'Haftalık Check-in', v: ['check', 'check', 'check'] },
                  { feature: 'WhatsApp Destek', v: ['check', 'check', 'check'] },
                  { feature: 'Sıçrama Protokolü', v: ['no', 'check', 'check'] },
                  { feature: 'Video Form Analizi', v: ['no', 'check', 'check'] },
                  { feature: 'Beslenme Danışmanlığı', v: ['no', 'no', 'check'] },
                  { feature: '7/24 Öncelikli Erişim', v: ['no', 'no', 'check'] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-text-main/[0.03] last:border-0 hover:bg-text-main/[0.01] transition-colors">
                    <td className="p-6 font-medium">{row.feature}</td>
                    {row.v.map((v, j) => (
                      <td key={j} className={`p-6 text-center ${j === 1 ? 'bg-primary/[0.02]' : ''}`}>
                        {v === 'check' ? <span className="text-secondary text-xl">✓</span>
                          : v === 'no' ? <span className="text-text-main/10">—</span>
                          : <span className="font-bold text-primary">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
