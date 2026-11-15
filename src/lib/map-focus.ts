export const mapPlaces = {
  Tokyo: {
    lat: 35.681236,
    lng: 139.767125,
    zoom: 11,
    label: 'Tokyo',
  },
  Yamanouchi: {
    lat: 36.784206,
    lng: 138.434204,
    zoom: 12,
    label: 'Yamanouchi',
  },
  Jigokudani: {
    lat: 36.73285,
    lng: 138.46277,
    zoom: 14,
    label: 'Jigokudani',
  },
} as const

export type MapFocus = keyof typeof mapPlaces
