export type BudgetLine = {
  id: string
  title: string
  detail: string
  note?: string
}

export type BudgetScenario = {
  id: 4 | 5 | 6
  label: string
  people: 8 | 10 | 12
  headcountLabel: string
  hero: string
  working9Note: string | null
  tokyo: BudgetLine
  waguri: BudgetLine
}

export type BudgetWaguri = {
  heading: string
  label: string
  fx: string
  identityName: string
  identityUrl: string
  band: string
  foot: string
  oldBandNote: string
  optionalHeading: string
  optionalLead: string
  optionalIfAdded: string
  optionalLines: BudgetLine[]
  sharedLines: BudgetLine[]
  rental: BudgetLine
  defaultBedrooms: 4 | 5 | 6
  scenarios: BudgetScenario[]
}
