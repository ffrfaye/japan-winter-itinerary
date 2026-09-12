import type { BudgetLine } from '@/types/budget'

export function BudgetList({ lines }: { lines: BudgetLine[] }) {
  return (
    <ul className="divide-y divide-zinc-200">
      {lines.map((item) => {
        const notes = item.notes?.length
          ? item.notes
          : item.note
            ? [item.note]
            : []
        return (
          <li key={item.id} className="space-y-1 py-3">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </div>
            {notes.map((note) => (
              <p key={note} className="text-sm text-zinc-500">
                {note}
              </p>
            ))}
          </li>
        )
      })}
    </ul>
  )
}
