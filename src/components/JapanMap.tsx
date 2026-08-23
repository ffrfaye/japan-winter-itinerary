import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type JapanMapProps = {
  active: 'Tokyo' | 'Nozawa'
  travelTo?: 'Tokyo' | 'Nozawa'
}

const places = {
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Nozawa: { lat: 36.9226, lng: 138.4406 },
} as const

const labels = {
  Tokyo: 'Tokyo',
  Nozawa: 'Nozawa Onsen',
} as const

function pinIcon(city: keyof typeof places, filled: boolean) {
  const disc = filled
    ? 'background:#18181b;border:2px solid #18181b;'
    : 'background:#fff;border:2px solid #52525b;'
  return L.divIcon({
    className: 'trip-pin',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="width:14px;height:14px;border-radius:999px;${disc}box-shadow:0 0 0 1px rgba(255,255,255,.8);"></span>
      <span style="font:600 10px/1 Inter Variable,Inter,sans-serif;color:${filled ? '#18181b' : '#71717a'};white-space:nowrap;">${labels[city]}</span>
    </div>`,
    iconSize: [88, 32],
    iconAnchor: [44, 8],
  })
}

const bounds = L.latLngBounds(
  [places.Tokyo.lat, places.Tokyo.lng],
  [places.Nozawa.lat, places.Nozawa.lng],
)

function fitTrip(map: L.Map) {
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
}

export function JapanMap({ active, travelTo }: JapanMapProps) {
  const destination = travelTo ?? active
  const root = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markers = useRef<Partial<Record<keyof typeof places, L.Marker>>>({})
  const lineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    const node = root.current
    if (!node) return

    const next = L.map(node, {
      scrollWheelZoom: false,
      attributionControl: true,
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
    }
  }, [])

  useEffect(() => {
    if (!map) return

    for (const city of ['Tokyo', 'Nozawa'] as const) {
      const filled = city === destination
      const latlng: L.LatLngExpression = [places[city].lat, places[city].lng]
      const existing = markers.current[city]
      if (existing) {
        existing.setIcon(pinIcon(city, filled))
        existing.setZIndexOffset(filled ? 200 : 0)
      } else {
        markers.current[city] = L.marker(latlng, {
          icon: pinIcon(city, filled),
          keyboard: false,
          zIndexOffset: filled ? 200 : 0,
        }).addTo(map)
      }
    }

    if (travelTo) {
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
  }, [map, destination, travelTo])

  return (
    <div className="relative z-0 isolate aspect-square w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
      <div
        ref={root}
        className="absolute inset-0 [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-zinc-100 [&_.leaflet-control-attribution]:text-[10px] [&_.trip-pin]:border-0 [&_.trip-pin]:bg-transparent"
        role="img"
        aria-label={`Map of Tokyo and Nozawa Onsen. ${destination} is the active city.`}
      />
    </div>
  )
}
