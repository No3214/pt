import { useStore } from '../stores/useStore'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect' | 'card'
  lines?: number
}

export default function Skeleton({ className = '', variant = 'rect', lines = 1 }: SkeletonProps) {
  const dm = useStore(s => s.darkMode)

  const base = `animate-pulse rounded-lg ${
    dm ? 'bg-white/[0.04]' : 'bg-black/[0.04]'
  }`

  if (variant === 'card') {
    return (
      <div className={`${base} rounded-2xl p-6 space-y-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${dm ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />
          <div className="flex-1 space-y-2">
            <div className={`h-3 w-24 rounded-md ${dm ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />
            <div className={`h-2 w-16 rounded-md ${dm ? 'bg-white/[0.04]' : 'bg-black/[0.03]'}`} />
          </div>
        </div>
        <div className={`h-32 rounded-xl ${dm ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`} />
      </div>
    )
  }

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2.5 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i}
            className={`${base} h-3`}
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  return <div className={`${base} ${className}`} />
}

/* ═══ Dashboard Skeleton ═══ */
export function DashboardSkeleton() {
  const dm = useStore(s => s.darkMode)
  const pulse = dm ? 'bg-white/[0.04]' : 'bg-black/[0.04]'

  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className={`h-4 w-20 rounded-md ${pulse}`} />
        <div className={`h-8 w-48 rounded-lg ${pulse}`} />
        <div className={`h-3 w-32 rounded-md ${pulse}`} />
      </div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`rounded-2xl border p-5 space-y-4 ${dm ? 'border-white/[0.04]' : 'border-black/[0.03]'}`}>
            <div className={`w-10 h-10 rounded-xl ${pulse}`} />
            <div className={`h-8 w-20 rounded-lg ${pulse}`} />
            <div className={`h-2 w-24 rounded-md ${pulse}`} />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${dm ? 'border-white/[0.04]' : 'border-black/[0.03]'}`}>
            <div className={`h-3 w-28 rounded-md mb-6 ${pulse}`} />
            <div className={`h-[200px] rounded-xl ${pulse}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
