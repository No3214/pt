import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, TrainingPackage } from '../../stores/useStore'
import { useStudentAuth } from '../../stores/studentAuth'
import { Check, ArrowRight, Zap, Shield, CreditCard, Loader2 } from 'lucide-react'

export default function PackageShowcase() {
  const { packages, darkMode, showToast, addPayment } = useStore()
  const { profile } = useStudentAuth()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  const handlePurchase = async (pkg: TrainingPackage) => {
    if (!profile) return
    setLoadingId(pkg.id)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    addPayment({
      clientId: profile.auth_id,
      packageId: pkg.id,
      amount: pkg.price,
      status: 'completed'
    })

    setLoadingId(null)
    setSuccessId(pkg.id)
    showToast(`${pkg.name} başarıyla satın alındı!`)

    setTimeout(() => setSuccessId(null), 3000)
  }

  const cardBg = darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border ${cardBg}`}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl font-bold tracking-tight mb-4">Gelişim Paketleri 🚀</h2>
        <p className={`text-sm max-w-lg mx-auto ${darkMode ? 'text-white/40' : 'text-stone-500'}`}>
          Sana en uygun eğitim paketini seç, profesyonel voleybol dünyasına adımını at.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.filter(p => p.isActive).map((pkg) => (
          <motion.div
            key={pkg.id}
            whileHover={{ y: -8 }}
            className={`flex flex-col p-8 rounded-[2rem] border transition-all relative overflow-hidden ${
              pkg.name.toLowerCase().includes('pro')
                ? 'border-primary/30 bg-primary/[0.03] scale-105 z-10'
                : darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-stone-50 border-black/[0.04]'
            }`}
          >
            {pkg.name.toLowerCase().includes('pro') && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-white text-[0.6rem] font-bold uppercase tracking-widest">
                En Popüler
              </div>
            )}

            <div className="mb-8">
              <span className={`text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-lg mb-4 inline-block ${
                pkg.name.toLowerCase().includes('pro') ? 'bg-primary/20 text-primary' : darkMode ? 'bg-white/10 text-white/50' : 'bg-black/5 text-black/40'
              }`}>
                {pkg.sessions} Seanslı Eğitim
              </span>
              <h3 className="font-display text-2xl font-bold">{pkg.name}</h3>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{pkg.price.toLocaleString()}</span>
                <span className="text-lg opacity-50 font-bold">{pkg.currency}</span>
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-white/30' : 'text-stone-400'}`}>
                {pkg.durationDays} gün boyunca geçerlidir.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {pkg.features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="p-1 rounded-full bg-secondary/10 text-secondary mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className={darkMode ? 'text-white/70' : 'text-stone-600'}>{f}</span>
                </div>
              ))}
            </div>

            <button
              disabled={loadingId !== null || successId === pkg.id}
              onClick={() => handlePurchase(pkg)}
              className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                successId === pkg.id
                  ? 'bg-green-500 text-white'
                  : pkg.name.toLowerCase().includes('pro')
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02]'
                    : darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              {loadingId === pkg.id ? (
                <Loader2 size={20} className="animate-spin" />
              ) : successId === pkg.id ? (
                <Check size={20} />
              ) : (
                <>
                  Satın Al <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 opacity-30">
               <Shield size={14} />
               <CreditCard size={14} />
               <Zap size={14} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
