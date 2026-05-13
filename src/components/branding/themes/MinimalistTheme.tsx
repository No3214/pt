import { motion } from 'framer-motion'

interface ThemeProps {
  content: any
  onContactClick: () => void
  coach: any
}

export function MinimalistTheme({ content, onContactClick, coach }: ThemeProps) {
  const { professional_data: pro } = coach
  const { hero, about, services } = content

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1D1D1F] font-body selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center mix-blend-difference text-white">
        <span className="font-bold tracking-tighter text-xl">CV.</span>
        <button onClick={onContactClick} className="text-xs font-black uppercase tracking-widest border-b border-white pb-1">Connect</button>
      </nav>

      {/* Profile Header */}
      <section className="pt-40 pb-20 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-end mb-20">
          <div className="w-32 h-32 rounded-full bg-black/5 flex items-center justify-center text-5xl">👤</div>
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-4"
            >
              {coach.name}
            </motion.h1>
            <p className="text-xl md:text-2xl font-medium opacity-40">{pro?.headline || 'Elite Coach'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-20">
          {/* Bio & Links */}
          <div className="md:col-span-2 space-y-12">
            <div>
              <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-30 mb-6">Expertise & Background</h4>
              <p className="text-2xl leading-relaxed font-medium">
                {pro?.bio_long || about.bio}
              </p>
            </div>

            {/* Experience List */}
            <div className="space-y-8">
              <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-30">Selected Experience</h4>
              {(pro?.experience || []).map((exp: any, i: number) => (
                <div key={i} className="flex justify-between items-start border-t border-black/5 pt-6">
                  <div>
                    <h5 className="font-bold text-lg">{exp.title}</h5>
                    <p className="opacity-40 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-sm font-bold opacity-30">{exp.year}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & CTA */}
          <div className="space-y-12">
             <div className="space-y-4">
              <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-30">Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(pro?.skills || []).map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-black/5 text-[0.65rem] font-black uppercase tracking-wider">{skill}</span>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-black text-white space-y-6">
              <h4 className="text-xl font-bold">Ready to start?</h4>
              <p className="text-sm opacity-60">Let's build your personalized path to performance today.</p>
              <button
                onClick={onContactClick}
                className="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-[0.6rem] tracking-[0.2em] hover:bg-white/90 transition-colors"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section (Udemy integration) */}
      <section className="py-20 px-8 max-w-5xl mx-auto border-t border-black/5">
        <h4 className="text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-30 mb-10">Programs & Education</h4>
        <div className="grid md:grid-cols-2 gap-6">
           <div className="p-8 rounded-[2rem] bg-black/5 border border-black/5 flex items-center justify-center text-sm opacity-40 italic">
             Loading published courses...
           </div>
        </div>
      </section>

      <footer className="py-20 text-center opacity-20 text-[0.6rem] font-black uppercase tracking-[0.4em]">
        ARENA PRO-ID // 2026
      </footer>
    </div>
  )
}
