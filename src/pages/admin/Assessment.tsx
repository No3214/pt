import { useState, useRef } from 'react'
import { useStore } from '../../stores/useStore'

export default function Assessment() {
  const { measurements, addMeasurement, progressPhotos, addProgressPhoto, deleteProgressPhoto, showToast, darkMode } = useStore()
  const [fms, setFms] = useState({ deepSquat: 2, hurdleStep: 2, inlineLunge: 3, shoulderMobility: 1, activeStraightLeg: 2, coreStability: 3 })
  const [meas, setMeas] = useState({ shoulder: '', chest: '', waist: '', hip: '', leg: '', arm: '' })
  const [postureNotes, setPostureNotes] = useState('')
  const [postureImg, setPostureImg] = useState<string | null>(null)
  const progressInput = useRef<HTMLInputElement>(null)
  const postureInput = useRef<HTMLInputElement>(null)

  const fmsTotal = Object.values(fms).reduce((a, b) => a + b, 0)
  const fmsMax = Object.keys(fms).length * 3
  const fmsColor = (fmsTotal / fmsMax) > 0.7 ? 'text-sage' : 'text-terracotta'

  const inp = `w-full p-3 rounded-sm border outline-none transition-all focus:border-terracotta text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`
  const cardBg = darkMode ? 'bg-[#1a1a2e]' : 'bg-bg'

  const saveMeasurements = () => {
    addMeasurement({ ...meas, date: new Date().toLocaleDateString('tr-TR') })
    showToast('Ölçümler kaydedildi!')
  }

  const handlePosturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPostureImg(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleProgressPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 400
        let w = img.width, h = img.height
        if (w > h) { h = h * MAX / w; w = MAX } else { w = w * MAX / h; h = MAX }
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
        const compressed = canvas.toDataURL('image/jpeg', 0.7)
        addProgressPhoto({ src: compressed, date: new Date().toLocaleDateString('tr-TR') })
        showToast('Fotoğraf eklendi!')
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const fmsFields = [
    { key: 'deepSquat', label: 'Derin Squat' },
    { key: 'hurdleStep', label: 'Hurdle Step' },
    { key: 'inlineLunge', label: 'Inline Lunge' },
    { key: 'shoulderMobility', label: 'Omuz Mobilitesi' },
    { key: 'activeStraightLeg', label: 'Aktif Düz Bacak' },
    { key: 'coreStability', label: 'Core Stabilite' },
  ] as const

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold mb-8">Fiziksel Değerlendirme & Grafikler</h2>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left column */}
        <div className="space-y-6">
          {/* FMS */}
          <div className={`${cardBg} p-6 rounded-md`}>
            <h3 className="text-lg font-medium mb-4">📐 FMS Skorlama (0-3)</h3>
            <div className="grid grid-cols-2 gap-4">
              {fmsFields.map(f => (
                <div key={f.key}>
                  <label className="block mb-1 text-xs font-medium">{f.label}</label>
                  <input type="number" min={0} max={3} value={fms[f.key]}
                    onChange={e => setFms({ ...fms, [f.key]: Math.min(3, Math.max(0, +e.target.value)) })}
                    className={inp} />
                </div>
              ))}
            </div>
            <div className={`text-xl font-semibold text-right border-t mt-4 pt-4 ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
              Toplam: <span className={fmsColor}>{fmsTotal}/{fmsMax}</span>
            </div>
          </div>

          {/* Measurements */}
          <div className={`${cardBg} p-6 rounded-md`}>
            <h3 className="text-lg font-medium mb-4">📏 Çevre Ölçümleri (cm)</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['shoulder', 'chest', 'waist', 'hip', 'leg', 'arm'] as const).map(k => (
                <div key={k}>
                  <label className="block mb-1 text-xs">{k === 'shoulder' ? 'Omuz' : k === 'chest' ? 'Göğüs' : k === 'waist' ? 'Bel' : k === 'hip' ? 'Kalça' : k === 'leg' ? 'Sağ Bacak' : 'Sağ Kol'}</label>
                  <input type="number" value={meas[k]} onChange={e => setMeas({ ...meas, [k]: e.target.value })} placeholder="0" className={inp} />
                </div>
              ))}
            </div>
            <button onClick={saveMeasurements} className={`w-full mt-4 py-3 rounded-full border cursor-pointer transition-all ${darkMode ? 'border-white/15 text-white bg-transparent hover:bg-white/5' : 'border-black/10 bg-transparent hover:bg-black/[0.02]'}`}>Ölçümleri Kaydet</button>
          </div>
        </div>

        {/* Right column - Posture */}
        <div className={`${cardBg} p-6 rounded-md`}>
          <h3 className="text-lg font-medium mb-4">👤 Postür Analizi</h3>
          <p className="text-sm text-[#57534E] mb-4">Kifoz, lordoz veya asimetri analizi için fotoğraf ekleyin.</p>
          <div onClick={() => postureInput.current?.click()}
            className={`aspect-[4/3] border-2 border-dashed rounded-sm mb-4 flex items-center justify-center cursor-pointer overflow-hidden ${darkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'}`}>
            {postureImg ? <img src={postureImg} alt="Postür" className="w-full h-full object-cover" /> : (
              <div className="text-center text-[#57534E]"><div className="text-3xl mb-2">📸</div><div className="text-sm">Postür Fotoğrafı Yükle</div></div>
            )}
          </div>
          <input ref={postureInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePosturePhoto} />
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Notlar ve Düzeltici Egzersiz Hedefleri</label>
            <textarea value={postureNotes} onChange={e => setPostureNotes(e.target.value)} rows={4} placeholder="Örn: Anterior pelvik tilt gözlendi..." className={`${inp} resize-y`} />
          </div>
          <button onClick={() => showToast('Analiz kaydedildi!')} className="btn-ripple w-full py-3 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">Analizi Kaydet</button>
        </div>
      </div>

      {/* Progress Photos */}
      <div className={`mt-8 ${cardBg} p-6 rounded-md`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">📸 İlerleme Fotoğrafları (Before/After)</h3>
          <button onClick={() => progressInput.current?.click()} className="px-4 py-2 rounded-full bg-terracotta text-white text-sm border-none cursor-pointer">+ Fotoğraf Ekle</button>
        </div>
        <input ref={progressInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleProgressPhoto} />
        <div className="flex gap-4 overflow-x-auto py-4">
          {progressPhotos.length === 0 ? (
            <p className="text-center text-[#57534E] w-full py-8">Henüz fotoğraf eklenmedi.</p>
          ) : progressPhotos.map((p, i) => (
            <div key={i} className={`flex-shrink-0 w-40 rounded-sm overflow-hidden border ${darkMode ? 'border-white/10' : 'border-black/5'}`}>
              <img src={p.src} alt={`İlerleme ${p.date}`} className="w-40 h-48 object-cover" />
              <div className="p-2 text-center text-xs">
                <div className="font-semibold">{p.date}</div>
                <button onClick={() => deleteProgressPhoto(i)} className="bg-transparent border-none cursor-pointer text-terracotta text-xs mt-1">Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
