import { useState, useRef } from 'react'
import { useStore } from '../../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../../lib/constants'
import { callGemini, callOpenRouter } from '../../lib/ai'

export default function FoodTracker() {
  const { foodLog, addFood, removeFood, clearFoodLog, showToast, darkMode, aiKeys } = useStore()
  const [search, setSearch] = useState('')
  const [foodImg, setFoodImg] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'
  const hasVision = aiKeys.gemini || aiKeys.openrouter

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })

  const handlePhotoPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFoodImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const analyzeWithAI = async () => {
    if (!foodImg) { alert('Lütfen önce bir fotoğraf yükleyin.'); return }
    const base64 = foodImg.split(',')[1]
    if (!base64) return
    setAnalyzing(true)
    const prompt = `Sen uzman bir sporcu diyetisyenisin. Fotoğraftaki ana yemeği tespit et (Türk mutfağı ise belirt). Tahmini kalori ve makro değerlerini hesapla. SADECE saf JSON döndür, markdown kullanma:\n{"name":"Yemek Adı (Miktar)","cal":250,"p":15,"f":5,"c":30}`
    try {
      let result: string | null = null
      if (aiKeys.gemini) result = await callGemini(prompt, base64)
      else if (aiKeys.openrouter) result = await callOpenRouter(prompt, base64)
      if (!result) throw new Error('Vision API yanıt vermedi')
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim()
      const foodData: FoodItem = JSON.parse(cleaned)
      addFood(foodData)
      showToast(`AI tespit: ${foodData.name} - ${foodData.cal} kcal`)
    } catch (err: any) {
      alert('AI Analiz Hatası: ' + err.message)
    }
    setAnalyzing(false)
  }

  const waMsg = foodLog.length > 0
    ? `📸 *GÜNLÜK YEMEK LOGU*\n━━━━━━━━━━━━━━━━━━━━\n${foodLog.map(f => `• ${f.name} — ${f.cal} kcal`).join('\n')}\n\n📊 *TOPLAM:*\n🔥 ${totals.cal} kcal\n🥩 P: ${Math.round(totals.p)}g · 🥑 Y: ${Math.round(totals.f)}g · 🍚 K: ${Math.round(totals.c)}g`
    : ''

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h2 className="font-display text-3xl font-semibold">Yemek Takibi & Kalori</h2>
        <span className="px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-800">📸 Fotoğraf + Veritabanı</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left */}
        <div className="space-y-6">
          {/* Photo */}
          <div className={`${cardBg} p-6 rounded-md`}>
            <h3 className="text-lg font-medium mb-4">📷 Yemek Fotoğrafı</h3>
            <div onClick={() => fileInput.current?.click()}
              className={`aspect-video rounded-sm mb-4 flex items-center justify-center cursor-pointer overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-[#E5E0D8]'}`}>
              {foodImg ? <img src={foodImg} alt="Yemek" className="w-full h-full object-cover" /> : (
                <div className="text-center text-[#57534E]"><div className="text-3xl mb-2">📸</div><div className="text-sm">Fotoğraf çek veya yükle</div></div>
              )}
            </div>
            <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" capture="environment" className="hidden" onChange={handlePhotoPreview} />
            <div className="flex gap-2">
              <button onClick={() => fileInput.current?.click()} className={`flex-1 py-2 rounded-full text-sm border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>📁 Galeri</button>
              <button onClick={() => fileInput.current?.click()} className="flex-1 py-2 rounded-full text-sm bg-terracotta text-white border-none cursor-pointer">📷 Kamera</button>
            </div>
            {hasVision && <button onClick={analyzeWithAI} disabled={analyzing} className="w-full mt-2 py-2 rounded-full text-sm text-white border-none cursor-pointer bg-gradient-to-r from-terracotta to-amber-500">
              {analyzing ? '⏳ Analiz ediliyor...' : '✨ AI Kalori Tespit Et'}
            </button>}
          </div>

          {/* Search */}
          <div className={`${cardBg} p-6 rounded-md`}>
            <h3 className="text-lg font-medium mb-4">🔍 Besin Ekle</h3>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara... (tavuk, pilav, yumurta...)" className={inp} />
            <div className="max-h-[250px] overflow-y-auto mt-2">
              {filtered.map((f, i) => (
                <div key={i} onClick={() => { addFood(f); setSearch('') }}
                  className={`flex justify-between items-center p-3 border-b cursor-pointer hover:bg-black/[0.02] ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-black/5'}`}>
                  <div><strong className="text-sm">{f.name}</strong><br /><span className="text-xs text-[#57534E]">P:{f.p}g · Y:{f.f}g · K:{f.c}g</span></div>
                  <span className="font-semibold text-sm text-terracotta">{f.cal} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Günlük Besin Logu</h3>
            <button onClick={clearFoodLog} className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Temizle</button>
          </div>
          <div className="mb-6">
            {foodLog.length === 0 ? <p className="text-center text-[#57534E] py-8">Henüz besin eklenmedi.</p> : foodLog.map((f, i) => (
              <div key={i} className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                <span className="text-sm">{f.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm">{f.cal} kcal</span>
                  <button onClick={() => removeFood(i)} className="bg-transparent border-none cursor-pointer text-terracotta text-xl">×</button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className={`${cardBg} p-6 rounded-md mb-6`}>
            <h3 className="text-base font-medium mb-4">Günlük Toplam</h3>
            <div className="flex gap-3">
              {[
                { label: 'Kalori', value: totals.cal.toString(), color: 'text-terracotta' },
                { label: 'Protein', value: Math.round(totals.p) + 'g', color: 'text-sage' },
                { label: 'Yağ', value: Math.round(totals.f) + 'g', color: 'text-sand' },
                { label: 'Karb', value: Math.round(totals.c) + 'g', color: '' },
              ].map((t, i) => (
                <div key={i} className={`flex-1 text-center p-3 rounded-sm ${darkMode ? 'bg-card-dark' : 'bg-white'}`}>
                  <p className="text-[0.7rem] uppercase text-[#57534E]">{t.label}</p>
                  <p className={`text-xl font-semibold ${t.color}`}>{t.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">📋 WhatsApp Yemek Logu</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(waMsg).then(() => showToast('Kopyalandı!'))} className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Kopyala</button>
                <button onClick={() => { if (waMsg) window.open(`https://wa.me/?text=${encodeURIComponent(waMsg)}`, '_blank') }} className="px-3 py-1 text-xs rounded-full bg-terracotta text-white border-none cursor-pointer">Gönder</button>
              </div>
            </div>
            <textarea value={waMsg} readOnly rows={6} className={`${inp} font-mono`} />
          </div>
        </div>
      </div>
    </div>
  )
}
