export type FlightQuotedDates = {
  start: string
  end: string
}

export type FlightRefreshedAt = {
  utc: string
  pt: string
  label: string
}

export type FlightOption = {
  id: string
  origin: string
  dest: string
  airlines: string
  flight_numbers: string[] | null
  depart_local: string
  arrive_local: string
  duration: string
  stops: number
  layover: string | null
  cabin: string
  price_usd: number
  currency: string
  booking_url: string
  notes: string[]
  quoted_dates: FlightQuotedDates
  last_refreshed: string
  refundable: null
  trip_type: string
  return_leg: string
  unbundled: boolean
  not_recommended: boolean
  sane_cheapest: boolean
}

export type FlightOriginGroup = {
  id: 'SFO' | 'YVR' | 'STL'
  heading: string
  search_url: string
  cheapest_economy_usd: number
  cheapest_sane_usd: number
  cheapest_sane_label: string
  options: FlightOption[]
}

export type FlightsScenarios = {
  refreshed_at: FlightRefreshedAt
  trip_dates: FlightQuotedDates
  source: string
  target_dates_actually_quoted: boolean
  caveats: string[]
  origins: {
    SFO: FlightOriginGroup
    YVR: FlightOriginGroup
    STL: FlightOriginGroup
  }
}
