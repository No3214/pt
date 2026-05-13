import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  lessons: Lesson[]
}

export default function CoursePlayer({ courseId, onBack }: { courseId: string, onBack: () => void }) {
  const { darkMode: dm } = useStore()
  const [course, setCourse] = useState<any>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseContent()
  }, [courseId])

  const fetchCourseContent = async () => {
    setLoading(true)
    const { data: courseData } = await supabase.from('courses').select('*').eq('id', courseId).single()
    setCourse(courseData)

    const { data: sectionsData } = await supabase
      .from('course_sections')
      .select('*, course_lessons(*)')
      .eq('course_id', courseId)
      .order('sort_order', { ascending: true })

    if (sectionsData) {
      const formatted = sectionsData.map(s => ({
        ...s,
        lessons: (s.course_lessons || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      }))
      setSections(formatted)
      if (formatted.length > 0 && formatted[0].lessons.length > 0) {
        setActiveLesson(formatted[0].lessons[0])
      }
    }
    setLoading(false)
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|.*shorts\/))([^?&"'>]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?badge=0&autopause=0&player_id=0&app_id=58479`

    return url
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${dm ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="font-display text-xl font-bold">{course?.title}</h2>
          <p className={`text-xs opacity-40`}>{activeLesson?.title || 'Ders Seçilmedi'}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Player Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-[2.5rem] bg-black overflow-hidden shadow-2xl relative">
            {activeLesson?.video_url ? (
              <iframe
                src={getEmbedUrl(activeLesson.video_url)}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                <span className="text-6xl mb-4">📺</span>
                <p>Bu ders için video henüz yüklenmedi.</p>
              </div>
            )}
          </div>
          <div className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <h3 className="font-display text-2xl font-bold mb-4">{activeLesson?.title}</h3>
            <div className={`text-sm leading-relaxed opacity-60 whitespace-pre-wrap`}>
              {activeLesson?.content || 'Bu ders için içerik notu bulunmamaktadır.'}
            </div>
          </div>
        </div>

        {/* Syllabus Sidebar */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm uppercase tracking-widest opacity-40 px-2">Kurs İçeriği</h4>
          <div className="space-y-2">
            {sections.map(section => (
              <div key={section.id} className="space-y-1">
                <div className={`px-4 py-2 text-xs font-bold uppercase opacity-30`}>{section.title}</div>
                {section.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-3 ${
                      activeLesson?.id === lesson.id
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : dm ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' : 'bg-bg border-black/5 hover:bg-black/5'
                    }`}
                  >
                    <span className={`text-[0.6rem] font-bold ${activeLesson?.id === lesson.id ? 'text-white/60' : 'text-primary'}`}>
                      {activeLesson?.id === lesson.id ? '▶' : (lesson.sort_order || 0) + 1}
                    </span>
                    <span className="text-xs font-medium flex-1 truncate">{lesson.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
