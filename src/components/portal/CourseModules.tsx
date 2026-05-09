import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { CheckCircle2, Lock, PlayCircle, ChevronRight, BookOpen } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
  lessons: { id: string; title: string; type: 'video' | 'reading'; duration: string; completed: boolean }[]
}

const demoModules: Module[] = [
  {
    id: '1',
    title: 'Hafta 1: Temeller ve Mobilite',
    description: 'Voleybol performans yolculuğuna temel hareket kalıpları ve eklem sağlığı ile başlıyoruz.',
    duration: '45 dk / gün',
    isCompleted: true,
    isLocked: false,
    lessons: [
      { id: '1-1', title: 'Dinamik Isınma Rutini', type: 'video', duration: '12:00', completed: true },
      { id: '1-2', title: 'Ankle Mobility Guide', type: 'reading', duration: '5 dk okuma', completed: true },
      { id: '1-3', title: 'Core Stabilizasyonu 101', type: 'video', duration: '15:00', completed: true },
    ]
  },
  {
    id: '2',
    title: 'Hafta 2: Patlayıcı Güç Başlangıcı',
    description: 'Sıçrama kapasitesini artırmak için plyometrik temelleri ve iniş mekaniklerini öğrenin.',
    duration: '60 dk / gün',
    isCompleted: false,
    isLocked: false,
    lessons: [
      { id: '2-1', title: 'Box Jump Teknikleri', type: 'video', duration: '18:00', completed: false },
      { id: '2-2', title: 'Landing Mechanics PDF', type: 'reading', duration: '8 dk okuma', completed: false },
      { id: '2-3', title: 'Alt Vücut Patlayıcılık', type: 'video', duration: '25:00', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Hafta 3: Üst Vücut ve Rotasyonel Güç',
    description: 'Smaç ve servis gücünü artırmak için omuz stabilitesi ve rotasyonel patlayıcılık.',
    duration: '50 dk / gün',
    isCompleted: false,
    isLocked: true,
    lessons: [
      { id: '3-1', title: 'Rotator Cuff Sağlığı', type: 'video', duration: '10:00', completed: false },
      { id: '3-2', title: 'Smaç Mekaniği Analizi', type: 'video', duration: '22:00', completed: false },
    ]
  }
]

export default function CourseModules() {
  const darkMode = useStore(s => s.darkMode)
  const [expandedModule, setExpandedModule] = useState<string | null>('1')

  const cardBg = darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-xl'

  return (
    <div className={`p-8 md:p-10 rounded-[2.5rem] border ${cardBg}`}>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight">Eğitim Programım 🎓</h2>
        <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`}>
          Adım adım ilerle, hedeflerine ulaş.
        </p>
      </div>

      <div className="space-y-4">
        {demoModules.map((module) => (
          <div
            key={module.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              darkMode ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-stone-50 border-black/[0.04]'
            } ${module.isLocked ? 'opacity-60 grayscale' : ''}`}
          >
            <button
              onClick={() => !module.isLocked && setExpandedModule(expandedModule === module.id ? null : module.id)}
              className="w-full text-left p-6 flex items-center justify-between gap-4"
              disabled={module.isLocked}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  module.isCompleted ? 'bg-green-500/10 text-green-500' :
                  module.isLocked ? 'bg-stone-500/10 text-stone-500' : 'bg-primary/10 text-primary'
                }`}>
                  {module.isCompleted ? <CheckCircle2 size={24} /> : module.isLocked ? <Lock size={24} /> : <span>{module.id}</span>}
                </div>
                <div>
                  <h3 className="font-bold text-base">{module.title}</h3>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-white/40' : 'text-stone-500'}`}>
                    {module.duration} • {module.lessons.length} Ders
                  </p>
                </div>
              </div>
              {!module.isLocked && (
                <ChevronRight
                  size={20}
                  className={`transition-transform ${expandedModule === module.id ? 'rotate-90' : ''} ${darkMode ? 'text-white/20' : 'text-stone-400'}`}
                />
              )}
            </button>

            <AnimatePresence>
              {expandedModule === module.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6"
                >
                  <p className={`text-sm mb-6 ${darkMode ? 'text-white/50' : 'text-stone-600'}`}>
                    {module.description}
                  </p>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer group ${
                          darkMode ? 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]' : 'bg-white border-black/[0.02] hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {lesson.type === 'video' ? <PlayCircle size={18} className="text-primary" /> : <BookOpen size={18} className="text-secondary" />}
                          <div>
                            <span className={`text-sm font-medium ${lesson.completed ? 'line-through opacity-50' : ''}`}>{lesson.title}</span>
                            <span className={`text-[0.65rem] ml-2 ${darkMode ? 'text-white/20' : 'text-stone-400'}`}>{lesson.duration}</span>
                          </div>
                        </div>
                        {lesson.completed && <CheckCircle2 size={16} className="text-green-500" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
