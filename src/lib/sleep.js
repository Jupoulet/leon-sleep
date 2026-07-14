// Logique métier pure (heures locales, aucune conversion UTC).

// "20:30:00" | "20:30" -> minutes depuis minuit (1230)
export function timeToMinutes(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function minutesToLabel(min) {
  if (min == null || Number.isNaN(min)) return '—'
  const norm = ((min % 1440) + 1440) % 1440
  const h = Math.floor(norm / 60)
  const m = Math.round(norm % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Durée de sommeil en minutes. wake < bedtime => passe minuit (+24h).
export function sleepDurationMinutes(bedtime, wakeTime) {
  const b = timeToMinutes(bedtime)
  const w = timeToMinutes(wakeTime)
  if (b == null || w == null) return null
  let d = w - b
  if (d < 0) d += 1440
  return d
}

export function durationLabel(min) {
  if (min == null) return '—'
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

// Moyenne d'une liste de nombres (ignore null/NaN). Renvoie null si vide.
export function average(values) {
  const nums = values.filter((v) => v != null && !Number.isNaN(v))
  if (!nums.length) return null
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

// Bornes de période -> { from, to } en 'YYYY-MM-DD'. today = 'YYYY-MM-DD'.
export function periodRange(preset, today) {
  const to = today
  const d = new Date(today + 'T00:00:00')
  const shift = (days) => {
    const x = new Date(d)
    x.setDate(x.getDate() - days)
    return x.toISOString().slice(0, 10)
  }
  switch (preset) {
    case 'week':
      return { from: shift(7), to }
    case 'month':
      return { from: shift(30), to }
    case '3months':
      return { from: shift(90), to }
    default:
      return { from: null, to: null }
  }
}

// Filtre les nuits sur [from, to] inclus (bornes null = pas de limite).
export function filterNights(nights, from, to) {
  return nights.filter((n) => {
    if (from && n.night_date < from) return false
    if (to && n.night_date > to) return false
    return true
  })
}

// Enrichit chaque nuit pour les graphs et calcule les moyennes de période.
export function buildSeries(nights) {
  const rows = [...nights]
    .sort((a, b) => a.night_date.localeCompare(b.night_date))
    .map((n) => ({
      ...n,
      wakeMin: timeToMinutes(n.wake_time),
      bedMin: timeToMinutes(n.bedtime),
      durationMin: sleepDurationMinutes(n.bedtime, n.wake_time),
    }))

  const averages = {
    wakeMin: average(rows.map((r) => r.wakeMin)),
    bedMin: average(rows.map((r) => r.bedMin)),
    wakings: average(rows.map((r) => r.night_wakings)),
    durationMin: average(rows.map((r) => r.durationMin)),
  }
  return { rows, averages }
}
