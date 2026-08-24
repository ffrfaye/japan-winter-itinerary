import raw from '@/data/flights-scenarios.json'
import type {
  FlightOption,
  FlightOriginGroup,
  FlightOriginId,
  FlightsScenarios,
} from '@/types/flights'

export const flights = raw as FlightsScenarios

export const flightOriginOrder: FlightOriginId[] = ['SFO', 'SEA', 'YVR', 'STL']

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
