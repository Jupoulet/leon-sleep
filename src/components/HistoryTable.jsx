import { durationLabel, minutesToLabel } from '../lib/sleep'

export default function HistoryTable({ rows }) {
  if (!rows.length) return null
  const recent = [...rows].reverse() // plus récent en haut
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-semibold">Historique</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-left text-muted">
              <th className="border-b border-line px-2.5 py-2 font-semibold">Date</th>
              <th className="border-b border-line px-2.5 py-2 font-semibold">Coucher</th>
              <th className="border-b border-line px-2.5 py-2 font-semibold">Réveil</th>
              <th className="border-b border-line px-2.5 py-2 font-semibold">Dodo</th>
              <th className="border-b border-line px-2.5 py-2 font-semibold">Réveils</th>
              <th className="border-b border-line px-2.5 py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.night_date} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap border-b border-line px-2.5 py-2">{r.night_date}</td>
                <td className="whitespace-nowrap border-b border-line px-2.5 py-2">{minutesToLabel(r.bedMin)}</td>
                <td className="whitespace-nowrap border-b border-line px-2.5 py-2">{minutesToLabel(r.wakeMin)}</td>
                <td className="whitespace-nowrap border-b border-line px-2.5 py-2">{durationLabel(r.durationMin)}</td>
                <td className="whitespace-nowrap border-b border-line px-2.5 py-2">{r.night_wakings}</td>
                <td className="border-b border-line px-2.5 py-2 text-muted">{r.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
