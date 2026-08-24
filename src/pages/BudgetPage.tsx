import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { BudgetList } from '@/components/BudgetList'
import { GhostTabs } from '@/components/GhostTabs'
import { budget, budgetBedroomTabs, budgetScenario, scenarioLines } from '@/lib/budget'
import { guestsFromTrip } from '@/lib/itinerary'
import { trip } from '@/trip'
import type { BudgetScenario } from '@/types/budget'

export function BudgetPage() {
  const guests = useMemo(() => guestsFromTrip(trip), [])
  const [bedrooms, setBedrooms] = useState<BudgetScenario['id']>(
    budget.defaultBedrooms,
  )
  const scenario = budgetScenario(bedrooms)
  const lines = scenarioLines(scenario)

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
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium">{trip.group.sizeLabel}</p>
        <ul className="mt-1 divide-y divide-zinc-200">
          {guests.map((guest) => (
            <li key={guest.id} className="py-3 text-[15px] font-medium">
              {guest.name}
            </li>
          ))}
        </ul>
      </section>

      <GhostTabs
        label="Bedrooms"
        value={bedrooms}
        onChange={setBedrooms}
        options={budgetBedroomTabs}
      />

      <header className="space-y-2">
        <p className="text-sm text-zinc-600">
          {scenario.headcountLabel} {budget.fx}
        </p>
        <p className="text-sm font-medium">{scenario.hero}</p>
        {scenario.working9Note ? (
          <p className="text-sm text-zinc-500">{scenario.working9Note}</p>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-2">
          <Badge variant="outline">{budget.label}</Badge>
          <p className="text-sm text-zinc-500">{budget.band}</p>
        </div>
      </header>
      <BudgetList lines={lines} />
    </div>
  )
}
