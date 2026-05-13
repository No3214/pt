import { motion } from 'framer-motion'

interface ThemeProps {
  content: any
  onContactClick: () => void
}

export function AthleteTheme({ content, onContactClick }: ThemeProps) {
  const { hero, about, services } = content

  return (
    <div className="min-h-screen bg-white text-black font-body selection:bg-primary/20 overflow-hidden">
      {/* Background Text */}
      <div className="fixed inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <h1 className="text-[30vw] font-black leading-none">ATHLETE</h1>
      </div>

      {/* Nav */}
      <nav className="p-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black">A</div>
          <span className="font-black tracking-tighter">PERFORMANCE</span>
        </div>
        <button onClick={onContactClick} className="font-black text-sm border-b-4 border-black pb-1 hover:text-primary hover:border-primary transition-colors">
          LET'S WORK
        </button>
      </nav>

      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col justify-center px-8 relative z-10">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-4xl"
        >
          <h1 className="font-display text-[clamp(4rem,15vw,12rem)] font-black leading-[0.8] mb-12 italic uppercase">
            {hero.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            <button
              onClick={onContactClick}
              className="bg-black text-white px-10 py-6 text-xl font-black italic hover:bg-primary transition-colors skew-x-[-12deg]"
            >
              <span className="inline-block skew-x-[12deg]">{hero.buttonText}</span>
            </button>
            <p className="text-xl font-medium max-w-sm border-l-8 border-black pl-6">
              {hero.subtitle}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="grid lg:grid-cols-2 mt-20 relative z-10 border-t-8 border-black">
        <div className="p-12 lg:p-24 border-r-8 border-black flex flex-col justify-center bg-primary text-white">
          <h2 className="text-6xl font-black italic uppercase mb-8 leading-none">{about.title}</h2>
          <p className="text-xl font-bold leading-relaxed opacity-90">{about.bio}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {(services && services.length > 0 ? services : [
            { title: "Strength", desc: "Build explosive power." },
            { title: "Conditioning", desc: "Never gas out again." },
            { title: "Nutrition", desc: "Fuel the machine." },
            { title: "Recovery", desc: "Optimize your rest." }
          ]).map((s: any, i: number) => (
            <div key={i} className="p-12 border-b-8 border-black last:border-b-0 md:even:border-l-8 md:[&:nth-child(3)]:border-b-0 hover:bg-black hover:text-white transition-colors group">
              <span className="text-sm font-black opacity-20 group-hover:opacity-100">0{i+1}</span>
              <h3 className="text-3xl font-black italic uppercase mt-4 mb-2">{s.title}</h3>
              <p className="text-sm font-bold opacity-40 group-hover:opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="p-20 text-center font-black italic uppercase tracking-tighter text-4xl opacity-10">
        ARENA PERFORMANCE ECOSYSTEM
      </footer>
    </div>
  )
}
