import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

interface ExerciseVideo {
  id: string
  name: string
  name_tr: string
  description_tr?: string
  youtube_id?: string
  thumbnail_url?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite'
  muscle_groups: string[]
  equipment: string[]
  category_name?: string
  view_count: number
}

const categories = [
  { key: 'all', label: 'Tümü', icon: '🏋️' },
  { key: 'chest', label: 'Göğüs', icon: '💪' },
  { key: 'back', label: 'Sırt', icon: '🔙' },
  { key: 'legs', label: 'Bacak', icon: '🦵' },
  { key: 'shoulders', label: 'Omuz', icon: '🤸' },
  { key: 'arms', label: 'Kol', icon: '💪' },
  { key: 'core', label: 'Core', icon: '🧘' },
  { key: 'cardio', label: 'Kardiyo', icon: '❤️' },
  { key: 'flexibility', label: 'Esneklik', icon: '🧘‍♀️' },
]

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Başlangıç', color: 'bg-green-500/20 text-green-600' },
  intermediate: { label: 'Orta', color: 'bg-blue-500/20 text-blue-600' },
  advanced: { label: 'İleri', color: 'bg-orange-500/20 text-orange-600' },
  elite: { label: 'Elit', color: 'bg-red-500/20 text-red-600' },
}

// Demo data for when Supabase isn't connected
const demoExercises: ExerciseVideo[] = [
  { id: '1', name: 'Barbell Back Squat', name_tr: 'Barbell Back Squat', difficulty: 'intermediate', muscle_groups: ['legs', 'core'], equipment: ['barbell'], youtube_id: 'ultWZbUMPL8', view_count: 1250, description_tr: 'Bacak ve core için temel bileşik hareket. Derinlik ve form çok önemli.' },
  { id: '2', name: 'Bench Press', name_tr: 'Bench Press', difficulty: 'intermediate', muscle_groups: ['chest', 'arms'], equipment: ['barbell', 'bench'], youtube_id: 'rT7DgCr-3pg', view_count: 980, description_tr: 'Göğüs kasları için en etkili bileşik hareket.' },
  { id: '3', name: 'Deadlift', name_tr: 'Deadlift', difficulty: 'advanced', muscle_groups: ['back', 'legs'], equipment: ['barbell'], youtube_id: 'op9kVnSso6Q', view_count: 1100, description_tr: 'Tüm vücut için en güçlü bileşik hareket.' },
  { id: '4', name: 'Pull Up', name_tr: 'Barfiks', difficulty: 'intermediate', muscle_groups: ['back', 'arms'], equipment: ['bar'], youtube_id: 'eGo4IYlbE5g', view_count: 870, description_tr: 'Sırt ve biceps için mükemmel vücut ağırlığı hareketi.' },
  { id: '5', name: 'Overhead Press', name_tr: 'Overhead Press', difficulty: 'intermediate', muscle_groups: ['shoulders', 'arms'], equipment: ['barbell'], youtube_id: '_RlRDWO2jfg', view_count: 650, description_tr: 'Omuz ve triceps geliştirme için temel bileşik hareket.' },
  { id: '6', name: 'Romanian Deadlift', name_tr: 'Romanian Deadlift', difficulty: 'intermediate', muscle_groups: ['legs', 'back'], equipment: ['barbell'], youtube_id: '7j-2w4-P14I', view_count: 720, description_tr: 'Hamstring ve glute odaklı çekme hareketi.' },
  { id: '7', name: 'Plank', name_tr: 'Plank', difficulty: 'beginner', muscle_groups: ['core'], equipment: [], youtube_id: 'ASdvN_XEl_c', view_count: 1500, description_tr: 'Core stabilizasyonu için temel izometrik egzersiz.' },
  { id: '8', name: 'Box Jump', name_tr: 'Kutu Atlama', difficulty: 'advanced', muscle_groups: ['legs', 'cardio'], equipment: ['box'], youtube_id: '52r_Ul5k03g', view_count: 430, description_tr: 'Patlayıcı güç ve atletizm geliştirme.' },
  { id: '9', name: 'Hip Thrust', name_tr: 'Hip Thrust', difficulty: 'intermediate', muscle_groups: ['legs', 'core'], equipment: ['barbell', 'bench'], youtube_id: 'SEdqd1n0cvg', view_count: 890, description_tr: 'Glute aktivasyonu ve güçlendirme için en etkili hareket.' },
  { id: '10', name: 'Face Pull', name_tr: 'Face Pull', difficulty: 'beginner', muscle_groups: ['shoulders', 'back'], equipment: ['cable'], youtube_id: 'rep-qVOkqgk', view_count: 560, description_tr: 'Arka omuz ve rotator cuff sağlığı için kritik hareket.' },
  { id: '11', name: 'Bulgarian Split Squat', name_tr: 'Bulgar Split Squat', difficulty: 'advanced', muscle_groups: ['legs'], equipment: ['dumbbell'], youtube_id: '2C-uNgKwPLE', view_count: 670, description_tr: 'Tek bacak gücü ve denge geliştirme.' },
  { id: '12', name: 'Cable Crunch', name_tr: 'Cable Crunch', difficulty: 'intermediate', muscle_groups: ['core'], equipment: ['cable'], youtube_id: 'AV5PmrIHsCY', view_count: 340, description_tr: 'Karın kasları için ağırlıklı izolasyon hareketi.' },
]

