import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

interface Lesson {
  id: string
  title: string
  video_url: string
  content: string
  sort_order: number
}

interface Section {
  id: string
  title: string
  sort_order: number
  lessons: Lesson[]
}

export default function CourseBuilder({ onClose }: { onClose: () => void }) {
  const { darkMode: dm, showToast, activeCourseId } = useStore()
  const [course, setCourse] = useState<any>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeCourseId) fetchCourseData()
  }, [activeCourseId])

  const fetchCourseData = async () => {
    setLoading(true)
    const { data: courseData } = await supabase.from('courses').select('*').eq('id', activeCourseId).single()
    setCourse(courseData)

    const { data: sectionsData } = await supabase
      .from('course_sections')
      .select('*, course_lessons(*)')
      .eq('course_id', activeCourseId)
      .order('sort_order', { ascending: true })

    if (sectionsData) {
      setSections(sectionsData.map(s => ({
        ...s,
        lessons: (s.course_lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      })))
    }
    setLoading(false)
  }

  const handleUpdateCourse = async (updates: any) => {
    const { error } = await supabase.from('courses').update(updates).eq('id', activeCourseId)
    if (error) showToast('Hata oluştu')
    else setCourse({ ...course, ...updates })
  }

  const handleAddSection = async () => {
    const { data, error } = await supabase
      .from('course_sections')
      .insert([{ course_id: activeCourseId, title: 'Yeni Bölüm', sort_order: sections.length }])
      .select()
      .single()

    if (data) setSections([...sections, { ...data, lessons: [] }])
  }

  const handleAddLesson = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    const { data, error } = await supabase
      .from('course_lessons')
      .insert([{
        section_id: sectionId,
        title: 'Yeni Ders',
        sort_order: section.lessons.length
      }])
      .select()
      .single()

    if (data) {
      setSections(sections.map(s => s.id === sectionId ? { ...s, lessons: [...s.lessons, data] } : s))
    }
  }

  const handleUpdateLesson = async (lessonId: string, sectionId: string, updates: any) => {
    const { error } = await supabase.from('course_lessons').update(updates).eq('id', lessonId)
    if (!error) {
      setSections(sections.map(s => s.id === sectionId ? {
        ...s,
        lessons: s.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
      } : s))
    }
  }

  if (loading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`w-full max-w-5xl h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden ${
          dm ? 'bg-bg border border-white/10' : 'bg-white shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${dm ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="font-display text-xl font-bold">Kurs Düzenleyici</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleUpdateCourse({ is_published: !course.is_published })}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                course.is_published
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}
            >
              {course.is_published ? '✅ Yayında' : '📋 Taslak'}
            </button>
            <button onClick={onClose} className="px-6 py-2 rounded-xl bg-primary text-white font-bold text-sm">
              Kaydet ve Kapat
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Sidebar: Course Metadata */}
            <div className="space-y-6">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest opacity-40 mb-2 block">Kurs Başlığı</label>
                <input
                  type="text"
                  value={course?.title}
                  onChange={e => handleUpdateCourse({ title: e.target.value })}
                  className={`w-full p-4 rounded-2xl border outline-none ${
                    dm ? 'bg-white/5 border-white/10 focus:border-primary/50' : 'bg-bg border-black/5 focus:border-primary/50'
                  }`}
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest opacity-40 mb-2 block">Açıklama</label>
                <textarea
                  rows={4}
                  value={course?.description}
                  onChange={e => handleUpdateCourse({ description: e.target.value })}
                  className={`w-full p-4 rounded-2xl border outline-none resize-none ${
                    dm ? 'bg-white/5 border-white/10 focus:border-primary/50' : 'bg-bg border-black/5 focus:border-primary/50'
                  }`}
                />
              </div>
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-widest opacity-40 mb-2 block">Fiyat (TRY)</label>
                <input
                  type="number"
                  value={course?.price}
                  onChange={e => handleUpdateCourse({ price: parseFloat(e.target.value) })}
                  className={`w-full p-4 rounded-2xl border outline-none ${
                    dm ? 'bg-white/5 border-white/10 focus:border-primary/50' : 'bg-bg border-black/5 focus:border-primary/50'
                  }`}
                />
              </div>
            </div>

            {/* Main Content: Sections & Lessons */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Müfredat</h3>
                <button
                  onClick={handleAddSection}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Yeni Bölüm Ekle
                </button>
              </div>

              {sections.map(section => (
                <div key={section.id} className={`rounded-[2rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-bg border-black/5'}`}>
                  <div className="p-5 flex items-center justify-between">
                    <input
                      type="text"
                      value={section.title}
                      onChange={async e => {
                        const newTitle = e.target.value
                        await supabase.from('course_sections').update({ title: newTitle }).eq('id', section.id)
                        setSections(sections.map(s => s.id === section.id ? { ...s, title: newTitle } : s))
                      }}
                      className="bg-transparent font-bold outline-none focus:text-primary transition-colors"
                    />
                    <button
                      onClick={() => handleAddLesson(section.id)}
                      className="text-[0.6rem] font-bold uppercase tracking-tighter bg-primary/10 text-primary px-3 py-1.5 rounded-lg"
                    >
                      Ders Ekle
                    </button>
                  </div>

                  <div className="px-5 pb-5 space-y-2">
                    {section.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={`p-4 rounded-2xl border ${
                          dm ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs opacity-30">#{(lesson.sort_order || 0) + 1}</span>
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={e => handleUpdateLesson(lesson.id, section.id, { title: e.target.value })}
                            className="bg-transparent font-medium text-sm outline-none flex-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Video URL (Youtube/Vimeo)"
                            value={lesson.video_url || ''}
                            onChange={e => handleUpdateLesson(lesson.id, section.id, { video_url: e.target.value })}
                            className={`p-2.5 rounded-xl text-[0.7rem] outline-none border ${
                              dm ? 'bg-black/20 border-white/5' : 'bg-bg border-black/5'
                            }`}
                          />
                          <input
                            type="text"
                            placeholder="Kısa içerik notu"
                            value={lesson.content || ''}
                            onChange={e => handleUpdateLesson(lesson.id, section.id, { content: e.target.value })}
                            className={`p-2.5 rounded-xl text-[0.7rem] outline-none border ${
                              dm ? 'bg-black/20 border-white/5' : 'bg-bg border-black/5'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
