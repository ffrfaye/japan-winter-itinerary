import type { PlaceCard, Trip, TripDay } from '@/types/trip'

export type TabId = 'itinerary' | 'rsvp' | 'planning' | 'budget' | 'lodging' | 'flights'

export type ViewMode = 'list' | 'cards'

export type MapPlace =
  | 'Tokyo'
  | 'Stay'
  | 'Ryuoo'
  | 'Shiga'
  | 'Nozawa'
  | 'Jigokudani'

export type PinState = 'primary' | 'secondary' | 'idle'

export type PinStates = Record<MapPlace, PinState>

export type DayStrip = {
  title: string
  detail: string
}

export type ItineraryDay = {
  id: string
  date: string
  weekday: string
  short: string
  dayNumber: number
  city: TripDay['city']
  title: string
  summary: string
  body: string[]
  strips: DayStrip[]
  places: PlaceCard[]
  stayId: string
  stayLabel: string
  jumpLabel: string
  overview: boolean
  pins: PinStates
  showTravelLine?: boolean
  showCluster?: boolean
  pinLinks?: Partial<Record<MapPlace, string>>
}

export type StayGroup = {
  id: string
  label: string
  days: ItineraryDay[]
}

export type Guest = {
  id: string
  name: string
  pairId: string
  pairNickname: string
  lockedYes: boolean
}

export type RsvpAnswer = 'yes' | 'maybe' | 'no' | null

export const tabs: { id: TabId; label: string }[] = [
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'lodging', label: 'Lodging' },
  { id: 'planning', label: 'Planning' },
  { id: 'budget', label: 'Budget' },
  { id: 'flights', label: 'Flights' },
]

const pinUrls = {
  Tokyo: 'https://www.gotokyo.org/en/',
  Stay: 'https://www.airbnb.com/rooms/1536728419485230997',
  Ryuoo: 'https://www.ryuoo.com/en/',
  Shiga: 'https://shigakogen-ski.or.jp/english/',
  Nozawa: 'https://en.nozawaski.com/',
  Jigokudani: 'https://en.jigokudani-yaenkoen.co.jp/',
} as const

const idlePins: PinStates = {
  Tokyo: 'idle',
  Stay: 'idle',
  Ryuoo: 'idle',
  Shiga: 'idle',
  Nozawa: 'idle',
  Jigokudani: 'idle',
}

const travelDays = new Set(['2026-12-30', '2027-01-05'])

function pinsFor(day: TripDay): Pick<
  ItineraryDay,
  'pins' | 'showTravelLine' | 'showCluster' | 'pinLinks'
> {
  if (day.overview) {
    return {
      pins: {
        ...idlePins,
        Tokyo: 'primary',
        Stay: 'primary',
        Ryuoo: 'secondary',
      },
      pinLinks: pinUrls,
    }
  }
  if (travelDays.has(day.id)) {
    return {
      pins: { ...idlePins, Tokyo: 'primary', Stay: 'primary' },
      showTravelLine: true,
      pinLinks: { Tokyo: pinUrls.Tokyo, Stay: pinUrls.Stay },
    }
  }
  if (day.id === '2026-12-31') {
    return {
      pins: { ...idlePins, Stay: 'secondary', Ryuoo: 'primary' },
      pinLinks: { Stay: pinUrls.Stay, Ryuoo: pinUrls.Ryuoo },
    }
  }
  if (day.id === '2027-01-01' || day.id === '2027-01-03') {
    return {
      pins: { ...idlePins, Stay: 'secondary', Shiga: 'primary' },
      pinLinks: { Stay: pinUrls.Stay, Shiga: pinUrls.Shiga },
    }
  }
  if (day.id === '2027-01-02') {
    return {
      pins: { ...idlePins, Stay: 'secondary', Nozawa: 'primary' },
      pinLinks: { Stay: pinUrls.Stay, Nozawa: pinUrls.Nozawa },
    }
  }
  if (day.id === '2027-01-04') {
    return {
      pins: {
        ...idlePins,
        Stay: 'secondary',
        Jigokudani: 'primary',
      },
      showCluster: true,
      pinLinks: {
        Stay: pinUrls.Stay,
        Jigokudani: pinUrls.Jigokudani,
      },
    }
  }
  return {
    pins: { ...idlePins, Tokyo: 'primary' },
    pinLinks: { Tokyo: pinUrls.Tokyo },
  }
}

