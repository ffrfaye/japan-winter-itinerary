export type StatusId = 'recommended' | 'open' | 'locked'

export type TripLink = {
  label: string
  url: string
}

export type StatusLegend = {
  id: StatusId
  label: string
  meaning: string
}

export type TripBlock = {
  title: string
  detail: string
  status: StatusId
  links?: TripLink[]
}

export type TripDay = {
  id: string
  date: string
  weekday: string
  short: string
  city: 'Tokyo' | 'Nozawa'
  status: StatusId
  title: string
  summary: string
  blocks: TripBlock[]
}

export type NamedPlace = {
  name: string
  note?: string
  url?: string
  status?: StatusId
  email?: string
  phone?: string
  stayA?: string
  stayB?: string
}

export type ChecklistItem = {
  id: string
  title: string
  detail: string
  status: StatusId
  priority: 'now' | 'soon' | 'later'
}

export type Trip = {
  meta: {
    title: string
    kicker: string
    japaneseTitle: string
    seal: string
    datesLabel: string
    start: string
    end: string
    nights: number
    nightsBreakdown: string
    tone: string
    cityBase: string
    airports: string
    planningBanner: {
      eyebrow: string
      title: string
      body: string
    }
  }
  group: {
    lead: string
    sizeLabel: string
    sizeOpen: string
    interests: string[]
    skiGear: string
  }
  constraints: { id: string; status: StatusId; text: string }[]
  statusLegend: StatusLegend[]
  route: {
    label: string
    status: StatusId
    stops: {
      id: string
      city: string
      cityKey: 'Tokyo' | 'Nozawa'
      dates: string
      nights: number
      note: string
    }[]
  }
  filters: { id: 'all' | 'Tokyo' | 'Nozawa'; label: string }[]
  days: TripDay[]
  openDecisions: {
    id: string
    status: StatusId
    title: string
    detail: string
  }[]
  concert: {
    status: StatusId
    groupRule: string
    artist: string
    tour: string
    venue: string
    shows: {
      date: string
      doors: string
      start: string
      seat: string
      price: string
    }[]
    tickets: {
      fcLotteries: string
      creatorLifeSize: string
      generalSale: string
    }
    sameNightReturn: string
    links: TripLink[]
  }
  ghibli: {
    status: StatusId
    unpublished: boolean
    doNotClaimTickets: boolean
    museum: string
    lastYearClosure: string
    tuesdayNote: string
    primaryDay: string
    sale: string
    rules: string[]
    links: TripLink[]
  }
  lodging: {
    status: StatusId
    tokyo: {
      rule: string
      areaRank: string[]
      candidates: NamedPlace[]
    }
    nozawa: {
      selfCatered: NamedPlace[]
      halfBoard: NamedPlace[]
      closed: NamedPlace[]
    }
  }
  budget: {
    status: StatusId
    heading: string
    label: string
    asOf: string
    basis: string
    lines: { id: string; title: string; detail: string }[]
  }
  transport: {
    yamato: { status: StatusId; text: string; links: TripLink[] }
    train: { status: StatusId; text: string; links: TripLink[] }
    transfer: { status: StatusId; text: string; links: TripLink[] }
  }
  ski: {
    mountain: string
    properDays: string
    tickets: { adultDay: string; adult3Day: string; season: string }
    rental: { shop: string; adultDaySet: string }
    onsen: { sotoYu: string }
    links: TripLink[]
  }
  snowMonkeys: {
    status: StatusId
    rule: string
    operator: string
    reservationsOpen: string
    window: string
    price: string
    url: string
  }
  checklist: ChecklistItem[]
}
