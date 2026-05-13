import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { supabase } from '../../lib/supabase'

export default function GymDashboard() {
  const { darkMode: dm } = useStore()
  const [stats, setStats] = useState({ staffCount: 0, studentCount: 0, revenue: 0 })
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGymData()
  }, [])

  const fetchGymData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get current user's tenant
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
    if (!profile?.tenant_id) return

    // Fetch stats
    const { count: staffCount } = await supabase.from('gym_staff').select('*', { count: 'exact' }).eq('gym_id', profile.tenant_id)
    const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact' }).eq('tenant_id', profile.tenant_id).eq('role', 'athlete')

    // Fetch staff list
    const { data: roster } = await supabase.from('gym_roster').select('*').eq('gym_id', profile.tenant_id)

    setStats({ staffCount: staffCount || 0, studentCount: studentCount || 0, revenue: 0 })
    if (roster) setStaff(roster)
    setLoading(false)
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <h1 className="font-display text-4xl font-black tracking-tight mb-2">Kurumsal Panel 🏢</h1>
        <p className={`text-sm font-medium ${dm ? 'text-white/30' : 'text-black/30'}`}>Spor salonu operasyonu ve eğitmen yönetimi.</p>
      </section>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: 'Aktif Eğitmen', value: stats.staffCount, icon: '💪' },
          { label: 'Toplam Üye', value: stats.studentCount, icon: '👥' },
          { label: 'Aylık Ciro', value: `${stats.revenue} ₺`, icon: '💰' }
        ].map((kpi, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-xl'}`}>
            <span className="text-2xl mb-4 block">{kpi.icon}</span>
            <p className="text-[0.6rem] font-black uppercase tracking-widest opacity-40">{kpi.label}</p>
            <h3 className="text-3xl font-display font-bold mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Staff Management */}
      <div className={`p-10 rounded-[2.5rem] border ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/5 shadow-2xl'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl font-bold">Eğitmen Kadrosu</h2>
          <button className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
            Yeni Eğitmen Ekle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[0.6rem] font-black uppercase tracking-widest opacity-30 border-b border-black/5">
                <th className="pb-4">Eğitmen</th>
                <th className="pb-4">Uzmanlık</th>
                <th className="pb-4">Rol</th>
                <th className="pb-4">Katılım</th>
                <th className="pb-4">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {staff.map((s, i) => (
                <tr key={i} className="text-sm">
                  <td className="py-4 font-bold">{s.coach_name}</td>
                  <td className="py-4 opacity-60">{s.headline}</td>
                  <td className="py-4 font-medium uppercase text-[0.65rem] tracking-wider text-primary">{s.role}</td>
                  <td className="py-4 opacity-40">{new Date(s.joined_at).toLocaleDateString()}</td>
                  <td className="py-4">
                    <button className="text-xs font-bold opacity-30 hover:opacity-100 transition-opacity">Yönet</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staff.length === 0 && (
            <div className="py-10 text-center opacity-20 italic">Henüz eğitmen eklenmemiş.</div>
          )}
        </div>
      </div>
    </div>
  )
}
