import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { FileText, Download, ExternalLink, Search, Filter } from 'lucide-react'

interface Resource {
  id: string
  title: string
  category: 'nutrition' | 'training' | 'lifestyle'
  type: 'pdf' | 'link' | 'guide'
  description: string
  url: string
  isPremium: boolean
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Elit Voleybolcu Beslenme Rehberi',
    category: 'nutrition',
    type: 'pdf',
    description: 'Maç günü beslenmesi, supplement kullanımı ve toparlanma öğünleri üzerine kapsamlı rehber.',
    url: '#',
    isPremium: false
  },
  {
    id: '2',
    title: 'Haftalık Uyku ve Recovery Takip Çizelgesi',
    category: 'lifestyle',
    type: 'pdf',
    description: 'Performansınızı optimize etmek için uykunuzu ve stres seviyenizi takip edin.',
    url: '#',
    isPremium: true
  },
  {
    id: '3',
    title: 'Evde Mobilite Ekipman Listesi',
    category: 'training',
    type: 'guide',
    description: 'Uygun maliyetli ve etkili mobilite çalışmaları için gerekli temel ekipmanlar.',
    url: '#',
    isPremium: false
  },
  {
    id: '4',
    title: 'Mental Hazırlık ve Odaklanma Teknikleri',
    category: 'lifestyle',
    type: 'pdf',
    description: 'Baskı altında sakin kalma ve maç öncesi rutin oluşturma stratejileri.',
    url: '#',
    isPremium: true
  }
]

export default function ResourceCenter() {
  const darkMode = useStore(s => s.darkMode)

  const cardBg = darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'
  const categoryColors = {
    nutrition: 'text-green-500 bg-green-500/10',
    training: 'text-primary bg-primary/10',
    lifestyle: 'text-secondary bg-secondary/10'
  }

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border ${cardBg}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Kaynak Merkezi 📚</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
            Rehberler, PDF'ler ve yardımcı dökümanlar.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/20' : 'text-stone-400'}`} />
            <input
              type="text"
              placeholder="Kaynak ara..."
              className={`pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-primary/50 ${
                darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-stone-50 border-black/5 text-stone-900'
              }`}
            />
          </div>
          <button className={`p-2.5 rounded-xl border ${darkMode ? 'bg-white/5 border-white/10 text-white/50' : 'bg-stone-50 border-black/5 text-stone-500'}`}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
              darkMode ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]' : 'bg-stone-50 border-black/[0.04] hover:bg-white hover:shadow-xl'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${categoryColors[res.category]}`}>
                <FileText size={24} />
              </div>
              {res.isPremium && (
                <span className="px-2.5 py-1 rounded-lg text-[0.6rem] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                  Premium
                </span>
              )}
            </div>

            <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
            <p className={`text-xs mb-6 line-clamp-2 leading-relaxed ${darkMode ? 'text-white/40' : 'text-stone-500'}`}>
              {res.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className={`text-[0.65rem] font-bold uppercase tracking-wider ${darkMode ? 'text-white/20' : 'text-stone-400'}`}>
                {res.type === 'pdf' ? 'PDF Döküman' : 'Online Rehber'}
              </span>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                darkMode ? 'bg-white/5 text-white/70 hover:bg-primary hover:text-white' : 'bg-white text-stone-700 shadow-sm hover:bg-primary hover:text-white'
              }`}>
                {res.type === 'pdf' ? <Download size={14} /> : <ExternalLink size={14} />}
                <span>{res.type === 'pdf' ? 'İndir' : 'Görüntüle'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
