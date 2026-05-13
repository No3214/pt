import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
  price: number
  category: string
}

export default function CourseCatalog({ onSelectCourse }: { onSelectCourse: (id: string) => void }) {
  const { darkMode: dm } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (data) setCourses(data)
    setLoading(false)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <motion.div
            key={course.id}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2.5rem] border overflow-hidden cursor-pointer transition-all ${
              dm ? 'bg-white/[0.03] border-white/[0.06] hover:border-primary/30' : 'bg-white border-black/[0.04] shadow-xl hover:border-primary/30'
            }`}
            onClick={() => onSelectCourse(course.id)}
          >
            <div className="aspect-video rounded-2xl bg-black/5 mb-4 overflow-hidden relative">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{course.title}</h3>
            <p className={`text-sm line-clamp-2 mb-6 ${dm ? 'text-white/40' : 'text-black/40'}`}>
              {course.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-primary">
                {course.price > 0 ? `${course.price} TRY` : 'Ücretsiz'}
              </span>
              <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold">
                İncele
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 opacity-30">
          <p>Şu an yayında olan bir kurs bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}
