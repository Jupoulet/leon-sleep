import { durationLabel, minutesToLabel } from '../lib/sleep'

// Delta vs moyenne : good = true si "en dessous de la moyenne = mieux".
function Delta({ value, avg, unit, lowerIsBetter }) {
  if (value == null || avg == null) return null
  const diff = value - avg
  const rounded = Math.round(diff * 10) / 10
  if (rounded === 0) return <span className="delta neutral">= moyenne</span>
  const better = lowerIsBetter ? diff < 0 : diff > 0
  const arrow = diff > 0 ? '⬆' : '⬇'
  const abs = Math.abs(rounded)
  return (
    <span className={better ? 'delta good' : 'delta bad'}>
      {arrow} {abs}
      {unit} vs moyenne
    </span>
  )
}

export default function LastNightCard({ last, averages }) {
  if (!last) return null
  return (
    <div className="card lastnight">
      <h2>Dernière nuit — {last.night_date}</h2>
      <div className="stats">
        <div className="stat">
          <span className="label">Temps de dodo</span>
          <span className="value">{durationLabel(last.durationMin)}</span>
          <Delta
            value={last.durationMin}
            avg={averages.durationMin}
            unit=" min"
            lowerIsBetter={false}
          />
        </div>
        <div className="stat">
          <span className="label">Réveils</span>
          <span className="value">{last.night_wakings}</span>
          <Delta
            value={last.night_wakings}
            avg={averages.wakings}
            unit=""
            lowerIsBetter={true}
          />
        </div>
        <div className="stat">
          <span className="label">Heure de réveil</span>
          <span className="value">{minutesToLabel(last.wakeMin)}</span>
          <Delta
            value={last.wakeMin}
            avg={averages.wakeMin}
            unit=" min"
            lowerIsBetter={false}
          />
        </div>
        <div className="stat">
          <span className="label">Heure de coucher</span>
          <span className="value">{minutesToLabel(last.bedMin)}</span>
        </div>
      </div>
      {last.note && <p className="note">📝 {last.note}</p>}
    </div>
  )
}
