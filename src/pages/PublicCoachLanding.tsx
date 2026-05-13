import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ProTheme } from '../components/branding/themes/ProTheme'
import { AthleteTheme } from '../components/branding/themes/AthleteTheme'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'

export default function PublicCoachLanding() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { showToast } = useStore()
  const [landing, setLanding] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', goal: 'fitness' })

  useEffect(() => {
    fetchLanding()
  }, [slug])

  const fetchLanding = async () => {
    const { data, error } = await supabase
      .from('coach_landings')
      .select('*, coach_profiles(name, email)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      navigate('/')
      return
    }

    setLanding(data)
    setLoading(false)
  }

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('leads').insert([{
      full_name: form.name,
      phone: form.phone,
      goal: form.goal,
      coach_id: landing.coach_id,
      status: 'New'
    }])

    if (!error) {
      showToast('Başvurunuz başarıyla iletildi! 🎉')
      setShowContact(false)
      setForm({ name: '', phone: '', goal: 'fitness' })
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  const themeProps = {
    content: landing.content,
    onContactClick: () => setShowContact(true)
  }

  return (
    <div className="relative">
      {landing.theme === 'pro' && <ProTheme {...themeProps} />}
      {landing.theme === 'athlete' && <AthleteTheme {...themeProps} />}
      {landing.theme === 'minimalist' && <ProTheme {...themeProps} />} {/* Fallback to Pro for now */}

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContact(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-bg rounded-[3rem] p-10 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <h3 className="font-display text-4xl font-black mb-2 tracking-tight">Harekete Geç.</h3>
              <p className="text-white/40 text-sm mb-8 font-medium">Hedeflerini paylaş, profesyonel planını hemen oluşturalım.</p>

              <form onSubmit={handleContact} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-colors font-bold"
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  required
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-colors font-bold"
                />
                <select
                  value={form.goal}
                  onChange={e => setForm({...form, goal: e.target.value})}
                  className="w-full h-16 px-6 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-colors font-bold appearance-none"
                >
                  <option value="fitness">Genel Fitness</option>
                  <option value="weight">Kilo Yönetimi</option>
                  <option value="performance">Sporcu Performansı</option>
                </select>
                <button type="submit" className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4">
                  BAŞVURUYU TAMAMLA ⚡
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
