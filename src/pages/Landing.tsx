import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useStore } from '../stores/useStore'
import { sanitize } from '../lib/constants'
import ScrollToTop from '../components/ScrollToTop'

/* ═══════════════ Animation Variants ═══════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

const letterReveal = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }
  })
}
const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  })
}

/* ═══════════════ Reveal Section Component ═══════════════ */
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  )
}

/* ═══════════════ Smooth Counter (eased) ═══════════════ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    const duration = 1400
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // quartic ease-out
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ═══════════════ Magnetic Button ═══════════════ */
function MagneticButton({ children, className = '', ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const handleLeave = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)' }
  return (
    <a ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} className={`inline-block transition-transform duration-300 ${className}`} {...props}>
      {children}
    </a>
  )
}
/* ═══════════════ 3D Tilt Card ═══════════════ */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [x, y])

  const handleLeave = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`${className}`}>
      {children}
    </motion.div>
  )
}
/* ═══════════════ Animated Text (word by word) ═══════════════ */
function AnimatedHeading({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={className} style={{ perspective: '600px' }}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i} custom={i} variants={letterReveal}
          className="inline-block mr-[0.3em]" style={{ transformOrigin: 'bottom' }}>
          {word}
        </motion.span>
      ))}
    </span>
  )
}

/* ═══════════════ Scroll Progress Bar ═══════════════ */
function ScrollProgress({ darkMode }: { darkMode: boolean }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className={`fixed top-0 left-0 right-0 h-[2px] z-[200] ${darkMode ? 'bg-gradient-to-r from-terracotta via-sage to-coast' : 'bg-gradient-to-r from-terracotta via-sage to-coast'}`}
    />
  )
}
/* ═══════════════ Grain Overlay ═══════════════ */
function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[150] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px'
      }}
    />
  )
}

