import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStudentAuth } from '../../stores/studentAuth'
import { useStore } from '../../stores/useStore'

interface GeneratedExercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes: string
}

interface GeneratedWorkout {
  name: string
  warmup: string[]
  exercises: GeneratedExercise[]
  cooldown: string[]
  duration: string
  difficulty: string
  focus: string
}

const goalOptions = [
  { key: 'strength', label: 'Kuvvet Artışı', icon: '🏋️', desc: 'Ağır yükler, düşük tekrar' },
  { key: 'hypertrophy', label: 'Kas Gelişimi', icon: '💪', desc: 'Orta yük, yüksek hacim' },
  { key: 'fat-loss', label: 'Yağ Yakımı', icon: '🔥', desc: 'HIIT + direnç kombine' },
  { key: 'athletic', label: 'Atletik Performans', icon: '⚡', desc: 'Patlayıcı güç, hız' },
  { key: 'endurance', label: 'Dayanıklılık', icon: '🏃', desc: 'Yüksek tekrar, düşük dinlenme' },
  { key: 'flexibility', label: 'Esneklik & Mobilite', icon: '🧘', desc: 'Stretching, yoga elementleri' },
]

const muscleGroups = [
  { key: 'full', label: 'Full Body' },
  { key: 'upper', label: 'Üst Vücut' },
  { key: 'lower', label: 'Alt Vücut' },
  { key: 'push', label: 'Push' },
  { key: 'pull', label: 'Pull' },
  { key: 'core', label: 'Core' },
]

const equipmentOptions = [
  { key: 'full-gym', label: 'Tam Donanımlı Salon' },
  { key: 'home-basic', label: 'Ev (Dambıl + Bant)' },
  { key: 'bodyweight', label: 'Sadece Vücut Ağırlığı' },
  { key: 'resistance-bands', label: 'Direnç Bandı' },
]

