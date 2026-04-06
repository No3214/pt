import { motion } from 'framer-motion';
import WeightTrendChart from './WeightTrendChart';
import BodyCompositionChart from './BodyCompositionChart';
import ConsistencyHeatmap from './ConsistencyHeatmap';

interface Props {
  data: {
    client: any;
    measurements: any[];
    workoutLogs: any[];
    targetWeight: number;
  };
  dm: boolean;
}

export default function StudentProgressDashboard({ data, dm }: Props) {
  const { client, measurements, workoutLogs, targetWeight } = data;

  const card = `p-8 rounded-[2.5rem] border transition-all duration-700 overflow-hidden relative ${
    dm ? 'bg-bg-alt/40 border-white/5 shadow-2xl' : 'bg-white border-black/[0.04] shadow-2xl shadow-black/[0.03]'
  }`;

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Weight Trend Chart - 8 Cols */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`lg:col-span-8 ${card}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">Kilo Değişim Trendi</h3>
            <p className="text-[0.7rem] uppercase tracking-widest opacity-40 font-bold mt-1">Son 12 Hafta Analizi</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {measurements.length > 0 ? measurements[measurements.length - 1].weight : '--'} kg
            </span>
          </div>
        </div>
        <WeightTrendChart data={measurements} targetWeight={targetWeight} dm={dm} />
      </motion.div>

      {/* Consistency Heatmap - 4 Cols */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`lg:col-span-4 h-full ${card}`}
      >
        <h3 className="font-display text-2xl font-bold tracking-tight mb-2">Disiplin Karnesi</h3>
        <p className="text-[0.7rem] uppercase tracking-widest opacity-40 font-bold mb-8">Antrenman Devamlılığı</p>
        <ConsistencyHeatmap logs={workoutLogs} dm={dm} />
      </motion.div>

      {/* Body Comp Chart - 7 Cols */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`lg:col-span-12 ${card}`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">Vücut Kompozisyonu</h3>
            <p className="text-[0.7rem] uppercase tracking-widest opacity-40 font-bold">V-Taper Skoru & Yağ Oranı</p>
          </div>
        </div>
        <BodyCompositionChart data={measurements} dm={dm} />
      </motion.div>
    </div>
  );
}
