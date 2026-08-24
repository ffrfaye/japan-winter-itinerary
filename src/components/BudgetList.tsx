import { trip } from '@/trip'

export function BudgetList() {
  return (
    <section className="space-y-2">
      <p className="text-sm text-zinc-600">{trip.budget.basis}</p>
      <ul className="divide-y divide-zinc-200">
        {trip.budget.lines.map((item) => (
          <li key={item.id} className="space-y-1 py-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </div>
            {item.note ? (
              <p className="text-sm text-zinc-500">{item.note}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="space-y-1 pt-2">
        <p className="text-sm text-zinc-600">{trip.budget.summary}</p>
        <p className="text-sm text-zinc-500">{trip.budget.band}</p>
      </div>
    </section>
  )
}