// AI-generated workout templates based on parameters
function generateWorkout(goal: string, muscle: string, _equipment: string, _level: string): GeneratedWorkout {
  const workouts: Record<string, GeneratedWorkout> = {
    'strength-full': {
      name: 'Full Body Kuvvet Patlaması',
      warmup: ['5 dk dinamik ısınma', 'Hip Circle x20', 'Band Pull-Apart x15', 'Goblet Squat x10'],
      exercises: [
        { name: 'Barbell Back Squat', sets: 5, reps: '5', rest: '3-4 dk', notes: 'Ağırlığı kademeli artır. Derinlik önemli.' },
        { name: 'Bench Press', sets: 5, reps: '5', rest: '3 dk', notes: 'Kontrollü negatif faz, patlayıcı yukarı.' },
        { name: 'Barbell Row', sets: 4, reps: '6', rest: '2-3 dk', notes: 'Sırt düz, dirsekler vücuda yakın.' },
        { name: 'Overhead Press', sets: 4, reps: '6', rest: '2-3 dk', notes: 'Core sıkı, nefes kontrolü.' },
        { name: 'Romanian Deadlift', sets: 3, reps: '8', rest: '2 dk', notes: 'Hamstring gerginliği hisset.' },
        { name: 'Weighted Plank', sets: 3, reps: '45sn', rest: '90 sn', notes: 'Plaka sırta, nefes devam.' },
      ],
      cooldown: ['5 dk yürüyüş', 'Hamstring stretch 2x30sn', 'Pigeon stretch 2x30sn', 'Child\'s Pose 60sn'],
      duration: '65-75 dk',
      difficulty: 'İleri',
      focus: 'Kuvvet & Güç'
    },
    'hypertrophy-upper': {
      name: 'Üst Vücut Hacim Bombardımanı',
      warmup: ['5 dk band stretching', 'Arm Circles x20', 'Push-Up x10', 'Face Pull x15'],
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '90 sn', notes: 'Göğüs üstü odak, sıkma zirvede.' },
        { name: 'Cable Row', sets: 4, reps: '12', rest: '90 sn', notes: 'Kürek kemikleri birbirine yaklaştır.' },
        { name: 'Lateral Raise', sets: 4, reps: '15', rest: '60 sn', notes: 'Hafif ağırlık, yüksek kontrol.' },
        { name: 'Dips', sets: 3, reps: '12-15', rest: '90 sn', notes: 'Göğüs veya triceps odak seç.' },
        { name: 'EZ Bar Curl', sets: 3, reps: '12', rest: '60 sn', notes: 'Dirsek sabit, negatif yavaş.' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12', rest: '60 sn', notes: 'Tam açılım, kontrollü iniş.' },
        { name: 'Face Pull', sets: 3, reps: '20', rest: '45 sn', notes: 'Arka omuz ve sağlık hareketi.' },
      ],
      cooldown: ['Doorway chest stretch 2x30sn', 'Cross-body shoulder stretch', 'Cat-Cow x10', 'Deep breathing 60sn'],
      duration: '55-65 dk',
      difficulty: 'Orta',
      focus: 'Kas Hacmi & Estetik'
    },
    'fat-loss-full': {
      name: 'Metabolik Yakıcı Devre',
      warmup: ['3 dk jumping jacks', 'High Knees x30', 'Butt Kicks x30', 'Inchworm x5'],
      exercises: [
        { name: 'Goblet Squat → Push Press Combo', sets: 4, reps: '12', rest: '45 sn', notes: 'Akıcı geçiş, tempo yüksek.' },
        { name: 'Kettlebell Swing', sets: 4, reps: '15', rest: '30 sn', notes: 'Hip hinge, kalça ile it.' },
        { name: 'Renegade Row', sets: 3, reps: '10/taraf', rest: '45 sn', notes: 'Core stabil, kalça dönmesin.' },
        { name: 'Box Jump', sets: 3, reps: '10', rest: '45 sn', notes: 'Yumuşak iniş, diz bükük.' },
        { name: 'Battle Rope', sets: 3, reps: '30sn', rest: '30 sn', notes: 'Alternatif dalga, tüm vücut.' },
        { name: 'Burpee', sets: 3, reps: '10', rest: '45 sn', notes: 'Tam hareket açıklığı.' },
        { name: 'Mountain Climber', sets: 3, reps: '20/taraf', rest: '30 sn', notes: 'Hızlı ama kontrollü.' },
      ],
      cooldown: ['5 dk yavaş yürüyüş', 'Quad stretch 2x30sn', 'Figure-4 stretch', 'Deep breathing 2 dk'],
      duration: '40-50 dk',
      difficulty: 'Orta-İleri',
      focus: 'Yağ Yakımı & Kondisyon'
    },
    'athletic-lower': {
      name: 'Alt Vücut Patlayıcı Güç',
      warmup: ['5 dk dinamik ısınma', 'A-Skip x20', 'Lateral Shuffle x20', 'Glute Bridge x15'],
      exercises: [
        { name: 'Box Jump', sets: 4, reps: '5', rest: '2 dk', notes: 'Maksimum yükseklik, tam dinlenme.' },
        { name: 'Trap Bar Deadlift', sets: 4, reps: '5', rest: '3 dk', notes: 'Patlayıcı kalkış, kontrollü iniş.' },
        { name: 'Bulgarian Split Squat', sets: 3, reps: '8/taraf', rest: '90 sn', notes: 'Denge + güç kombinasyonu.' },
        { name: 'Sled Push', sets: 4, reps: '20m', rest: '90 sn', notes: 'Düşük pozisyon, güçlü itme.' },
        { name: 'Single Leg RDL', sets: 3, reps: '10/taraf', rest: '60 sn', notes: 'Denge ve hamstring odak.' },
        { name: 'Calf Raise (Tempo)', sets: 3, reps: '15', rest: '60 sn', notes: '3 sn yukarı, 3 sn aşağı.' },
      ],
      cooldown: ['Foam roll quads & hamstrings 3 dk', 'Pigeon stretch', 'Standing quad stretch', '90/90 hip stretch'],
      duration: '55-65 dk',
      difficulty: 'İleri',
      focus: 'Patlayıcı Güç & Atletizm'
    },
  }

  // Pick the best match or a default
  const key = `${goal}-${muscle}`
  return workouts[key] || workouts['strength-full'] || {
    name: 'Özelleştirilmiş Antrenman',
    warmup: ['5 dk genel ısınma', 'Dinamik stretching'],
    exercises: [
      { name: 'Squat Varyasyonu', sets: 4, reps: '8-10', rest: '2 dk', notes: 'Hedefinize uygun ağırlık seçin.' },
      { name: 'Çekme Hareketi', sets: 4, reps: '8-10', rest: '2 dk', notes: 'Sırt odaklı.' },
      { name: 'İtme Hareketi', sets: 4, reps: '8-10', rest: '2 dk', notes: 'Göğüs/omuz odaklı.' },
      { name: 'Core Hareketi', sets: 3, reps: '15', rest: '60 sn', notes: 'Stabilizasyon öncelikli.' },
    ],
    cooldown: ['5 dk soğuma', 'Stretching'],
    duration: '45-55 dk',
    difficulty: 'Orta',
    focus: goal
  }
}

