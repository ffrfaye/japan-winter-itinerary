import type { RsvpHouse, Trip, TripDay, TripLink } from '@/types/trip'

export type TabId = 'itinerary' | 'rsvp' | 'planning'

export type ViewMode = 'list' | 'cards'

export type MapPlace = 'Tokyo' | 'Nozawa' | 'Jigokudani'

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
  links: TripLink[]
  photos: { src: string; caption: string }[]
  stayId: string
  stayLabel: string
  mapCity: MapPlace
  fillAll?: boolean
  travelTo?: 'Tokyo' | 'Nozawa'
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
  { id: 'rsvp', label: 'RSVP' },
  { id: 'planning', label: 'Planning' },
]

const travelTo: Record<string, 'Tokyo' | 'Nozawa'> = {
  '2026-12-30': 'Nozawa',
  '2027-01-05': 'Tokyo',
}

export function parseTab(hash: string): TabId {
  const value = hash.replace(/^#/, '')
  if (value === 'rsvp' || value === 'planning' || value === 'itinerary') {
    return value
  }
  return 'itinerary'
}

export function dayHeading(day: ItineraryDay) {
  if (day.dayNumber === 0) return 'Day 0'
  return `Day ${day.dayNumber} · ${day.weekday} ${day.short}`
}

function dayLinks(day: TripDay): TripLink[] {
  if (day.links?.length) return day.links
  return day.blocks.flatMap((block) => block.links ?? [])
}

function toItinerary(
  day: TripDay,
  stayId: string,
  stayLabel: string,
  mapCity: MapPlace,
): ItineraryDay {
  const body = [
    day.summary,
    ...day.blocks.map((block) => block.detail).filter(Boolean),
  ]
  const photos =
    day.id === '2027-01-02'
      ? [
          {
            src: '/snow-monkeys.jpg',
            caption: 'Jigokudani snow monkeys',
          },
        ]
      : []
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
    links: dayLinks(day),
    photos,
    stayId,
    stayLabel,
    mapCity,
    fillAll: day.overview,
    travelTo: travelTo[day.id],
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
    return slice.map((day) =>
      toItinerary(
        day,
        stop.id,
        stayLabel,
        day.id === '2027-01-02' ? 'Jigokudani' : stop.cityKey,
      ),
    )
  })
  if (!overview) return mapped
  return [
    toItinerary(overview, 'overview', 'Overview', 'Tokyo'),
    ...mapped,
  ]
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

export function filterHouses(
  houses: RsvpHouse[],
  remaining: number,
): RsvpHouse[] {
  return houses.filter((house) => {
    if (house.kind === 'two-house' && remaining < 11) return false
    if (house.kind === 'tokyo-apt') return remaining >= 1
    return remaining >= house.min && remaining <= house.max
  })
}

export function tokyoAptNote(remaining: number) {
  return remaining <= 8
    ? '2 apartments if yes ≤ 8. Unbooked.'
    : '3 apartments. Unbooked.'
}
