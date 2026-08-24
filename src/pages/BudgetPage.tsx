import { Badge } from '@/components/ui/badge'
import { BudgetList } from '@/components/BudgetList'
import { trip } from '@/trip'

export function BudgetPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">
          {trip.budget.heading}
        </h1>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-sm text-zinc-600">{trip.budget.placeholder}</p>
          <Badge variant="outline">{trip.budget.label}</Badge>
        </div>
        <p className="text-sm text-zinc-500">{trip.budget.asOf}</p>
        <p className="text-sm text-zinc-500">{trip.budget.workingNote}</p>
      </header>
      <BudgetList />
    </div>
  )
}
