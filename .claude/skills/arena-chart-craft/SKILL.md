---
name: arena-chart-craft
description: ARENA Performance chart/viz playbook'u. Recharts ARENA tokens + responsive + accessibility + i18n pattern'leri. Line, bar, area, radar, composed chart, heatmap, sparkline. Performance progress, workout volume, body metrics, fiyatlandirma comparison. A11y (table fallback + aria-label), RTL, dark mode. Tetikleyici: "chart", "grafik", "recharts", "viz", "bar", "line", "radar", "heatmap", "sparkline", "dashboard".
version: 1.0.0
owner: ARENA Performance
model_preference: claude-opus-4-7
---

# ARENA × Chart Craft

Recharts 2.x kullanilir (charts chunk'indadir). Hedef: markaya uygun, erisilebilir, responsive.

## 0) Token Tema

```ts
// src/lib/chart-theme.ts
export const chartTheme = {
  colors: {
    primary: '#C2684A',
    secondary: '#7A9E82',
    accent: '#4A6D88',
    sand: '#D4B483',
    grid: 'rgba(10,10,10,0.08)',
    text: '#0A0A0A',
  },
  font: { family: 'Manrope, system-ui, sans-serif', size: 12 },
}
```

Dark mode `useStore(darkMode)` ile renk + text degisir.

## 1) Base Chart Wrapper

```tsx
import { ResponsiveContainer } from 'recharts'

export function ChartBox({
  title,
  children,
  height = 320,
  caption,
}: { title: string; children: ReactNode; height?: number; caption?: string }) {
  return (
    <figure className="w-full">
      <figcaption>
        <h3 className="text-sm font-semibold">{title}</h3>
        {caption && <p className="text-xs text-muted">{caption}</p>}
      </figcaption>
      <div role="img" aria-label={title} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as any}
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
```

`role="img"` + `aria-label` — ekran okuyucu baslika erisir. DataFallback (table) a11y icin asagida.

## 2) Line Chart (Workout Volume)

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'

<ChartBox title={t.charts.volume}>
  <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
    <CartesianGrid stroke={theme.colors.grid} vertical={false} />
    <XAxis dataKey="date" tickFormatter={d => fmt.date(new Date(d), locale)} />
    <YAxis tickFormatter={v => fmt.number(v, locale)} />
    <Tooltip content={<CustomTooltip />} />
    <Legend iconType="circle" />
    <Line type="monotone" dataKey="volume" stroke={theme.colors.primary} strokeWidth={2} dot={false} animationDuration={800} />
    <Line type="monotone" dataKey="target" stroke={theme.colors.accent} strokeDasharray="4 4" dot={false} />
  </LineChart>
</ChartBox>
```

### Custom Tooltip
```tsx
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg shadow-lg border border-primary/20 rounded-lg p-3">
      <p className="text-xs text-muted">{fmt.date(new Date(label), locale)}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
          {t.charts[p.dataKey]}: {fmt.number(p.value, locale)}
        </p>
      ))}
    </div>
  )
}
```

## 3) Bar Chart (Program Comparison)

```tsx
<BarChart data={data}>
  <CartesianGrid stroke={theme.colors.grid} vertical={false} />
  <XAxis dataKey="program" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="attendees" fill={theme.colors.secondary} radius={[8, 8, 0, 0]} />
</BarChart>
```

### Stacked Bar
```tsx
<Bar dataKey="workouts" stackId="a" fill={theme.colors.primary} />
<Bar dataKey="nutrition" stackId="a" fill={theme.colors.secondary} />
<Bar dataKey="recovery" stackId="a" fill={theme.colors.accent} />
```

## 4) Area Chart (Weight Progress)

```tsx
<AreaChart data={data}>
  <defs>
    <linearGradient id="grad-weight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.4} />
      <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0} />
    </linearGradient>
  </defs>
  <Area dataKey="weight" stroke={theme.colors.primary} fill="url(#grad-weight)" strokeWidth={2} />
</AreaChart>
```

## 5) Radar Chart (Performance Profile)

```tsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

<RadarChart data={profile}>
  <PolarGrid stroke={theme.colors.grid} />
  <PolarAngleAxis dataKey="skill" />
  <PolarRadiusAxis angle={90} domain={[0, 100]} />
  <Radar name={t.charts.you} dataKey="you" stroke={theme.colors.primary} fill={theme.colors.primary} fillOpacity={0.3} />
  <Radar name={t.charts.elite} dataKey="elite" stroke={theme.colors.accent} fill={theme.colors.accent} fillOpacity={0.15} />
  <Legend />
