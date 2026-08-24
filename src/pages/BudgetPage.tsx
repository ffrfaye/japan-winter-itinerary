import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { BudgetList } from '@/components/BudgetList'
import { GhostTabs } from '@/components/GhostTabs'
import { budget, budgetBedroomTabs, budgetScenario, scenarioLines } from '@/lib/budget'
import type { BudgetScenario } from '@/types/budget'

export function BudgetPage() {
  const [bedrooms, setBedrooms] = useState<BudgetScenario['id']>(
    budget.defaultBedrooms,
  )
  const scenario = budgetScenario(bedrooms)
  const lines = scenarioLines(scenario)

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">{budget.heading}</h1>
        <p className="text-sm text-zinc-600">
          <a
            href={budget.identityUrl}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            {budget.identityName}
          </a>
        </p>
      </header>

      <GhostTabs
        label="Bedrooms"
        value={bedrooms}
        onChange={setBedrooms}
        options={budgetBedroomTabs}
      />

      <header className="space-y-2">
        <p className="text-sm font-medium">{scenario.hero}</p>
        {scenario.working9Note ? (
          <p className="text-sm text-zinc-500">{scenario.working9Note}</p>
        ) : null}
        <Badge variant="outline">{budget.label}</Badge>
      </header>
      <BudgetList lines={lines} />
      {budget.foot ? (
        <p className="text-sm text-zinc-600">{budget.foot}</p>
      ) : null}
    </div>
  )
}
