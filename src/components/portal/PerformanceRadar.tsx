import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';

export default function PerformanceRadar() {
  const { darkMode: dm } = useStore();
  const { decryptedData } = useStudentPortal();

  const stats = decryptedData?.client?.performanceStats || {
    strength: 60,
    explosiveness: 50,
    endurance: 55,
    consistency: 70,
    nutrition: 65
  };

  const data = [
    { subject: 'Kuvvet', A: stats.strength, fullMark: 100 },
    { subject: 'Patlayıcı Güç', A: stats.explosiveness, fullMark: 100 },
    { subject: 'Dayanıklılık', A: stats.endurance, fullMark: 100 },
    { subject: 'Süreklilik', A: stats.consistency, fullMark: 100 },
    { subject: 'Beslenme', A: stats.nutrition, fullMark: 100 },
  ];

  const card = `p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden h-full flex flex-col ${
    dm ? 'bg-white/[0.02] border-white/5 shadow-2xl shadow-black/20' : 'bg-white border-black/[0.04] shadow-xl'
  }`;

  return (
    <div className={card}>
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-text-main tracking-tight">Performans Radarı</h3>
        <p className={`text-[0.7rem] font-bold uppercase tracking-[0.2em] mt-1 ${dm ? 'text-primary/60' : 'text-primary/40'}`}>
          Atletik Kapasite Analizi
        </p>
      </div>

      <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke={dm ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: dm ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)', fontSize: 10, fontWeight: 700 }} 
            />
            <Radar
              name="Performans"
              dataKey="A"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className="text-[0.6rem] font-bold uppercase tracking-widest opacity-40 mb-1">En Güçlü Yanın</div>
          <div className="text-sm font-bold text-primary">
            {data.reduce((prev, current) => (prev.A > current.A) ? prev : current).subject}
          </div>
        </div>
        <div className={`p-4 rounded-2xl ${dm ? 'bg-white/5' : 'bg-black/5'}`}>
          <div className="text-[0.6rem] font-bold uppercase tracking-widest opacity-40 mb-1">Gelişim Alanı</div>
          <div className="text-sm font-bold text-secondary">
            {data.reduce((prev, current) => (prev.A < current.A) ? prev : current).subject}
          </div>
        </div>
      </div>
    </div>
  );
}
