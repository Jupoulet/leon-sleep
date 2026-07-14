import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Date d'hier au format YYYY-MM-DD (défaut = nuit du soir passé, notée le matin).
function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

const EMPTY = { bedtime: '20:30', wake_time: '07:00', night_wakings: 0, note: '' }

export default function NightForm({ nights, onSaved }) {
  const [nightDate, setNightDate] = useState(yesterday())
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  // Pré-remplissage si la nuit existe déjà.
  useEffect(() => {
    const existing = nights.find((n) => n.night_date === nightDate)
    if (existing) {
      setForm({
        bedtime: (existing.bedtime || '').slice(0, 5),
        wake_time: (existing.wake_time || '').slice(0, 5),
        night_wakings: existing.night_wakings ?? 0,
        note: existing.note || '',
      })
    } else {
      setForm(EMPTY)
    }
  }, [nightDate, nights])

  const exists = nights.some((n) => n.night_date === nightDate)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const payload = {
      night_date: nightDate,
      bedtime: form.bedtime,
      wake_time: form.wake_time,
      night_wakings: Number(form.night_wakings),
      note: form.note.trim() || null,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase
      .from('sleep_nights')
      .upsert(payload, { onConflict: 'night_date' })
    setBusy(false)
    if (error) {
      setMsg({ type: 'error', text: 'Erreur : ' + error.message })
    } else {
      setMsg({ type: 'ok', text: exists ? 'Nuit mise à jour ✓' : 'Nuit enregistrée ✓' })
      onSaved()
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>{exists ? 'Modifier une nuit' : 'Saisir une nuit'}</h2>
      <div className="grid">
        <label>
          Date de la nuit
          <input
            type="date"
            value={nightDate}
            onChange={(e) => setNightDate(e.target.value)}
            required
          />
        </label>
        <label>
          Heure de coucher
          <input type="time" value={form.bedtime} onChange={set('bedtime')} required />
        </label>
        <label>
          Heure de réveil
          <input type="time" value={form.wake_time} onChange={set('wake_time')} required />
        </label>
        <label>
          Nombre de réveils
          <input
            type="number"
            min="0"
            value={form.night_wakings}
            onChange={set('night_wakings')}
            required
          />
        </label>
      </div>
      <label>
        Note (optionnel)
        <input
          type="text"
          placeholder="dents, malade, sieste zappée…"
          value={form.note}
          onChange={set('note')}
        />
      </label>
      {msg && <p className={msg.type === 'error' ? 'error' : 'ok'}>{msg.text}</p>}
      <button type="submit" disabled={busy}>
        {busy ? '…' : exists ? 'Mettre à jour' : 'Enregistrer'}
      </button>
    </form>
  )
}
