import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { hasPin, nozawaLandmarks, tokyoLandmarks } from '@/lib/lodging'
import type { LodgingLocation, LodgingProperty } from '@/types/lodging'

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
  caption,
}: {
  location: LodgingLocation
  cards: LodgingProperty[]
  selectedId: string | null
  onSelect: (id: string) => void
  caption?: string | null
}) {
  const root = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markers = useRef<L.Marker[]>([])

  const landmarks =
    location === 'tokyo'
      ? tokyoLandmarks
      : location === 'nozawa'
        ? nozawaLandmarks
        : []

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

    const landmarkBounds = L.latLngBounds([])
    const pinBounds = L.latLngBounds([])

    for (const place of landmarks) {
      const marker = L.marker([place.lat, place.lng], {
        icon: landmarkIcon(place.label),
        keyboard: false,
        interactive: false,
        zIndexOffset: 0,
      }).addTo(map)
      markers.current.push(marker)
      landmarkBounds.extend([place.lat, place.lng])
    }

    for (const card of cards) {
      if (!hasPin(card) || card.lat == null || card.lng == null) continue
      const marker = L.marker([card.lat, card.lng], {
        icon: propertyIcon(card.name, card.id === selectedId),
        keyboard: true,
        zIndexOffset: card.id === selectedId ? 200 : 50,
      }).addTo(map)
      marker.on('click', () => onSelect(card.id))
      markers.current.push(marker)
      pinBounds.extend([card.lat, card.lng])
    }

    if (location === 'kyoto') {
      if (pinBounds.isValid()) {
        map.fitBounds(pinBounds, { padding: [28, 28], maxZoom: 15 })
      } else {
        map.setView([35.0116, 135.7681], 13)
      }
      return
    }

    const bounds =
      location === 'tokyo' && pinBounds.isValid()
        ? pinBounds.extend(landmarkBounds)
        : landmarkBounds.extend(pinBounds)

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 })
    }
  }, [map, landmarks, cards, selectedId, onSelect, location])

  return (
    <div className="flex h-full min-h-[40vh] w-full flex-col md:min-h-[28rem]">
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm">
        <div
          ref={root}
          className="h-full min-h-[40vh] w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-zinc-100 [&_.leaflet-control-attribution]:text-[10px] [&_.trip-pin]:border-0 [&_.trip-pin]:bg-transparent md:min-h-[28rem]"
          role="img"
          aria-label={
            location === 'tokyo'
              ? 'Map of Tokyo Station, Hatchobori, and Nihonbashi'
              : location === 'nozawa'
                ? 'Map of Nozawa village and ski base'
                : 'Map of Kyoto. Listings without coordinates are not pinned.'
          }
        />
      </div>
      {caption ? (
        <p className="mt-2 text-xs text-zinc-500">{caption}</p>
      ) : null}
    </div>
  )
}