export default function VideoLibrary() {
  const [exercises, setExercises] = useState<ExerciseVideo[]>(demoExercises)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<ExerciseVideo | null>(null)
  const darkMode = useStore(s => s.darkMode)

  useEffect(() => {
    // Try to fetch from Supabase, fall back to demo data
    const fetchExercises = async () => {
      try {
        const { data } = await supabase.from('exercise_library').select('*').order('view_count', { ascending: false })
        if (data && data.length > 0) setExercises(data)
      } catch {}
    }
    fetchExercises()
  }, [])

  const filtered = exercises.filter(ex => {
    if (selectedCategory !== 'all' && !ex.muscle_groups.includes(selectedCategory)) return false
    if (selectedDifficulty && ex.difficulty !== selectedDifficulty) return false
    if (searchQuery && !ex.name_tr.toLowerCase().includes(searchQuery.toLowerCase()) && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const cardBg = darkMode ? 'bg-white/[0.03] border-white/[0.06] hover:border-primary/30' : 'bg-white border-black/[0.04] hover:border-primary/30 shadow-lg'

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Egzersiz Kütüphanesi 📚</h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
            {exercises.length} egzersiz • Video ve teknik rehber
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full md:w-72">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Egzersiz ara..."
            className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm ${
              darkMode ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20' : 'bg-bg border-black/[0.06] text-black placeholder:text-black/20'
            }`}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : darkMode ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08]' : 'bg-black/[0.03] text-black/50 hover:bg-black/[0.06]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2 mb-8">
        {Object.entries(difficultyLabels).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setSelectedDifficulty(selectedDifficulty === key ? null : key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDifficulty === key ? val.color + ' ring-2 ring-current/20' : darkMode ? 'bg-white/[0.04] text-white/30' : 'bg-black/[0.03] text-black/30'
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ex, i) => (
          <motion.button
            key={ex.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedVideo(ex)}
            className={`text-left p-5 rounded-2xl border transition-all group cursor-pointer ${cardBg}`}
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-black/10">
              {ex.youtube_id ? (
                <img
                  src={`https://img.youtube.com/vi/${ex.youtube_id}/mqdefault.jpg`}
                  alt={ex.name_tr}
                  loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🏋️</div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-1">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              {/* Difficulty Badge */}
              <span className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[0.55rem] font-bold ${difficultyLabels[ex.difficulty].color}`}>
                {difficultyLabels[ex.difficulty].label}
              </span>
            </div>

            {/* Info */}
            <h3 className="font-bold text-sm mb-1">{ex.name_tr}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ex.muscle_groups.slice(0, 3).map(mg => (
                <span key={mg} className={`px-2 py-0.5 rounded-md text-[0.6rem] font-bold uppercase tracking-wider ${
                  darkMode ? 'bg-white/[0.06] text-white/30' : 'bg-black/[0.04] text-black/30'
                }`}>
                  {categories.find(c => c.key === mg)?.label || mg}
                </span>
              ))}
            </div>
            <div className={`flex items-center gap-2 mt-3 text-[0.6rem] ${darkMode ? 'text-white/20' : 'text-black/20'}`}>
              <span>👁 {ex.view_count}</span>
              {ex.equipment.length > 0 && <span>• {ex.equipment.join(', ')}</span>}
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <p className="font-bold text-sm">Egzersiz bulunamadı</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Filtrelerinizi değiştirmeyi deneyin.</p>
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-3xl rounded-3xl overflow-hidden ${darkMode ? 'bg-surface' : 'bg-white'}`}
            >
              {/* Video */}
              {selectedVideo.youtube_id && (
                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              )}
              {/* Info */}
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">{selectedVideo.name_tr}</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-black/40'}`}>{selectedVideo.name}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${difficultyLabels[selectedVideo.difficulty].color}`}>
                    {difficultyLabels[selectedVideo.difficulty].label}
                  </span>
                </div>
                {selectedVideo.description_tr && (
                  <p className={`mt-4 text-sm leading-relaxed ${darkMode ? 'text-white/50' : 'text-black/50'}`}>
                    {selectedVideo.description_tr}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedVideo.muscle_groups.map(mg => (
                    <span key={mg} className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                      {categories.find(c => c.key === mg)?.label || mg}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="mt-6 w-full py-3 rounded-xl bg-primary text-white font-bold text-sm"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
