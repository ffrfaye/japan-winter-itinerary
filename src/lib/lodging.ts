import raw from '../../lodging-cards.json'
import type {
  BedroomCount,
  LodgingCardsFile,
  LodgingCompareCard,
  LodgingLocation,
} from '@/types/lodging'

const file = raw as LodgingCardsFile

export const lodgingLocations: { id: LodgingLocation; label: string }[] = [
  { id: 'Tokyo', label: 'Tokyo' },
  { id: 'Nozawa', label: 'Nozawa' },
]

export const lodgingBedrooms: { id: BedroomCount; label: string }[] = [
  { id: 4, label: '4 bedrooms' },
  { id: 5, label: '5 bedrooms' },
  { id: 6, label: '6 bedrooms' },
]

export const tokyoLandmarks = [
  { id: 'station', label: 'Station', lat: 35.681236, lng: 139.767125 },
  { id: 'hatchobori', label: 'Hatchobori', lat: 35.67458, lng: 139.77764 },
  { id: 'nihonbashi', label: 'Nihonbashi', lat: 35.68402, lng: 139.77445 },
] as const

export const nozawaLandmarks = [
  { id: 'village', label: 'Village', lat: 36.9226, lng: 138.4406 },
  { id: 'ski-base', label: 'Ski base', lat: 36.9165, lng: 138.453 },
] as const

function isCard(value: unknown): value is LodgingCompareCard {
  if (!value || typeof value !== 'object') return false
  const card = value as Partial<LodgingCompareCard>
  return (
    typeof card.id === 'string' &&
    typeof card.name === 'string' &&
    (card.location === 'Tokyo' || card.location === 'Nozawa') &&
    typeof card.lodgingType === 'string' &&
    Array.isArray(card.fits) &&
    typeof card.lat === 'number' &&
    typeof card.lng === 'number'
  )
}

export function loadLodgingCards(): LodgingCompareCard[] {
  const list = Array.isArray(file.properties) ? file.properties : []
  return list.filter(isCard)
}

export function filterLodgingCards(
  cards: LodgingCompareCard[],
  location: LodgingLocation,
  bedrooms: BedroomCount,
) {
  return cards.filter(
    (card) => card.location === location && card.fits.includes(bedrooms),
  )
}

export function onsenLabel(kind: LodgingCompareCard['onsen']) {
  if (kind === 'in-house') return 'In-house onsen'
  if (kind === 'village-walk') return 'Village walk'
  if (kind === 'none') return 'No onsen'
  return ''
}

export function roomsLine(card: LodgingCompareCard) {
  const parts: string[] = []
  if (typeof card.rooms === 'number') parts.push(`${card.rooms} rooms`)
  if (typeof card.baths === 'number') parts.push(`${card.baths} baths`)
  if (typeof card.sleeps === 'number') parts.push(`sleeps ${card.sleeps}`)
  return parts.join(' · ')
}
