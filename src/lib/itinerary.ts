import type { RsvpHouse, Trip, TripDay } from '@/types/trip'

export type TabId = 'itinerary' | 'rsvp' | 'planning'

export type ViewMode = 'list' | 'cards'

export type ItineraryDay = {
  id: string
  date: string
  weekday: string
  short: string
  city: TripDay['city']
  title: string
  summary: string
  body: string[]
  photos: { src: string; caption: string }[]
  stayId: string
  stayLabel: string
  mapCity: 'Tokyo' | 'Nozawa'
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

export function mapDays(trip: Trip): ItineraryDay[] {
  let cursor = 0
  return trip.route.stops.flatMap((stop, stopIndex) => {
    const remainingDays = trip.days.length - cursor
    const remainingStops = trip.route.stops.length - stopIndex
    const take =
      stop.nights > 0 ? stop.nights : remainingStops === 1 ? remainingDays : 1
    const slice = trip.days.slice(cursor, cursor + take)
    cursor += slice.length
    const stayLabel =
      stop.id === 'fly'
        ? 'Depart 9 Jan'
        : `${stop.city} ${stop.dates} · ${stop.nights}n`
    return slice.map((day) => {
      const body = [day.summary, ...day.blocks.map((block) => block.detail)]
      const photos =
        day.id === '2027-01-03'
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
        city: day.city,
        title: day.title,
        summary: day.summary,
        body,
        photos,
        stayId: stop.id,
        stayLabel,
        mapCity: stop.cityKey,
        travelTo: travelTo[day.id],
      }
    })
  })
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
