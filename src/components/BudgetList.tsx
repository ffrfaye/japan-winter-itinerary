import { budget } from '@/lib/budget'
import type { BudgetLine } from '@/types/budget'

export function BudgetList({ lines }: { lines: BudgetLine[] }) {
  return (
    <div className="space-y-8">
      <section>
        <ul className="divide-y divide-zinc-200">
          {lines.map((item) => (
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
      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
          {budget.optionalHeading}
        </h2>
        <p className="text-sm text-zinc-500">{budget.optionalLead}</p>
        <ul className="divide-y divide-zinc-200">
          {budget.optionalLines.map((item) => (
            <li key={item.id} className="space-y-1 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium text-zinc-700">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.detail}</p>
              </div>
              {item.note ? (
                <p className="text-sm text-zinc-500">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500">{budget.optionalIfAdded}</p>
      </section>
      <div className="space-y-1">
        <p className="text-sm text-zinc-600">{budget.foot}</p>
        <p className="text-sm text-zinc-400">{budget.oldBandNote}</p>
      </div>
    </div>
  )
}
