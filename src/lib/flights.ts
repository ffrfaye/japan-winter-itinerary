import raw from '@/data/flights-scenarios.json'
import type {
  FlightOption,
  FlightOriginGroup,
  FlightOriginId,
  FlightsScenarios,
} from '@/types/flights'

export const flights = raw as FlightsScenarios

export const flightOriginOrder: FlightOriginId[] = ['SFO', 'SEA', 'YVR', 'STL']

export const flightOriginTabs = flightOriginOrder.map((id) => ({
  id,
  label: id,
}))

const emptyHeadings: Record<FlightOriginId, string> = {
  SFO: 'SFO',
  SEA: 'Seattle (SEA)',
  YVR: 'Vancouver (YVR)',
  STL: 'St. Louis (STL)',
}

function emptyGroup(id: FlightOriginId): FlightOriginGroup {
  return {
    id,
    heading: emptyHeadings[id],
    search_url: null,
    cheapest_economy_usd: null,
    cheapest_sane_usd: null,
    cheapest_sane_label: null,
    options: [],
  }
}

export function flightGroups(): FlightOriginGroup[] {
  return flightOriginOrder.map((id) => flights.origins[id] ?? emptyGroup(id))
}

export function usd(amount: number) {
  return `$${amount.toLocaleString('en-US')}`
}

export function stopsLabel(option: FlightOption) {
  if (option.stops === 0) return 'Nonstop'
  if (option.stops === 1) return '1 stop'
  return `${option.stops} stops`
}

export function flightNumbersLabel(option: FlightOption) {
  if (!option.flight_numbers || option.flight_numbers.length === 0) return null
  return option.flight_numbers.join(' · ')
}

export function originLastRefreshed(group: FlightOriginGroup): string {
  const raw =
    group.id === 'SEA'
      ? (group.last_refreshed ??
        group.refreshed_at?.label ??
        group.refreshed_at?.pt ??
        flights.refreshed_at.label ??
        flights.refreshed_at.pt)
      : flights.refreshed_at.label
  return raw.startsWith('Last refreshed') ? raw : `Last refreshed ${raw}`
}

export function bookedFlights() {
  return Array.isArray(flights.booked) ? flights.booked : []
}

export function bookedFlightLine(
  booking: NonNullable<FlightsScenarios['booked']>[number],
) {
  const { outbound, return: inbound } = booking
  const price = booking.price_each_usd.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${booking.names} · ${booking.pnr} · booked · ${outbound.flight} ${outbound.from} ${outbound.depart} → ${outbound.to} ${outbound.arrive}; ${inbound.flight} ${inbound.from} ${inbound.depart} → ${inbound.to} ${inbound.arrive} · $${price} each`
}

export function optionLastRefreshed(
  option: FlightOption,
  group: FlightOriginGroup,
): string {
  if (group.id === 'SEA') {
    return originLastRefreshed(group)
  }
  const raw = option.last_refreshed || flights.refreshed_at.label
  return raw.startsWith('Last refreshed') ? raw : `Last refreshed ${raw}`
}
