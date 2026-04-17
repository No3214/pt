import { motion } from 'framer-motion';
import { useStore } from '../../stores/useStore';
import { RevealSection, fadeUp } from '../landing/LandingUI';

interface AuthorityBadge {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

export default function AuthorityStrip() {
  const { darkMode } = useStore();
  const dm = darkMode;

  const badges: AuthorityBadge[] = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2L15.09 8.26H22L17.45 12.74L19.54 19.27L12 15.08L4.46 19.27L6.55 12.74L2 8.26H8.91L12 2Z" />
        </svg>
      ),
      label: 'Profesyonel Voleybolcu',
      sublabel: 'Elit seviye koçluk'
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
      label: 'Kişisel Planlama',
      sublabel: 'Özel program tasarımı'
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <path d="M3 9h18M9 3v18" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          <circle cx="15" cy="9" r="1.5" fill="currentColor" />
          <circle cx="9" cy="15" r="1.5" fill="currentColor" />
          <circle cx="15" cy="15" r="1.5" fill="currentColor" />
        </svg>
      ),
      label: 'Portal Destekli Takip',
      sublabel: '24/7 ilerleme analizi'
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
        </svg>
      ),
      label: 'Sınırlı Kontenjan',
      sublabel: 'Premium kalite garantisi'
    }
  ];

  return (
    <RevealSection className="w-full py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        {/* Title */}
        <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] font-bold text-primary/70 mb-3">
            Neden ARENA
          </p>
          <h2 className={`text-2xl md:text-3xl font-bold font-display tracking-[-0.02em] ${
            dm ? 'text-text-main' : 'text-text-main'
          }`}>
            Premium Koçluk Standartları
          </h2>
        </motion.div>

        {/* Badges Grid — Desktop: 4 columns, Tablet: 2x2, Mobile: 1 */}
        <motion.div
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group h-full"
            >
              <div
                className={`relative flex flex-col items-center justify-center text-center p-6 md:p-8 rounded-2xl border transition-all duration-500 h-full ${
                  dm
                    ? 'bg-gradient-to-br from-white/5 to-white/[0.01] border-white/10 hover:border-primary/30 hover:bg-white/[0.08] shadow-lg shadow-black/20'
                    : 'bg-gradient-to-br from-white/80 to-white/50 border-white/30 hover:border-primary/40 hover:bg-white/95 shadow-md shadow-black/5'
                }`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 p-3 rounded-xl transition-all duration-500 ${
                    dm
                      ? 'bg-primary/15 text-primary group-hover:bg-primary/25 group-hover:scale-110'
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Label */}
                <h3 className={`text-sm md:text-base font-bold font-display mb-1 transition-colors duration-300 ${
                  dm ? 'text-text-main group-hover:text-primary' : 'text-text-main group-hover:text-primary'
                }`}>
                  {badge.label}
                </h3>

                {/* Sublabel */}
                {badge.sublabel && (
                  <p className={`text-[0.8rem] leading-tight transition-colors duration-300 ${
                    dm ? 'text-text-main/40 group-hover:text-text-main/60' : 'text-text-main/50 group-hover:text-text-main/70'
                  }`}>
                    {badge.sublabel}
                  </p>
                )}

                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    zIndex: -1
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={fadeUp}
          custom={5}
          className={`h-px mx-auto mt-16 w-32 ${dm ? 'bg-white/5' : 'bg-black/5'}`}
        />
      </div>
    </RevealSection>
  );
}
