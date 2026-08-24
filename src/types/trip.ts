export type StatusId = 'recommended' | 'open' | 'locked' | 'deferred'

export type TripLink = {
  label: string
  url: string
}

export type PlaceCard = {
  title: string
  description: string
  url: string
  thumb?: string
  thumbPosition?: string
  mark: string
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
  dayNumber: number
  overview?: boolean
  city: 'Tokyo' | 'Nozawa' | 'Overview'
  status: StatusId
  title: string
  summary: string
  links?: TripLink[]
  places?: PlaceCard[]
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

export type LodgingBookStatus =
  | 'available'
  | 'enquire'
  | 'waitlist'
  | 'sold-out'

export type LodgingOption = {
  id: string
  property: string
  city: 'Tokyo' | 'Nozawa'
  beds: string
  status: LodgingBookStatus
  perPerson?: string
  nextStep: string
  url?: string
  email?: string
  phone?: string
  note?: string
}

export type LodgingBand = {
  id: '4' | '5' | '6'
  heading: string
  why: string
  options: LodgingOption[]
}

export type RsvpHouse = {
  id: string
  name: string
  city: 'Tokyo' | 'Nozawa'
  kind: 'single' | 'two-house' | 'tokyo-apt'
  min: number
  max: number
  note: string
  email?: string
  phone?: string
  url?: string
}

export type ChecklistItem = {
  id: string
  title: string
  detail: string
  status: StatusId
  priority: 'now' | 'soon' | 'later'
}

export type PlanningActivity = {
  id: string
  group: 'tokyo' | 'nozawa' | 'last-block'
  title: string
  status: StatusId
  detail: string
  when?: string
  lines: string[]
  links: TripLink[]
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
    shareLine: string
    lockedNote: string
    photoCredit: string
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
    sizeStatus: StatusId
    pairs: { id: string; nickname: string; names: string[] }[]
    invited: number
    rsvpHeadline: string
    rsvpSub: string
    rsvpSaveNote: string
    nyeSoldoutNote: string
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
  activities: PlanningActivity[]
  lodging: {
    status: StatusId
    asOf: string
    tokyoNote: string
    bands: LodgingBand[]
  }
  budget: {
    status: StatusId
    heading: string
    label: string
    asOf: string
    placeholder: string
    workingNote: string
    basis: string
    summary: string
    subtotalWithoutRental: string
    subtotalWithRental: string
    band: string
    lines: { id: string; title: string; detail: string; note?: string }[]
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
    childTour?: string
    parkAdmission?: string
    parkUrl?: string
    url: string
  }
  checklist: ChecklistItem[]
  bookNow: ChecklistItem[]
  rsvpHouses: RsvpHouse[]
}
