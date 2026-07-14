import { durationLabel, minutesToLabel } from '../lib/sleep'

export default function HistoryTable({ rows }) {
  if (!rows.length) return null
  const recent = [...rows].reverse() // plus récent en haut
  return (
    <div className="card">
      <h2>Historique</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Coucher</th>
              <th>Réveil</th>
              <th>Dodo</th>
              <th>Réveils</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.night_date}>
                <td>{r.night_date}</td>
                <td>{minutesToLabel(r.bedMin)}</td>
                <td>{minutesToLabel(r.wakeMin)}</td>
                <td>{durationLabel(r.durationMin)}</td>
                <td>{r.night_wakings}</td>
                <td className="note-cell">{r.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
