export type BudgetLine = {
  id: string
  title: string
  detail: string
  note?: string
}

export type BudgetWaguri = {
  heading: string
  label: string
  headcountLabel: string
  fx: string
  identityBefore: string
  identityName: string
  identityAfter: string
  identityUrl: string
  hero: string
  band: string
  foot: string
  oldBandNote: string
  optionalHeading: string
  optionalLead: string
  optionalIfAdded: string
  optionalLines: BudgetLine[]
  lines: BudgetLine[]
}
