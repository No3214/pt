
import { useStore } from '../../stores/useStore';
import { useStudentPortal } from '../../stores/studentPortal';
import WeightTrendChart from '../admin/charts/WeightTrendChart';

export default function StudentWeightChart() {
  const { darkMode: dm } = useStore();
  const { decryptedData } = useStudentPortal();

  if (!decryptedData?.measurements || decryptedData.measurements.length < 2) {
    return (
      <div className={`p-8 rounded-[2.5rem] border h-full flex flex-col justify-center items-center text-center ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'}`}>
        <h3 className="font-display text-xl font-bold text-text-main tracking-tight mb-2">Gelişim Grafiği</h3>
        <p className="text-[0.85rem] text-text-main/40 font-medium">Grafik oluşması için en az 2 ölçüm girmelisin.</p>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-[2.5rem] border h-full flex flex-col ${dm ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/[0.04] shadow-xl'}`}>
      <h3 className="font-display text-xl font-bold text-text-main tracking-tight mb-2 flex items-center gap-2">
         <span className="text-secondary">📉</span> Gelişim Grafiği
      </h3>
      <p className="text-[0.85rem] text-text-main/40 font-medium mb-2">Zaman içindeki vücut ağırlığı değişimin.</p>
      
      <div className="flex-1 min-h-[250px]">
        <WeightTrendChart 
          data={decryptedData.measurements} 
          targetWeight={decryptedData.measurements[0].weight - 5} 
          dm={dm} 
        />
      </div>
    </div>
  );
}
