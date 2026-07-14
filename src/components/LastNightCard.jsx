import { durationLabel, minutesToLabel } from '../lib/sleep'

// Delta vs moyenne : lowerIsBetter = true si "en dessous de la moyenne = mieux".
function Delta({ value, avg, unit, lowerIsBetter }) {
  if (value == null || avg == null) return null
  const diff = value - avg
  const rounded = Math.round(diff * 10) / 10
  if (rounded === 0) return <span className="text-xs text-muted">= moyenne</span>
  const better = lowerIsBetter ? diff < 0 : diff > 0
  const arrow = diff > 0 ? '⬆' : '⬇'
  const abs = Math.abs(rounded)
  return (
    <span className={`text-xs font-medium ${better ? 'text-good' : 'text-bad'}`}>
      {arrow} {abs}
      {unit} vs moyenne
    </span>
  )
}

function Stat({ label, value, children }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-slate-50 p-3">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
      {children}
    </div>
  )
}

export default function LastNightCard({ last, averages }) {
  if (!last) return null
  return (
    <div className="card bg-gradient-to-br from-accent/10 to-transparent">
      <h2 className="mb-4 text-lg font-semibold">Dernière nuit — {last.night_date}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <Stat label="Temps de dodo" value={durationLabel(last.durationMin)}>
          <Delta value={last.durationMin} avg={averages.durationMin} unit=" min" lowerIsBetter={false} />
        </Stat>
        <Stat label="Réveils" value={last.night_wakings}>
          <Delta value={last.night_wakings} avg={averages.wakings} unit="" lowerIsBetter={true} />
        </Stat>
        <Stat label="Heure de réveil" value={minutesToLabel(last.wakeMin)}>
          <Delta value={last.wakeMin} avg={averages.wakeMin} unit=" min" lowerIsBetter={false} />
        </Stat>
        <Stat label="Heure de coucher" value={minutesToLabel(last.bedMin)} />
      </div>
      {last.note && <p className="mt-3 text-sm text-muted">📝 {last.note}</p>}
    </div>
  )
}
