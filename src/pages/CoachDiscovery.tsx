import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useStore } from '../stores/useStore'
import { GrainOverlay } from '../components/landing/LandingUI'
import { Link } from 'react-router-dom'

export default function CoachDiscovery() {
  const { darkMode: dm } = useStore()
  const [coaches, setCoaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchCoaches()
  }, [])

  const fetchCoaches = async () => {
    const { data } = await supabase
      .from('coach_landings')
      .select('slug, coach_profiles(*)')
      .eq('is_published', true)

    if (data) setCoaches(data)
    setLoading(false)
  }

  const filtered = coaches.filter(c =>
    c.coach_profiles.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.coach_profiles.professional_data?.headline?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className={`min-h-screen py-32 px-6 ${dm ? 'bg-bg text-white' : 'bg-bg-alt text-black'}`}>
      <GrainOverlay />

      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        <section className="text-center space-y-4">
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Profesyonel Koçları <br /> Keşfet<span className="text-primary">.</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg opacity-40 font-medium">
            Hedeflerine en uygun uzmanı bul, kariyerindeki bir sonraki adımı profesyonellerle at.
          </p>
        </section>

        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="İsim veya uzmanlık ara..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className={`w-full h-16 px-8 rounded-2xl border outline-none focus:border-primary transition-all font-bold ${
              dm ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'
            }`}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">🔍</div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {filtered.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group p-8 rounded-[3rem] border transition-all hover:scale-[1.02] ${
                dm ? 'bg-white/[0.02] border-white/5 hover:border-primary/30' : 'bg-white border-black/5 shadow-2xl hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl border border-primary/10">👤</div>
                <div>
                  <h3 className="font-bold text-xl">{c.coach_profiles.name}</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">{c.coach_profiles.professional_data?.headline || 'Elite Coach'}</p>
                </div>
              </div>

              <p className="text-sm opacity-40 line-clamp-3 mb-8 font-medium h-[4.5rem]">
                {c.coach_profiles.professional_data?.bio_long || "Performans odaklı antrenman ve profesyonel gelişim programları."}
              </p>

              <div className="flex flex-wrap gap-2 mb-8 h-12 overflow-hidden">
                {(c.coach_profiles.professional_data?.skills || []).slice(0, 3).map((s: string, j: number) => (
                  <span key={j} className="px-3 py-1 rounded-lg bg-black/5 text-[0.6rem] font-black uppercase tracking-wider opacity-60">{s}</span>
                ))}
              </div>

              <Link
                to={`/p/${c.slug}`}
                className="block w-full py-4 rounded-2xl bg-black text-white text-center font-black uppercase text-[0.65rem] tracking-[0.2em] group-hover:bg-primary transition-colors"
              >
                PROFILI İNCELE ↗
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20 opacity-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-bold uppercase tracking-widest text-xs">Aradığınız kriterlerde koç bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
