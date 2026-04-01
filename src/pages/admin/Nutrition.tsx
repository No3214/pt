import { useState } from 'react'
import { useStore } from '../../stores/useStore'
import { toPng } from 'html-to-image'

export default function Nutrition() {
  const { darkMode, showToast } = useStore()
  const [form, setForm] = useState({ gender: 'female', age: 23, weight: 65, height: 175, activity: 1.55, goal: 0 })
  const [result, setResult] = useState<{ bmr: number; targetCals: number; proteinG: number; fatG: number; carbG: number; proteinCal: number; fatCal: number; carbCal: number } | null>(null)
  const [waPreview, setWaPreview] = useState('')

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'

  const calculate = () => {
    let bmr = (10 * form.weight) + (6.25 * form.height) - (5 * form.age)
    bmr += form.gender === 'male' ? 5 : -161
    bmr = Math.round(bmr)
    const tdee = Math.round(bmr * form.activity)
    const targetCals = tdee + form.goal
    const proteinG = Math.round(form.weight * 2.2)
    const proteinCal = proteinG * 4
    const fatCal = Math.round(targetCals * 0.25)
    const fatG = Math.round(fatCal / 9)
    const carbCal = targetCals - proteinCal - fatCal
    const carbG = Math.round(carbCal / 4)
    setResult({ bmr, targetCals, proteinG, fatG, carbG, proteinCal, fatCal, carbCal })
    const wa = `🥗 *ELA EBEOĞLU — Beslenme Planı*\n━━━━━━━━━━━━━━━━━━━━\n🎯 Hedef Kalori: ${targetCals} kcal\n\n*Günlük Makro Dağılımın:*\n🥩 Protein: ${proteinG}g\n🥑 Yağ: ${fatG}g\n🍚 Karbonhidrat: ${carbG}g\n\n📌 *Antrenman Günü Notu:*\nKarbonhidratlarının %60'ını antrenman öncesi ve sonrası 2 öğüne böl.\n\n📌 *Dinlenme Günü Notu:*\nKarbonhidratı azaltıp yağ oranını artırabilirsin. Protein sabit tut.`
    setWaPreview(wa)
  }

  const copyText = () => {
    navigator.clipboard.writeText(waPreview).then(() => showToast('Panoya kopyalandı!'))
  }

  const downloadPNG = async () => {
    const el = document.getElementById('diet-export')
    if (!el) return
    el.style.left = '0'
    try {
      const url = await toPng(el, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'ElaEbeoglu_Diyet.png'
      link.href = url
      link.click()
    } catch { showToast('PNG oluşturulamadı') }
    el.style.left = '-9999px'
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h2 className="font-display text-3xl font-semibold">TDEE & Makro Hesaplayıcı</h2>
        <span className="px-3 py-1 rounded-full text-xs bg-sky-100 text-sky-700">Mifflin-St Jeor Algoritması</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Input */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="font-display text-xl mb-6">Fiziksel Veriler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Cinsiyet</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inp}>
                <option value="female">Kadın</option><option value="male">Erkek</option>
              </select>
            </div>
            <div><label className="block mb-1 text-sm font-medium">Yaş</label><input type="number" value={form.age} onChange={e => setForm({ ...form, age: +e.target.value })} className={inp} /></div>
            <div><label className="block mb-1 text-sm font-medium">Kilo (kg)</label><input type="number" step={0.1} value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} className={inp} /></div>
            <div><label className="block mb-1 text-sm font-medium">Boy (cm)</label><input type="number" value={form.height} onChange={e => setForm({ ...form, height: +e.target.value })} className={inp} /></div>
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Aktivite Seviyesi</label>
            <select value={form.activity} onChange={e => setForm({ ...form, activity: +e.target.value })} className={inp}>
              <option value={1.2}>Sedanter</option><option value={1.375}>Hafif Aktif (1-3 gün)</option>
              <option value={1.55}>Orta Aktif (3-5 gün)</option><option value={1.725}>Çok Aktif (6-7 gün)</option>
              <option value={1.9}>Aşırı Aktif (Profesyonel)</option>
            </select>
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Hedef</label>
            <select value={form.goal} onChange={e => setForm({ ...form, goal: +e.target.value })} className={inp}>
              <option value={-500}>Yağ Yakımı (-500 kcal)</option><option value={0}>Koruma & Performans</option>
              <option value={300}>Kas Kazanımı (+300 kcal)</option>
            </select>
          </div>
          <button onClick={calculate} className="btn-ripple w-full mt-6 py-4 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">Hesapla & Plan Çıkar</button>
        </div>

        {/* Results */}
        <div className={`transition-opacity ${result ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          {result && (
            <>
              <div className={`flex justify-between items-end border-b pb-4 mb-6 ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#57534E]">Günlük Hedef Kalori</p>
                  <p className="font-display text-5xl text-terracotta">{result.targetCals}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-[#57534E]">BMR</p>
                  <p className="text-xl font-semibold">{result.bmr} kcal</p>
                </div>
              </div>
              <h3 className="font-display text-xl mb-4">Makro Dağılımı</h3>
              <div className="flex gap-4 mb-8">
                {[
                  { label: 'Protein (2g/kg)', g: result.proteinG, cal: result.proteinCal, color: 'border-l-sage' },
                  { label: 'Yağ (%25)', g: result.fatG, cal: result.fatCal, color: 'border-l-sand' },
                  { label: 'Karbonhidrat', g: result.carbG, cal: result.carbCal, color: 'border-l-terracotta' },
                ].map((m, i) => (
                  <div key={i} className={`flex-1 p-4 rounded-md border border-l-4 text-center ${m.color} ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
                    <p className="text-xs uppercase tracking-wider text-[#57534E]">{m.label}</p>
                    <p className="text-2xl font-semibold">{m.g}g</p>
                    <p className="text-xs text-[#57534E]">{m.cal} kcal</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">📋 WhatsApp Tavsiye Çıktısı</span>
                  <div className="flex gap-2">
                    <button onClick={downloadPNG} className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>PNG İndir 📸</button>
                    <button onClick={copyText} className={`px-3 py-1 text-xs rounded-full border cursor-pointer ${darkMode ? 'border-white/15 text-white bg-transparent' : 'border-black/10 bg-transparent'}`}>Kopyala</button>
                  </div>
                </div>
                <textarea value={waPreview} onChange={e => setWaPreview(e.target.value)} rows={8} className={`${inp} font-mono`} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden export */}
      <div id="diet-export" style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 550, background: '#FAF6F1', padding: '3rem 2rem', borderRadius: 12, fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '3px solid #7A9E82', paddingBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', color: '#1C1917', margin: 0 }}>ELA EBEOĞLU</h2>
          <div style={{ fontSize: '0.9rem', color: '#C2684A', letterSpacing: 4, marginTop: '0.5rem', fontWeight: 600 }}>PERFORMANCE NUTRITION</div>
        </div>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.15rem', lineHeight: 1.7, color: '#333' }}
          dangerouslySetInnerHTML={{ __html: waPreview.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>') }} />
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#57534E', opacity: 0.8 }}>📸 @ela.ebeoglu | 🌐 elaebeoglu.com</div>
      </div>
    </div>
  )
}
