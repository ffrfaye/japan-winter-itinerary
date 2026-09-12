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

export type BudgetCarRental = {
  id: string
  title: string
  label: string
  notes: string[]
}

export type BudgetScenario = {
  id: 4 | 5 | 6
  label: string
  hero: string
  working9Note: string | null
  quietNote?: string | null
  tokyo: BudgetLine
  waguri: BudgetLine
  cars: Pick<BudgetLine, 'detail' | 'note'>
}

export type BudgetWaguri = {
  heading: string
  label: string
  identityName: string
  identityUrl: string
  foot: string
  last_refreshed?: string | null
  sharedLines: BudgetLine[]
  rental: BudgetLine
  carRental: BudgetCarRental
  last4: BudgetLast4
  defaultBedrooms: 4 | 5 | 6
  scenarios: BudgetScenario[]
}
