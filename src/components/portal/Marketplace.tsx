import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

interface Course {
  id: string
  title: string
  price: number
}

export default function Marketplace() {
  const { darkMode: dm, showToast } = useStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarketplace()
  }, [])

  const fetchMarketplace = async () => {
    const { data } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('is_published', true)

    if (data) setCourses(data)
    setLoading(false)
  }

  const handleEnroll = async (courseId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showToast('Lütfen önce giriş yapın')
      return
    }

    const { error } = await supabase
      .from('enrollments')
      .insert([{ student_id: user.id, course_id: courseId }])

    if (error) {
      if (error.code === '23505') showToast('Zaten bu kursa kayıtlısınız')
      else showToast('Kayıt sırasında bir hata oluştu')
      return
    }

    // Record payment if price > 0
    const course = courses.find(c => c.id === courseId)
    if (course && course.price > 0) {
      await supabase
        .from('payments')
        .insert([{
          user_id: user.id,
          course_id: courseId,
          amount: course.price,
          status: 'completed' // In a real app, this would be 'pending' until gateway success
        }])
    }

    showToast('Kursa başarıyla kayıt oldunuz!')
  }

  return (
    <div className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
      <h3 className="font-display text-2xl font-bold mb-6">Marketplace 🛒</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-black/5 rounded-2xl" />)}
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className={`p-5 rounded-2xl border flex items-center justify-between ${
              dm ? 'bg-white/5 border-white/5' : 'bg-bg border-black/5'
            }`}>
              <div>
                <h4 className="font-bold text-sm">{course.title}</h4>
                <p className="text-xs text-primary font-bold">{course.price > 0 ? `${course.price} TRY` : 'Ücretsiz'}</p>
              </div>
              <button
                onClick={() => handleEnroll(course.id)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-[0.65rem] font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
              >
                Hemen Al
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
