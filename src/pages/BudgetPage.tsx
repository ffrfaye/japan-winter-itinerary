import { Badge } from '@/components/ui/badge'
import { BudgetList } from '@/components/BudgetList'
import { budget } from '@/lib/budget'

export function BudgetPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">{budget.heading}</h1>
        <p className="text-sm text-zinc-500">
          {budget.identityBefore}
          <a
            href={budget.identityUrl}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {budget.identityName}
          </a>
          {budget.identityAfter}
        </p>
        <p className="text-sm text-zinc-600">
          {budget.headcountLabel} {budget.fx}
        </p>
        <p className="text-sm font-medium">{budget.hero}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <Badge variant="outline">{budget.label}</Badge>
          <p className="text-sm text-zinc-500">{budget.band}</p>
        </div>
      </header>
      <BudgetList />
    </div>
  )
}
