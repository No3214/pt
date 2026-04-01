import { useStore } from '../../stores/useStore'

export default function Settings() {
  const { aiKeys, setAiKeys, showToast, darkMode } = useStore()

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'

  const save = () => {
    showToast('Tüm API anahtarları kaydedildi! LLM Council aktif.')
  }

  const status = (key: string) => key ? '✅ Aktif' : '⚪ Pasif'

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold mb-2">Sistem & AI Ayarları</h2>
      <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-[#57534E]'}`}>LLM Council: Birden fazla yapay zeka sağlayıcısını aynı anda sorgula, en iyi sonuçları seç.</p>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Gemini */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="text-lg font-medium mb-4">💎 Gemini (Google)</h3>
          <p className="text-xs text-[#57534E] mb-4">Vision + Text. Ücretsiz kullanım.</p>
          <div>
            <label className="block mb-1 text-sm font-medium">API Key</label>
            <input type="password" value={aiKeys.gemini} onChange={e => setAiKeys({ gemini: e.target.value })} placeholder="AIzaSy..." className={inp} />
          </div>
          <p className="text-xs mt-2">{status(aiKeys.gemini)}</p>
        </div>

        {/* OpenRouter */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="text-lg font-medium mb-4">🌐 OpenRouter</h3>
          <p className="text-xs text-[#57534E] mb-4">100+ model erişimi. GPT-4o, Claude, Llama.</p>
          <div className="space-y-3">
            <div>
              <label className="block mb-1 text-sm font-medium">API Key</label>
              <input type="password" value={aiKeys.openrouter} onChange={e => setAiKeys({ openrouter: e.target.value })} placeholder="sk-or-v1-..." className={inp} />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Model</label>
              <select value={aiKeys.openrouterModel} onChange={e => setAiKeys({ openrouterModel: e.target.value })} className={inp}>
                <option value="google/gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                <option value="anthropic/claude-sonnet-4">Claude Sonnet 4</option>
                <option value="openai/gpt-4o">GPT-4o</option>
                <option value="meta-llama/llama-4-maverick">Llama 4 Maverick</option>
              </select>
            </div>
          </div>
          <p className="text-xs mt-2">{status(aiKeys.openrouter)}</p>
        </div>

        {/* DeepSeek */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="text-lg font-medium mb-4">🧠 DeepSeek</h3>
          <p className="text-xs text-[#57534E] mb-4">Yüksek zeka, düşük maliyet. Reasoning.</p>
          <div>
            <label className="block mb-1 text-sm font-medium">API Key</label>
            <input type="password" value={aiKeys.deepseek} onChange={e => setAiKeys({ deepseek: e.target.value })} placeholder="sk-..." className={inp} />
          </div>
          <p className="text-xs mt-2">{status(aiKeys.deepseek)}</p>
        </div>
      </div>

      <button onClick={save} className="btn-ripple mt-8 px-8 py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">
        Tüm Anahtarları Kaydet & Aktifleştir
      </button>
    </div>
  )
}
