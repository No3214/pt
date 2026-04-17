import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'
import { useTranslation } from '../../locales'
import { fadeUp, shake, successPop } from '../../lib/motion'
import { Card3D, Card3DLayer, Card3DShine } from '../animations/3d/Card3D'

type FormErrors = Partial<Record<'name' | 'email' | 'phone', string>>

const sessionTypes = [
  { value: 'consultation', label: 'Ön Görüşme', icon: '💬', desc: 'Tanışma ve hedef belirleme', price: '500 ₺', duration: '30 dk' },
  { value: 'assessment', label: 'Değerlendirme', icon: '📋', desc: 'Kapsamlı fiziksel analiz', price: '750 ₺', duration: '45 dk' },
  { value: 'training', label: 'Online Antrenman', icon: '🏋️', desc: 'Birebir antrenman seansı', price: '1.000 ₺', duration: '60 dk' },
]

export default function BookingCTA() {
  useTranslation()
  const reduce = useReducedMotion()
  const { addBooking, darkMode: dm } = useStore()
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type')
  const [selectedType, setSelectedType] = useState('consultation')
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [shakeKey, setShakeKey] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', goal: '', message: '',
    preferredDay: '', preferredTime: ''
  })

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Ad soyad gerekli'
    if (!form.email.trim()) e.email = 'E-posta gerekli'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Geçerli bir e-posta girin'
    if (!form.phone.trim()) e.phone = 'Telefon gerekli'
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Geçerli bir telefon girin'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      setShakeKey(k => k + 1) // trigger shake animation
      return
    }
    setErrors({})
    setSending(true)

    const booking = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      goal: form.goal,
      message: form.message,
      preferredDay: form.preferredDay,
      preferredTime: form.preferredTime,
      sessionType: selectedType as 'consultation' | 'assessment' | 'training',
      status: 'pending' as const,
    }

    // Save to store
    addBooking(booking)

    // Also try Supabase
    try {
      await supabase.from('bookings').insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        goal: form.goal,
        message: form.message,
        preferred_day: form.preferredDay,
        preferred_time: form.preferredTime,
        session_type: selectedType,
        status: 'pending',
      })
    } catch { /* fallback to local */ }

    setSending(false)
    setStep('success')
    setForm({ name: '', email: '', phone: '', goal: '', message: '', preferredDay: '', preferredTime: '' })
  }

  const inpBase = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:ring-2 focus:shadow-[0_0_0_4px_rgba(var(--color-primary-rgb),0.08)] ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const inp = `${inpBase} focus:border-primary/50 focus:ring-primary/10`
  const inpErr = `${inpBase} border-red-500/60 focus:border-red-500 focus:ring-red-500/20 bg-red-500/[0.03]`
  const fieldCls = (key: keyof FormErrors) => (errors[key] ? inpErr : inp)

  return (
    <section id="booking" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 ${dm ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'}`}>
            RANDEVU AL
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Dönüşümün <span className="text-primary">ilk adımı.</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${dm ? 'text-white/50' : 'text-stone-500'}`}>
            Sınırlı kontenjan ile çalışıyorum. Ön görüşme ile uygunluğunu değerlendirip sana özel bir plan oluşturalım.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Type */}
          {step === 'type' && (
            <motion.div
              key="type"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20 }}
              variants={fadeUp}
              className="grid md:grid-cols-3 gap-6"
            >
              {sessionTypes.map((type) => (
                <Card3D key={type.value} intensity={8} className="h-full">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedType(type.value); setStep('form') }}
                    className={`relative p-8 rounded-2xl border cursor-pointer transition-all h-full ${
                      dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-primary/30' : 'bg-white border-black/[0.04] hover:border-primary/30'
                    } hover:shadow-xl`}
                  >
                    <Card3DShine className="rounded-2xl" />
                    <Card3DLayer depth={32}>
                      <span className="text-4xl block mb-4">{type.icon}</span>
                      <h3 className="text-xl font-display font-bold mb-2">{type.label}</h3>
                      <p className={`text-sm mb-4 ${dm ? 'text-white/40' : 'text-stone-500'}`}>{type.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{type.price}</span>
                        <span className={`text-xs font-medium ${dm ? 'text-white/30' : 'text-stone-400'}`}>{type.duration}</span>
                      </div>
                    </Card3DLayer>
                  </motion.div>
                </Card3D>
              ))}
            </motion.div>
          )}

          {/* Step 2: Contact Form */}
          {step === 'form' && (
            <motion.div
              key={`form-${shakeKey}`}
              initial={{ opacity: 0, x: 30 }}
              animate={
                reduce
                  ? { opacity: 1, x: 0 }
                  : shakeKey > 0
                    ? shake.animate
                    : { opacity: 1, x: 0 }
              }
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className={`p-8 md:p-10 rounded-2xl border ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setStep('type')} className={`w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer ${dm ? 'bg-white/[0.06] text-white/50' : 'bg-stone-100 text-stone-500'}`}>
                  ←
                </button>
                <div>
                  <h3 className="text-xl font-display font-bold">
                    {sessionTypes.find(t => t.value === selectedType)?.icon} {sessionTypes.find(t => t.value === selectedType)?.label}
                  </h3>
                  <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>
                    {sessionTypes.find(t => t.value === selectedType)?.price} • {sessionTypes.find(t => t.value === selectedType)?.duration}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Ad Soyad *</label>
                  <input
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors(p => ({ ...p, name: undefined })) }}
                    placeholder="Adınız Soyadınız"
                    className={fieldCls('name')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                  />
                  {errors.name && <p id="err-name" className="mt-1.5 text-[0.7rem] text-red-500 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>E-posta *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors(p => ({ ...p, email: undefined })) }}
                    placeholder="ornek@email.com"
                    className={fieldCls('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {errors.email && <p id="err-email" className="mt-1.5 text-[0.7rem] text-red-500 font-medium">{errors.email}</p>}
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Telefon *</label>
                  <input
                    value={form.phone}
                    onChange={e => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors(p => ({ ...p, phone: undefined })) }}
                    placeholder="0555 123 45 67"
                    className={fieldCls('phone')}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'err-phone' : undefined}
                  />
                  {errors.phone && <p id="err-phone" className="mt-1.5 text-[0.7rem] text-red-500 font-medium">{errors.phone}</p>}
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Hedef</label>
                  <select value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className={inp}>
                    <option value="">Seçin...</option>
                    <option value="fitness">Genel Fitness</option>
                    <option value="voleybol">Voleybol Performansı</option>
                    <option value="kilo-kaybi">Kilo Kaybı</option>
                    <option value="kas-kazanimi">Kas Kazanımı</option>
                    <option value="rehabilitasyon">Rehabilitasyon</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Tercih Ettiğiniz Gün</label>
                  <select value={form.preferredDay} onChange={e => setForm({ ...form, preferredDay: e.target.value })} className={inp}>
                    <option value="">Esnek</option>
                    <option value="Pazartesi">Pazartesi</option>
                    <option value="Salı">Salı</option>
                    <option value="Çarşamba">Çarşamba</option>
                    <option value="Perşembe">Perşembe</option>
                    <option value="Cuma">Cuma</option>
                    <option value="Cumartesi">Cumartesi</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Tercih Ettiğiniz Saat</label>
                  <select value={form.preferredTime} onChange={e => setForm({ ...form, preferredTime: e.target.value })} className={inp}>
                    <option value="">Esnek</option>
                    <option value="09:00-12:00">Sabah (09:00-12:00)</option>
                    <option value="12:00-15:00">Öğlen (12:00-15:00)</option>
                    <option value="15:00-18:00">Öğleden Sonra (15:00-18:00)</option>
                    <option value="18:00-21:00">Akşam (18:00-21:00)</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Mesajınız (Opsiyonel)</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Hedefiniz, sağlık durumunuz veya sorularınız..." className={`${inp} resize-none h-24`} />
              </div>

              <motion.button
                whileHover={sending ? undefined : { scale: 1.01 }}
                whileTap={sending ? undefined : { scale: 0.99 }}
                onClick={handleSubmit}
                disabled={sending}
                className={`w-full mt-6 py-4 rounded-full font-semibold border-none cursor-pointer transition-all flex items-center justify-center gap-2.5 ${
                  sending
                    ? (dm ? 'bg-primary/30 text-white/70 cursor-wait' : 'bg-primary/60 text-white/90 cursor-wait')
                    : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/30'
                }`}
              >
                {sending && (
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </motion.svg>
                )}
                {sending ? 'Gönderiliyor...' : 'Randevu Talebi Gönder'}
              </motion.button>

              <p className={`text-xs text-center mt-3 ${dm ? 'text-white/25' : 'text-stone-300'}`}>
                Talebiniz değerlendirildikten sonra sizinle iletişime geçilecektir.
              </p>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-12 rounded-2xl border text-center ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}
            >
              <motion.div
                variants={successPop}
                initial="hidden"
                animate="show"
                className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-[0_12px_40px_rgba(var(--color-primary-rgb),0.35)]"
              >
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>
              <h3 className="text-2xl font-display font-bold mb-3">Talebiniz Alındı!</h3>
              <p className={`text-lg mb-2 ${dm ? 'text-white/60' : 'text-stone-600'}`}>
                En kısa sürede değerlendirip sizinle iletişime geçeceğim.
              </p>
              <p className={`text-sm mb-8 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                Genellikle 24 saat içinde dönüş yapılır.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('type')}
                className={`px-8 py-3 rounded-full font-semibold border-none cursor-pointer ${dm ? 'bg-white/[0.06] text-white/60 hover:bg-white/10' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
              >
                ← Geri Dön
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
