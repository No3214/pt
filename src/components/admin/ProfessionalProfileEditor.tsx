import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

export default function ProfessionalProfileEditor() {
  const { darkMode: dm, showToast } = useStore()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('coach_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) {
      // Ensure structure exists
      const proData = data.professional_data || {
        experience: [],
        certifications: [],
        skills: [],
        headline: "",
        bio_long: ""
      }
      setProfile({ ...data, professional_data: proData })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('coach_profiles')
      .update({
        professional_data: profile.professional_data
      })
      .eq('id', profile.id)

    if (error) showToast('Hata oluştu')
    else showToast('Profesyonel profiliniz güncellendi! 🎖️')
  }

  const addItem = (field: 'experience' | 'certifications' | 'skills') => {
    const newItem = field === 'skills' ? "" : { title: "", company: "", year: "" }
    const updated = { ...profile.professional_data }
    updated[field] = [...updated[field], newItem]
    setProfile({ ...profile, professional_data: updated })
  }

  const removeItem = (field: 'experience' | 'certifications' | 'skills', index: number) => {
    const updated = { ...profile.professional_data }
    updated[field] = updated[field].filter((_: any, i: number) => i !== index)
    setProfile({ ...profile, professional_data: updated })
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
      <h2 className="font-display text-3xl font-bold mb-8">Profesyonel Kariyer 🎖️</h2>

      <div className="space-y-10">
        {/* Headline & Long Bio */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">Profesyonel Başlık</label>
            <input
              type="text"
              value={profile.professional_data.headline}
              onChange={e => setProfile({...profile, professional_data: {...profile.professional_data, headline: e.target.value}})}
              className="w-full h-14 px-5 rounded-xl bg-black/5 border border-transparent focus:border-primary outline-none font-bold"
              placeholder="Örn: Senior Fitness Specialist & Nutritionist"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">Detaylı Biyografi</label>
            <textarea
              value={profile.professional_data.bio_long}
              onChange={e => setProfile({...profile, professional_data: {...profile.professional_data, bio_long: e.target.value}})}
              className="w-full h-32 p-5 rounded-xl bg-black/5 border border-transparent focus:border-primary outline-none font-medium resize-none"
              placeholder="Kariyer yolculuğunuzdan bahsedin..."
            />
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Deneyim</h4>
            <button onClick={() => addItem('experience')} className="text-primary text-xs font-bold">+ Ekle</button>
          </div>
          <div className="space-y-4">
            {profile.professional_data.experience.map((exp: any, i: number) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-black/5 items-start">
                <input
                  placeholder="Pozisyon"
                  value={exp.title}
                  onChange={e => {
                    const updated = [...profile.professional_data.experience]
                    updated[i].title = e.target.value
                    setProfile({...profile, professional_data: {...profile.professional_data, experience: updated}})
                  }}
                  className="flex-1 bg-transparent border-b border-black/10 outline-none text-sm font-bold"
                />
                <input
                  placeholder="Kurum/Yıl"
                  value={exp.year}
                  onChange={e => {
                    const updated = [...profile.professional_data.experience]
                    updated[i].year = e.target.value
                    setProfile({...profile, professional_data: {...profile.professional_data, experience: updated}})
                  }}
                  className="w-32 bg-transparent border-b border-black/10 outline-none text-sm"
                />
                <button onClick={() => removeItem('experience', i)} className="text-red-500 opacity-40">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">Uzmanlık Alanları</h4>
            <button onClick={() => addItem('skills')} className="text-primary text-xs font-bold">+ Ekle</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.professional_data.skills.map((skill: string, i: number) => (
              <div key={i} className="px-4 py-2 rounded-full bg-primary/10 text-primary flex items-center gap-2 text-xs font-bold">
                <input
                  value={skill}
                  onChange={e => {
                    const updated = [...profile.professional_data.skills]
                    updated[i] = e.target.value
                    setProfile({...profile, professional_data: {...profile.professional_data, skills: updated}})
                  }}
                  className="bg-transparent outline-none w-20"
                />
                <button onClick={() => removeItem('skills', i)} className="opacity-40">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Badges */}
        <div className="pt-8 border-t border-black/5">
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest opacity-40">Sertifika & Belge Doğrulama</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border-2 border-dashed ${dm ? 'border-white/10' : 'border-black/10'} flex flex-col items-center justify-center text-center`}>
              <span className="text-3xl mb-3">🎓</span>
              <h5 className="font-bold text-xs uppercase tracking-wider mb-2">GSB / Federasyon Belgesi</h5>
              <p className="text-[0.6rem] opacity-40 mb-4 italic">Belgenizi yükleyin, "Doğrulanmış" rozeti kazanın.</p>
              <button className="px-4 py-2 rounded-lg bg-black text-white text-[0.6rem] font-black">DOSYA SEÇ</button>
            </div>
            <div className={`p-6 rounded-2xl bg-secondary/5 border border-secondary/20`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">🛡️</div>
                <div>
                  <h5 className="font-bold text-xs">Doğrulama Durumu</h5>
                  <p className="text-[0.6rem] text-secondary font-bold">Beklemede</p>
                </div>
              </div>
              <p className="text-[0.6rem] opacity-60 leading-relaxed italic">
                Belgeleriniz ARENA SuperAdmin ekibi tarafından 24-48 saat içinde incelenir ve onaylanır.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          PROFİLİ GÜNCELLE 💾
        </button>
      </div>
    </div>
  )
}
