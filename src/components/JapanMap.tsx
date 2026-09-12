import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPlace, PinState, PinStates } from '@/lib/itinerary'

type JapanMapProps = {
  pins: PinStates
  showTravelLine?: boolean
  showCluster?: boolean
  pinLinks?: Partial<Record<MapPlace, string>>
  softLabels?: boolean
}

const places = {
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Nozawa: { lat: 36.9226, lng: 138.4406 },
  Jigokudani: { lat: 36.7333, lng: 138.462 },
} as const

const labels = {
  Tokyo: 'Tokyo',
  Nozawa: 'Nozawa Onsen',
  Jigokudani: 'Jigokudani',
} as const

function pinIcon(city: MapPlace, state: PinState, soft: boolean) {
  const filled = state === 'primary'
  const disc = filled
    ? 'background:#18181b;border:2px solid #18181b;'
    : 'background:#fff;border:2px solid #52525b;'
  const color = filled ? (soft ? '#3f3f46' : '#18181b') : '#71717a'
  const weight = soft ? 500 : 600
  const label =
    state === 'idle'
      ? ''
      : `<span style="font:${weight} 10px/1 Inter Variable,Inter,sans-serif;color:${color};white-space:nowrap;">${labels[city]}</span>`
  const width = state === 'idle' ? 16 : city === 'Jigokudani' ? 96 : 104
  const height = state === 'idle' ? 16 : 32
  const anchorX = city === 'Jigokudani' && state !== 'idle' ? 36 : width / 2
  const anchorY = city === 'Jigokudani' && state !== 'idle' ? 14 : state === 'idle' ? 8 : 8
  return L.divIcon({
    className: 'trip-pin',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="width:14px;height:14px;border-radius:999px;${disc}box-shadow:0 0 0 1px rgba(255,255,255,.8);"></span>
      ${label}
    </div>`,
    iconSize: [width, height],
    iconAnchor: [anchorX, anchorY],
  })
}

const bounds = L.latLngBounds(
  [places.Tokyo.lat, places.Tokyo.lng],
  [places.Nozawa.lat, places.Nozawa.lng],
).extend([places.Jigokudani.lat, places.Jigokudani.lng])

function fitTrip(map: L.Map) {
  map.fitBounds(bounds, { padding: [24, 24], maxZoom: 7 })
}

export function JapanMap({
  pins,
  showTravelLine,
  showCluster,
  pinLinks,
  softLabels,
}: JapanMapProps) {
  const root = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markers = useRef<Partial<Record<MapPlace, L.Marker>>>({})
  const lineRef = useRef<L.Polyline | null>(null)
  const clusterRef = useRef<L.Circle | null>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return

    const next = L.map(node, {
      scrollWheelZoom: false,
      attributionControl: true,
      minZoom: 5,
      maxZoom: 8,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(next)
    fitTrip(next)
    setMap(next)

    const resize = new ResizeObserver(() => {
      next.invalidateSize()
      fitTrip(next)
    })
    resize.observe(node)

    return () => {
      resize.disconnect()
      next.remove()
      setMap(null)
      markers.current = {}
      lineRef.current = null
      clusterRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!map) return

    for (const city of ['Tokyo', 'Nozawa', 'Jigokudani'] as const) {
      const state = pins[city]
      const latlng: L.LatLngExpression = [places[city].lat, places[city].lng]
      const href = pinLinks?.[city]
      const existing = markers.current[city]
      if (existing) {
        existing.setIcon(pinIcon(city, state, Boolean(softLabels)))
        existing.setZIndexOffset(state === 'primary' ? 200 : state === 'secondary' ? 100 : 0)
        existing.off('click')
        if (href) {
          existing.on('click', () => window.open(href, '_blank', 'noreferrer'))
        }
      } else {
        const marker = L.marker(latlng, {
          icon: pinIcon(city, state, Boolean(softLabels)),
          keyboard: false,
          zIndexOffset: state === 'primary' ? 200 : state === 'secondary' ? 100 : 0,
        }).addTo(map)
        if (href) {
          marker.on('click', () => window.open(href, '_blank', 'noreferrer'))
        }
        markers.current[city] = marker
      }
    }

    if (showTravelLine) {
      const path: L.LatLngExpression[] = [
        [places.Tokyo.lat, places.Tokyo.lng],
        [places.Nozawa.lat, places.Nozawa.lng],
      ]
      if (lineRef.current) {
        lineRef.current.setLatLngs(path)
      } else {
        lineRef.current = L.polyline(path, {
          color: '#18181b',
          weight: 2,
          opacity: 0.7,
        }).addTo(map)
      }
    } else if (lineRef.current) {
      lineRef.current.remove()
      lineRef.current = null
    }

    if (showCluster) {
      const center: L.LatLngExpression = [
        (places.Nozawa.lat + places.Jigokudani.lat) / 2,
        (places.Nozawa.lng + places.Jigokudani.lng) / 2,
      ]
      const radius =
        map.distance(
          [places.Nozawa.lat, places.Nozawa.lng],
          [places.Jigokudani.lat, places.Jigokudani.lng],
        ) /
          2 +
        2500
      if (clusterRef.current) {
        clusterRef.current.setLatLng(center)
        clusterRef.current.setRadius(radius)
      } else {
        clusterRef.current = L.circle(center, {
          radius,
          color: '#18181b',
          weight: 1,
          opacity: 0.22,
          dashArray: '3 5',
          fill: false,
          interactive: false,
        }).addTo(map)
      }
    } else if (clusterRef.current) {
      clusterRef.current.remove()
      clusterRef.current = null
    }
  }, [map, pins, showTravelLine, showCluster, pinLinks, softLabels])

  const primary = (Object.entries(pins) as [MapPlace, PinState][])
    .filter(([, state]) => state === 'primary')
    .map(([place]) => place)
    .join(', ')

  return (
    <div className="relative z-10 isolate aspect-[2/1] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
      <div
        ref={root}
        className="absolute inset-0 [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-zinc-100 [&_.leaflet-control-attribution]:text-[10px] [&_.trip-pin]:border-0 [&_.trip-pin]:bg-transparent"
        role="img"
        aria-label={`Map of Tokyo, Nozawa Onsen, and Jigokudani. ${primary} highlighted.`}
      />
    </div>
  )
}
