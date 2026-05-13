import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'
import CourseBuilder from '../../components/admin/CourseBuilder'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price: number
  category: string
  is_published: boolean
}

export default function Courses() {
  const { darkMode: dm, showToast, setActiveCourse, activeCourseId } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      showToast('Kurslar yüklenirken hata oluştu')
    } else {
      setCourses(data || [])
    }
    setLoading(false)
  }

  const handleCreateCourse = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        title: 'Yeni Kurs',
        coach_id: user.id,
        description: 'Kurs açıklaması buraya gelecek',
        is_published: false
      }])
      .select()
      .single()

    if (error) {
      showToast('Kurs oluşturulamadı')
    } else {
      setCourses([data, ...courses])
      setActiveCourse(data.id)
      setIsBuilderOpen(true)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Bu kursu silmek istediğinize emin misiniz?')) return

    const { error } = await supabase.from('courses').delete().eq('id', id)
    if (error) {
      showToast('Kurs silinemedi')
    } else {
      setCourses(courses.filter(c => c.id !== id))
      showToast('Kurs silindi')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Kurs Yönetimi 📚</h2>
          <p className={`text-sm mt-1 ${dm ? 'text-white/40' : 'text-black/40'}`}>
            Udemy tarzı eğitim içeriklerinizi buradan yönetin.
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          + Yeni Kurs Oluştur
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course.id}
              className={`p-6 rounded-[2rem] border transition-all ${
                dm ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-black/[0.04] shadow-xl'
              }`}
            >
              <div className="aspect-video rounded-2xl bg-black/5 mb-4 overflow-hidden relative">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🎓</div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-[0.6rem] font-bold uppercase ${
                    course.is_published ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {course.is_published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className={`text-sm line-clamp-2 mb-6 ${dm ? 'text-white/40' : 'text-black/40'}`}>
                {course.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setActiveCourse(course.id); setIsBuilderOpen(true) }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    dm ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                  }`}
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {courses.length === 0 && !loading && (
        <div className={`text-center py-20 rounded-[3rem] border-2 border-dashed ${
          dm ? 'border-white/10' : 'border-black/5'
        }`}>
          <div className="text-5xl mb-4">🌑</div>
          <h3 className="font-bold">Henüz kursunuz yok</h3>
          <p className={`text-sm mt-1 ${dm ? 'text-white/30' : 'text-black/30'}`}>İlk kursunuzu oluşturarak öğrencilerinize değer katmaya başlayın.</p>
        </div>
      )}

      {/* Course Builder Modal */}
      <AnimatePresence>
        {isBuilderOpen && activeCourseId && (
          <CourseBuilder onClose={() => { setIsBuilderOpen(false); fetchCourses() }} />
        )}
      </AnimatePresence>
    </div>
  )
}
