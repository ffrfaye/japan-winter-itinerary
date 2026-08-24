import type { PlaceCard, Trip, TripDay } from '@/types/trip'

export type TabId = 'itinerary' | 'rsvp' | 'planning' | 'budget' | 'lodging'

export type ViewMode = 'list' | 'cards'

export type MapPlace = 'Tokyo' | 'Nozawa' | 'Jigokudani'

export type PinState = 'primary' | 'secondary' | 'idle'

export type PinStates = Record<MapPlace, PinState>

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
]

const pinUrls = {
  Tokyo: 'https://www.gotokyo.org/en/',
  Nozawa: 'https://en.nozawaski.com/',
  Jigokudani: 'https://en.jigokudani-yaenkoen.co.jp/',
} as const

const skiDays = new Set(['2026-12-31', '2027-01-01', '2027-01-03', '2027-01-04'])
const travelDays = new Set(['2026-12-30', '2027-01-05'])

function pinsFor(day: TripDay): Pick<
  ItineraryDay,
  'pins' | 'showTravelLine' | 'showCluster' | 'pinLinks'
> {
  if (day.overview) {
    return {
      pins: { Tokyo: 'primary', Nozawa: 'primary', Jigokudani: 'primary' },
      pinLinks: pinUrls,
    }
  }
  if (travelDays.has(day.id)) {
    return {
      pins: { Tokyo: 'primary', Nozawa: 'primary', Jigokudani: 'idle' },
      showTravelLine: true,
    }
  }
  if (day.id === '2027-01-02') {
    return {
      pins: { Tokyo: 'idle', Nozawa: 'secondary', Jigokudani: 'primary' },
      showCluster: true,
      pinLinks: { Nozawa: pinUrls.Nozawa, Jigokudani: pinUrls.Jigokudani },
    }
  }
  if (skiDays.has(day.id)) {
    return {
      pins: { Tokyo: 'idle', Nozawa: 'primary', Jigokudani: 'secondary' },
    }
  }
  return {
    pins: { Tokyo: 'primary', Nozawa: 'idle', Jigokudani: 'idle' },
  }
}

export function parseTab(hash: string): TabId {
  const value = hash.replace(/^#/, '')
  if (value === 'rsvp') return 'budget'
  if (
    value === 'planning' ||
    value === 'itinerary' ||
    value === 'lodging' ||
    value === 'budget'
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
  const details = day.blocks.map((block) => block.detail).filter(Boolean)
  const body = details.length > 0 ? details : [day.summary]
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
