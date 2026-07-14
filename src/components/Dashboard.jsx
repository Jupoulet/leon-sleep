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

  if (loading) return <div className="center">Chargement des nuits…</div>

  return (
    <div className="dashboard">
      {session && <NightForm nights={nights} onSaved={load} />}

      <LastNightCard last={lastNight} averages={averages} />

      <div className="card">
        <div className="filters">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              className={preset === p.key ? 'chip active' : 'chip'}
              onClick={() => setPreset(p.key)}
            >
              {p.label}
            </button>
          ))}
          {preset === 'custom' && (
            <span className="range">
              <input
                type="date"
                value={custom.from}
                onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))}
              />
              →
              <input
                type="date"
                value={custom.to}
                onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))}
              />
            </span>
          )}
        </div>

        <div className="averages">
          <span>
            Réveil moyen : <b>{minutesToLabel(averages.wakeMin)}</b>
          </span>
          <span>
            Coucher moyen : <b>{minutesToLabel(averages.bedMin)}</b>
          </span>
          <span>
            Réveils/nuit :{' '}
            <b>{averages.wakings != null ? averages.wakings.toFixed(1) : '—'}</b>
          </span>
          <span>
            Dodo moyen : <b>{durationLabel(averages.durationMin != null ? Math.round(averages.durationMin) : null)}</b>
          </span>
        </div>

        <SleepCharts rows={rows} averages={averages} />
      </div>

      <HistoryTable rows={rows} />
    </div>
  )
}
