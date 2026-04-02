import { motion } from 'framer-motion'
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
    color: 'from-blue-500/10 to-purple-500/10',
  },
  {
    key: 'openrouter',
    name: 'OpenRouter',
    company: 'Multi-Provider',
    icon: '🌐',
    desc: '100+ model erişimi. GPT-4o, Claude, Llama.',
    placeholder: 'sk-or-v1-...',
    color: 'from-emerald-500/10 to-cyan-500/10',
    hasModel: true,
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',
    company: 'DeepSeek AI',
    icon: '🧠',
    desc: 'Yüksek zeka, düşük maliyet. Reasoning odaklı.',
    placeholder: 'sk-...',
    color: 'from-amber-500/10 to-orange-500/10',
  },
]

export default function Settings() {
  const { aiKeys, setAiKeys, showToast, darkMode: dm } = useStore()

  const inp = `w-full p-3.5 rounded-xl border outline-none transition-all duration-300 focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/10 ${dm ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30' : 'bg-white border-black/[0.06] placeholder:text-stone-400'}`

  const save = () => showToast('Tüm API anahtarları kaydedildi! LLM Council aktif.')

  const activeCount = [aiKeys.gemini, aiKeys.openrouter, aiKeys.deepseek].filter(Boolean).length

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-10">
        <h2 className="font-display text-3xl font-semibold tracking-tight">AI Ayarları</h2>
        <p className={`mt-1 text-sm ${dm ? 'text-white/40' : 'text-stone-400'}`}>
          LLM Council: Birden fazla AI sağlayıcısını sorgula, en iyi sonucu seç
        </p>
      </motion.div>

      {/* Status Bar */}
      <motion.div variants={fadeUp} className={`p-5 rounded-2xl border mb-8 ${dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
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
      </motion.div>

      {/* Provider Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {providers.map(p => {
          const value = p.key === 'gemini' ? aiKeys.gemini : p.key === 'openrouter' ? aiKeys.openrouter : aiKeys.deepseek
          const isActive = Boolean(value)
          return (
            <motion.div
              key={p.key}
              variants={fadeUp}
              className={`p-6 rounded-2xl border transition-all duration-300 ${isActive ? (dm ? 'border-sage/30 bg-sage/[0.04]' : 'border-sage/20 bg-sage/[0.02]') : (dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04]')}`}
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
                  <input
                    type="password"
                    value={value}
                    onChange={e => setAiKeys({ [p.key]: e.target.value })}
                    placeholder={p.placeholder}
                    className={inp}
                  />
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
  )
}