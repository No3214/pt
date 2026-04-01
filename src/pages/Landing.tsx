import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../stores/useStore'
import { sanitize } from '../lib/constants'

// ═══════════════ Scroll Reveal Hook ═══════════════
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function RevealDiv({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal()
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}

// ═══════════════ Landing Page ═══════════════
export default function Landing() {
  const { darkMode, toggleDarkMode } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
    const msg = `Merhaba Ela! Sana sitenden başvuru yapıyorum.\n\n👤 İsim: ${name}\n🎯 Hedef: ${goal}\n📝 Not: ${notes}`
    window.open(`https://wa.me/905362486849?text=${encodeURIComponent(msg)}`, '_blank')
    form.reset()
  }

  return (
    <div className="font-body">
      {/* ─── Header ─── */}
      <header className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-[10px] border-b transition-all duration-300 ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]' : ''} ${darkMode ? 'bg-[#1a1a2e]/95 border-white/5' : 'bg-[#FAF6F1]/90 border-black/5'}`}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className={`font-display text-2xl font-bold no-underline ${darkMode ? 'text-white' : 'text-[#1C1917]'}`}>
            Ela Ebeoğlu <span className="text-[0.6rem] uppercase tracking-[0.1em] font-medium ml-2 opacity-60">PERFORMANCE</span>
          </a>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex fixed md:static inset-0 md:inset-auto flex-col md:flex-row items-center justify-center gap-8 md:gap-8 z-[100] ${darkMode ? 'bg-[#1a1a2e]/98 md:bg-transparent' : 'bg-[#FAF6F1]/98 md:bg-transparent'}`}>
            {['neden', 'kazanim', 'programlar', 'iletisim'].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
                className={`no-underline text-sm transition-colors hover:text-terracotta ${darkMode ? 'text-gray-400' : 'text-[#57534E]'} md:text-sm text-xl`}>
                {id === 'neden' ? 'Neden Ela?' : id === 'kazanim' ? 'Ne Kazanırsın?' : id === 'programlar' ? 'Programlar' : 'İletişim'}
              </a>
            ))}
          </nav>
          <div className="flex gap-3 items-center">
            <button onClick={toggleDarkMode} className="bg-transparent border-none cursor-pointer text-xl p-1 rounded-full transition-all hover:rotate-[30deg]" aria-label="Tema değiştir">
              {darkMode ? '🌙' : '☀️'}
            </button>
            <Link to="/admin" className={`rounded-full px-4 py-2 text-[0.8rem] border no-underline transition-all ${darkMode ? 'border-white/15 text-white hover:bg-white/5' : 'border-black/10 text-[#1C1917] hover:bg-black/[0.02]'}`}>
              Koç Girişi
            </Link>
            <button className="md:hidden bg-transparent border-none cursor-pointer p-2 z-[101]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              <div className="space-y-[5px]">
                <span className={`block w-[22px] h-[2px] rounded transition-all ${darkMode ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block w-[22px] h-[2px] rounded transition-all ${darkMode ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-[22px] h-[2px] rounded transition-all ${darkMode ? 'bg-white' : 'bg-[#1C1917]'} ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="pt-40 md:pt-44 pb-32 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="blob absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-sand" />
          <div className="blob absolute top-[40%] -left-[10%] w-[300px] h-[300px] bg-sage opacity-20" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 border border-terracotta/20 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-terracotta mb-8">
              <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
              Nisan 2026 · Sadece 3 yeni danışan
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.1] tracking-tight mb-8">
              Güçlü ol, kendine güven, harekete geç.
            </h1>
            <p className={`text-lg leading-relaxed mb-12 ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>
              Profesyonel sporcu bakışıyla, kendi potansiyelini keşfet. Performansını artırmak, sakatlıklardan korunmak ve vücudunu en iyi haline taşımak için sana özel antrenman ve beslenme stratejileri.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="#iletisim" className="btn-ripple inline-flex items-center justify-center px-8 py-4 rounded-full bg-terracotta text-white font-medium no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(194,104,74,0.2)]">
                Ücretsiz Görüşme
              </a>
              <a href="#programlar" className={`inline-flex items-center justify-center px-8 py-4 rounded-full border no-underline transition-all ${darkMode ? 'border-white/15 text-white hover:bg-white/5' : 'border-black/10 text-[#1C1917] hover:bg-black/[0.02]'}`}>
                Programları İncele
              </a>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-[#E5E0D8]">
            <img src="/voleybol_1.png" alt="Ela Ebeoğlu Profesyonel Portre" className="w-full h-full object-cover object-center scale-105" style={{ filter: 'contrast(1.05) saturate(1.1)' }} />
            <div className="absolute bottom-[10%] -left-[10%] md:left-[-10%] bg-white dark:bg-card-dark p-4 rounded-md shadow-float flex items-center gap-4">
              <div className="w-10 h-10 bg-sage rounded-full text-white flex items-center justify-center font-bold text-sm">20+</div>
              <div>
                <div className="text-[0.6rem] uppercase tracking-[0.1em] text-[#57534E]">Aktif</div>
                <div className="font-semibold text-sm">Mutlu Danışan</div>
              </div>
            </div>
            <div className="absolute top-[20%] -right-[10%] md:right-[-10%] bg-white dark:bg-card-dark p-4 rounded-md shadow-float flex items-center gap-2">
              <span className="text-red-400">⭐</span>
              <span className="font-semibold text-sm">5.0 Değerlendirme</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Neden Ela ─── */}
      <section id="neden" className={`py-32 ${darkMode ? '' : 'bg-white'}`}>
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealDiv>
            <p className="text-[0.875rem] uppercase tracking-[0.1em] font-medium text-terracotta mb-4">Neden Ela?</p>
          </RevealDiv>
          <RevealDiv>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold max-w-[800px] mb-16">
              Çünkü burada ilham vermek değil, karar verdirmek hedefleniyor.
            </h2>
          </RevealDiv>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🏆', title: 'Gerçek sporcu disiplini', desc: 'Voleybol sahasından edindiğim disiplinle seni limitlerine ulaştırıyorum.' },
              { icon: '💪', title: 'Kadın odaklı güçlenme', desc: 'Kendi bedenini tanımanı ve güçlü bir temele sahip olmanı hedefliyorum.' },
              { icon: '✨', title: 'Seçici premium takip', desc: 'Kaliteyi korumak için sadece kararlı ve disiplinli danışanlarla çalışıyorum.' },
            ].map((c, i) => (
              <div key={i} className={`card-hover p-10 rounded-lg border shadow-sm ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-4">{c.title}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-[#57534E]'}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Kazanımlar ─── */}
      <section id="kazanim" className="py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealDiv><p className="text-[0.875rem] uppercase tracking-[0.1em] font-medium text-terracotta mb-4">Ne Kazanırsın?</p></RevealDiv>
          <RevealDiv><h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold max-w-[800px] mb-16">Somut çıktılar ve gerçek değişim.</h2></RevealDiv>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Kuvvet Artışı', color: 'border-sage', desc: 'Güçlenmen için kanıtlanmış yöntemler.' },
              { title: 'Sakatlık Önleme', color: 'border-sand', desc: 'Hareket mekaniklerine uygun stratejiler.' },
              { title: 'Bütüncül Beslenme', color: 'border-terracotta', desc: 'Sürdürülebilir makro dengesi ve planlama.' },
            ].map((c, i) => (
              <div key={i} className={`card-hover p-10 rounded-lg border shadow-sm ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
                <h3 className={`font-display text-xl font-semibold mb-4 inline-block border-b-2 ${c.color} pb-1`}>{c.title}</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-[#57534E]'}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Programlar ─── */}
      <section id="programlar" className={`py-32 ${darkMode ? '' : 'bg-white'}`}>
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealDiv><p className="text-[0.875rem] uppercase tracking-[0.1em] font-medium text-terracotta mb-4">Online Programlar</p></RevealDiv>
          <RevealDiv><h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold max-w-[800px] mb-16">Ertesi güne bırakmayacağın planlar.</h2></RevealDiv>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Online Koçluk', desc: 'Sana özel antrenman ve temel beslenme takibi.', price: '₺2.500', featured: false },
              { name: 'Voleybol Performance', desc: 'Sıçrama, atletizm ve performansa yönelik uzman modül.', price: '₺3.000', featured: true },
              { name: 'Premium Büyüme', desc: 'TDEE destekli tam beslenme + günlük kontrol + 1:1.', price: '₺5.500', featured: false },
            ].map((p, i) => (
              <div key={i} className={`card-hover flex flex-col p-10 rounded-lg border shadow-sm relative ${p.featured ? 'border-2 border-terracotta' : ''} ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'} ${p.featured && !darkMode ? '!border-terracotta' : ''}`}>
                {p.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-terracotta/10 border border-terracotta/20 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-terracotta whitespace-nowrap">
                    <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" /> Sadece 2 Yer Kaldı
                  </div>
                )}
                <h3 className="font-display text-2xl font-semibold mb-4">{p.name}</h3>
                <p className={`flex-1 mb-8 ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>{p.desc}</p>
                <div className="text-3xl font-semibold mb-8">{p.price}<span className="text-base font-normal opacity-60">/ay</span></div>
                <a href="#iletisim" className={`btn-ripple text-center py-4 rounded-full font-medium no-underline transition-all ${i === 2 ? (darkMode ? 'border border-white/15 text-white hover:bg-white/5' : 'border border-black/10 text-[#1C1917] hover:bg-black/[0.02]') : 'bg-terracotta text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(194,104,74,0.2)]'}`}>
                  {i === 2 ? 'Sıraya Gir' : 'Başvur'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-6">
          <RevealDiv className="text-center mb-16"><h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold">Onların Hikayesi.</h2></RevealDiv>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: '"Sadece antrenman değil, disiplin öğreten bir süreçti. Vücudumdaki değişime inanamıyorum."', name: 'Ayşe K.', role: 'Voleybolcu', colors: 'from-sage to-coast', initials: 'AK' },
              { text: '"Ela\'nın programlarıyla 3 ayda dikey sıçramam 8 cm arttı. Gerçekten fark yaratan biri."', name: 'Deniz Y.', role: 'Amatör Voleybolcu', colors: 'from-terracotta to-sand', initials: 'DY' },
              { text: '"Beslenme planım ve antrenmanlarım o kadar uyumluydu ki, ilk kez sürdürülebilir bir değişim yaşadım."', name: 'Selin B.', role: 'Fitness Meraklısı', colors: 'from-sand to-sage', initials: 'SB' },
            ].map((t, i) => (
              <div key={i} className={`card-hover p-10 rounded-lg border shadow-sm ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
                <div className="text-amber-500 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="italic mb-6">{t.text}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.colors} flex items-center justify-center text-white font-semibold text-sm`}>{t.initials}</div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[0.6rem] uppercase tracking-[0.1em] text-[#57534E]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── İletişim ─── */}
      <section id="iletisim" className="py-32">
        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] font-semibold mb-8">Başvuru & İletişim</h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>Sınırlı kontenjan nedeniyle başvuruları değerlendirerek alıyorum. Lütfen formdaki bilgileri eksiksiz doldur.</p>
            <form onSubmit={handleContact} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Ad Soyad</label>
                <input name="name" type="text" required placeholder="Adınız Soyadınız" className={`w-full p-4 rounded-sm border outline-none transition-all focus:border-terracotta ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`} />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Ana Hedefiniz</label>
                <select name="goal" required className={`w-full p-4 rounded-sm border outline-none transition-all focus:border-terracotta ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`}>
                  <option value="">Seçiniz...</option>
                  <option>Kuvvet Artışı</option>
                  <option>Voleybol Performans</option>
                  <option>Genel Fitness & Postür</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Spor Geçmişi & Notlar</label>
                <textarea name="notes" required rows={4} placeholder="Kısaca kendinizden bahsedin..." className={`w-full p-4 rounded-sm border outline-none transition-all focus:border-terracotta resize-y ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`} />
              </div>
              <button type="submit" className="btn-ripple w-full py-4 rounded-full bg-terracotta text-white font-medium transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(194,104,74,0.2)] border-none cursor-pointer text-base">
                📩 WhatsApp ile Başvur
              </button>
            </form>
          </div>
          <div className={`p-10 rounded-lg border shadow-sm ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="font-display text-2xl font-semibold mb-6">Instagram @elaebeoglu</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['/voleybol_1.png', '/voleybol_2.png', '/voleybol_3.png', '/voleybol_4.png'].map((src, i) => (
                <div key={i} className="aspect-square rounded-sm overflow-hidden bg-bg">
                  <img src={src} alt="Instagram" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" style={{ filter: 'contrast(1.05) saturate(1.1)' }} />
                </div>
              ))}
            </div>
            <a href="https://instagram.com/elaebeoglu" target="_blank" rel="noopener noreferrer" className={`block text-center py-4 rounded-full border no-underline transition-all ${darkMode ? 'border-white/15 text-white hover:bg-white/5' : 'border-black/10 text-[#1C1917] hover:bg-black/[0.02]'}`}>
              Takip Et
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={`py-16 border-t text-center ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-sm uppercase tracking-[0.1em] text-[#57534E] mb-4">© 2026 Ela Ebeoğlu Performance. Tüm Hakları Saklıdır.</p>
          <div className="flex gap-4 justify-center">
            <span className={`text-sm cursor-pointer ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>Gizlilik</span>
            <span className={`text-sm cursor-pointer ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>Şartlar</span>
          </div>
        </div>
      </footer>

      {/* ─── WhatsApp Float ─── */}
      <a href="https://wa.me/905362486849?text=Merhaba,%20programlarınız%20hakkında%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-8 right-8 z-[99] w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-float transition-all hover:scale-110 no-underline">
        <svg viewBox="0 0 24 24" className="w-[30px] h-[30px] fill-current">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
        </svg>
      </a>
    </div>
  )
}
