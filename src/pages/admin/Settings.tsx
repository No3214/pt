import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function Settings() {
  const { clients, calSessions, measurements, progressPhotos, savedPrograms, showToast, darkMode: dm, aiConfig, setAiConfig, whatsappTemplates, updateTemplate } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<'data' | 'ai' | 'templates' | 'danger'>('data')

  const card = `p-6 rounded-2xl border transition-all duration-300 ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`



    const handleExport = () => {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      clients,
      calSessions,
      measurements,
      progressPhotos: progressPhotos.length,
      savedPrograms,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `arena-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Yedek dosyası indirildi!')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.clients) {          const store = useStore.getState()
          data.clients.forEach((c: Record<string, unknown>) => {
            if (!store.clients.find(x => x.id === c.id)) {
              store.addClient(c)
            }
          })
          showToast(`${data.clients.length} danışan import edildi!`)
        }
      } catch {
        showToast('Geçersiz dosya formatı.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleResetAll = () => {
    if (!confirm('TÜM VERİLERİ SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ?\n\nBu işlem geri alınamaz.')) return
    if (!confirm('Son kez: Tüm danışanlar, seanslar, ölçümler silinecek. Devam?')) return
    localStorage.removeItem('arena-store')
    window.location.reload()
  }

  const tabs = [
    { key: 'data' as const, label: 'Veri Yönetimi', icon: '💾' },
    { key: 'ai' as const, label: 'AI Yönetimi', icon: '🤖' },
    { key: 'templates' as const, label: 'Mesaj Şablonları', icon: '📝' },
    { key: 'danger' as const, label: 'Tehlikeli Bölge', icon: '⚠️' },
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Ayarlar</h2>
        <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
          AI yapılandırma, veri yönetimi ve sistem ayarları
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={fadeUp} className="flex gap-2 mb-8">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium cursor-pointer border-none transition-all ${
              activeTab === t.key
                ? 'bg-primary text-white'
                : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Data Tab */}
        {activeTab === 'data' && (
          <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {/* Data Stats */}            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Danışan', value: clients.length, icon: '👥' },
                { label: 'Randevu', value: calSessions.length, icon: '📅' },
                { label: 'Ölçüm', value: measurements.length, icon: '📏' },
                { label: 'Program', value: savedPrograms.length, icon: '📋' },
              ].map((s, i) => (
                <div key={i} className={card}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className={`text-xs uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-400'}`}>{s.label}</p>
                      <p className="text-xl font-semibold mt-0.5">{s.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Export / Import */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={card}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📤</span>
                  <div>
                    <h3 className="font-medium">Veri Dışa Aktar</h3>
                    <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>Tüm verilerin JSON yedeğini indir</p>
                  </div>
                </div>
                <p className={`text-xs mb-5 leading-relaxed ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                  Danışanlar, randevular, ölçümler ve programlar dahil tüm verileriniz indirilir.                  API anahtarları güvenlik nedeniyle dahil edilmez.
                </p>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleExport}
                  className="w-full py-3.5 rounded-full bg-secondary text-white font-medium border-none cursor-pointer"
                >
                  JSON Olarak İndir
                </motion.button>
              </div>

              <div className={card}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h3 className="font-medium">Veri İçe Aktar</h3>
                    <p className={`text-xs ${dm ? 'text-white/40' : 'text-stone-400'}`}>JSON yedeğinden geri yükle</p>
                  </div>
                </div>
                <p className={`text-xs mb-5 leading-relaxed ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                  Daha önce dışa aktardığınız bir JSON dosyasından verileri geri yükleyin.
                  Mevcut veriler korunur, sadece yeni kayıtlar eklenir.
                </p>
                <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => fileRef.current?.click()}
                  className={`w-full py-3.5 rounded-full font-medium cursor-pointer border ${dm ? 'border-white/10 text-white/70 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-600 bg-transparent hover:bg-stone-50'}`}
                >
                  JSON Dosyası Seç                </motion.button>
              </div>
            </div>

            {/* Storage Info */}
            <div className={`${card} mt-6`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">💿</span>
                <h3 className="font-medium text-sm">Depolama Bilgisi</h3>
              </div>
              <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                Veriler tarayıcınızın localStorage alanında saklanır.
                Tarayıcı verilerini temizlerseniz tüm veriler silinir — düzenli yedek almanız önerilir.
              </p>
            </div>
          </motion.div>
        )}

        {/* AI Configuration Tab */}
        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className={card}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔑</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">API Anahtarları</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Tüm AI analizleri ve diyet yazımları için kullanılır</p>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={aiConfig.gemini || ''}
                    onChange={(e) => setAiConfig({ gemini: e.target.value })}
                    placeholder="AIzaSy..."
                    className={`w-full p-3.5 rounded-xl border outline-none text-sm font-mono tracking-wide transition-all ${
                      dm ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 text-white' : 'bg-stone-50 border-black/[0.06] focus:border-primary/50 text-text-main'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>
                    OpenRouter API Key
                  </label>
                  <input
                    type="password"
                    value={aiConfig.openrouter || ''}
                    onChange={(e) => setAiConfig({ openrouter: e.target.value })}
                    placeholder="sk-or-v1-..."
                    className={`w-full p-3.5 rounded-xl border outline-none text-sm font-mono tracking-wide transition-all ${
                      dm ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 text-white' : 'bg-stone-50 border-black/[0.06] focus:border-primary/50 text-text-main'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>
                    DeepSeek API Key
                  </label>
                  <input
                    type="password"
                    value={aiConfig.deepseek || ''}
                    onChange={(e) => setAiConfig({ deepseek: e.target.value })}
                    placeholder="sk-..."
                    className={`w-full p-3.5 rounded-xl border outline-none text-sm font-mono tracking-wide transition-all ${
                      dm ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 text-white' : 'bg-stone-50 border-black/[0.06] focus:border-primary/50 text-text-main'
                    }`}
                  />
                  <p className={`text-[0.65rem] mt-2 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                    DeepSeek AI modeli için kullanılır. <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API key al</a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* WhatsApp Templates Tab */}
        {activeTab === 'templates' && (
          <motion.div key="templates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className={card}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📱</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">WhatsApp Şablonları</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Öğrenci ve adaylara gönderilen mesajları özelleştirin</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Onboarding Template */}
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>
                      Ön Kayıt Formu Mesajı
                    </label>
                    <textarea
                      value={whatsappTemplates.onboarding}
                      onChange={(e) => updateTemplate('onboarding', e.target.value)}
                      rows={6}
                      className={`w-full p-4 rounded-xl border outline-none text-sm leading-relaxed transition-all resize-none ${
                        dm ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 text-white' : 'bg-stone-50 border-black/[0.06] focus:border-primary/50 text-text-main'
                      }`}
                    />
                    <p className={`text-[0.65rem] mt-2 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                      Mevcut değişkenler: <code className="text-primary">{"{{link}}"}</code>
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl text-xs flex flex-col gap-2 ${dm ? 'bg-primary/10 border border-primary/20' : 'bg-primary/5 border border-primary/10'}`}>
                    <span className="font-bold text-primary uppercase text-[0.6rem]">Önizleme</span>
                    <p className="italic opacity-60">
                      {whatsappTemplates.onboarding.replace('{{link}}', 'https://pt.kozbeyli.com/onboarding')}
                    </p>
                  </div>
                </div>

                {/* Measurement Template */}
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-semibold uppercase tracking-wider ${dm ? 'text-white/40' : 'text-stone-500'}`}>
                      Haftalık Ölçüm Mesajı
                    </label>
                    <textarea
                      value={whatsappTemplates.measurement}
                      onChange={(e) => updateTemplate('measurement', e.target.value)}
                      rows={6}
                      className={`w-full p-4 rounded-xl border outline-none text-sm leading-relaxed transition-all resize-none ${
                        dm ? 'bg-white/[0.03] border-white/[0.08] focus:border-primary/50 text-white' : 'bg-stone-50 border-black/[0.06] focus:border-primary/50 text-text-main'
                      }`}
                    />
                    <p className={`text-[0.65rem] mt-2 ${dm ? 'text-white/30' : 'text-stone-400'}`}>
                      Mevcut değişkenler: <code className="text-primary">{"{{link}}"}</code>, <code className="text-primary">{"{{name}}"}</code>
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl text-xs flex flex-col gap-2 ${dm ? 'bg-secondary/10 border border-secondary/20' : 'bg-secondary/5 border border-secondary/10'}`}>
                    <span className="font-bold text-secondary uppercase text-[0.6rem]">Önizleme</span>
                    <p className="italic opacity-60">
                      {whatsappTemplates.measurement.replace('{{link}}', 'https://pt.kozbeyli.com/measure/123').replace('{{name}}', 'Mina Aksoy')}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`mt-10 p-5 rounded-2xl flex items-start gap-4 ${dm ? 'bg-white/[0.02]' : 'bg-stone-50/50'}`}>
                <span className="text-xl">💡</span>
                <p className={`text-xs leading-relaxed ${dm ? 'text-white/30' : 'text-stone-500'}`}>
                  Değişkenler otomatik olarak doldurulur. <code className="text-primary">{"{{link}}"}</code> öğrencinin verilerini girebileceği formu, <code className="text-primary">{"{{name}}"}</code> ise öğrencinin adını temsil eder.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Danger Zone */}
        {activeTab === 'danger' && (
          <motion.div key="danger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className={`p-8 rounded-2xl border-2 border-dashed ${dm ? 'border-primary/30 bg-primary/[0.03]' : 'border-primary/20 bg-primary/[0.02]'}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-primary">Tehlikeli Bölge</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Bu işlemler geri alınamaz</p>
                </div>              </div>

              <div className="space-y-4">


                <div className={`p-5 rounded-xl ${dm ? 'bg-white/[0.03]' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-primary">Tüm Verileri Sil</h4>
                      <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Danışanlar, seanslar, ölçümler dahil herşeyi siler ve uygulamayı sıfırlar</p>                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResetAll}
                      className="px-5 py-2.5 rounded-full text-xs font-medium cursor-pointer bg-primary text-white border-none"
                    >
                      Herşeyi Sil
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}