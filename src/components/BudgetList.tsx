import { Badge } from '@/components/ui/badge'
import { trip } from '@/trip'

export function BudgetList() {
  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          {trip.budget.heading}
        </h2>
        <Badge variant="outline">{trip.budget.label}</Badge>
      </div>
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
    </section>
  )
}