/* ═══════════════ Testimonial Carousel ═══════════════ */
function TestimonialCarousel({ testimonials, dm }: { testimonials: { text: string; name: string; role: string; metric: string }[]; dm: boolean }) {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timerRef.current)
  }, [testimonials.length])

  const goTo = (i: number) => {
    setActive(i)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setActive(prev => (prev + 1) % testimonials.length), 5000)
  }
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center"
          >
            {/* Quote side */}
            <div className={`p-10 md:p-14 rounded-3xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-white'}`}>
              <div className={`inline-flex px-4 py-1.5 rounded-full text-[0.72rem] font-semibold mb-8 ${dm ? 'bg-sage/20 text-sage' : 'bg-sage/10 text-sage'}`}>
                {testimonials[active].metric}
              </div>
              <p className={`font-display text-[clamp(1.3rem,2.5vw,1.8rem)] leading-[1.5] font-medium mb-10 ${dm ? 'text-white/80' : 'text-[#1C1917]/80'}`}>
                {testimonials[active].text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-sage flex items-center justify-center text-white text-[0.82rem] font-semibold shadow-lg">
                  {testimonials[active].name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className={`text-[0.95rem] font-semibold ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{testimonials[active].name}</div>
                  <div className={`text-[0.72rem] uppercase tracking-[0.12em] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>{testimonials[active].role}</div>
                </div>
              </div>
            </div>
            {/* Visual side - large metric */}
            <div className="flex flex-col items-center justify-center text-center py-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[clamp(4rem,10vw,8rem)] font-display font-bold tracking-tight leading-none ${dm ? 'text-white/10' : 'text-[#1C1917]/[0.06]'}`}
              >
                {testimonials[active].metric}
              </motion.div>
              <div className={`text-[0.75rem] uppercase tracking-[0.2em] mt-4 ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>
                Kanıtlanmış Sonuç
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex gap-2 justify-center mt-10">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-500 ${
              i === active ? 'w-8 bg-terracotta' : `w-1.5 ${dm ? 'bg-white/15' : 'bg-black/10'}`
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
/* ═══════════════ FAQ Item ═══════════════ */
function FaqItem({ question, answer, index, dm }: { question: string; answer: string; index: number; dm: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={fadeUp} custom={index}
      className={`border-b ${dm ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer group transition-colors duration-300 ${dm ? 'text-white' : 'text-[#1C1917]'}`}
      >
        <span className={`font-display text-[1.15rem] font-semibold pr-8 transition-colors duration-300 ${open ? 'text-terracotta' : ''}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            open
              ? 'bg-terracotta/10 text-terracotta'
              : dm ? 'bg-white/5 text-white/30 group-hover:bg-white/10' : 'bg-black/[0.03] text-[#1C1917]/25 group-hover:bg-black/[0.06]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className={`pb-6 text-[0.95rem] leading-[1.8] max-w-[640px] ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ═══════════════ Landing Page ═══════════════ */
export default function Landing() {
  const { darkMode, toggleDarkMode } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name = sanitize((form.elements.namedItem('name') as HTMLInputElement).value)
    const goal = sanitize((form.elements.namedItem('goal') as HTMLSelectElement).value)
    const notes = sanitize((form.elements.namedItem('notes') as HTMLTextAreaElement).value)
    const msg = `Merhaba Ela! Sana sitenden basvuru yapiyorum.\n\n Ad: ${name}\n Hedef: ${goal}\n Not: ${notes}`
    window.open(`https://wa.me/905362486849?text=${encodeURIComponent(msg)}`, '_blank')
    form.reset()
  }
  const dm = darkMode

  const testimonials = [
    { text: 'Sadece antrenman değil, disiplin öğreten bir süreçti. Vücudumdaki değişime inanamıyorum.', name: 'Ayşe K.', role: 'Voleybolcu', metric: '+12kg squat' },
    { text: 'Ela\'nın programlarıyla 3 ayda dikey sıçramam 8 cm arttı. Gerçekten fark yaratan biri.', name: 'Deniz Y.', role: 'Amatör Voleybolcu', metric: '+8cm sıçrama' },
    { text: 'Beslenme planım ve antrenmanlarım o kadar uyumluydu ki, ilk kez sürdürülebilir bir değişim yaşadım.', name: 'Selin B.', role: 'Fitness', metric: '-4kg yağ' },
  ]

  return (
    <div className="font-body overflow-x-hidden">
      <ScrollProgress darkMode={dm} />
      <GrainOverlay />

      {/* ─── Navigation ─── */}
      <AnimatePresence>
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
            scrolled
              ? `backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)] ${dm ? 'bg-[#0a0a0a]/90' : 'bg-white/80'}`
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-5 flex justify-between items-center">
            <a href="#" className={`font-display text-[1.4rem] font-semibold no-underline tracking-[-0.02em] ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Ela Ebeoğlu
            </a>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {[
                { id: 'hakkinda', label: 'Hakkında' },
                { id: 'programlar', label: 'Programlar' },
                { id: 'sonuclar', label: 'Sonuçlar' },
                { id: 'fiyatlar', label: 'Fiyatlar' },
                { id: 'iletisim', label: 'İletişim' },
              ].map(item => (
                <a key={item.id} href={`#${item.id}`}
                  className={`no-underline text-[0.82rem] tracking-[0.04em] uppercase transition-all duration-300 hover:opacity-100 ${dm ? 'text-white/50 hover:text-white' : 'text-[#1C1917]/40 hover:text-[#1C1917]'}`}>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Fullscreen Nav */}
            <AnimatePresence>
              {menuOpen && (
                <motion.nav
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`md:hidden fixed inset-0 flex flex-col items-center justify-center gap-8 z-[100] backdrop-blur-2xl ${dm ? 'bg-[#050505]/95' : 'bg-[#FAF6F1]/95'}`}>
                  {[
                    { id: 'hakkinda', label: 'Hakkında' },
                    { id: 'programlar', label: 'Programlar' },
                    { id: 'sonuclar', label: 'Sonuçlar' },
                    { id: 'iletisim', label: 'İletişim' },
                  ].map((item, i) => (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`no-underline text-2xl font-display font-semibold tracking-[-0.01em] transition-colors duration-300 ${dm ? 'text-white/70 hover:text-white' : 'text-[#1C1917]/60 hover:text-[#1C1917]'}`}>
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to="/admin" onClick={() => setMenuOpen(false)}
                      className={`mt-4 inline-flex items-center px-6 py-3 rounded-full text-[0.82rem] tracking-[0.03em] no-underline transition-all duration-300 ${dm ? 'text-white/60 border border-white/10' : 'text-[#1C1917]/50 border border-black/8'}`}>
                      Koç Paneli
                    </Link>
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>

            <div className="flex gap-4 items-center">
              <button onClick={toggleDarkMode}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${dm ? 'bg-white/10 text-white' : 'bg-black/5 text-[#1C1917]'}`}
                aria-label="Tema değiştir">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {dm
                    ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    : <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>
                  }
                </svg>
              </button>
              <Link to="/admin" className={`hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-[0.78rem] tracking-[0.03em] no-underline transition-all duration-300 ${dm ? 'text-white/60 hover:text-white border border-white/10 hover:border-white/30' : 'text-[#1C1917]/50 hover:text-[#1C1917] border border-black/8 hover:border-black/20'}`}>
                Koç Paneli
              </Link>              <button className="md:hidden bg-transparent border-none cursor-pointer p-2 z-[101]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
                <div className="space-y-[5px]">
                  <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-300 ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                  <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-300 ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-[1.5px] rounded-full transition-all duration-300 ${dm ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>

      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 -z-10">
          <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]' : 'bg-gradient-to-b from-[#FAF6F1] via-[#FAF6F1]/40 to-[#FAF6F1]'}`} />
          <img src="/ela_hero.png" alt="" className="w-full h-full object-cover object-center opacity-30" />
        </motion.div>

        {/* Ambient glow orbs */}
        <div className="absolute inset-0 -z-[5] overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #C2684A 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, #7A9E82 0%, transparent 70%)' }}
          />        </div>

        <div className="max-w-[1400px] mx-auto px-8 md:px-12 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUp} custom={0}
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.15em] mb-10 ${dm ? 'bg-white/5 text-white/60 border border-white/10' : 'bg-black/[0.03] text-[#1C1917]/50 border border-black/[0.06]'}`}>
                <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-pulse" />
                Nisan 2026 — Sınırlı Kontenjan
              </motion.div>

              <motion.h1 variants={staggerContainer} initial="hidden" animate="visible"
                className={`font-display text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                <AnimatedHeading text="Güçlü ol." />
                <br />
                <span className="bg-gradient-to-r from-terracotta via-[#d4845e] to-terracotta bg-clip-text text-transparent">
                  <AnimatedHeading text="Kendine güven." />
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={4}
                className={`text-[1.1rem] leading-[1.8] max-w-[520px] mb-12 ${dm ? 'text-white/45' : 'text-[#1C1917]/45'}`}>
                Profesyonel sporcu disipliniyle, sana özel antrenman ve beslenme stratejileri. Performansını artır, vücudunu en iyi haline taşı.
              </motion.p>

              <motion.div variants={fadeUp} custom={5} className="flex gap-4 flex-wrap">
                <MagneticButton href="#iletisim"
                  className="group px-8 py-4 bg-terracotta text-white rounded-full text-[0.88rem] font-medium no-underline overflow-hidden relative">
                  <span className="relative z-10 flex items-center gap-2">
                    Ücretsiz Görüşme                    <motion.svg
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </span>
                  <span className="absolute inset-0 bg-[#a8543a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </MagneticButton>
                <MagneticButton href="#programlar"
                  className={`px-8 py-4 rounded-full text-[0.88rem] font-medium no-underline border ${dm ? 'border-white/15 text-white/70 hover:text-white hover:border-white/30' : 'border-black/10 text-[#1C1917]/60 hover:text-[#1C1917] hover:border-black/25'}`}>
                  Programları İncele
                </MagneticButton>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4]">
                <img src="/voleybol_1.png" alt="Ela Ebeoğlu" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-t from-[#0a0a0a]/50 via-transparent to-transparent' : 'bg-gradient-to-t from-[#FAF6F1]/30 via-transparent to-transparent'}`} />
                {/* Shine sweep on hero image */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                />
              </div>
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className={`absolute -left-8 bottom-[20%] px-6 py-4 rounded-2xl shadow-float backdrop-blur-xl ${dm ? 'bg-white/10 border border-white/10' : 'bg-white/90 border border-black/5'}`}
              >
                <div className="text-3xl font-semibold text-terracotta"><Counter target={20} suffix="+" /></div>
                <div className={`text-[0.7rem] uppercase tracking-[0.12em] mt-1 ${dm ? 'text-white/50' : 'text-[#1C1917]/40'}`}>Mutlu Danışan</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className={`absolute -right-6 top-[15%] px-6 py-4 rounded-2xl shadow-float backdrop-blur-xl ${dm ? 'bg-white/10 border border-white/10' : 'bg-white/90 border border-black/5'}`}
              >
                <div className="text-3xl font-semibold text-sage"><Counter target={5} suffix=".0" /></div>
                <div className={`text-[0.7rem] uppercase tracking-[0.12em] mt-1 ${dm ? 'text-white/50' : 'text-[#1C1917]/40'}`}>Değerlendirme</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >          <span className={`text-[0.6rem] uppercase tracking-[0.25em] ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>Keşfet</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5 ${dm ? 'border-white/20' : 'border-black/15'}`}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-1 h-1 rounded-full ${dm ? 'bg-white/60' : 'bg-black/40'}`}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Hakkında / Philosophy ─── */}
      <section id="hakkinda" className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
                  Felsefe
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1}
                  className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                  İlham vermek değil,
                  <br />karar verdirmek.
                </motion.h2>
                <motion.p variants={fadeUp} custom={2}
                  className={`text-[1.05rem] leading-[1.85] max-w-[480px] ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>
                  Voleybol sahasında edindiğim disiplinle, sadece kararlı ve disiplinli danışanlarla çalışıyorum. Her program bilimsel temellere dayanır, her adım ölçülür.
                </motion.p>
              </div>
              <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-6">
                {[
                  { num: '01', title: 'Sporcu Disiplini', desc: 'Profesyonel voleybol tecrübesiyle kanıtlanmış antrenman metodolojisi.' },
                  { num: '02', title: 'Kadın Odaklı Güçlenme', desc: 'Bedenini tanımanı ve güçlü bir temele sahip olmanı hedefliyorum.' },
                  { num: '03', title: 'Seçici Premium Takip', desc: 'Kaliteyi korumak için sınırlı kontenjanla, birebir odaklı çalışma.' },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} custom={i}>
                    <TiltCard className={`group p-8 rounded-2xl border transition-all duration-500 cursor-default ${dm ? 'border-white/5 hover:border-white/15 bg-white/[0.02]' : 'border-black/[0.04] hover:border-black/10 bg-black/[0.01]'}`}>
                      <div className="flex gap-6 items-start">
                        <span className={`text-[2rem] font-display font-bold leading-none transition-colors duration-500 group-hover:text-terracotta ${dm ? 'text-white/10' : 'text-[#1C1917]/8'}`}>{item.num}</span>
                        <div>
                          <h3 className={`font-display text-xl font-semibold mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{item.title}</h3>
                          <p className={`text-[0.92rem] leading-relaxed ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>{item.desc}</p>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Stats Band ─── */}
      <section className={`py-20 border-y ${dm ? 'border-white/5 bg-[#0a0a0a]' : 'border-black/5 bg-[#FAF6F1]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: 20, suffix: '+', label: 'Aktif Danışan' },
              { value: 8, suffix: '+', label: 'Yıl Voleybol' },              { value: 96, suffix: '', label: 'Egzersiz Kütüphanesi' },
              { value: 100, suffix: '%', label: 'Memnuniyet' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group">
                <div className={`text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold tracking-tight font-display ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className={`text-[0.72rem] uppercase tracking-[0.15em] mt-2 ${dm ? 'text-white/30' : 'text-[#1C1917]/35'}`}>{s.label}</div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-8 h-[2px] bg-terracotta/40 mx-auto mt-4 origin-left"
                />
              </motion.div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── Rakamlar / Stats ─── */}
      <section className={`py-20 md:py-24 border-y ${dm ? 'bg-[#050505] border-white/[0.04]' : 'bg-white border-black/[0.04]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: '150+', label: 'Mutlu Danışan', icon: '🏆' },
                { value: '12+', label: 'Yıl Deneyim', icon: '⏱️' },
                { value: '3000+', label: 'Antrenman Programı', icon: '📋' },
                { value: '%96', label: 'Memnuniyet Oranı', icon: '⭐' },
              ].map((stat, i) => (
                <motion.div key={i} variants={scaleIn} className="text-center group">
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <div className={`font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight leading-none mb-2 transition-colors duration-300 group-hover:text-terracotta ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-[0.82rem] ${dm ? 'text-white/35' : 'text-[#1C1917]/35'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Programlar ─── */}
      <section id="programlar" className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
              Programlar
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-20 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Ertesi güne bırakmayacağın planlar.
            </motion.h2>
          </RevealSection>
          <RevealSection className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Online Koçluk', desc: 'Sana özel antrenman programı ve temel beslenme takibi ile hedefe yönelik ilerleme.', price: '2.500', features: ['Kişiye özel program', 'Haftalık check-in', 'WhatsApp destek'] },
              { name: 'Voleybol Performance', desc: 'Sıçrama, atletizm ve sahaya özel performans modülü ile rakiplerinden ayrıl.', price: '3.000', features: ['Plyometrik antrenman', 'Sakatlık önleme', 'Video analiz'], featured: true },
              { name: 'Premium Büyüme', desc: 'TDEE destekli tam beslenme, günlük kontrol ve birebir koçluk ile maksimum sonuç.', price: '5.500', features: ['Günlük TDEE takibi', '1:1 görüşmeler', 'FMS değerlendirme'] },
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <TiltCard
                  className={`group relative flex flex-col p-10 rounded-2xl border transition-all duration-500 h-full overflow-hidden ${
                    p.featured
                      ? `border-terracotta/30 ${dm ? 'bg-terracotta/[0.04]' : 'bg-terracotta/[0.02]'}`
                      : `${dm ? 'border-white/5 hover:border-white/15 bg-white/[0.02]' : 'border-black/[0.04] hover:border-black/10 bg-black/[0.01]'}`
                  }`}
                >
                  {/* Shine sweep effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-20deg] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                    </div>
                  </div>

                  {p.featured && (
                    <div className="absolute -top-3 left-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta text-white text-[0.65rem] font-medium uppercase tracking-[0.12em]">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      2 Yer Kaldı
                    </div>
                  )}
                  <h3 className={`font-display text-2xl font-semibold mb-3 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{p.name}</h3>
                  <p className={`text-[0.9rem] leading-relaxed flex-1 mb-8 ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>{p.desc}</p>

                  <div className="mb-8 space-y-3">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-terracotta" />
                        <span className={`text-[0.85rem] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className={`text-[2.5rem] font-semibold tracking-tight mb-6 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                      ₺{p.price}<span className={`text-base font-normal ml-1 ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>/ay</span>
                    </div>
                    <a href="#iletisim"
                      className={`block text-center py-4 rounded-full text-[0.88rem] font-medium no-underline transition-all duration-500 ${
                        p.featured
                          ? 'bg-terracotta text-white hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)]'
                          : `border ${dm ? 'border-white/10 text-white/70 hover:border-white/30 hover:text-white' : 'border-black/10 text-[#1C1917]/60 hover:border-black/25 hover:text-[#1C1917]'}`
                      }`}>
                      {p.featured ? 'Hemen Başvur' : 'Başvur'}
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </RevealSection>
          {/* Program Comparison Table */}
          <RevealSection className="mt-16">
            <motion.div variants={fadeUp}
              className={`overflow-x-auto rounded-2xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-black/[0.01]'}`}>
              <table className="w-full min-w-[480px] text-left text-[0.85rem]">
                <thead>
                  <tr className={`border-b ${dm ? 'border-white/5' : 'border-black/[0.04]'}`}>
                    <th className={`p-3 md:p-5 font-medium text-[0.65rem] md:text-[0.75rem] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Özellik</th>
                    <th className={`p-3 md:p-5 font-medium text-[0.65rem] md:text-[0.75rem] ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Online Koçluk</th>
                    <th className={`p-3 md:p-5 font-medium text-[0.65rem] md:text-[0.75rem] text-terracotta`}>Voleybol Performance</th>
                    <th className={`p-3 md:p-5 font-medium text-[0.65rem] md:text-[0.75rem] ${dm ? 'text-white/60' : 'text-[#1C1917]/60'}`}>Premium Büyüme</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Kişiye Özel Program', v: ['check', 'check', 'check'] },
                    { feature: 'Haftalık Check-in', v: ['check', 'check', 'check'] },
                    { feature: 'WhatsApp Destek', v: ['check', 'check', 'check'] },
                    { feature: 'Plyometrik Antrenman', v: ['no', 'check', 'check'] },
                    { feature: 'Video Analiz', v: ['no', 'check', 'check'] },
                    { feature: 'FMS Değerlendirme', v: ['no', 'no', 'check'] },
                    { feature: 'Günlük TDEE Takibi', v: ['no', 'no', 'check'] },
                    { feature: '1:1 Görüşmeler', v: ['no', 'no', 'check'] },
                    { feature: 'Fiyat', v: ['₺2.500/ay', '₺3.000/ay', '₺5.500/ay'] },
                  ].map((row, i) => (                    <tr key={i} className={`border-b last:border-0 ${dm ? 'border-white/[0.03]' : 'border-black/[0.03]'}`}>
                      <td className={`p-3 md:p-4 text-[0.75rem] md:text-[0.85rem] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>{row.feature}</td>
                      {row.v.map((v, j) => (
                        <td key={j} className={`p-3 md:p-4 text-[0.75rem] md:text-[0.85rem] ${j === 1 ? (dm ? 'bg-terracotta/[0.03]' : 'bg-terracotta/[0.02]') : ''}`}>
                          {v === 'check' ? <span className="text-sage text-lg">&#10003;</span>
                            : v === 'no' ? <span className={`${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>—</span>
                            : <span className="font-semibold text-terracotta">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Sonuçlar / Testimonials ─── */}
      <section id="sonuclar" className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
              Sonuçlar
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-20 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Onların hikayesi, senin motivasyonun.
            </motion.h2>
          </RevealSection>
          <RevealSection>
            <motion.div variants={fadeUp}>
              <TestimonialCarousel testimonials={testimonials} dm={dm} />
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Gallery / Instagram — Bento Grid ─── */}
      <section className={`py-24 md:py-32 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
              Galeri
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-12 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Sahadan stüdyoya.
            </motion.h2>
          </RevealSection>

          <RevealSection>
            {/* Bento Grid - 7 photos */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
              {[
                { src: '/ela_hero.png', span: 'md:col-span-2 md:row-span-2', alt: 'Ela Ebeoğlu Portrait' },
                { src: '/voleybol_1.png', span: '', alt: 'Voleybol Aksiyon' },
                { src: '/ela_voleybol.png', span: '', alt: 'Voleybol Sahası' },
                { src: '/voleybol_2.png', span: '', alt: 'Gece Antrenmanı' },
                { src: '/ela_training.png', span: 'md:col-span-1 md:row-span-2', alt: 'Antrenman' },
                { src: '/voleybol_3.png', span: '', alt: 'Takım Fotoğrafı' },
                { src: '/voleybol_4.png', span: '', alt: 'Lifestyle' },              ].map((img, i) => (
                <motion.div key={i} variants={scaleIn}
                  className={`rounded-xl overflow-hidden relative group cursor-pointer ${img.span}`}>
                  <img src={img.src} alt={img.alt}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                  <div className={`absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-end p-5 ${dm ? 'bg-gradient-to-t from-black/60 via-transparent' : 'bg-gradient-to-t from-black/40 via-transparent'}`}>
                    <div>
                      <span className="text-white text-[0.82rem] font-medium">{img.alt}</span>
                      <span className="block text-white/60 text-[0.7rem] mt-0.5">@elaebeoglu</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 text-center">
              <a href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-[0.82rem] no-underline transition-all duration-300 border ${dm ? 'border-white/10 text-white/50 hover:text-white hover:border-white/25' : 'border-black/8 text-[#1C1917]/40 hover:text-[#1C1917] hover:border-black/20'}`}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                Instagram'da Takip Et
              </a>
            </motion.div>
          </RevealSection>
        </div>
      </section>
      {/* ─── SSS / FAQ ─── */}
      <section className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
              Sıkça Sorulan Sorular
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-16 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Merak ettiklerin.
            </motion.h2>
          </RevealSection>

          <RevealSection className="max-w-[800px]">
            {[
              { q: 'Programa nasıl başlarım?', a: 'Başvuru formunu doldurduktan sonra WhatsApp üzerinden iletişime geçiyorum. Ücretsiz 15 dakikalık tanışma görüşmesinde hedeflerini konuşup, sana uygun programı belirliyoruz.' },
              { q: 'Online antrenman nasıl işliyor?', a: 'Sana özel hazırladığım program, video açıklamalı egzersizlerle uygulamanda gönderiliyor. Haftalık check-in\'lerle formu kontrol edip, programı gerektiğinde güncelliyorum.' },
              { q: 'Beslenme planı dahil mi?', a: 'Online Koçluk paketinde temel beslenme takibi var. Premium Büyüme paketinde ise günlük TDEE hesaplı tam beslenme planı, makro takibi ve birebir beslenme danışmanlığı dahil.' },
              { q: 'Voleybol oynamıyorum, katılabilir miyim?', a: 'Elbette! Voleybol Performance paketi sahaya özel olsa da, Online Koçluk ve Premium Büyüme paketleri her seviye için uygun. Kuvvet, postür ve genel fitness hedeflerine yönelik çalışıyoruz.' },
              { q: 'Sonuçları ne zaman görürüm?', a: 'Disiplinli takipte ilk 4 haftada gözle görülür değişim başlıyor. 3 aylık süreçte ciddi dönüşümler yaşanıyor. Her danışanın süreci farklı, ama tutarlılık her zaman sonuç verir.' },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} dm={dm} />
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── Fiyatlandırma / Pricing ─── */}
      <section id="fiyatlar" className={`py-32 md:py-40 ${dm ? 'bg-[#050505]' : 'bg-white'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className={`text-[0.7rem] uppercase tracking-[0.3em] mb-4 font-medium ${dm ? 'text-terracotta/60' : 'text-terracotta'}`}>Paketler</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className={`font-display text-[clamp(2.2rem,4vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.1] mb-6 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Sana Özel Plan Seç
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className={`text-[0.95rem] max-w-[500px] leading-relaxed mb-16 ${dm ? 'text-white/35' : 'text-[#1C1917]/40'}`}>
              Her seviyeye uygun, bilimsel temelli koçluk paketleri. İlk görüşme ücretsiz.
            </motion.p>
          </RevealSection>

          <RevealSection className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Online Koçluk',
                price: '2.500',
                period: '/ay',
                desc: 'Kişiye özel antrenman programı ve temel beslenme takibi',
                features: ['Kişiye özel antrenman programı', 'Haftalık program güncelleme', 'WhatsApp destek', 'Form kontrol videoları', 'Temel beslenme rehberi'],
                color: 'sage',
                popular: false,
              },
              {
                name: 'Voleybol Performance',
                price: '3.000',
                period: '/ay',
                desc: 'Sıçrama, atletizm ve sahaya özel performans antrenmanı',
                features: ['Online Koçluk dahil', 'Sıçrama & patlayıcılık protokolü', 'Pozisyona özel antrenman', 'Video analiz & geri bildirim', 'Sakatlık önleme programı', 'Haftalık 1:1 görüntülü görüşme'],
                color: 'terracotta',
                popular: true,
              },
              {
                name: 'Premium Büyüme',
                price: '5.500',
                period: '/ay',
                desc: 'TDEE destekli tam beslenme planı ile bütüncül koçluk',
                features: ['Voleybol Performance dahil', 'TDEE bazlı beslenme planı', 'Günlük makro takibi', 'Danışan portalı erişimi', 'Supplement rehberliği', '7/24 öncelikli destek', 'Aylık vücut analizi'],
                color: 'coast',
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div key={plan.name} variants={scaleIn} custom={i}
                className={`relative p-8 rounded-3xl border transition-all duration-500 group hover:shadow-2xl ${
                  plan.popular
                    ? (dm ? 'bg-terracotta/[0.06] border-terracotta/20 hover:border-terracotta/40' : 'bg-terracotta/[0.02] border-terracotta/15 hover:border-terracotta/30 shadow-lg')
                    : (dm ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]' : 'bg-[#FAFAF8] border-black/[0.04] hover:border-black/[0.08]')
                }`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-terracotta text-white text-[0.65rem] font-semibold uppercase tracking-[0.15em]">
                    En Popüler
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`font-display text-xl font-semibold mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{plan.name}</h3>
                  <p className={`text-[0.82rem] leading-relaxed ${dm ? 'text-white/35' : 'text-[#1C1917]/40'}`}>{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-[0.82rem] ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>₺</span>
                  <span className={`font-display text-4xl font-bold tracking-[-0.03em] ${
                    plan.color === 'terracotta' ? 'text-terracotta' : plan.color === 'sage' ? 'text-sage' : 'text-coast'
                  }`}>{plan.price}</span>
                  <span className={`text-[0.82rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-3 text-[0.82rem] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.color === 'terracotta' ? 'text-terracotta' : plan.color === 'sage' ? 'text-sage' : 'text-coast'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#iletisim"
                  className={`block w-full py-4 rounded-full text-center text-[0.88rem] font-medium no-underline transition-all duration-300 ${
                    plan.popular
                      ? 'bg-terracotta text-white hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)]'
                      : (dm ? 'bg-white/[0.06] text-white/70 hover:bg-white/[0.1]' : 'bg-[#1C1917] text-white hover:shadow-lg')
                  }`}>
                  Başla
                </a>
              </motion.div>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── SSS / FAQ ─── */}
      <section className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-[#F7F5F2]'}`}>
        <div className="max-w-[800px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className={`text-[0.7rem] uppercase tracking-[0.3em] mb-4 font-medium text-center ${dm ? 'text-sage/60' : 'text-sage'}`}>SSS</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className={`font-display text-[clamp(2.2rem,4vw,3.5rem)] font-semibold tracking-[-0.03em] leading-[1.1] mb-16 text-center ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Sıkça Sorulan Sorular
            </motion.h2>
          </RevealSection>

          <RevealSection className="space-y-3">
            {[
              { q: 'Online koçluk nasıl işliyor?', a: 'Detaylı bir değerlendirme formunun ardından sana özel antrenman ve beslenme programı hazırlanır. WhatsApp üzerinden haftalık takip ve form kontrol videoları ile süreç yönetilir.' },
              { q: 'Programa ne zaman başlayabilirim?', a: 'Ücretsiz ilk görüşmeden sonra aynı hafta içinde programın hazır olur. Ödeme sonrası 24-48 saat içinde kişiye özel planın eline ulaşır.' },
              { q: 'Spor geçmişim yok, katılabilir miyim?', a: 'Elbette! Programlar her seviyeye göre özelleştirilir. Başlangıç seviyesinden ileri düzeye kadar herkes için uygun bir plan oluşturulur.' },
              { q: 'Beslenme planı dahil mi?', a: 'Online Koçluk paketinde temel beslenme rehberi verilir. Premium Büyüme paketinde ise TDEE bazlı detaylı makro hesaplı beslenme planı dahildir.' },
              { q: 'Sakatlığım var, yine de çalışabilir miyim?', a: 'Değerlendirme formunda sakatlık geçmişin detaylı olarak alınır. Gerekirse fizyoterapist ile koordineli şekilde güvenli bir program hazırlanır.' },
              { q: 'Paket süresinin sonunda ne olur?', a: 'Paketler aylık olarak yenilenir. İstediğin zaman paketini yükseltebilir, düşürebilir veya durdurabilirsin. Taahhüt yoktur.' },
            ].map((faq, i) => (
              <motion.details key={i} variants={fadeUp} custom={i}
                className={`group rounded-2xl border transition-all duration-300 ${dm ? 'border-white/[0.06] hover:border-white/[0.1]' : 'border-black/[0.04] hover:border-black/[0.08]'}`}>
                <summary className={`flex items-center justify-between p-6 cursor-pointer list-none font-medium text-[0.95rem] select-none ${dm ? 'text-white/70' : 'text-[#1C1917]/70'}`}>
                  {faq.q}
                  <svg className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-open:rotate-45 ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </summary>
                <div className={`px-6 pb-6 text-[0.88rem] leading-relaxed ${dm ? 'text-white/35' : 'text-[#1C1917]/40'}`}>
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </RevealSection>
        </div>
      </section>

      {/* ─── Fiyatlar / Pricing ─── */}
      <section id="fiyatlar" className={`py-32 md:py-40 ${dm ? 'bg-[#050505]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
              Fiyatlar
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[700px] mb-20 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Yatırımın, kendin ol.
            </motion.h2>
          </RevealSection>

          <RevealSection>
            <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Online Koçluk', price: '2.500', color: 'sage', features: ['Kişisel antrenman programı', 'Haftalık program güncellemesi', 'WhatsApp destek', 'Form analizi (video)'] },
                { name: 'Voleybol Performans', price: '3.000', color: 'terracotta', popular: true, features: ['Pozisyona özel antrenman', 'Patlayıcılık & çeviklik', 'Sakatlık önleme protokolü', 'Beslenme rehberi', 'Haftalık video analiz'] },
                { name: 'Premium Büyüme', price: '5.500', color: 'coast', features: ['Tüm Voleybol Performans özellikleri', 'Birebir online görüşme (haftalık)', 'Detaylı beslenme planı', 'Zihinsel performans koçluğu', 'Öncelikli WhatsApp destek', '7/24 soru-cevap'] },
              ].map((plan, i) => (
                <motion.div key={i} variants={scaleIn}
                  className={`relative rounded-2xl border p-8 transition-all duration-500 hover:scale-[1.02] ${
                    plan.popular
                      ? dm ? 'bg-terracotta/5 border-terracotta/20' : 'bg-terracotta/[0.03] border-terracotta/15'
                      : dm ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.06]'
                  }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-terracotta text-white text-[0.7rem] font-medium rounded-full">
                      En Popüler
                    </div>
                  )}
                  <h3 className={`font-display text-xl font-semibold mb-2 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-3xl font-display font-bold text-${plan.color}`}>₺{plan.price}</span>
                    <span className={`text-[0.8rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>/ay</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className={`flex items-start gap-2.5 text-[0.85rem] leading-relaxed ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>
                        <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 text-${plan.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#iletisim" className={`block text-center py-3.5 rounded-full text-[0.85rem] font-medium no-underline transition-all duration-300 ${
                    plan.popular
                      ? 'bg-terracotta text-white hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)]'
                      : dm ? 'border border-white/10 text-white/60 hover:text-white hover:border-white/25' : 'border border-black/10 text-[#1C1917]/50 hover:text-[#1C1917] hover:border-black/20'
                  }`}>
                    Başla
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── SSS / FAQ ─── */}
      <section className={`py-24 md:py-32 ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="max-w-[800px] mx-auto px-8 md:px-12">
          <RevealSection>
            <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6 text-center">
              Sık Sorulan Sorular
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-center mb-16 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Merak ettiklerin
            </motion.h2>
          </RevealSection>

          <RevealSection>
            <motion.div variants={fadeUp} className="space-y-3">
              {[
                { q: 'Online koçluk nasıl işliyor?', a: 'Hedeflerine ve seviyene göre kişisel program hazırlıyorum. Haftalık güncellemeler, form kontrolleri ve WhatsApp üzerinden sürekli iletişimle ilerleyişini takip ediyoruz.' },
                { q: 'Programa ne zaman başlayabilirim?', a: 'Başvurunu aldıktan sonra 24-48 saat içinde seninle iletişime geçiyorum. İlk hafta içinde programın hazır oluyor.' },
                { q: 'Spor geçmişim yok, katılabilir miyim?', a: 'Kesinlikle! Programlar tamamen kişisel hazırlanıyor. Sıfırdan başlayanlar için özel başlangıç protokolüm var.' },
                { q: 'Beslenme planı dahil mi?', a: 'Voleybol Performans ve Premium paketlerde beslenme rehberi/planı dahildir. Online Koçluk paketinde temel beslenme önerileri sunuyorum.' },
                { q: 'Sakatlığım var, yine de çalışabilir miyim?', a: 'Doktor onayı aldıktan sonra sakatlığına uygun modifiye program hazırlıyorum. Rehabilitasyon sonrası spora dönüş programları da uzmanlık alanım.' },
                { q: 'Paket süresinin sonunda ne olur?', a: 'Minimum 3 ay taahhüt öneriyorum. Süre sonunda devam, paket değişikliği veya bağımsız devam için geçiş programı seçeneklerin var.' },
              ].map((item, i) => (
                <motion.details key={i} variants={scaleIn}
                  className={`group rounded-xl border overflow-hidden transition-all duration-300 ${
                    dm ? 'border-white/[0.06] hover:border-white/10' : 'border-black/[0.06] hover:border-black/10'
                  }`}>
                  <summary className={`flex items-center justify-between px-6 py-4 cursor-pointer list-none text-[0.92rem] font-medium select-none ${
                    dm ? 'text-white/70 hover:text-white' : 'text-[#1C1917]/70 hover:text-[#1C1917]'
                  }`}>
                    {item.q}
                    <svg className="w-4 h-4 flex-shrink-0 ml-4 transition-transform duration-300 group-open:rotate-45 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </summary>
                  <div className={`px-6 pb-5 text-[0.85rem] leading-[1.8] ${dm ? 'text-white/40' : 'text-[#1C1917]/45'}`}>
                    {item.a}
                  </div>
                </motion.details>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── İletişim / Contact ─── */}
      <section id="iletisim" className={`py-32 md:py-40 ${dm ? 'bg-[#0a0a0a]' : 'bg-[#FAF6F1]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection>
            <div className="grid lg:grid-cols-2 gap-20">
              <div>
                <motion.p variants={fadeUp} className="text-[0.75rem] uppercase tracking-[0.2em] font-medium text-terracotta mb-6">
                  İletişim
                </motion.p>
                <motion.h2 variants={fadeUp} custom={1}
                  className={`font-display text-[clamp(2.2rem,4vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.02em] mb-8 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
                  Başvuru formu
                </motion.h2>                <motion.p variants={fadeUp} custom={2}
                  className={`text-[1rem] leading-[1.8] max-w-[460px] mb-12 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>
                  Sınırlı kontenjan nedeniyle başvuruları değerlendirerek alıyorum. Formu doldurduktan sonra WhatsApp üzerinden iletişime geçeceğim.
                </motion.p>

                <motion.form variants={fadeUp} custom={3} onSubmit={handleContact} className="space-y-5">
                  <div className="group">
                    <label className={`block mb-2 text-[0.78rem] font-medium tracking-wide transition-colors duration-300 group-focus-within:text-terracotta ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>Ad Soyad</label>
                    <input name="name" type="text" required placeholder="Adınız Soyadınız"
                      className={`w-full p-4 rounded-xl border outline-none transition-all duration-300 text-[0.92rem] focus:border-terracotta focus:shadow-[0_0_0_3px_rgba(194,104,74,0.1)] ${dm ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/20' : 'bg-black/[0.02] border-black/[0.06] placeholder:text-[#1C1917]/25'}`} />
                  </div>                  <div className="group">
                    <label className={`block mb-2 text-[0.78rem] font-medium tracking-wide transition-colors duration-300 group-focus-within:text-terracotta ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>Ana Hedefiniz</label>
                    <select name="goal" required
                      className={`w-full p-4 rounded-xl border outline-none transition-all duration-300 text-[0.92rem] focus:border-terracotta focus:shadow-[0_0_0_3px_rgba(194,104,74,0.1)] ${dm ? 'bg-white/[0.03] border-white/10 text-white' : 'bg-black/[0.02] border-black/[0.06]'}`}>
                      <option value="">Seçiniz...</option>
                      <option>Kuvvet Artışı</option>
                      <option>Voleybol Performans</option>
                      <option>Genel Fitness & Postür</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className={`block mb-2 text-[0.78rem] font-medium tracking-wide transition-colors duration-300 group-focus-within:text-terracotta ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>Spor Geçmişi & Notlar</label>
                    <textarea name="notes" required rows={4} placeholder="Kısaca kendinizden bahsedin..."
                      className={`w-full p-4 rounded-xl border outline-none transition-all duration-300 text-[0.92rem] resize-y focus:border-terracotta focus:shadow-[0_0_0_3px_rgba(194,104,74,0.1)] ${dm ? 'bg-white/[0.03] border-white/10 text-white placeholder:text-white/20' : 'bg-black/[0.02] border-black/[0.06] placeholder:text-[#1C1917]/25'}`} />
                  </div>                  <button type="submit"
                    className="group w-full py-4 rounded-full bg-terracotta text-white text-[0.92rem] font-medium border-none cursor-pointer transition-all duration-300 hover:shadow-[0_15px_30px_rgba(194,104,74,0.25)] relative overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      WhatsApp ile Başvur
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                    </span>
                    <span className="absolute inset-0 bg-[#a8543a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </button>
                </motion.form>
              </div>
              <motion.div variants={fadeUp} custom={2} className="flex flex-col gap-8">
                <div className={`p-10 rounded-2xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-white'}`}>
                  <h3 className={`font-display text-2xl font-semibold mb-3 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Hızlı İletişim</h3>
                  <p className={`text-[0.9rem] mb-6 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Doğrudan ulaşmak için:</p>
                  <div className="space-y-4">
                    <a href="https://wa.me/905362486849" target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-4 rounded-xl border no-underline transition-all duration-300 group ${dm ? 'border-white/5 hover:border-[#25D366]/30 text-white' : 'border-black/[0.04] hover:border-[#25D366]/30 text-[#1C1917]'}`}>
                      <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors duration-300">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                      </div>
                      <div>
                        <div className="text-[0.88rem] font-medium">WhatsApp</div>
                        <div className={`text-[0.75rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>+90 536 248 6849</div>
                      </div>
                    </a>                    <a href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-4 p-4 rounded-xl border no-underline transition-all duration-300 group ${dm ? 'border-white/5 hover:border-[#E1306C]/30 text-white' : 'border-black/[0.04] hover:border-[#E1306C]/30 text-[#1C1917]'}`}>
                      <div className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center group-hover:bg-[#E1306C]/20 transition-colors duration-300">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#E1306C]"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                      </div>
                      <div>
                        <div className="text-[0.88rem] font-medium">Instagram</div>
                        <div className={`text-[0.75rem] ${dm ? 'text-white/30' : 'text-[#1C1917]/30'}`}>@elaebeoglu</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className={`p-10 rounded-2xl border ${dm ? 'border-white/5 bg-white/[0.02]' : 'border-black/[0.04] bg-white'}`}>
                  <h3 className={`font-display text-xl font-semibold mb-4 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Süreç Nasıl İşler?</h3>
                  <div className="space-y-5">
                    {[
                      { step: '01', text: 'Formu doldur, WhatsApp ile başvur' },
                      { step: '02', text: 'Ücretsiz 15 dk tanışma görüşmesi' },
                      { step: '03', text: 'Hedef belirleme & FMS değerlendirmesi' },
                      { step: '04', text: 'Kişiye özel programın hazır!' },
                    ].map((s, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-4 group"
                      >
                        <span className="text-[0.7rem] font-bold w-6 mt-0.5 text-terracotta group-hover:scale-110 transition-transform duration-300">{s.step}</span>
                        <span className={`text-[0.88rem] ${dm ? 'text-white/50' : 'text-[#1C1917]/50'}`}>{s.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </RevealSection>
        </div>
      </section>
      {/* ─── CTA Banner ─── */}
      <section className={`py-24 md:py-32 relative overflow-hidden ${dm ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #C2684A 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <RevealSection className="text-center">
            <motion.div variants={fadeUp}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.15em] mb-8 mx-auto ${dm ? 'bg-terracotta/10 text-terracotta/80 border border-terracotta/15' : 'bg-terracotta/[0.06] text-terracotta border border-terracotta/10'}`}>
              <span className="w-1.5 h-1.5 bg-terracotta rounded-full animate-pulse" />
              Sınırlı Kontenjan
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1}
              className={`font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] max-w-[800px] mx-auto mb-6 ${dm ? 'text-white' : 'text-[#1C1917]'}`}>
              Değişim için{' '}
              <span className="bg-gradient-to-r from-terracotta via-[#d4845e] to-sage bg-clip-text text-transparent">
                bugün
              </span>{' '}başla.
            </motion.h2>

            <motion.p variants={fadeUp} custom={2}
              className={`text-[1.05rem] leading-[1.8] max-w-[520px] mx-auto mb-12 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>
              Ücretsiz 15 dakikalık tanışma görüşmesiyle hedeflerini konuşalım. Seninle çalışıp çalışamayacağıma birlikte karar verelim.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex gap-4 justify-center flex-wrap">
              <a href="#iletisim"
                className="group relative px-10 py-5 bg-terracotta text-white rounded-full text-[0.95rem] font-medium no-underline overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(194,104,74,0.3)]">
                <span className="relative z-10 flex items-center gap-3">
                  Hemen Başvur
                  <motion.svg animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </span>
                <span className="absolute inset-0 bg-[#a8543a] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </a>
              <a href="https://wa.me/905362486849" target="_blank" rel="noopener noreferrer"
                className={`px-10 py-5 rounded-full text-[0.95rem] font-medium no-underline border flex items-center gap-3 transition-all duration-300 ${dm ? 'border-white/10 text-white/60 hover:text-white hover:border-white/25' : 'border-black/10 text-[#1C1917]/50 hover:text-[#1C1917] hover:border-black/20'}`}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                WhatsApp ile Sor
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} custom={4}
              className={`mt-16 flex flex-wrap items-center justify-center gap-8 ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>
              {[
                { icon: '🏐', text: '8+ Yıl Voleybol' },
                { icon: '🎯', text: '100% Memnuniyet' },
                { icon: '📊', text: 'Bilimsel Yaklaşım' },
                { icon: '🔒', text: 'Gizlilik Garantisi' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[0.78rem]">
                  <span className="text-base">{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={`pt-20 pb-8 border-t ${dm ? 'border-white/5 bg-[#050505]' : 'border-black/5 bg-[#FAF6F1]'}`}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-12">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="28" stroke="#C2684A" strokeWidth="3"/><path d="M4 32h56" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.5"/><path d="M32 4v56" stroke="#D4C4AB" strokeWidth="1.5" opacity="0.5"/></svg>
                </div>
                <div>
                  <span className={`font-display text-lg font-semibold ${dm ? 'text-white' : 'text-[#1C1917]'}`}>Ela Ebeoğlu</span>
                  <span className={`text-[0.6rem] uppercase tracking-[0.15em] ml-2 ${dm ? 'text-white/25' : 'text-[#1C1917]/25'}`}>Performance</span>
                </div>
              </div>
              <p className={`text-[0.85rem] leading-[1.8] max-w-[360px] ${dm ? 'text-white/30' : 'text-[#1C1917]/35'}`}>
                Kişiye özel antrenman programları, voleybol performans koçluğu ve bütüncül beslenme danışmanlığı.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className={`text-[0.7rem] uppercase tracking-[0.15em] font-medium mb-5 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>Sayfalar</h4>
              <div className="space-y-3">
                {[
                  { label: 'Hakkında', href: '#hakkinda' },
                  { label: 'Programlar', href: '#programlar' },
                  { label: 'Sonuçlar', href: '#sonuclar' },
                  { label: 'Fiyatlar', href: '#fiyatlar' },
                  { label: 'İletişim', href: '#iletisim' },
                ].map(l => (
                  <a key={l.label} href={l.href} className={`block text-[0.82rem] no-underline transition-colors duration-300 ${dm ? 'text-white/30 hover:text-white' : 'text-[#1C1917]/30 hover:text-[#1C1917]'}`}>{l.label}</a>
                ))}
              </div>
            </div>
            {/* Social */}
            <div>
              <h4 className={`text-[0.7rem] uppercase tracking-[0.15em] font-medium mb-5 ${dm ? 'text-white/40' : 'text-[#1C1917]/40'}`}>İletişim</h4>
              <div className="space-y-3">
                <a href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2.5 text-[0.82rem] no-underline transition-colors duration-300 ${dm ? 'text-white/30 hover:text-white' : 'text-[#1C1917]/30 hover:text-[#1C1917]'}`}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  Instagram
                </a>
                <a href="https://wa.me/905362486849" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2.5 text-[0.82rem] no-underline transition-colors duration-300 ${dm ? 'text-white/30 hover:text-white' : 'text-[#1C1917]/30 hover:text-[#1C1917]'}`}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className={`pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-3 ${dm ? 'border-white/5' : 'border-black/5'}`}>
            <p className={`text-[0.72rem] tracking-wide ${dm ? 'text-white/20' : 'text-[#1C1917]/20'}`}>
              &copy; 2026 Ela Ebeoğlu Performance. Tüm hakları saklıdır.
            </p>
            <p className={`text-[0.72rem] ${dm ? 'text-white/15' : 'text-[#1C1917]/15'}`}>
              KVKK & Gizlilik Politikası
            </p>
          </div>
        </div>
      </footer>
      {/* ─── WhatsApp Float ─── */}
      <motion.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        href="https://wa.me/905362486849?text=Merhaba,%20programlarınız%20hakkında%20bilgi%20almak%20istiyorum."
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-8 right-8 z-[99] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-float transition-all hover:scale-110 no-underline"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
        </svg>
      </motion.a>
      <ScrollToTop />
    </div>
  )
}
