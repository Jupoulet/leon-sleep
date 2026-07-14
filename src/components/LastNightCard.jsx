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
    <span className={`text-xs font-semibold ${better ? 'text-good' : 'text-bad'}`}>
      {arrow} {abs}
      {unit} vs moyenne
    </span>
  )
}

const TONES = {
  lavender: 'bg-lavender text-lavender-ink',
  peach: 'bg-peach text-peach-ink',
  sky: 'bg-sky text-sky-ink',
  mint: 'bg-mint text-mint-ink',
}

function Stat({ label, value, icon, tone, children }) {
  return (
    <div className={`flex flex-col gap-1 rounded-2xl p-4 ${TONES[tone]}`}>
      <span className="flex items-center gap-1.5 text-xs font-semibold opacity-80">
        <span className="text-base">{icon}</span>
        {label}
      </span>
      <span className="text-3xl font-extrabold tracking-tight">{value}</span>
      {children}
    </div>
  )
}

export default function LastNightCard({ last, averages }) {
  if (!last) return null
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-bold">
        <span className="mr-1">🌙</span> Dernière nuit — {last.night_date}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <Stat label="Temps de dodo" icon="😴" tone="lavender" value={durationLabel(last.durationMin)}>
          <Delta value={last.durationMin} avg={averages.durationMin} unit=" min" lowerIsBetter={false} />
        </Stat>
        <Stat label="Réveils" icon="🔁" tone="peach" value={last.night_wakings}>
          <Delta value={last.night_wakings} avg={averages.wakings} unit="" lowerIsBetter={true} />
        </Stat>
        <Stat label="Heure de réveil" icon="⏰" tone="sky" value={minutesToLabel(last.wakeMin)}>
          <Delta value={last.wakeMin} avg={averages.wakeMin} unit=" min" lowerIsBetter={false} />
        </Stat>
        <Stat label="Heure de coucher" icon="🛏️" tone="mint" value={minutesToLabel(last.bedMin)} />
      </div>
      {last.note && (
        <p className="mt-4 rounded-2xl bg-white/60 px-4 py-2.5 text-sm text-muted">📝 {last.note}</p>
      )}
    </div>
  )
}
