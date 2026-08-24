import raw from '@/data/flights-scenarios.json'
import type { FlightOption, FlightOriginGroup, FlightsScenarios } from '@/types/flights'

export const flights = raw as FlightsScenarios

export const flightOriginOrder: FlightOriginGroup['id'][] = ['SFO', 'YVR', 'STL']

export function flightGroups(): FlightOriginGroup[] {
  return flightOriginOrder.map((id) => flights.origins[id])
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
