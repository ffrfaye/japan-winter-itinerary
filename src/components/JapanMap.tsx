import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapPlaces, type MapFocus } from '@/lib/map-focus'

function pinIcon(label: string) {
  const width = label.length > 8 ? 96 : 72
  return L.divIcon({
    className: 'trip-pin',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;pointer-events:none;">
      <span style="width:14px;height:14px;border-radius:999px;background:#18181b;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.28);"></span>
      <span style="font:600 11px/1.1 Inter Variable,Inter,sans-serif;color:#18181b;white-space:nowrap;background:rgba(255,255,255,.88);padding:1px 4px;border-radius:4px;">${label}</span>
    </div>`,
    iconSize: [width, 36],
    iconAnchor: [width / 2, 8],
  })
}

function placeOf(focus: MapFocus) {
  return mapPlaces[focus]
}

export function JapanMap({ focus }: { focus: MapFocus }) {
  const root = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const focusRef = useRef(focus)
  focusRef.current = focus

  useEffect(() => {
    const node = root.current
    if (!node) return

    const initial = placeOf(focusRef.current)
    const map = L.map(node, {
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: true,
      zoomControl: true,
      minZoom: 5,
      maxZoom: 16,
    })
    map.getContainer().style.touchAction = 'pan-y'
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
        maxZoom: 19,
      },
    ).addTo(map)

    const marker = L.marker([initial.lat, initial.lng], {
      icon: pinIcon(initial.label),
      keyboard: false,
      interactive: false,
    }).addTo(map)
    map.setView([initial.lat, initial.lng], initial.zoom, { animate: false })
    mapRef.current = map
    markerRef.current = marker

    const apply = (animate: boolean) => {
      const place = placeOf(focusRef.current)
      const next = L.latLng(place.lat, place.lng)
      marker.setLatLng(next)
      marker.setIcon(pinIcon(place.label))
      map.invalidateSize()
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!animate || reduced) {
        map.setView(next, place.zoom, { animate: false })
        return
      }
      const here = map.getCenter()
      const same =
        map.getZoom() === place.zoom && here.distanceTo(next) < 40
      if (!same) {
        map.flyTo(next, place.zoom, { duration: 1.15, easeLinearity: 0.25 })
      }
    }

    const resize = new ResizeObserver(() => {
      const size = map.getSize()
      map.invalidateSize()
      if (size.x < 20 || size.y < 20) apply(false)
    })
    resize.observe(node)
    requestAnimationFrame(() => apply(false))

    return () => {
      resize.disconnect()
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    const place = placeOf(focus)
    const next = L.latLng(place.lat, place.lng)
    marker.setLatLng(next)
    marker.setIcon(pinIcon(place.label))
    map.invalidateSize()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      map.setView(next, place.zoom, { animate: false })
      return
    }
    map.flyTo(next, place.zoom, { duration: 1.15, easeLinearity: 0.25 })
  }, [focus])

  const place = placeOf(focus)

  return (
    <div className="trip-map relative left-1/2 ml-[-50vw] aspect-square w-screen overflow-hidden border-y border-zinc-200 bg-zinc-100 md:static md:left-auto md:ml-0 md:aspect-[2/1] md:w-full md:rounded-xl md:border">
      <div
        ref={root}
        className="absolute inset-0 [&_.leaflet-container]:z-0 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-zinc-100 [&_.leaflet-container]:font-sans [&_.leaflet-control-attribution]:text-[10px] [&_.trip-pin]:border-0 [&_.trip-pin]:bg-transparent"
        role="img"
        aria-label={`Map centered on ${place.label}`}
      />
    </div>
  )
}
