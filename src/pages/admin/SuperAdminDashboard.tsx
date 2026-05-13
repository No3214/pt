import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

export default function SuperAdminDashboard() {
  const { darkMode: dm } = useStore()
  const [stats, setStats] = useState({
    totalCoaches: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalSales: 0
  })
  const [coaches, setCoaches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuperStats()
  }, [])

  const fetchSuperStats = async () => {
    setLoading(true)

    const { count: coachCount } = await supabase.from('coach_profiles').select('*', { count: 'exact', head: true })
    const { count: studentCount } = await supabase.from('student_profiles').select('*', { count: 'exact', head: true })
    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
    const { data: salesData } = await supabase.from('payments').select('amount')

    const totalSales = salesData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0

    setStats({
      totalCoaches: coachCount || 0,
      totalStudents: studentCount || 0,
      totalCourses: courseCount || 0,
      totalSales
    })

    const { data: coachList } = await supabase.from('coach_profiles').select('*').order('created_at', { ascending: false })
    setCoaches(coachList || [])

    setLoading(false)
  }

  const statCards = [
    { label: 'Toplam Antrenör', value: stats.totalCoaches, icon: '👨‍🏫', color: 'text-blue-500' },
    { label: 'Toplam Öğrenci', value: stats.totalStudents, icon: '🏃‍♂️', color: 'text-green-500' },
    { label: 'Toplam Kurs', value: stats.totalCourses, icon: '📚', color: 'text-purple-500' },
    { label: 'Platform Cirosu', value: `${stats.totalSales.toLocaleString()} TRY`, icon: '💰', color: 'text-amber-500' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">Platform Yönetimi (SuperAdmin) 🛡️</h2>
        <p className={`text-sm mt-1 ${dm ? 'text-white/40' : 'text-black/40'}`}>
          Tüm antrenörleri, öğrencileri ve finansal verileri buradan izleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border ${dm ? 'bg-white/[0.03] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <div className="text-3xl mb-4">{stat.icon}</div>
            <div className={`text-[0.65rem] font-bold uppercase tracking-widest opacity-40 mb-1`}>{stat.label}</div>
            <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
        <h3 className="font-display text-xl font-bold mb-6">Kayıtlı Antrenörler</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="opacity-40 border-b border-black/5">
                <th className="pb-4 font-bold uppercase tracking-tighter">İsim / E-posta</th>
                <th className="pb-4 font-bold uppercase tracking-tighter">Uzmanlık</th>
                <th className="pb-4 font-bold uppercase tracking-tighter">Durum</th>
                <th className="pb-4 font-bold uppercase tracking-tighter">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {coaches.map(coach => (
                <tr key={coach.id} className="group">
                  <td className="py-4">
                    <div className="font-bold">{coach.name}</div>
                    <div className="text-xs opacity-40">{coach.email}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      {coach.specializations?.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[0.6rem] font-bold">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-lg text-[0.6rem] font-bold ${coach.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {coach.is_active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="py-4 opacity-40 text-xs">
                    {new Date(coach.created_at).toLocaleDateString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