export function parseTab(hash: string): TabId {
  const value = hash.replace(/^#/, '')
  if (value === 'rsvp') return 'budget'
  if (
    value === 'planning' ||
    value === 'itinerary' ||
    value === 'lodging' ||
    value === 'budget' ||
    value === 'flights'
  ) {
    return value
  }
  return 'itinerary'
}

export function dayHeading(day: ItineraryDay) {
  if (day.overview) return 'Overview'
  return `Day ${day.dayNumber} · ${day.weekday} ${day.short}`
}

function toItinerary(
  day: TripDay,
  stayId: string,
  stayLabel: string,
): ItineraryDay {
  const strips = day.blocks
    .filter((block) => block.detail)
    .map((block) => ({ title: block.title, detail: block.detail }))
  const body =
    strips.length > 0 ? strips.map((block) => block.detail) : [day.summary]
  return {
    id: day.id,
    date: day.date,
    weekday: day.weekday,
    short: day.short,
    dayNumber: day.dayNumber,
    city: day.city,
    title: day.title,
    summary: day.summary,
    body,
    strips,
    places: day.places ?? [],
    stayId,
    stayLabel,
    jumpLabel: day.overview ? 'Overview' : `${day.weekday} ${day.short}`,
    overview: Boolean(day.overview),
    ...pinsFor(day),
  }
}

export function mapDays(trip: Trip): ItineraryDay[] {
  const overview = trip.days.find((day) => day.overview)
  const calendar = trip.days.filter((day) => !day.overview)
  let cursor = 0
  const mapped = trip.route.stops.flatMap((stop, stopIndex) => {
    const remainingDays = calendar.length - cursor
    const remainingStops = trip.route.stops.length - stopIndex
    const take =
      stop.nights > 0 ? stop.nights : remainingStops === 1 ? remainingDays : 1
    const slice = calendar.slice(cursor, cursor + take)
    cursor += slice.length
    const stayLabel =
      stop.id === 'fly'
        ? 'Depart 9 Jan'
        : `${stop.city} ${stop.dates} · ${stop.nights}n`
    return slice.map((day) => toItinerary(day, stop.id, stayLabel))
  })
  if (!overview) return mapped
  return [toItinerary(overview, 'overview', 'Overview'), ...mapped]
}

export function groupDays(days: ItineraryDay[]): StayGroup[] {
  const groups: StayGroup[] = []
  for (const day of days) {
    const last = groups[groups.length - 1]
    if (last && last.id === day.stayId) {
      last.days.push(day)
    } else {
      groups.push({ id: day.stayId, label: day.stayLabel, days: [day] })
    }
  }
  return groups
}

export function guestsFromTrip(trip: Trip): Guest[] {
  return trip.group.pairs.flatMap((pair) =>
    pair.names.map((name) => ({
      id: `${pair.id}-${name.toLowerCase()}`,
      name,
      pairId: pair.id,
      pairNickname: pair.nickname,
      lockedYes: name === 'Faye',
    })),
  )
}

export function emptyAnswers(guests: Guest[]): Record<string, RsvpAnswer> {
  return Object.fromEntries(
    guests.map((guest) => [guest.id, guest.lockedYes ? 'yes' : null]),
  ) as Record<string, RsvpAnswer>
}

export function yesCount(answers: Record<string, RsvpAnswer>) {
  return Object.values(answers).filter((value) => value === 'yes').length
}

export function remainingGuests(
  invited: number,
  answers: Record<string, RsvpAnswer>,
) {
  const noCount = Object.values(answers).filter((value) => value === 'no').length
  return invited - noCount
}
