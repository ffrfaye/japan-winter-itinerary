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
  { id: 'kyoto', label: 'Kyoto' },
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
    (card.location === 'tokyo' ||
      card.location === 'nozawa' ||
      card.location === 'kyoto') &&
    Array.isArray(card.scenarios) &&
    card.scenarios.every(isBedroom)
  )
}

export function nozawaMapCaption(notes: LodgingCardsFile['nozawa_map_notes']) {
  if (typeof notes === 'string' && notes.trim()) return notes.trim()
  if (!notes || typeof notes !== 'object') return null
  const parts = [notes.village, notes.nagasaka, notes.hikage].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  )
  return parts.length > 0 ? parts.join(' · ') : null
}

export function loadLodgingFile(): LodgingCardsFile {
  return {
    research_as_of:
      typeof file.research_as_of === 'string' ? file.research_as_of : '2026-08-23',
    checked_at: typeof file.checked_at === 'string' ? file.checked_at : null,
    nozawa_as_of:
      typeof file.nozawa_as_of === 'string' ? file.nozawa_as_of : null,
    nozawa_checked_at:
      typeof file.nozawa_checked_at === 'string' ? file.nozawa_checked_at : null,
    nozawa_map_notes: file.nozawa_map_notes ?? null,
    kyoto_notes:
      typeof file.kyoto_notes === 'string' ? file.kyoto_notes : null,
    properties: Array.isArray(file.properties)
      ? file.properties.filter(isProperty)
      : [],
  }
}

export function loadLodgingCards(): LodgingProperty[] {
  return loadLodgingFile().properties
}

export function availabilityKey(status: string) {
  return status.toLowerCase().replaceAll('_', '-')
}

export function isBooked(card: LodgingProperty) {
  return availabilityKey(card.availability_status) === 'booked'
}

export function lodgingStatusRank(card: LodgingProperty) {
  const status = availabilityKey(card.availability_status)
  if (status === 'booked') return 0
  if (status === 'available') return 1
  if (status === 'enquire' || status === 'enquire/hold' || status === 'hold') {
    return 2
  }
  if (status === 'unknown') return 3
  if (status === 'sold-out') return 4
  return 3
}

export function isSoldOut(card: LodgingProperty) {
  return availabilityKey(card.availability_status) === 'sold-out'
}

export function isOversizeOrMismatch(
  card: LodgingProperty,
  bedrooms: BedroomCount,
) {
  if (card.location !== 'nozawa') return false
  if (typeof card.bedrooms === 'number' && card.bedrooms < bedrooms) return true
  if (
    !card.scenarios.includes(bedrooms) &&
    typeof card.bedrooms === 'number' &&
    card.bedrooms > bedrooms
  ) {
    return true
  }
  return false
}

export function isFadedCard(card: LodgingProperty, bedrooms: BedroomCount) {
  return isSoldOut(card) || isOversizeOrMismatch(card, bedrooms)
}

export function isSoldOutWaitlistEmpty(card: LodgingProperty) {
  return isSoldOut(card)
}

export function lodgingSortRank(card: LodgingProperty, bedrooms: BedroomCount) {
  const faded = isFadedCard(card, bedrooms) ? 10 : 0
  return faded + lodgingStatusRank(card)
}

export function filterLodgingCards(
  cards: LodgingProperty[],
  location: LodgingLocation,
  bedrooms: BedroomCount,
) {
  return cards
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => {
      if (card.location !== location) return false
      if (location === 'nozawa') return true
      return card.scenarios.includes(bedrooms)
    })
    .sort((a, b) => {
      const rank =
        lodgingSortRank(a.card, bedrooms) - lodgingSortRank(b.card, bedrooms)
      return rank !== 0 ? rank : a.index - b.index
    })
    .map(({ card }) => card)
}

export function hasPin(card: LodgingProperty) {
  return typeof card.lat === 'number' && typeof card.lng === 'number'
}

export function propertyUrl(card: LodgingProperty) {
  return card.property_url || card.official_url
}

export function thumbUrl(card: LodgingProperty) {
  const first = card.images?.[0]?.url
  if (typeof first === 'string' && first.startsWith('https://')) return first
  return null
}

export function priceLine(price: LodgingPrice | null) {
  if (!price || price.amount == null || !price.currency) return ''
  const amount =
    price.currency === 'JPY'
      ? `¥${price.amount.toLocaleString('en-US')}`
      : `${price.currency} ${price.amount.toLocaleString('en-US')}`
  const per = price.per ? ` / ${price.per}` : ''
  return `${amount}${per}`
}

export function typicalPriceLine(price: LodgingPrice | null) {
  if (!price || price.amount != null) return ''
  return typeof price.source === 'string' ? price.source : ''
}

export function roomsLine(card: LodgingProperty) {
  const parts: string[] = []
  if (typeof card.bedrooms === 'number') {
    parts.push(`${card.bedrooms} bedrooms`)
  }
  if (typeof card.bathrooms === 'number') {
    parts.push(`${card.bathrooms} bathrooms`)
  }
  if (typeof card.sleeps === 'number') parts.push(`sleeps ${card.sleeps}`)
  return parts.join(' · ')
}

export function onsenLabel(onsen: LodgingOnsen | null) {
  const kind = onsen?.type?.toLowerCase().replace(/_/g, '-')
  let label = ''
  if (kind === 'in-house') label = 'In-house onsen'
  else if (kind === 'village-walk' || kind === 'village walk') {
    label = 'Village walk'
  } else if (kind === 'none') label = 'No onsen'
  else if (onsen?.type) label = onsen.type
  if (!label) return ''
  return onsen?.nearest ? `${label} · ${onsen.nearest}` : label
}

export function availabilityLabel(status: string) {
  const key = availabilityKey(status)
  if (key === 'sold-out') return 'Sold out'
  if (key === 'booked') return 'Booked'
  if (key === 'enquire') return 'Enquire'
  if (key === 'enquire/hold' || key === 'hold') return 'Hold'
  if (key === 'available') return 'Available'
  if (key === 'unknown') return 'Unknown'
  if (key === 'inquiry sent') return 'Inquiry sent'
  return status
}

export function skiLine(card: LodgingProperty) {
  const ski = card.ski_logistics
  if (!ski) return ''
  const vehicle =
    ski.vehicle_access === false
      ? 'No vehicle'
      : ski.vehicle_access === true
        ? 'Vehicle access'
        : ski.vehicle_access
  return [ski.walk_to_lift, ski.walk_to_village, vehicle]
    .filter((value) => typeof value === 'string' && value.length > 0)
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
