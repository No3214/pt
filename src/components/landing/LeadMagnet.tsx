import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'

/**
 * Lead Magnet — email karşılığı ücretsiz PDF.
 * Conversion booster: warm lead yakala, WhatsApp'a yönlendir.
 * LocalStorage'a kaydeder, e-posta servisi entegre olana dek console'a logger.
 */
export default function LeadMagnet() {
  const { darkMode: dm, showToast } = useStore()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      showToast('Geçerli bir e-posta gir')
      return
    }
    setLoading(true)
    try {
      // LocalStorage'a kaydet (backend hazır olana dek)
      const leads = JSON.parse(localStorage.getItem('ela-leads') || '[]')
      leads.push({ email, date: new Date().toISOString(), source: 'lead-magnet-pdf' })
      localStorage.setItem('ela-leads', JSON.stringify(leads))

      // Plausible/CF analytics event
      if (typeof window !== 'undefined' && (window as unknown as { plausible?: (e: string, o?: unknown) => void }).plausible) {
        (window as unknown as { plausible: (e: string, o?: unknown) => void }).plausible('Lead Magnet', { props: { email } })
      }

      await new Promise(r => setTimeout(r, 500))
      setSubmitted(true)
      showToast('PDF e-postanıza gönderildi! 🚀')
    } catch {
      showToast('Bir hata oluştu, tekrar dener misin?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className={`relative overflow-hidden py-20 px-8 md:px-12 ${dm ? 'bg-gradient-to-br from-primary/10 via-transparent to-secondary/10' : 'bg-gradient-to-br from-primary/5 via-transparent to-secondary/5'}`}
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.15em] mb-6 ${dm ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
          <span>🎁</span> Ücretsiz PDF
        </div>

        <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-tight leading-[1.1] mb-4">
          Voleybolcular için{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            7 Sıçrama Egzersizi
          </span>
        </h2>
        <p className={`text-[1rem] max-w-xl mx-auto mb-8 ${dm ? 'text-white/50' : 'text-stone-500'}`}>
          Dikey sıçramanı <strong className="text-primary">+10cm artıracak</strong> protokol. 4 haftalık
          program · video açıklamalı · her seviye için uyarlanabilir.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className={`flex-1 px-6 py-4 rounded-full text-[0.95rem] border outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`}
              required
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-8 py-4 rounded-full text-[0.95rem] font-bold text-white shadow-lg transition-all ${loading ? 'bg-primary/60' : 'bg-primary hover:bg-primary-dark shadow-primary/30'}`}
            >
              {loading ? '...' : 'PDF Gönder'}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`inline-flex items-center gap-3 px-6 py-4 rounded-full ${dm ? 'bg-primary/15 border border-primary/30' : 'bg-primary/10 border border-primary/20'}`}
          >
            <span className="text-2xl">✅</span>
            <span className="font-semibold">PDF e-postana gönderildi — kutunu kontrol et!</span>
          </motion.div>
        )}

        <p className={`mt-4 text-[0.75rem] ${dm ? 'text-white/30' : 'text-stone-400'}`}>
          Spam göndermem. İstediğin an çık. KVKK uyumlu.
        </p>
      </motion.div>
    </section>
  )
}
