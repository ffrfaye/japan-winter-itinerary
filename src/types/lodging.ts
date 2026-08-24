export type LodgingLocation = 'Tokyo' | 'Nozawa'

export type BedroomCount = 4 | 5 | 6

export type OnsenKind = 'in-house' | 'village-walk' | 'none'

export type LodgingArea =
  | 'station'
  | 'hatchobori'
  | 'nihonbashi'
  | 'village'
  | 'ski-base'

export type LodgingCompareCard = {
  id: string
  name: string
  location: LodgingLocation
  lodgingType: string
  price?: string
  rooms?: number
  baths?: number
  sleeps?: number
  fits: BedroomCount[]
  availability?: string
  bookingMethod?: string
  onsen?: OnsenKind
  walkToLift?: string
  walkToVillage?: string
  vehicleAccess?: string
  photo?: string
  lat: number
  lng: number
  area?: LodgingArea
  pros: string[]
  cons: string[]
}

export type LodgingCardsFile = {
  properties: LodgingCompareCard[]
}
