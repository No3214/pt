import { useState } from 'react'
import { useStore } from '../stores/useStore'
import { turkishFoods, sanitize, type FoodItem } from '../lib/constants'

export default function Portal() {
  const { darkMode, showToast } = useStore()
  const [foodLog, setFoodLog] = useState<FoodItem[]>([])
  const [search, setSearch] = useState('')
  const [habits, setHabits] = useState([false, false, false, false])

  const filtered = search.length >= 2 ? turkishFoods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())) : []
  const totals = foodLog.reduce((a, f) => ({ cal: a.cal + f.cal, p: a.p + f.p, f: a.f + f.f, c: a.c + f.c }), { cal: 0, p: 0, f: 0, c: 0 })
  const habitLabels = ['💧 3 Litre Su İçtim', '💤 8 Saat Uyudum', '🥩 Protein Hedefimi Tuttum', '🚶 10.000 Adım Attım']

  const addFood = (f: FoodItem) => { setFoodLog([...foodLog, f]); setSearch('') }
  const removeFood = (i: number) => setFoodLog(foodLog.filter((_, idx) => idx !== i))

  const submitHabits = () => {
    const done = habits.filter(Boolean).length
    showToast(`${done}/4 alışkanlık tamamlandı! Koçunuza bildirildi.`)
    setHabits([false, false, false, false])
  }

  return (
    <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-[#1a1a2e] text-white' : 'bg-bg'}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-semibold mb-2">Hoşgeldin 👋</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-[#57534E]'}>Antrenman ve beslenme takibini buradan yapabilirsin.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Food Log */}
          <div className={`card-hover p-6 rounded-lg border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="font-display text-xl font-semibold mb-4">🍽 Günlük Yemek Logu</h3>
            <div className="mb-4">
              {foodLog.length === 0 ? <p className="text-sm text-[#57534E]">Henüz yemek eklenmedi.</p> : foodLog.map((f, i) => (
                <div key={i} className={`flex justify-between items-center py-2 border-b text-sm ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                  <span>{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{f.cal} kcal</span>
                    <button onClick={() => removeFood(i)} className="bg-transparent border-none cursor-pointer text-terracotta">×</button>
                  </div>
                </div>
              ))}
            </div>
            <input value={search} onChange={e => setSearch(sanitize(e.target.value))} placeholder="Yemek ara..."
              className={`w-full p-3 rounded-sm border outline-none text-sm mb-2 ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-black/[0.02] border-black/5'}`} />
            <div className="max-h-[200px] overflow-y-auto">
              {filtered.map((f, i) => (
                <div key={i} onClick={() => addFood(f)}
                  className={`flex justify-between items-center p-2 border-b cursor-pointer text-sm ${darkMode ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/[0.02]'}`}>
                  <span>{f.name}</span>
                  <span className="text-terracotta font-semibold">{f.cal} kcal</span>
                </div>
              ))}
            </div>
          </div>

          {/* Habits */}
          <div className={`card-hover p-6 rounded-lg border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="font-display text-xl font-semibold mb-4">💧 Günlük Habit Check-in</h3>
            <div className="space-y-3">
              {habitLabels.map((h, i) => (
                <label key={i} className={`flex items-center gap-3 p-3 rounded-sm cursor-pointer ${darkMode ? 'bg-white/5' : 'bg-bg'}`}>
                  <input type="checkbox" checked={habits[i]} onChange={() => { const n = [...habits]; n[i] = !n[i]; setHabits(n) }}
                    className="w-5 h-5 accent-sage" />
                  <span className="text-sm">{h}</span>
                </label>
              ))}
            </div>
            <button onClick={submitHabits} className="btn-ripple w-full mt-4 py-3 rounded-full bg-terracotta text-white font-medium border-none cursor-pointer">Gönder ✅</button>
          </div>

          {/* Macros */}
          <div className={`card-hover p-6 rounded-lg border ${darkMode ? 'bg-card-dark border-white/5' : 'bg-white border-black/5'}`}>
            <h3 className="font-display text-xl font-semibold mb-4">📊 Bugünkü Makrolarım</h3>
            <div className="space-y-3">
              {[
                { label: 'Kalori', value: totals.cal, color: 'text-terracotta' },
                { label: 'Protein', value: Math.round(totals.p) + 'g', color: 'text-sage' },
                { label: 'Yağ', value: Math.round(totals.f) + 'g', color: 'text-sand' },
                { label: 'Karb', value: Math.round(totals.c) + 'g', color: '' },
              ].map((t, i) => (
                <div key={i} className={`text-center p-3 rounded-sm ${darkMode ? 'bg-white/5' : 'bg-bg'}`}>
                  <p className="text-[0.7rem] uppercase text-[#57534E]">{t.label}</p>
                  <p className={`text-xl font-semibold ${t.color}`}>{t.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
