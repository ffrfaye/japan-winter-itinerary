import raw from '@/data/budget-waguri.json'
import type {
  BudgetLine,
  BudgetLast4,
  BudgetScenario,
  BudgetSide,
  BudgetWaguri,
} from '@/types/budget'

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

function sideDetail(side: BudgetSide | null | undefined) {
  const value = side?.detail?.trim()
  return value ? value : '—'
}

function last4Line(last4: BudgetLast4): BudgetLine {
  const notes = [last4.tokyo?.note, last4.kyoto?.note].filter(
    (note): note is string => typeof note === 'string' && note.length > 0,
  )
  return {
    id: last4.id,
    title: last4.title,
    detail: `${sideDetail(last4.tokyo)} / ${sideDetail(last4.kyoto)}`,
    notes,
  }
}

export function scenarioLines(scenario: BudgetScenario): BudgetLine[] {
  const byId = (id: string) =>
    budget.sharedLines.find((line) => line.id === id)
  return [
    byId('flight'),
    scenario.tokyo,
    scenario.waguri,
    byId('lifts'),
    byId('tickets'),
    budget.rental,
    last4Line(budget.last4),
  ].filter((line): line is BudgetLine => Boolean(line))
}
