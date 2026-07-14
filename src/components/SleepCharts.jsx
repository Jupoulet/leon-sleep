import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { durationLabel, minutesToLabel } from '../lib/sleep'

// Insère les jours manquants (valeurs null) pour que la ligne se coupe (trou visible).
function densify(rows) {
  if (rows.length < 2) return rows
  const out = []
  const start = new Date(rows[0].night_date + 'T00:00:00')
  const end = new Date(rows[rows.length - 1].night_date + 'T00:00:00')
  const byDate = new Map(rows.map((r) => [r.night_date, r]))
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10)
    out.push(
      byDate.get(key) || {
        night_date: key,
        wakeMin: null,
        bedMin: null,
        durationMin: null,
        night_wakings: null,
      },
    )
  }
  return out
}

function Chart({ data, dataKey, avg, color, yLabel, fmt }) {
  const timeAxis = fmt === 'time'
  return (
    <div className="rounded-xl border border-line bg-white/60 p-3">
      <h3 className="mb-1.5 text-sm font-semibold">{yLabel}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="night_date" tick={{ fontSize: 11 }} minTickGap={24} />
          <YAxis
            tick={{ fontSize: 11 }}
            domain={timeAxis ? [0, 1440] : ['auto', 'auto']}
            tickFormatter={timeAxis ? minutesToLabel : undefined}
            width={44}
          />
          <Tooltip
            formatter={(v) =>
              v == null
                ? '—'
                : fmt === 'time'
                  ? minutesToLabel(v)
                  : fmt === 'duration'
                    ? durationLabel(v)
                    : v
            }
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 2 }}
            connectNulls={false}
            isAnimationActive={false}
          />
          {avg != null && (
            <ReferenceLine
              y={avg}
              stroke={color}
              strokeDasharray="6 4"
              strokeOpacity={0.6}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SleepCharts({ rows, averages }) {
  const data = densify(rows)
  if (!rows.length)
    return <p className="py-8 text-center text-muted">Aucune donnée sur cette période.</p>

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
      <Chart
        data={data}
        dataKey="durationMin"
        avg={averages.durationMin}
        color="#6c5ce7"
        yLabel="Durée de sommeil"
        fmt="duration"
      />
      <Chart
        data={data}
        dataKey="night_wakings"
        avg={averages.wakings}
        color="#e17055"
        yLabel="Nombre de réveils"
        fmt="int"
      />
      <Chart
        data={data}
        dataKey="wakeMin"
        avg={averages.wakeMin}
        color="#00b894"
        yLabel="Heure de réveil"
        fmt="time"
      />
      <Chart
        data={data}
        dataKey="bedMin"
        avg={averages.bedMin}
        color="#0984e3"
        yLabel="Heure de coucher"
        fmt="time"
      />
    </div>
  )
}
