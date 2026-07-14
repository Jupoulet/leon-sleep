import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import {
  buildSeries,
  durationLabel,
  filterNights,
  minutesToLabel,
  periodRange,
} from '../lib/sleep'
import NightForm from './NightForm.jsx'
import LastNightCard from './LastNightCard.jsx'
import SleepCharts from './SleepCharts.jsx'
import HistoryTable from './HistoryTable.jsx'

const PRESETS = [
  { key: 'week', label: 'Semaine' },
  { key: 'month', label: 'Mois' },
  { key: '3months', label: '3 mois' },
  { key: 'custom', label: 'Personnalisé' },
]

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function Dashboard({ session }) {
  const [nights, setNights] = useState([])
  const [loading, setLoading] = useState(true)
  const [preset, setPreset] = useState('month')
  const [custom, setCustom] = useState({ from: '', to: today() })

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sleep_nights')
      .select('*')
      .order('night_date', { ascending: true })
    if (!error) setNights(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Nuit la plus récente (toutes périodes confondues) pour l'encart.
  const lastNight = useMemo(() => {
    const { rows } = buildSeries(nights)
    return rows.length ? rows[rows.length - 1] : null
  }, [nights])

  // Données filtrées sur la période choisie.
  const { rows, averages } = useMemo(() => {
    let from, to
    if (preset === 'custom') {
      from = custom.from || null
      to = custom.to || null
    } else {
      ;({ from, to } = periodRange(preset, today()))
    }
    return buildSeries(filterNights(nights, from, to))
  }, [nights, preset, custom])

  if (loading)
    return <div className="p-16 text-center text-muted">Chargement des nuits…</div>

  return (
    <div>
      {session && <NightForm nights={nights} onSaved={load} />}

      <LastNightCard last={lastNight} averages={averages} />

      <div className="card">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition ${
                preset === p.key
                  ? 'bg-accent text-white shadow-[0_6px_16px_-6px_rgba(139,110,240,0.6)]'
                  : 'bg-lavender/50 text-lavender-ink hover:bg-lavender'
              }`}
              onClick={() => setPreset(p.key)}
            >
              {p.label}
            </button>
          ))}
          {preset === 'custom' && (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <input
                className="input py-1.5"
                type="date"
                value={custom.from}
                onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
              />
              →
              <input
                className="input py-1.5"
                type="date"
                value={custom.to}
                onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
              />
            </span>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-4 text-[13px] text-muted">
          <span>
            Réveil moyen : <b className="text-ink">{minutesToLabel(averages.wakeMin)}</b>
          </span>
          <span>
            Coucher moyen : <b className="text-ink">{minutesToLabel(averages.bedMin)}</b>
          </span>
          <span>
            Réveils/nuit :{' '}
            <b className="text-ink">
              {averages.wakings != null ? averages.wakings.toFixed(1) : '—'}
            </b>
          </span>
          <span>
            Dodo moyen :{' '}
            <b className="text-ink">
              {durationLabel(averages.durationMin != null ? Math.round(averages.durationMin) : null)}
            </b>
          </span>
        </div>

        <SleepCharts rows={rows} averages={averages} />
      </div>

      <HistoryTable rows={rows} />
    </div>
  )
}
