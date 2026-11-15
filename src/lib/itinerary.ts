import type { Trip } from '@/types/trip'
import type { ItineraryDay } from '@/data/days'

export type { ItineraryDay, StayGroup } from '@/data/days'
export { groupDays, itineraryDays } from '@/data/days'

export type TabId = 'itinerary' | 'rsvp' | 'planning' | 'budget' | 'lodging' | 'flights'

export type ViewMode = 'list' | 'cards'

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
  return `${day.dateLabel} · ${day.title}`
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
