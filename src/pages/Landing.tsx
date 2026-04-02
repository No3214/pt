import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { sanitize } from '../lib/constants'

/* ═══════════════ Animation Variants ═══════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}

const scaleReveal = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
}

/* ═══════════════ Reveal Section ═══════════════ */
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════════ Counter ═══════════════ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / 45)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 25)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══════════════ Magnetic Button ═══════════════ */
function Magnetic({ children, className = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)' }
  return <a ref={ref} onMouseMove={move} onMouseLeave={reset} className={`inline-block transition-transform duration-300 ${className}`} {...props}>{children}</a>
}

/* ═══════════════ Parallax Image ═══════════════ */
function ParallaxImg({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="w-full h-[120%] object-cover" />
    </div>
  )
}

/* ═══════════════ LANDING PAGE ═══════════════ */
export default function Landing() {
  const { darkMode, toggleDarkMode } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.currentTarget
    const name = sanitize((f.elements.namedItem('name') as HTMLInputElement).value)
    const goal = sanitize((f.elements.namedItem('goal') as HTMLSelectElement).value)
    const notes = sanitize((f.elements.namedItem('notes') as HTMLTextAreaElement).value)
    const msg = `Merhaba Ela! Sana sitenden basvuru yapiyorum.\n\n Ad: ${name}\n Hedef: ${goal}\n Not: ${notes}`
    window.open(`https://wa.me/905362486849?text=${encodeURIComponent(msg)}`, '_blank')
    f.reset()
  }

  const dm = darkMode

  return (
    <div className={`font-body overflow-x-hidden ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>

      {/* ════════════ NAVIGATION ════════════ */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
          scrolled
            ? `${dm ? 'bg-[#050505]/80' : 'bg-[#FAF6F1]/80'} backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.03)]`
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center">
          <a href="#" className={`font-display text-[1.5rem] font-bold tracking-[-0.04em] no-underline transition-colors duration-300 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
            Ela<span className="text-terracotta">.</span>
          </a>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-12`}>
            {['Hakkında', 'Programlar', 'Sonuçlar', 'İletişim'].map((label, i) => (
              <a key={i} href={`#${['hakkinda','programlar','sonuclar','iletisim'][i]}`}
                className={`text-[0.8rem] tracking-[0.08em] uppercase no-underline transition-all duration-300 hover:text-terracotta ${dm ? 'text-white/40' : 'text-[#1C1917]/35'}`}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} aria-label="Tema değiştir"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${dm ? 'bg-white/8 text-white hover:bg-white/15' : 'bg-black/[0.04] text-[#1C1917] hover:bg-black/[0.08]'}`}>
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {dm ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /> : <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>}
              </svg>
            </button>
            <Link to="/admin" className={`hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-[0.78rem] tracking-[0.02em] font-medium no-underline transition-all duration-500 ${dm ? 'text-white/50 hover:text-white border border-white/10 hover:border-white/25' : 'text-[#1C1917]/40 hover:text-[#1C1917] border border-black/8 hover:border-black/20'}`}>
              Koç Paneli
            </Link>
            {/* Mobile Menu Toggle */}
            <button className="md:hidden bg-transparent border-none cursor-pointer p-2 z-[101]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              <div className="space-y-[5px]">
                <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-500 origin-center ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-500 ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-500 origin-center ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 ${dm ? 'bg-[#050505]/98' : 'bg-[#FAF6F1]/98'} backdrop-blur-3xl`}
          >
            {['Hakkında', 'Programlar', 'Sonuçlar', 'İletişim'].map((label, i) => (
              <motion.a
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                href={`#${['hakkinda','programlar','sonuclar','iletisim'][i]}`}
                onClick={() => setMenuOpen(false)}
                className={`font-display text-[2.5rem] font-semibold tracking-[-0.02em] no-underline transition-colors duration-300 hover:text-terracotta ${dm ? 'text-white' : 'text-[#1C1917]'}`}
              >
                {label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-col items-center gap-4"
            >
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className={`px-8 py-3 rounded-full text-[0.85rem] font-medium no-underline border ${dm ? 'border-white/15 text-white/60' : 'border-black/10 text-[#1C1917]/50'}`}>
                Koç Paneli
              </Link>
              <a href="#iletisim" onClick={() => setMenuOpen(false)}
                className="px-8 py-3 rounded-full bg-terracotta text-white text-[0.85rem] font-medium no-underline">
                Ücretsiz Görüşme
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════ HERO — CINEMATIC FULL-SCREEN ════════════ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Zoom on Scroll */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 -z-10">
          <img src="/ela_hero.png" alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${dm
            ? 'bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505]'
            : 'bg-gradient-to-b from-[#FAF6F1]/90 via-[#FAF6F1]/30 to-[#FAF6F1]/95'
          }`} />
        </motion.div>

        {/* Hero Content — Centered Massive Typography */}
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="relative text-center px-6 max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.2em] mb-10 backdrop-blur-xl ${dm ? 'bg-white/5 text-white/60 border border-white/10' : 'bg-white/60 text-[#1C1917]/50 border border-black/[0.06]'}`}
          >
            <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            Nisan 2026 — Sınırlı Kontenjan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-[clamp(3.5rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.04em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}
          >
            Güçlü ol.<br />
            <span className="apple-gradient-text">Kendine güven.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className={`text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.7] max-w-[560px] mx-auto mb-14 ${dm ? 'text-white/45' : 'text-[#1C1917]/45'}`}
          >
            Profesyonel sporcu disipliniyle, sana özel antrenman ve beslenme stratejileri.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex gap-5 justify-center flex-wrap"
          >
            <Magnetic href="#iletisim"
              className="group relative px-10 py-4.5 bg-terracotta text-white rounded-full text-[0.9rem] font-medium no-underline overflow-hidden">
              <span className="relative z-10">Ücretsiz Görüşme</span>
              <span className="absolute inset-0 bg-[#a8543a] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full" />
            </Magnetic>
            <Magnetic href="#programlar"
              className={`px-10 py-4.5 rounded-full text-[0.9rem] font-medium no-underline border transition-all duration-500 ${dm ? 'border-white/15 text-white/60 hover:text-white hover:border-white/40' : 'border-black/10 text-[#1C1917]/50 hover:text-[#1C1917] hover:border-black/30'}`}>
              Programları Keşfet
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-[1px] h-16 ${dm ? 'bg-gradient-to-b from-white/30 to-transparent' : 'bg-gradient-to-b from-black/20 to-transparent'}`} />
        </motion.div>
      </section>

      {/* ════════════ MARQUEE STATS BAND ════════════ */}
      <section className={`py-6 border-y overflow-hidden ${dm ? 'border-white/[0.04] bg-[#050505]' : 'border-black/[0.04] bg-white'}`}>
        <div className="marquee-track">
          <div className="marquee-content">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex items-center gap-16 px-8">
                {[
                  { val: '20+', label: 'Aktif Danışan' },
                  { val: '8+', label: 'Yıl Voleybol' },
                  { val: '96', label: 'Egzersiz' },
                  { val: '%100', label: 'Memnuniyet' },
                  { val: '5.0', label: 'Değerlendirme' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 whitespace-nowrap">
                    <span className={`text-[1.8rem] font-bold tracking-tight ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{s.val}</span>
                    <span className={`text-[0.72rem] uppercase tracking-[0.15em] ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>{s.label}</span>
                    <span className="text-terracotta/30 text-lg">✦</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ ABOUT — CINEMATIC SPLIT ════════════ */}
      <section id="hakkinda" className={`py-40 md:py-56 ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal>
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
              {/* Left — Image */}
              <motion.div variants={scaleReveal} className="relative">
                <ParallaxImg src="/voleybol_1.png" alt="Ela Ebeoğlu" className="rounded-[2rem] aspect-[4/5]" />
                {/* Floating Glass Card */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`absolute -right-6 md:-right-12 bottom-12 px-8 py-6 rounded-2xl backdrop-blur-2xl shadow-float ${dm ? 'bg-white/[0.06] border border-white/10' : 'bg-white/80 border border-white'}`}
                >
                  <div className="text-[2.5rem] font-bold text-terracotta leading-none"><Counter target={20} suffix="+" /></div>
                  <div className={`text-[0.68rem] uppercase tracking-[0.15em] mt-2 ${dm ? 'text-white/40' : 'text-[#1C1917]/35'}`}>Mutlu Danışan</div>
                </motion.div>
              </motion.div>

              {/* Right — Text */}
              <div>
                <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.25em] font-medium text-terracotta mb-8">
                  Felsefe
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1}
                  className={`font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] mb-10 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                  İlham vermek<br />değil, karar<br />verdirmek.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2}
                  className={`text-[1.08rem] leading-[1.9] max-w-[440px] mb-14 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>
                  Voleybol sahasında edindiğim disiplinle, sadece kararlı ve disiplinli danışanlarla çalışıyorum. Her program bilimsel temellere dayanır, her adım ölçülür.
                </motion.p>

                {/* Philosophy Items */}
                <motion.div variants={stagger} className="space-y-8">
                  {[
                    { num: '01', title: 'Sporcu Disiplini', desc: 'Profesyonel voleybol tecrübesiyle kanıtlanmış metodoloji.' },
                    { num: '02', title: 'Kadın Odaklı Güçlenme', desc: 'Bedenini tanımanı ve güçlü bir temele sahip olmanı hedefliyorum.' },
                    { num: '03', title: 'Seçici Premium Takip', desc: 'Sınırlı kontenjanla, birebir odaklı çalışma.' },
                  ].map((item, i) => (
                    <motion.div key={i} variants={fadeUp} custom={i}
                      className="group flex gap-6 items-start">
                      <span className={`text-[0.65rem] font-mono tracking-wider mt-2 opacity-30 group-hover:opacity-100 group-hover:text-terracotta transition-all duration-500 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{item.num}</span>
                      <div className={`flex-1 pb-8 border-b transition-colors duration-500 ${dm ? 'border-white/[0.04] group-hover:border-white/10' : 'border-black/[0.04] group-hover:border-black/10'}`}>
                        <h3 className={`text-[1.1rem] font-semibold mb-1.5 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{item.title}</h3>
                        <p className={`text-[0.88rem] leading-relaxed ${dm ? 'text-white/35' : 'text-[#1C1917]/40'}`}>{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ BIG STATEMENT ════════════ */}
      <section className={`py-32 md:py-44 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal className="text-center">
            <motion.h2 variants={fadeUp}
              className={`font-display text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[1.1] tracking-[-0.03em] max-w-[800px] mx-auto ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Ertesi güne bırakmayacağın planlar. <span className="text-terracotta">Pes etmeyeceğin</span> bir koç.
            </motion.h2>
          </Reveal>
        </div>
      </section>

      {/* ════════════ PROGRAMLAR — PREMIUM CARDS ════════════ */}
      <section id="programlar" className={`py-32 md:py-44 ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal>
            <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.25em] font-medium text-terracotta mb-8">
              Programlar
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.03em] max-w-[600px] mb-20 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Senin için tasarlandı.
            </motion.h2>
          </Reveal>

          <Reveal className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Online Koçluk', desc: 'Sana özel antrenman programı ve temel beslenme takibi ile hedefe yönelik ilerleme.', price: '2.500', features: ['Kişiye özel program', 'Haftalık check-in', 'WhatsApp destek'], icon: '◎' },
              { name: 'Voleybol Performance', desc: 'Sıçrama, atletizm ve sahaya özel performans modülü ile rakiplerinden ayrıl.', price: '3.000', features: ['Plyometrik antrenman', 'Sakatlık önleme', 'Video analiz'], featured: true, icon: '◆' },
              { name: 'Premium Büyüme', desc: 'TDEE destekli tam beslenme, günlük kontrol ve birebir koçluk ile maksimum sonuç.', price: '5.500', features: ['Günlük TDEE takibi', '1:1 görüşmeler', 'FMS değerlendirme'], icon: '▲' },
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`group relative flex flex-col p-10 md:p-12 rounded-[1.5rem] border transition-all duration-700 hover:-translate-y-2 ${
                  p.featured
                    ? `${dm ? 'bg-gradient-to-b from-terracotta/[0.08] to-transparent border-terracotta/20 hover:border-terracotta/40' : 'bg-gradient-to-b from-terracotta/[0.04] to-transparent border-terracotta/15 hover:border-terracotta/30'}`
                    : `${dm ? 'border-white/[0.05] hover:border-white/15 bg-white/[0.02]' : 'border-black/[0.05] hover:border-black/12 bg-white'}`
                } hover:shadow-float`}
              >
                {p.featured && (
                  <div className="absolute -top-3.5 left-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta text-white text-[0.65rem] font-semibold uppercase tracking-[0.15em]">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Popüler
                  </div>
                )}

                <div className={`text-2xl mb-8 ${dm ? 'text-white/20' : 'text-[#1C1917]/15'}`}>{p.icon}</div>
                <h3 className={`font-display text-[1.6rem] font-bold tracking-[-0.02em] mb-3 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{p.name}</h3>
                <p className={`text-[0.88rem] leading-[1.7] flex-1 mb-10 ${dm ? 'text-white/35' : 'text-[#1C1917]/40'}`}>{p.desc}</p>

                <div className="mb-10 space-y-4">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] ${dm ? 'bg-white/5 text-sage' : 'bg-sage/8 text-sage'}`}>✓</div>
                      <span className={`text-[0.85rem] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className={`text-[2.8rem] font-bold tracking-[-0.03em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                    ₺{p.price}<span className={`text-[0.9rem] font-normal ml-1.5 ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>/ay</span>
                  </div>
                  <a href="#iletisim"
                    className={`block text-center py-4 rounded-full text-[0.88rem] font-semibold no-underline transition-all duration-500 ${
                      p.featured
                        ? 'bg-terracotta text-white hover:shadow-[0_20px_40px_rgba(194,104,74,0.3)] hover:-translate-y-0.5'
                        : `border ${dm ? 'border-white/10 text-white/60 hover:border-white/25 hover:text-white' : 'border-black/10 text-[#1C1917]/50 hover:border-black/25 hover:text-[#1C1917]'}`
                    }`}>
                    {p.featured ? 'Hemen Başvur' : 'Başvur'}
                  </a>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ════════════ PROGRAM COMPARISON TABLE ════════════ */}
      <section className={`py-20 md:py-28 ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1100px] mx-auto px-6 md:px-16">
          <Reveal>
            <motion.div variants={fadeUp}
              className={`overflow-x-auto rounded-[1.5rem] border backdrop-blur-xl ${dm ? 'border-white/[0.05] bg-white/[0.02]' : 'border-black/[0.05] bg-white'}`}>
              <table className="w-full text-left text-[0.85rem]">
                <thead>
                  <tr className={`border-b ${dm ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
                    <th className={`p-5 font-medium text-[0.75rem] uppercase tracking-[0.1em] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>Özellik</th>
                    <th className={`p-5 font-medium text-[0.75rem] uppercase tracking-[0.1em] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>Online</th>
                    <th className={`p-5 font-semibold text-[0.75rem] uppercase tracking-[0.1em] text-terracotta`}>Voleybol</th>
                    <th className={`p-5 font-medium text-[0.75rem] uppercase tracking-[0.1em] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Kişiye Özel Program', v: [true, true, true] },
                    { feature: 'Haftalık Check-in', v: [true, true, true] },
                    { feature: 'WhatsApp Destek', v: [true, true, true] },
                    { feature: 'Plyometrik Antrenman', v: [false, true, true] },
                    { feature: 'Video Analiz', v: [false, true, true] },
                    { feature: 'FMS Değerlendirme', v: [false, false, true] },
                    { feature: 'Günlük TDEE Takibi', v: [false, false, true] },
                    { feature: '1:1 Görüşmeler', v: [false, false, true] },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b last:border-0 transition-colors ${dm ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-black/[0.03] hover:bg-black/[0.01]'}`}>
                      <td className={`p-4 pl-5 ${dm ? 'text-white/45' : 'text-[#1C1917]/45'}`}>{row.feature}</td>
                      {row.v.map((v, j) => (
                        <td key={j} className={`p-4 text-center ${j === 1 ? (dm ? 'bg-terracotta/[0.04]' : 'bg-terracotta/[0.02]') : ''}`}>
                          {v ? <span className="text-sage text-base">✓</span> : <span className={`${dm ? 'text-white/10' : 'text-[#1C1917]/10'}`}>—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className={`border-t ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                    <td className={`p-4 pl-5 font-semibold ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Aylık</td>
                    <td className={`p-4 text-center font-bold text-[1.1rem] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>₺2.500</td>
                    <td className={`p-4 text-center font-bold text-[1.1rem] text-terracotta ${dm ? 'bg-terracotta/[0.04]' : 'bg-terracotta/[0.02]'}`}>₺3.000</td>
                    <td className={`p-4 text-center font-bold text-[1.1rem] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>₺5.500</td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ SONUÇLAR / TESTIMONIALS ════════════ */}
      <section id="sonuclar" className={`py-32 md:py-44 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal>
            <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.25em] font-medium text-terracotta mb-8">
              Sonuçlar
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.03em] max-w-[650px] mb-20 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Onların hikayesi, senin motivasyonun.
            </motion.h2>
          </Reveal>

          <Reveal className="grid md:grid-cols-3 gap-5">
            {[
              { text: 'Sadece antrenman değil, disiplin öğreten bir süreçti. Vücudumdaki değişime inanamıyorum.', name: 'Ayşe K.', role: 'Voleybolcu', metric: '+12kg squat' },
              { text: 'Ela\'nın programlarıyla 3 ayda dikey sıçramam 8 cm arttı. Gerçekten fark yaratan biri.', name: 'Deniz Y.', role: 'Amatör Voleybolcu', metric: '+8cm sıçrama' },
              { text: 'Beslenme planım ve antrenmanlarım o kadar uyumluydu ki, ilk kez sürdürülebilir bir değişim yaşadım.', name: 'Selin B.', role: 'Fitness', metric: '-4kg yağ' },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`group p-10 md:p-12 rounded-[1.5rem] border transition-all duration-700 hover:-translate-y-1 ${dm ? 'border-white/[0.05] bg-white/[0.02] hover:border-white/10' : 'border-black/[0.05] bg-[#FAF6F1] hover:border-black/10'}`}>

                <div className={`inline-flex px-3 py-1.5 rounded-full text-[0.68rem] font-semibold uppercase tracking-[0.1em] mb-8 ${dm ? 'bg-sage/15 text-sage' : 'bg-sage/10 text-sage-dark'}`}>
                  {t.metric}
                </div>

                <svg className={`w-8 h-8 mb-6 ${dm ? 'text-white/8' : 'text-[#1C1917]/8'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className={`text-[1.05rem] leading-[1.85] mb-10 ${dm ? 'text-white/55' : 'text-[#1C1917]/55'}`}>{t.text}</p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-sage flex items-center justify-center text-white text-[0.8rem] font-bold">
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <div className={`text-[0.92rem] font-semibold ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{t.name}</div>
                    <div className={`text-[0.72rem] uppercase tracking-[0.1em] ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ════════════ GALLERY — CINEMATIC BENTO ════════════ */}
      <section className={`py-32 md:py-44 ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal>
            <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.25em] font-medium text-terracotta mb-8">
              Galeri
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.03em] max-w-[500px] mb-16 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Sahadan stüdyoya.
            </motion.h2>
          </Reveal>

          <Reveal>
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[260px]">
              {[
                { src: '/ela_hero.png', span: 'md:col-span-2 md:row-span-2', alt: 'Ela Portrait' },
                { src: '/voleybol_1.png', span: '', alt: 'Voleybol' },
                { src: '/ela_voleybol.png', span: '', alt: 'Sahada' },
                { src: '/voleybol_2.png', span: '', alt: 'Antrenman' },
                { src: '/ela_training.png', span: 'md:row-span-2', alt: 'Training' },
                { src: '/voleybol_3.png', span: '', alt: 'Takım' },
                { src: '/voleybol_4.png', span: '', alt: 'Lifestyle' },
              ].map((img, i) => (
                <motion.div key={i} variants={scaleReveal}
                  className={`rounded-2xl overflow-hidden relative group cursor-pointer ${img.span}`}>
                  <img src={img.src} alt={img.alt}
                    className="w-full h-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-110" />
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6 bg-gradient-to-t ${dm ? 'from-black/70 via-black/20 to-transparent' : 'from-black/50 via-black/10 to-transparent'}`}>
                    <span className="text-white text-[0.82rem] font-medium tracking-wide">{img.alt}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 text-center">
              <a href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-[0.82rem] font-medium no-underline transition-all duration-500 border hover:-translate-y-0.5 ${dm ? 'border-white/10 text-white/40 hover:text-white hover:border-white/25' : 'border-black/8 text-[#1C1917]/35 hover:text-[#1C1917] hover:border-black/20'}`}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                @elaebeoglu
              </a>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ İLETİŞİM / CONTACT ════════════ */}
      <section id="iletisim" className={`py-32 md:py-44 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-20 lg:gap-32">
              {/* Left */}
              <div>
                <motion.p variants={fadeUp} className="text-[0.72rem] uppercase tracking-[0.25em] font-medium text-terracotta mb-8">
                  İletişim
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1}
                  className={`font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-[-0.03em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                  Dönüşümüne<br />bugün başla.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2}
                  className={`text-[1rem] leading-[1.85] max-w-[420px] mb-14 ${dm ? 'text-white/35' : 'text-[#1C1917]/38'}`}>
                  Sınırlı kontenjan nedeniyle başvuruları değerlendirerek alıyorum. Formu doldurduktan sonra WhatsApp üzerinden iletişime geçeceğim.
                </motion.p>

                {/* Quick Contact Cards */}
                <motion.div variants={stagger} className="space-y-4">
                  <motion.a variants={fadeUp} href="https://wa.me/905362486849" target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-5 p-5 rounded-2xl border no-underline transition-all duration-500 hover:-translate-y-0.5 ${dm ? 'border-white/[0.05] hover:border-white/15 text-white bg-white/[0.02]' : 'border-black/[0.05] hover:border-black/12 text-[#1C1917] bg-[#FAF6F1]'}`}>
                    <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                    </div>
                    <div>
                      <div className="text-[0.92rem] font-semibold">WhatsApp</div>
                      <div className={`text-[0.78rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>+90 536 248 6849</div>
                    </div>
                  </motion.a>
                  <motion.a variants={fadeUp} custom={1} href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-5 p-5 rounded-2xl border no-underline transition-all duration-500 hover:-translate-y-0.5 ${dm ? 'border-white/[0.05] hover:border-white/15 text-white bg-white/[0.02]' : 'border-black/[0.05] hover:border-black/12 text-[#1C1917] bg-[#FAF6F1]'}`}>
                    <div className="w-12 h-12 rounded-full bg-[#E1306C]/10 flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E1306C]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    </div>
                    <div>
                      <div className="text-[0.92rem] font-semibold">Instagram</div>
                      <div className={`text-[0.78rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>@elaebeoglu</div>
                    </div>
                  </motion.a>
                </motion.div>

                {/* Process Steps */}
                <motion.div variants={fadeUp} custom={2} className={`mt-10 p-8 rounded-2xl border ${dm ? 'border-white/[0.05] bg-white/[0.02]' : 'border-black/[0.05] bg-[#FAF6F1]'}`}>
                  <h3 className={`text-[0.92rem] font-semibold mb-6 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Süreç</h3>
                  <div className="space-y-5">
                    {[
                      { step: '01', text: 'Formu doldur, WhatsApp ile başvur' },
                      { step: '02', text: 'Ücretsiz 15 dk tanışma görüşmesi' },
                      { step: '03', text: 'Hedef belirleme & FMS değerlendirmesi' },
                      { step: '04', text: 'Kişiye özel programın hazır!' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-5">
                        <span className="text-[0.65rem] font-mono text-terracotta w-5">{s.step}</span>
                        <div className={`flex-1 h-[1px] ${dm ? 'bg-white/[0.04]' : 'bg-black/[0.04]'}`} />
                        <span className={`text-[0.85rem] ${dm ? 'text-white/45' : 'text-[#1C1917]/45'}`}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right — Form */}
              <motion.div variants={fadeUp} custom={2}>
                <form onSubmit={handleContact} className={`p-10 md:p-14 rounded-[2rem] border ${dm ? 'border-white/[0.05] bg-white/[0.02]' : 'border-black/[0.05] bg-[#FAF6F1]'}`}>
                  <h3 className={`font-display text-[1.8rem] font-bold tracking-[-0.02em] mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Başvuru Formu</h3>
                  <p className={`text-[0.85rem] mb-10 ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>Tüm alanları doldurunuz.</p>

                  <div className="space-y-6">
                    <div>
                      <label className={`block mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Ad Soyad</label>
                      <input name="name" type="text" required placeholder="Adınız Soyadınız"
                        className={`w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-500 text-[0.92rem] ring-1 focus:ring-2 focus:ring-terracotta ${dm ? 'bg-white/[0.04] ring-white/[0.06] text-white placeholder:text-white/15' : 'bg-white ring-black/[0.06] placeholder:text-[#1C1917]/20'}`} />
                    </div>
                    <div>
                      <label className={`block mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Ana Hedefiniz</label>
                      <select name="goal" required
                        className={`w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-500 text-[0.92rem] ring-1 focus:ring-2 focus:ring-terracotta ${dm ? 'bg-white/[0.04] ring-white/[0.06] text-white' : 'bg-white ring-black/[0.06]'}`}>
                        <option value="">Seçiniz...</option>
                        <option>Kuvvet Artışı</option>
                        <option>Voleybol Performans</option>
                        <option>Genel Fitness & Postür</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Notlar</label>
                      <textarea name="notes" required rows={4} placeholder="Kısaca kendinizden bahsedin..."
                        className={`w-full px-5 py-4 rounded-xl border-none outline-none transition-all duration-500 text-[0.92rem] resize-y ring-1 focus:ring-2 focus:ring-terracotta ${dm ? 'bg-white/[0.04] ring-white/[0.06] text-white placeholder:text-white/15' : 'bg-white ring-black/[0.06] placeholder:text-[#1C1917]/20'}`} />
                    </div>
                  </div>

                  <button type="submit"
                    className="group w-full py-4.5 mt-10 rounded-full bg-terracotta text-white text-[0.92rem] font-semibold border-none cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(194,104,74,0.35)] hover:-translate-y-0.5 relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                      WhatsApp ile Başvur
                    </span>
                    <span className="absolute inset-0 bg-[#a8543a] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left rounded-full" />
                  </button>
                </form>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className={`py-20 border-t ${dm ? 'border-white/[0.04] bg-[#050505]' : 'border-black/[0.04] bg-[#FAF6F1]'}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className={`font-display text-[1.3rem] font-bold tracking-[-0.03em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Ela<span className="text-terracotta">.</span></span>
              <span className={`text-[0.68rem] uppercase tracking-[0.15em] ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>Performance</span>
            </div>
            <p className={`text-[0.75rem] tracking-wide ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>
              &copy; 2026 Tüm hakları saklıdır.
            </p>
            <div className="flex gap-8">
              {[
                { label: 'Instagram', href: 'https://instagram.com/elaebeoglu' },
                { label: 'WhatsApp', href: 'https://wa.me/905362486849' },
              ].map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className={`text-[0.78rem] no-underline transition-all duration-300 hover:text-terracotta ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════ WHATSAPP FLOAT ════════════ */}
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, type: 'spring', stiffness: 200, damping: 20 }}
        href="https://wa.me/905362486849?text=Merhaba,%20programlarınız%20hakkında%20bilgi%20almak%20istiyorum."
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-8 right-8 z-[99] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] no-underline"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
        </svg>
      </motion.a>
    </div>
  )
}