export default function AIWorkoutGenerator() {
  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [selectedMuscle, setSelectedMuscle] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null)

  const { profile } = useStudentAuth()
  const darkMode = useStore(s => s.darkMode)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      const result = generateWorkout(selectedGoal, selectedMuscle, selectedEquipment, profile?.athlete_level || 'Rookie')
      setWorkout(result)
      setIsGenerating(false)
      setStep(3)
    }, 2000)
  }

  const cardBg = darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-2xl'

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border ${cardBg}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">🤖</div>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">AI Antrenman Oluşturucu</h2>
          <p className={`text-sm ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Hedefe özel akıllı program</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Goal */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-bold text-sm mb-4">Hedefiniz Nedir?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {goalOptions.map(g => (
                <button
                  key={g.key}
                  onClick={() => { setSelectedGoal(g.key); setStep(1) }}
                  className={`text-left p-5 rounded-2xl border transition-all group ${
                    selectedGoal === g.key
                      ? 'border-primary bg-primary/5'
                      : darkMode ? 'border-white/[0.06] hover:border-white/[0.12]' : 'border-black/[0.06] hover:border-black/[0.12]'
                  }`}
                >
                  <span className="text-2xl block mb-2">{g.icon}</span>
                  <span className="font-bold text-sm block">{g.label}</span>
                  <span className={`text-xs block mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>{g.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Muscle Group */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-bold text-sm mb-4">Hangi Bölge?</h3>
            <div className="grid grid-cols-3 gap-3">
              {muscleGroups.map(m => (
                <button
                  key={m.key}
                  onClick={() => { setSelectedMuscle(m.key); setStep(2) }}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    darkMode ? 'border-white/[0.06] hover:border-primary/30' : 'border-black/[0.06] hover:border-primary/30'
                  }`}
                >
                  <span className="font-bold text-sm">{m.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-xs text-primary font-medium">← Geri</button>
          </motion.div>
        )}

        {/* Step 2: Equipment */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-bold text-sm mb-4">Ekipman Durumu?</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {equipmentOptions.map(e => (
                <button
                  key={e.key}
                  onClick={() => { setSelectedEquipment(e.key); handleGenerate() }}
                  className={`p-5 rounded-2xl border text-center transition-all ${
                    darkMode ? 'border-white/[0.06] hover:border-primary/30' : 'border-black/[0.06] hover:border-primary/30'
                  }`}
                >
                  <span className="font-bold text-sm">{e.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-xs text-primary font-medium">← Geri</button>
          </motion.div>
        )}

        {/* Generating Animation */}
        {isGenerating && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">AI Programı Oluşturuyor...</h3>
            <p className={`text-sm ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
              Hedefinize ve seviyenize özel program hazırlanıyor.
            </p>
          </motion.div>
        )}

        {/* Step 3: Result */}
        {step === 3 && workout && !isGenerating && (
          <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Workout Header */}
            <div className={`p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-primary/5 border-primary/20' : 'bg-primary/5 border-primary/10'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl font-bold">{workout.name}</h3>
                <span className="text-2xl">🤖</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`}>⏱ {workout.duration}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`}>📊 {workout.difficulty}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`}>🎯 {workout.focus}</span>
              </div>
            </div>

            {/* Warmup */}
            <div className="mb-6">
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-primary mb-3">🔥 Isınma</h4>
              <div className="space-y-2">
                {workout.warmup.map((w, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm ${darkMode ? 'bg-white/[0.03]' : 'bg-black/[0.02]'}`}>
                    {w}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises */}
            <div className="mb-6">
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-primary mb-3">💪 Ana Antrenman</h4>
              <div className="space-y-3">
                {workout.exercises.map((ex, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{i + 1}. {ex.name}</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-white/30' : 'text-black/30'}`}>Dinlenme: {ex.rest}</span>
                    </div>
                    <div className="flex gap-4 mb-2">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{ex.sets} Set</span>
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">{ex.reps} Tekrar</span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-white/30' : 'text-black/30'}`}>💡 {ex.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooldown */}
            <div className="mb-6">
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-primary mb-3">🧊 Soğuma</h4>
              <div className="space-y-2">
                {workout.cooldown.map((c, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm ${darkMode ? 'bg-white/[0.03]' : 'bg-black/[0.02]'}`}>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setStep(0); setWorkout(null) }}
                className={`flex-1 py-3.5 rounded-xl border font-bold text-sm ${darkMode ? 'border-white/[0.08] text-white/50' : 'border-black/[0.08] text-black/50'}`}
              >
                Yeni Program Oluştur
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20"
              >
                Antrenmanı Başlat 🚀
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
