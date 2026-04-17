import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import { tr, enUS, es, fr, de, it, ptBR, ru, zhCN, ja, arSA, ko, hi, Locale } from 'date-fns/locale';
import { useTranslation } from '../../../locales';

const locales: Record<string, Locale> = {
  tr, en: enUS, es, fr, de, it, pt: ptBR, ru, zh: zhCN, ja, ar: arSA, ko, hi
};

interface Props {
  data: { date: string; weight: number }[];
  targetWeight: number;
  dm: boolean;
}

export default function WeightTrendChart({ data, targetWeight, dm }: Props) {
  const { t, language } = useTranslation();
  const currentLocale = locales[language] || tr;

  const chartData = data.map(m => ({
    ...m,
    dateLabel: format(parseISO(m.date), 'd MMM', { locale: currentLocale }),
    weightNum: parseFloat(m.weight)
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const isSuccess = chartData.length > 1 && chartData[chartData.length - 1].weightNum <= chartData[0].weightNum;

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff5c5c" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff5c5c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorWeightDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
          <XAxis 
            dataKey="dateLabel" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: dm ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontSize: 10 }}
            dy={10}
          />
          <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              border: 'none', 
              borderRadius: '12px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
            }}
          />
          <ReferenceLine y={targetWeight} stroke="#6B7280" strokeDasharray="3 3" label={{ position: 'right', value: t.admin.chart_target_label, fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }} />
          <Area 
            type="monotone" 
            dataKey="weightNum" 
            stroke={isSuccess ? '#22C55E' : '#EF4444'} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={isSuccess ? 'url(#colorWeightDown)' : 'url(#colorWeight)'} 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
