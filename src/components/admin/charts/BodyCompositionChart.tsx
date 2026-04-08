import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart, Bar, Line } from 'recharts';
import { format, parseISO } from 'date-fns';
import { tr, enUS, es, fr, de, it, ptBR, ru, zhCN, ja, arSA, ko, hi } from 'date-fns/locale';
import { useTranslation } from '../../../locales';

const locales: Record<string, any> = {
  tr, en: enUS, es, fr, de, it, pt: ptBR, ru, zh: zhCN, ja, ar: arSA, ko, hi
};

interface Props {
  data: { date: string; bodyFat?: number; muscle?: number; weight?: number }[];
  dm: boolean;
}

export default function BodyCompositionChart({ data, dm }: Props) {
  const { language } = useTranslation();
  const currentLocale = locales[language] || tr;

  const chartData = data.map(m => ({
    ...m,
    dateLabel: format(parseISO(m.date), 'd MMM', { locale: currentLocale }),
    fatNum: parseFloat(m.bodyFat || '0'),
    vTaper: (parseFloat(m.shoulder || '0') / parseFloat(m.waist || '1')).toFixed(2)
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
          <XAxis 
            dataKey="dateLabel" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: dm ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
          />
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            label={{ value: 'V-Taper Score', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8884d8' }}
            tick={{ fontSize: 10 }}
            axisLine={false} tickLine={false}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: 'Yağ %', angle: 90, position: 'insideRight', fontSize: 10, fill: '#10B981' }}
            tick={{ fontSize: 10 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: dm ? '#111' : '#fff', 
              border: 'none', 
              borderRadius: '12px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
            }}
          />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
          <Bar yAxisId="left" dataKey="vTaper" fill="#A855F7" radius={[4, 4, 0, 0]} name="V-Taper (Omuz/Bel)" unit=" ratio" />
          <Line yAxisId="right" type="monotone" dataKey="fatNum" stroke="#10B981" strokeWidth={3} name="Vücut Yağ Oranı %" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
