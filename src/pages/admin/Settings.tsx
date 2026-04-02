import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

const providers = [
  {
    key: 'gemini',
    name: 'Gemini',
    company: 'Google',
    icon: '💎',
    desc: 'Vision + Text. Ücretsiz kullanım mevcut.',
    placeholder: 'AIzaSy...',
    testUrl: 'https://generativelanguage.googleapis.com/v1beta/models?key=',
  },
  {
    key: 'openrouter',
    name: 'OpenRouter',
    company: 'Multi-Provider',
    icon: '🌐',
    desc: '100+ model erişimi. GPT-4o, Claude, Llama.',
    placeholder: 'sk-or-v1-...',
    hasModel: true,
    testUrl: 'https://openrouter.ai/api/v1/models',
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',    company: 'DeepSeek AI',
    icon: '🧠',
    desc: 'Yüksek zeka, düşük maliyet. Reasoning odaklı.',
    placeholder: 'sk-...',
    testUrl: 'https://api.deepseek.com/models',
  },
]

type TestStatus = 'idle' | 'testing' | 'success' | 'error'

export default function Settings() {
  const { aiKeys, setAiKeys, clients, calSessions, measurements, progressPhotos, savedPrograms, showToast, darkMode: dm } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({})
  const [activeTab, setActiveTab] = useState<'ai' | 'data' | 'danger'>('ai')
  const [showKeyFor, setShowKeyFor] = useState<string | null>(null)

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`
  const card = `p-6 rounded-2xl border transition-all duration-300 ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`

  const save = () => showToast('Tüm API anahtarları kaydedildi! LLM Council aktif.')

  const activeCount = [aiKeys.gemini, aiKeys.openrouter, aiKeys.deepseek].filter(Boolean).length

  const testConnection = async (key: string) => {
    const apiKey = key === 'gemini' ? aiKeys.gemini : key === 'openrouter' ? aiKeys.openrouter : aiKeys.deepseek
    if (!apiKey) { showToast('Önce API key giriniz.'); return }

    setTestStatus(s => ({ ...s, [key]: 'testing' }))
    try {
      const provider = providers.find(p => p.key === key)!      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      let url = provider.testUrl

      if (key === 'gemini') {
        url = provider.testUrl + apiKey
      } else if (key === 'openrouter') {
        headers['Authorization'] = `Bearer ${apiKey}`
      } else {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const res = await fetch(url, { headers, method: 'GET' })
      if (res.ok) {
        setTestStatus(s => ({ ...s, [key]: 'success' }))
        showToast(`${provider.name} bağlantısı başarılı!`)
      } else {
        setTestStatus(s => ({ ...s, [key]: 'error' }))
        showToast(`${provider.name} bağlantı hatası: ${res.status}`)
      }
    } catch {
      setTestStatus(s => ({ ...s, [key]: 'error' }))
      showToast('Bağlantı hatası. CORS sorunu olabilir.')
    }
    setTimeout(() => setTestStatus(s => ({ ...s, [key]: 'idle' })), 5000)
  }
  const handleExport = () => {
    const data = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      clients,
      calSessions,
      measurements,
      progressPhotos: progressPhotos.length,
      savedPrograms,
      aiKeys: { gemini: !!aiKeys.gemini, openrouter: !!aiKeys.openrouter, deepseek: !!aiKeys.deepseek },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ela-pt-backup-${new Date().toISOString().split('T')[0]}.json`
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
          data.clients.forEach((c: any) => {
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
    localStorage.removeItem('ela-pt-store')
    window.location.reload()
  }

  const tabs = [
    { key: 'ai' as const, label: 'AI Ayarları', icon: '🤖' },
    { key: 'data' as const, label: 'Veri Yönetimi', icon: '💾' },
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
                ? 'bg-terracotta text-white'
                : (dm ? 'bg-white/[0.06] text-white/50 hover:bg-white/10' : 'bg-stone-100 text-stone-500 hover:bg-stone-200')
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* AI Tab */}
        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>            {/* Status Bar */}
            <div className={`p-5 rounded-2xl border mb-8 ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeCount > 0 ? 'bg-sage/15' : (dm ? 'bg-white/[0.06]' : 'bg-stone-100')}`}>
                    <span className={`text-sm font-bold ${activeCount > 0 ? 'text-sage' : (dm ? 'text-white/30' : 'text-stone-400')}`}>{activeCount}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activeCount === 0 ? 'Hiçbir sağlayıcı aktif değil' : `${activeCount}/3 sağlayıcı aktif`}</p>
                    <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{activeCount >= 2 ? 'Council modu kullanılabilir' : 'En az 2 sağlayıcı ekleyin'}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {[aiKeys.gemini, aiKeys.openrouter, aiKeys.deepseek].map((k, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${k ? 'bg-sage' : (dm ? 'bg-white/10' : 'bg-stone-200')}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {providers.map(p => {
                const value = p.key === 'gemini' ? aiKeys.gemini : p.key === 'openrouter' ? aiKeys.openrouter : aiKeys.deepseek
                const isActive = Boolean(value)
                const status = testStatus[p.key] || 'idle'
                return (
                  <motion.div
                    key={p.key}
                    variants={fadeUp}                    whileHover={{ y: -2 }}
                    className={`${card} ${isActive ? (dm ? 'border-sage/30 bg-sage/[0.04]' : 'border-sage/20 bg-sage/[0.02]') : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.icon}</span>
                        <div>
                          <h3 className="font-medium">{p.name}</h3>
                          <p className={`text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}>{p.company}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isActive
                        ? 'bg-sage/15 text-sage'
                        : (dm ? 'bg-white/[0.06] text-white/30' : 'bg-stone-100 text-stone-400')
                      }`}>
                        {isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <p className={`text-xs mb-5 ${dm ? 'text-white/40' : 'text-stone-500'}`}>{p.desc}</p>
                    <div className="space-y-3">
                      <div>
                        <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>API Key</label>
                        <div className="relative">
                          <input
                            type={showKeyFor === p.key ? 'text' : 'password'}
                            value={value}
                            onChange={e => setAiKeys({ [p.key]: e.target.value })}
                            placeholder={p.placeholder}
                            className={inp}
                          />
                          <button                            onClick={() => setShowKeyFor(showKeyFor === p.key ? null : p.key)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-xs ${dm ? 'text-white/30' : 'text-stone-400'}`}
                          >
                            {showKeyFor === p.key ? '🙈' : '👁'}
                          </button>
                        </div>
                      </div>
                      {p.hasModel && (
                        <div>
                          <label className={`block mb-2 text-xs font-medium uppercase tracking-wider ${dm ? 'text-white/50' : 'text-stone-500'}`}>Model</label>
                          <select value={aiKeys.openrouterModel} onChange={e => setAiKeys({ openrouterModel: e.target.value })} className={inp}>
                            <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                            <option value="anthropic/claude-sonnet-4">Claude Sonnet 4</option>
                            <option value="openai/gpt-4o">GPT-4o</option>
                            <option value="meta-llama/llama-4-maverick">Llama 4 Maverick</option>
                          </select>
                        </div>
                      )}
                      {/* Test Connection */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => testConnection(p.key)}
                        disabled={status === 'testing'}
                        className={`w-full py-2.5 rounded-xl text-xs font-medium cursor-pointer border transition-all ${
                          status === 'success' ? 'bg-sage/10 border-sage/30 text-sage' :
                          status === 'error' ? 'bg-terracotta/10 border-terracotta/30 text-terracotta' :
                          status === 'testing' ? 'bg-sand/10 border-sand/30 text-sand' :
                          (dm ? 'border-white/10 text-white/50 bg-transparent hover:bg-white/5' : 'border-stone-200 text-stone-500 bg-transparent hover:bg-stone-50')                        }`}
                      >
                        {status === 'testing' ? 'Test ediliyor...' :
                         status === 'success' ? 'Bağlantı Başarılı ✓' :
                         status === 'error' ? 'Bağlantı Hatası ✕' :
                         'Bağlantıyı Test Et'}
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={save}
              className="mt-8 w-full md:w-auto px-10 py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer"
            >
              Tüm Anahtarları Kaydet
            </motion.button>
          </motion.div>
        )}

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
                  className="w-full py-3.5 rounded-full bg-sage text-white font-medium border-none cursor-pointer"
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

        {/* Danger Zone */}
        {activeTab === 'danger' && (
          <motion.div key="danger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className={`p-8 rounded-2xl border-2 border-dashed ${dm ? 'border-terracotta/30 bg-terracotta/[0.03]' : 'border-terracotta/20 bg-terracotta/[0.02]'}`}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-terracotta">Tehlikeli Bölge</h3>
                  <p className={`text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>Bu işlemler geri alınamaz</p>
                </div>              </div>

              <div className="space-y-4">
                <div className={`p-5 rounded-xl ${dm ? 'bg-white/[0.03]' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">API Anahtarlarını Sıfırla</h4>
                      <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Tüm AI sağlayıcı anahtarlarını temizler</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (confirm('Tüm API anahtarları silinecek. Emin misiniz?')) {
                          setAiKeys({ gemini: '', openrouter: '', deepseek: '' })
                          showToast('API anahtarları sıfırlandı.')
                        }
                      }}
                      className="px-5 py-2.5 rounded-full text-xs font-medium cursor-pointer border border-terracotta/40 text-terracotta bg-transparent hover:bg-terracotta/5"
                    >
                      Sıfırla
                    </motion.button>
                  </div>
                </div>

                <div className={`p-5 rounded-xl ${dm ? 'bg-white/[0.03]' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-terracotta">Tüm Verileri Sil</h4>
                      <p className={`text-xs mt-1 ${dm ? 'text-white/30' : 'text-stone-400'}`}>Danışanlar, seanslar, ölçümler dahil herşeyi siler ve uygulamayı sıfırlar</p>                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResetAll}
                      className="px-5 py-2.5 rounded-full text-xs font-medium cursor-pointer bg-terracotta text-white border-none"
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