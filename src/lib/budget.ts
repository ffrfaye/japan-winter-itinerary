import raw from '@/data/budget-waguri.json'
import type { BudgetLine, BudgetScenario, BudgetWaguri } from '@/types/budget'

export const budget = raw as BudgetWaguri

export const budgetBedroomTabs = budget.scenarios.map((scenario) => ({
  id: scenario.id,
  label: scenario.label,
}))

export function budgetScenario(bedrooms: BudgetScenario['id']): BudgetScenario {
  return (
    budget.scenarios.find((scenario) => scenario.id === bedrooms) ??
    budget.scenarios[0]
  )
}

export function scenarioLines(scenario: BudgetScenario): BudgetLine[] {
  const byId = (id: string) =>
    budget.sharedLines.find((line) => line.id === id)
  return [
    byId('flight'),
    scenario.tokyo,
    scenario.waguri,
    byId('lifts'),
    budget.rental,
    byId('tickets'),
  ].filter((line): line is BudgetLine => Boolean(line))
}
