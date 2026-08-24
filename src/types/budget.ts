export type BudgetLine = {
  id: string
  title: string
  detail: string
  note?: string
  notes?: string[]
}

export type BudgetSide = {
  detail: string | null
  note?: string | null
}

export type BudgetLast4 = {
  id: string
  title: string
  tokyo: BudgetSide | null
  kyoto: BudgetSide | null
}

export type BudgetScenario = {
  id: 4 | 5 | 6
  label: string
  hero: string
  working9Note: string | null
  tokyo: BudgetLine
  waguri: BudgetLine
}

export type BudgetWaguri = {
  heading: string
  label: string
  identityName: string
  identityUrl: string
  foot: string
  sharedLines: BudgetLine[]
  rental: BudgetLine
  last4: BudgetLast4
  defaultBedrooms: 4 | 5 | 6
  scenarios: BudgetScenario[]
}
