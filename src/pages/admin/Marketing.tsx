import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import LandingPageBuilder from '../../components/admin/LandingPageBuilder'
import ProfessionalProfileEditor from '../../components/admin/ProfessionalProfileEditor'

export default function Marketing() {
  const { darkMode: dm } = useStore()
  const [activeTab, setActiveTab] = useState<'landing' | 'pro' | 'seo' | 'leads'>('landing')

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <h1 className="font-display text-4xl font-black tracking-tight mb-2">Pazarlama & Web Sitesi 🚀</h1>
        <p className={`text-sm font-medium ${dm ? 'text-white/30' : 'text-black/30'}`}>Kendi markanı oluştur, yeni danışanlar kazan.</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-black/5 w-fit">
        {[
          { id: 'landing', label: 'Tanıtım Sayfası', icon: '🎨' },
          { id: 'pro', label: 'Kariyer & CV', icon: '🎖️' },
          { id: 'seo', label: 'SEO & Analytics', icon: '🔍' },
          { id: 'leads', label: 'Dönüşümler', icon: '🎯' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id ? 'bg-white shadow-lg text-black' : 'opacity-40 hover:opacity-100'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'landing' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <LandingPageBuilder />
        </motion.div>
      )}

      {activeTab === 'pro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ProfessionalProfileEditor />
        </motion.div>
      )}

      {activeTab === 'seo' && (
        <div className="py-20 text-center opacity-30">
          <p className="text-4xl mb-4">🚧</p>
          <h3 className="text-xl font-bold">Çok Yakında</h3>
          <p className="text-sm">Google aramalarında üst sıralara çıkmanız için SEO araçları ekleniyor.</p>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="py-20 text-center opacity-30">
          <p className="text-4xl mb-4">🚧</p>
          <h3 className="text-xl font-bold">İstatistikler Hazırlanıyor</h3>
          <p className="text-sm">Landing sayfanızdan gelen tıklama ve başvuru analizleri burada görünecek.</p>
        </div>
      )}
    </div>
  )
}
