import raw from '@/data/lodging-cards.json'
import type {
  BedroomCount,
  LodgingCardsFile,
  LodgingLocation,
  LodgingOnsen,
  LodgingPrice,
  LodgingProperty,
  LodgingTokyoLogistics,
} from '@/types/lodging'

const file = raw as LodgingCardsFile

export const lodgingLocations: { id: LodgingLocation; label: string }[] = [
  { id: 'tokyo', label: 'Tokyo' },
  { id: 'nozawa', label: 'Nozawa' },
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

function isBedroom(value: unknown): value is BedroomCount {
  return value === 4 || value === 5 || value === 6
}

function isProperty(value: unknown): value is LodgingProperty {
  if (!value || typeof value !== 'object') return false
  const card = value as Partial<LodgingProperty>
  return (
    typeof card.id === 'string' &&
    typeof card.name === 'string' &&
    (card.location === 'tokyo' || card.location === 'nozawa') &&
    Array.isArray(card.scenarios) &&
    card.scenarios.every(isBedroom)
  )
}

export function loadLodgingFile(): LodgingCardsFile {
  return {
    research_as_of:
      typeof file.research_as_of === 'string' ? file.research_as_of : null,
    nozawa_map_notes:
      typeof file.nozawa_map_notes === 'string' ? file.nozawa_map_notes : null,
    properties: Array.isArray(file.properties)
      ? file.properties.filter(isProperty)
      : [],
  }
}

export function loadLodgingCards(): LodgingProperty[] {
  return loadLodgingFile().properties
}

export function filterLodgingCards(
  cards: LodgingProperty[],
  location: LodgingLocation,
  bedrooms: BedroomCount,
) {
  return cards.filter(
    (card) =>
      card.default_card !== false &&
      card.location === location &&
      card.scenarios.includes(bedrooms),
  )
}

export function hasPin(card: LodgingProperty) {
  return typeof card.lat === 'number' && typeof card.lng === 'number'
}

export function thumbUrl(card: LodgingProperty) {
  const first = card.images?.[0]?.url
  if (typeof first !== 'string') return null
  if (first.startsWith('https://')) return first
  if (first.startsWith('/lodging-thumbs/') || first.startsWith('/lodging/')) {
    return first
  }
  return null
}

export function priceLine(price: LodgingPrice | null) {
  if (!price || price.amount == null || !price.currency) return ''
  const amount = `${price.currency} ${price.amount.toLocaleString('en-US')}`
  const per = price.per ? ` / ${price.per}` : ''
  const asOf = price.as_of ? ` · as of ${price.as_of}` : ''
  return `${amount}${per}${asOf}`
}

export function roomsLine(card: LodgingProperty) {
  const parts: string[] = []
  if (typeof card.bedrooms === 'number') parts.push(`${card.bedrooms} rooms`)
  if (typeof card.bathrooms === 'number') parts.push(`${card.bathrooms} baths`)
  if (typeof card.sleeps === 'number') parts.push(`sleeps ${card.sleeps}`)
  return parts.join(' · ')
}

export function onsenLabel(onsen: LodgingOnsen | null) {
  const kind = onsen?.type?.toLowerCase().replace(/_/g, '-')
  if (kind === 'in-house') return 'In-house onsen'
  if (kind === 'village-walk' || kind === 'village walk') return 'Village walk'
  if (kind === 'none') return 'No onsen'
  const nearest = onsen?.nearest ? ` · ${onsen.nearest}` : ''
  return onsen?.type ? `${onsen.type}${nearest}` : ''
}

export function availabilityLabel(status: string) {
  if (status === 'sold-out') return 'Sold out'
  if (status === 'enquire') return 'Enquire'
  if (status === 'available') return 'Available'
  if (status === 'unknown') return 'Unknown'
  return status
}

export function skiLine(card: LodgingProperty) {
  const ski = card.ski_logistics
  if (!ski) return ''
  return [ski.walk_to_lift, ski.walk_to_village, ski.vehicle_access]
    .filter(Boolean)
    .join(' · ')
}

export function tokyoLine(logistics: LodgingTokyoLogistics | null) {
  if (!logistics) return ''
  const walk =
    logistics.walk_to_tokyo_shinkansen_min != null
      ? `${logistics.walk_to_tokyo_shinkansen_min} min to shinkansen`
      : ''
  return [logistics.neighborhood, walk].filter(Boolean).join(' · ')
}

export function contactHref(value: string) {
  if (value.includes('@')) return `mailto:${value}`
  if (value.startsWith('tel:') || value.startsWith('mailto:')) return value
  if (value.startsWith('+') || /^[\d().\s-]+$/.test(value)) return `tel:${value}`
  return null
}
