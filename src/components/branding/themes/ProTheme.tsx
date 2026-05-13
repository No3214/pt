import { motion } from 'framer-motion'
import { GrainOverlay } from '../../landing/LandingUI'

interface ThemeProps {
  content: any
  onContactClick: () => void
}

export function ProTheme({ content, onContactClick }: ThemeProps) {
  const { hero, about, services, socials } = content

  return (
    <div className="min-h-screen bg-[#050505] text-white font-body selection:bg-primary/30">
      <GrainOverlay />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-md">
        <div className="font-display font-black text-xl tracking-tighter">ARENA<span className="text-primary">.</span></div>
        <button
          onClick={onContactClick}
          className="px-6 py-2 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
        >
          {hero.buttonText}
        </button>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tighter mb-8"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto mb-10 font-medium"
          >
            {hero.subtitle}
          </motion.p>
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onContactClick}
            className="group relative px-12 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 overflow-hidden"
          >
            <span className="relative z-10">{hero.buttonText}</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="absolute inset-0 z-20 flex items-center justify-center text-black font-black uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              BAŞLA ⚡
            </span>
          </motion.button>
        </div>
      </section>

      {/* About */}
      <section className="py-32 border-y border-white/5">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="aspect-[4/5] rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center text-8xl grayscale opacity-20">
            👤
          </div>
          <div>
            <h2 className="font-display text-5xl font-bold mb-8">{about.title}</h2>
            <p className="text-xl text-white/50 leading-relaxed italic border-l-4 border-primary pl-8">
              {about.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 bg-white text-black">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-6xl font-black mb-20 tracking-tight">Hizmetlerim<span className="text-primary">.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(services && services.length > 0 ? services : [
              { title: "Personal Training", desc: "Kişiye özel antrenman ve motivasyon." },
              { title: "Beslenme Danışmanlığı", desc: "Hedebe yönelik sürdürülebilir beslenme." },
              { title: "Online Coaching", desc: "Dünyanın her yerinden profesyonel takip." }
            ]).map((s: any, i: number) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-bg border border-black/5 hover:border-primary/30 transition-colors">
                <h4 className="font-bold text-xl mb-4">{s.title}</h4>
                <p className="text-black/40 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center opacity-30 text-xs font-bold tracking-widest uppercase">
        <p>© 2026 Powered by ARENA Performance</p>
      </footer>
    </div>
  )
}
