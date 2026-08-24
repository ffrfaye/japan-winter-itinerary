import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { nozawaLandmarks, tokyoLandmarks } from '@/lib/lodging'
import type { LodgingCompareCard, LodgingLocation } from '@/types/lodging'

function landmarkIcon(label: string) {
  return L.divIcon({
    className: 'trip-pin',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="width:10px;height:10px;border-radius:999px;background:#fff;border:2px solid #52525b;box-shadow:0 0 0 1px rgba(255,255,255,.8);"></span>
      <span style="font:500 10px/1 Inter Variable,Inter,sans-serif;color:#52525b;white-space:nowrap;">${label}</span>
    </div>`,
    iconSize: [88, 28],
    iconAnchor: [44, 8],
  })
}

function propertyIcon(name: string, active: boolean) {
  const disc = active
    ? 'background:#18181b;border:2px solid #18181b;'
    : 'background:#fff;border:2px solid #18181b;'
  const color = active ? '#18181b' : '#3f3f46'
  return L.divIcon({
    className: 'trip-pin',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="width:14px;height:14px;border-radius:999px;${disc}box-shadow:0 0 0 1px rgba(255,255,255,.8);"></span>
      <span style="font:600 10px/1 Inter Variable,Inter,sans-serif;color:${color};white-space:nowrap;">${name}</span>
    </div>`,
    iconSize: [120, 32],
    iconAnchor: [60, 8],
  })
}

export function LodgingCompareMap({
  location,
  cards,
  selectedId,
  onSelect,
}: {
  location: LodgingLocation
  cards: LodgingCompareCard[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markers = useRef<L.Marker[]>([])

  const landmarks = location === 'Tokyo' ? tokyoLandmarks : nozawaLandmarks

  useEffect(() => {
    const node = root.current
    if (!node) return

    const next = L.map(node, {
      scrollWheelZoom: false,
      attributionControl: true,
      minZoom: 12,
      maxZoom: 17,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(next)
    setMap(next)

    const resize = new ResizeObserver(() => {
      next.invalidateSize()
    })
    resize.observe(node)

    return () => {
      resize.disconnect()
      next.remove()
      setMap(null)
      markers.current = []
    }
  }, [])

  useEffect(() => {
    if (!map) return

    for (const marker of markers.current) marker.remove()
    markers.current = []

    const bounds = L.latLngBounds([])

    for (const place of landmarks) {
      const marker = L.marker([place.lat, place.lng], {
        icon: landmarkIcon(place.label),
        keyboard: false,
        interactive: false,
        zIndexOffset: 0,
      }).addTo(map)
      markers.current.push(marker)
      bounds.extend([place.lat, place.lng])
    }

    for (const card of cards) {
      const marker = L.marker([card.lat, card.lng], {
        icon: propertyIcon(card.name, card.id === selectedId),
        keyboard: true,
        zIndexOffset: card.id === selectedId ? 200 : 50,
      }).addTo(map)
      marker.on('click', () => onSelect(card.id))
      markers.current.push(marker)
      bounds.extend([card.lat, card.lng])
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: location === 'Tokyo' ? 15 : 15 })
    }
  }, [map, landmarks, cards, selectedId, onSelect, location])

  return (
    <div className="h-full min-h-[40vh] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm md:min-h-[28rem]">
      <div
        ref={root}
        className="h-full min-h-[40vh] w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-zinc-100 [&_.leaflet-control-attribution]:text-[10px] [&_.trip-pin]:border-0 [&_.trip-pin]:bg-transparent md:min-h-[28rem]"
        role="img"
        aria-label={
          location === 'Tokyo'
            ? 'Map of Tokyo Station, Hatchobori, and Nihonbashi'
            : 'Map of Nozawa village and ski base'
        }
      />
    </div>
  )
}
