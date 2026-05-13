import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

export default function LandingPageBuilder() {
  const { darkMode: dm, showToast } = useStore()
  const [landing, setLanding] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLanding()
  }, [])

  const fetchLanding = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('coach_landings')
      .select('*')
      .eq('coach_id', user.id)
      .single()

    if (data) setLanding(data)
    setLoading(false)
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('coach_landings')
      .update({
        slug: landing.slug,
        theme: landing.theme,
        content: landing.content,
        is_published: landing.is_published
      })
      .eq('id', landing.id)

    if (error) {
      if (error.code === '23505') showToast('Bu özel URL (slug) zaten alınmış!')
      else showToast('Kaydetme sırasında bir hata oluştu')
    } else {
      showToast('Tanıtım sayfanız güncellendi! 🚀')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="grid lg:grid-cols-2 gap-10">
      {/* Settings Form */}
      <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
        <h2 className="font-display text-3xl font-bold mb-8">Sayfa Oluşturucu 🎨</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">Özel URL (Slug)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-30">arena-performance.com/p/</span>
              <input
                type="text"
                value={landing.slug}
                onChange={e => setLanding({...landing, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                className="flex-1 h-14 px-5 rounded-xl bg-black/5 border border-transparent focus:border-primary outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">Tema Seçimi</label>
            <div className="grid grid-cols-3 gap-4">
              {['pro', 'athlete', 'minimalist'].map(t => (
                <button
                  key={t}
                  onClick={() => setLanding({...landing, theme: t})}
                  className={`py-4 rounded-xl border-2 transition-all font-bold uppercase text-[0.6rem] tracking-widest ${
                    landing.theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-black/5 opacity-40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <h4 className="font-bold text-sm mb-4">Hero Bölümü</h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ana Başlık"
                value={landing.content.hero.title}
                onChange={e => setLanding({
                  ...landing,
                  content: { ...landing.content, hero: { ...landing.content.hero, title: e.target.value } }
                })}
                className="w-full h-14 px-5 rounded-xl bg-black/5 border border-transparent focus:border-primary outline-none font-medium"
              />
              <textarea
                placeholder="Alt Başlık"
                value={landing.content.hero.subtitle}
                onChange={e => setLanding({
                  ...landing,
                  content: { ...landing.content, hero: { ...landing.content.hero, subtitle: e.target.value } }
                })}
                className="w-full h-32 p-5 rounded-xl bg-black/5 border border-transparent focus:border-primary outline-none font-medium resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <h4 className="font-bold text-sm mb-4">Başvuru Formu Soruları</h4>
            <div className="space-y-3">
              {['Kilo/Boy Soru', 'Sağlık Geçmişi Soru', 'Antrenman Deneyimi Soru'].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/5">
                  <span className="text-xs font-bold opacity-60">{q}</span>
                  <button className="text-[0.6rem] font-black uppercase text-primary">Aktif</button>
                </div>
              ))}
            </div>
            <p className="text-[0.6rem] opacity-30 mt-3 italic">* Özel sorular yakında eklenebilir hale gelecek.</p>
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-primary/5 border border-primary/10">
            <div>
              <h4 className="font-bold text-sm">Yayına Al</h4>
              <p className="text-xs opacity-40">Sayfanız herkes tarafından görülebilir hale gelir.</p>
            </div>
            <button
              onClick={() => setLanding({...landing, is_published: !landing.is_published})}
              className={`w-14 h-8 rounded-full relative transition-colors ${landing.is_published ? 'bg-primary' : 'bg-black/20'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${landing.is_published ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            DEĞİŞİKLİKLERİ KAYDET 💾
          </button>
        </div>
      </div>

      {/* Preview Info */}
      <div className="flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl">👀</div>
        <h3 className="font-display text-3xl font-bold">Önizleme Yakında.</h3>
        <p className={`max-w-xs text-sm opacity-40`}>
          Şu an sayfanızı kaydedip <strong>arena-performance.com/p/{landing.slug}</strong> adresinden canlı olarak kontrol edebilirsiniz.
        </p>
        {landing.is_published && (
           <a
            href={`/p/${landing.slug}`}
            target="_blank"
            className="text-primary font-bold border-b border-primary pb-1"
          >
            Sayfama Git ↗
          </a>
        )}
      </div>
    </div>
  )
}
