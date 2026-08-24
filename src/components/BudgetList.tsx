import { budget } from '@/lib/budget'

export function BudgetList() {
  return (
    <section className="space-y-2">
      <ul className="divide-y divide-zinc-200">
        {budget.lines.map((item) => (
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
        <p className="text-sm text-zinc-600">{budget.foot}</p>
        <p className="text-sm text-zinc-400">{budget.oldBandNote}</p>
      </div>
    </section>
  )
}