</RadarChart>
```

`skill` = speed, power, endurance, agility, technique, mental.

## 6) Sparkline (Dashboard Card)

```tsx
<ResponsiveContainer width="100%" height={40}>
  <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
    <Line type="monotone" dataKey="value" stroke={theme.colors.primary} strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

## 7) Composed Chart (Multiple Series)

```tsx
import { ComposedChart, Area, Bar, Line } from 'recharts'

<ComposedChart data={data}>
  <Bar dataKey="calories" fill={theme.colors.secondary} />
  <Line dataKey="weight" stroke={theme.colors.primary} strokeWidth={2} />
  <Area dataKey="target" fill={theme.colors.sand} stroke={theme.colors.sand} fillOpacity={0.3} />
</ComposedChart>
```

## 8) Heatmap (Workout Frequency — custom)

Recharts'ta native heatmap yok. Grid CSS + cell render:

```tsx
<div role="img" aria-label={t.charts.heatmap} className="grid grid-cols-7 gap-1">
  {days.map(d => {
    const intensity = d.count / max
    return (
      <div
        key={d.date}
        className="w-6 h-6 rounded"
        style={{ backgroundColor: `rgba(194,104,74,${intensity})` }}
        title={`${fmt.date(new Date(d.date), locale)}: ${d.count}`}
      />
    )
  })}
</div>
```

## 9) A11y Table Fallback

Ekran okuyucu chart'i okuyamaz. Visually-hidden table:

```tsx
<ChartBox title={t.charts.volume}>
  <LineChart ...>
  <table className="sr-only">
    <caption>{t.charts.volume}</caption>
    <thead>
      <tr><th>{t.charts.date}</th><th>{t.charts.volume}</th></tr>
    </thead>
    <tbody>
      {data.map(d => (
        <tr key={d.date}><td>{fmt.date(new Date(d.date), locale)}</td><td>{d.volume}</td></tr>
      ))}
    </tbody>
  </table>
</ChartBox>
```

## 10) Responsive Stratejisi

- Desktop: full chart + legend + grid
- Tablet: kucult + grid inceltilir
- Mobile (< 640px): sparkline-like sadelesir; tooltip'le detay
- `useMediaQuery('(max-width: 640px)')` + conditional render

## 11) Performans

- `data` prop'unu memo'la (`useMemo`)
- Tooltip render cost: custom > default; `isAnimationActive={false}` scroll'da
- 500+ data point: `<LineChart>` SVG yerine canvas fallback dusun (recharts-d3 canvas experimental)
- Chart.js alternative: canvas ile 10k nokta rahatsiz degil (ama bundle buyur)

## 12) Dark Mode Destegi

```tsx
const { darkMode } = useStore()
const theme = darkMode ? darkTheme : lightTheme
```

`darkTheme.text = '#FAF6F1'`, `grid = 'rgba(255,255,255,0.08)'`.

## 13) i18n Integration

- `XAxis tickFormatter` — date/number locale-aware
- `Tooltip` — label cevrilir
- `Legend` — serie adi `t.charts.<key>`
- RTL: `direction: 'rtl'` style + XAxis reversed? (recharts acik destek sinirli, manuel flip)

## 14) Export / Paylasim

```ts
import { toPng } from 'html-to-image'
async function exportChart(ref: HTMLElement, filename: string) {
  const dataUrl = await toPng(ref, { pixelRatio: 2, backgroundColor: '#FAF6F1' })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
```

(html-to-image zaten `image-export` chunk'inda.)

## 15) PDF'e Embed

`pdf-export` chunk'inda react-to-pdf var. Chart'i render et → canvas'a cevir → pdf'e yerlestir.

## 16) Real-time Update

```tsx
const [data, setData] = useState(initial)
useEffect(() => {
  const channel = supabase.channel(`metrics-${userId}`).on('postgres_changes', ..., payload => {
    setData(prev => [...prev, payload.new].slice(-100)) // son 100
  }).subscribe()
  return () => { supabase.removeChannel(channel) }
}, [userId])
```

Chart animation `isAnimationActive` — real-time append'ta kapatin yoksa her nokta yeniden anime olur.

## 17) Red Flags

- `data` prop yeni obje referansiyla her render → sonsuz remount
- `width={400}` hardcode → mobile break
- Tooltip'te HTML injection (user-provided string) → sanitize
- 12+ serie → okunmaz, gruplayiniz
- Pie chart kullanma (karsilastirma kotu); bar > pie

## 18) Checklist

- [ ] ResponsiveContainer ile wrap
- [ ] `role="img"` + `aria-label`
- [ ] sr-only table fallback
- [ ] Dark mode renk uyumu
- [ ] Locale-aware format
- [ ] Memoized data
- [ ] Legend text cevrilmis
- [ ] Contrast AA

---

Premium chart = az veri + keskin mesaj + markali renk.
