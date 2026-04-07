import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'
import { GrainOverlay } from '../../components/landing/LandingUI'
import { tenantConfig } from '../../config/tenant'

type AuthMode = 'login' | 'register' | 'magic-link' | 'forgot-password'

export default function StudentLogin() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const { login, register, loginWithMagicLink, resetPassword, isLoading, error } = useStudentAuth()
  const darkMode = useStore(s => s.darkMode)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')

    if (mode === 'login') {
      await login(email, password)
    } else if (mode === 'register') {
      const ok = await register(email, password, name, phone)
      if (ok) setSuccessMsg('Kayıt başarılı! E-postanızı kontrol edin.')
    } else if (mode === 'magic-link') {
      const ok = await loginWithMagicLink(email)
      if (ok) setSuccessMsg('Giriş bağlantısı e-postanıza gönderildi!')
    } else if (mode === 'forgot-password') {
      const ok = await resetPassword(email)
      if (ok) setSuccessMsg('Şifre sıfırlama bağlantısı gönderildi!')
    }
  }

  const bg = darkMode ? 'bg-[#050505]' : 'bg-[#FAF6F1]'
  const cardBg = darkMode ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'
  const inputBg = darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20' : 'bg-[#FAF6F1] border-black/[0.06] text-[#1C1917] placeholder:text-black/20'

  return (
    <div className={`min-h-screen flex font-body ${bg} text-text-main relative overflow-hidden`}>
      <GrainOverlay />

      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 50%, ${tenantConfig.theme.colors.primary}15, transparent 60%)` }} />

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 border border-primary/10">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          <h1 className="font-display text-[3.5rem] font-bold tracking-tighter leading-[0.95] mb-6">
            Gelişimin <br />
            <span className="text-primary">Başlıyor.</span>
          </h1>

          <p className={`text-lg leading-relaxed mb-10 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
            Kişisel antrenman portalına hoş geldin. Antrenmanlarını takip et, beslenme planını yönet, koçunla iletişimde kal.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Aktif Sporcu', value: '200+' },
              { label: 'Antrenman Planı', value: '1.5K+' },
              { label: 'Başarı Oranı', value: '%94' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`p-4 rounded-2xl border ${cardBg}`}
              >
                <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                <div className={`text-[0.65rem] font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-10 p-6 rounded-2xl border ${cardBg}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">MA</div>
              <div>
                <div className="font-bold text-sm">Mina Aksoy</div>
                <div className={`text-[0.6rem] uppercase tracking-widest ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Elite Sporcu</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
            <p className={`text-sm leading-relaxed italic ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
              "Portal sayesinde gelişimimi adım adım takip ediyorum. Koçumla anlık iletişim kurmak harika!"
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight">{tenantConfig.brand.name}</h2>
          </div>

          {/* Mode Tabs */}
          <div className={`flex gap-1 p-1 rounded-2xl mb-8 ${darkMode ? 'bg-white/[0.04]' : 'bg-black/[0.03]'}`}>
            {[
              { key: 'login' as AuthMode, label: 'Giriş Yap' },
              { key: 'register' as AuthMode, label: 'Kayıt Ol' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setMode(tab.key); setSuccessMsg('') }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  mode === tab.key || (mode === 'forgot-password' && tab.key === 'login') || (mode === 'magic-link' && tab.key === 'login')
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : darkMode ? 'text-white/40 hover:text-white/60' : 'text-black/40 hover:text-black/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Title */}
                <div className="mb-6">
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {mode === 'login' && 'Hoş Geldin 👋'}
                    {mode === 'register' && 'Hesap Oluştur 🚀'}
                    {mode === 'magic-link' && 'Şifresiz Giriş ✨'}
                    {mode === 'forgot-password' && 'Şifre Sıfırla 🔑'}
                  </h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
                    {mode === 'login' && 'Portalına giriş yap, gelişimini takip et.'}
                    {mode === 'register' && 'Yeni hesap oluştur ve koçunla bağlan.'}
                    {mode === 'magic-link' && 'E-postana gelen bağlantı ile giriş yap.'}
                    {mode === 'forgot-password' && 'E-postanı gir, şifre sıfırlama bağlantısı al.'}
                  </p>
                </div>

                {/* Name (register only) */}
                {mode === 'register' && (
                  <div>
                    <label className={`block text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Adınız Soyadınız"
                      required
                      className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm ${inputBg}`}
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className={`block text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                    E-posta
                  </label>
                  <div className="relative">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm ${inputBg}`}
                    />
                  </div>
                </div>

                {/* Phone (register only) */}
                {mode === 'register' && (
                  <div>
                    <label className={`block text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                      Telefon <span className={`${darkMode ? 'text-white/15' : 'text-black/15'}`}>(Opsiyonel)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                      className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm ${inputBg}`}
                    />
                  </div>
                )}

                {/* Password */}
                {(mode === 'login' || mode === 'register') && (
                  <div>
                    <label className={`block text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
                      Şifre
                    </label>
                    <div className="relative">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'register' ? 'Min. 8 karakter' : '••••••••'}
                        required
                        minLength={mode === 'register' ? 8 : undefined}
                        className={`w-full pl-12 pr-12 py-3.5 rounded-xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm ${inputBg}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50'}`}
                      >
                        {showPassword ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot Password Link */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMode('magic-link')}
                      className="text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                    >
                      Şifresiz giriş yap →
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className={`text-xs font-medium transition-colors ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50'}`}
                    >
                      Şifremi unuttum
                    </button>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      {successMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' && 'Giriş Yap'}
                      {mode === 'register' && 'Hesap Oluştur'}
                      {mode === 'magic-link' && 'Bağlantı Gönder'}
                      {mode === 'forgot-password' && 'Sıfırlama Bağlantısı Gönder'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </>
                  )}
                </motion.button>

                {/* Back to Login from sub-modes */}
                {(mode === 'magic-link' || mode === 'forgot-password') && (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`w-full py-3 text-sm font-medium ${darkMode ? 'text-white/30 hover:text-white/50' : 'text-black/30 hover:text-black/50'} transition-colors`}
                  >
                    ← Giriş ekranına dön
                  </button>
                )}

                {/* Divider */}
                {(mode === 'login' || mode === 'register') && (
                  <>
                    <div className="relative my-6">
                      <div className={`absolute inset-0 flex items-center`}>
                        <div className={`w-full border-t ${darkMode ? 'border-white/[0.06]' : 'border-black/[0.06]'}`} />
                      </div>
                      <div className="relative flex justify-center">
                        <span className={`px-4 text-[0.65rem] font-bold uppercase tracking-widest ${darkMode ? 'bg-[#050505] text-white/20' : 'bg-[#FAF6F1] text-black/20'}`}>
                          veya
                        </span>
                      </div>
                    </div>

                    {/* Social Login Placeholder */}
                    <button
                      type="button"
                      onClick={() => setMode('magic-link')}
                      className={`w-full py-3.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-3 transition-all ${
                        darkMode
                          ? 'border-white/[0.08] text-white/50 hover:bg-white/[0.04]'
                          : 'border-black/[0.08] text-black/50 hover:bg-black/[0.02]'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      E-posta ile şifresiz giriş
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Footer */}
          <div className={`mt-10 text-center text-[0.6rem] font-bold uppercase tracking-widest ${darkMode ? 'text-white/15' : 'text-black/15'}`}>
            <p>End-to-End Encrypted • KVKK Uyumlu</p>
            <p className="mt-1">© 2026 {tenantConfig.brand.fullName}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
