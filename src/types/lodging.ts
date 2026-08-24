export type LodgingLocation = 'tokyo' | 'nozawa' | 'kyoto'

export type BedroomCount = 4 | 5 | 6

export type LodgingPrice = {
  amount: number | null
  currency: string | null
  covers: string | null
  per: string | null
  as_of: string | null
  source: string | null
  how_to_get_quote: string | null
}

export type LodgingOnsen = {
  type: string | null
  nearest: string | null
}

export type LodgingSkiLogistics = {
  walk_to_lift?: string | null
  walk_to_village?: string | null
  vehicle_access?: string | boolean | null
}

export type LodgingTokyoLogistics = {
  neighborhood?: string | null
  walk_to_tokyo_shinkansen_min?: number | string | null
}

export type LodgingImage = {
  url: string
  source?: string | null
}

export type LodgingProperty = {
  id: string
  name: string
  location: LodgingLocation
  operator: string | null
  official_url: string | null
  type: string | null
  bedrooms: number | null
  bathrooms: number | null
  sleeps: number | null
  scenarios: BedroomCount[]
  scenario_notes: string | null
  price: LodgingPrice | null
  availability_status: string
  availability_notes: string | null
  booking_method: string | null
  booking_url: string | null
  booking_contact: string | null
  onsen: LodgingOnsen | null
  ski_logistics: LodgingSkiLogistics | null
  tokyo_logistics: LodgingTokyoLogistics | null
  address: string | null
  lat: number | null
  lng: number | null
  images: LodgingImage[]
  pros: string[]
  cons: string[]
  default_card?: boolean
  nara_not_base?: boolean
  badge?: string | null
}

export type LodgingMapNotes = {
  village?: string | null
  nagasaka?: string | null
  hikage?: string | null
}

export type LodgingCardsFile = {
  research_as_of?: string | null
  nozawa_map_notes?: string | LodgingMapNotes | null
  kyoto_notes?: string | null
  properties: LodgingProperty[]
}
