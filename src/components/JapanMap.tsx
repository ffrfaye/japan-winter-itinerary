import { useEffect, useRef } from 'react'
import {
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
  type StyleSpecification,
} from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { mapPlaces, type MapFocus } from '@/lib/map-focus'
import { stayOrder, stays, type StayId } from '@/data/stays'

setWorkerUrl(maplibreWorkerUrl)

const POSITRON = 'https://tiles.openfreemap.org/styles/positron'

let positronStyle: Promise<StyleSpecification | string> | null = null

function englishPositron() {
  if (!positronStyle) {
    positronStyle = fetch(POSITRON)
      .then((response) => {
        if (!response.ok) throw new Error('style')
        return response.json() as Promise<StyleSpecification>
      })
      .then((style) => {
        for (const layer of style.layers ?? []) {
          if (layer.type !== 'symbol' || !layer.layout) continue
          const field = layer.layout['text-field']
          if (field == null) continue
          if (!JSON.stringify(field).includes('name')) continue
          layer.layout['text-field'] = [
            'coalesce',
            ['get', 'name_en'],
            ['get', 'name:latin'],
            ['get', 'name'],
          ]
        }
        return style
      })
      .catch(() => POSITRON)
  }
  return positronStyle
}

function pinElement(label: string) {
  const el = document.createElement('div')
  el.className = 'trip-pin'
  el.style.cssText =
    'display:flex;flex-direction:column;align-items:center;gap:3px;pointer-events:none;'
  el.innerHTML = `<span style="width:14px;height:14px;border-radius:999px;background:#18181b;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.28);"></span>
    <span data-label style="font:600 11px/1.1 Inter Variable,Inter,sans-serif;color:#18181b;white-space:nowrap;background:rgba(255,255,255,.9);padding:1px 5px;border-radius:4px;">${label}</span>`
  return el
}

function placeOf(focus: MapFocus) {
  return mapPlaces[focus]
}

function emphasizeStay(markers: Partial<Record<StayId, Marker>>, stayId: StayId | null) {
  for (const id of stayOrder) {
    const marker = markers[id]
    if (!marker) continue
    const button = marker.getElement() as HTMLButtonElement
    paintLodgingPin(button, id === stayId)
  }
}

function kmBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const lat = ((a.lat + b.lat) / 2) * rad
  const x = dLng * Math.cos(lat) * 6371
  const y = dLat * 6371
  return Math.hypot(x, y)
}

const houseSvg = (color: string) =>
  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" fill="${color}"/></svg>`

function paintLodgingPin(el: HTMLButtonElement, active: boolean) {
  const size = active ? 32 : 22
  el.style.cssText = [
    `width:${size}px`,
    `height:${size}px`,
    'border-radius:999px',
    'border:2px solid #fff',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:0',
    'cursor:pointer',
    'box-shadow:0 1px 4px rgba(0,0,0,.28)',
    `background:${active ? '#18181b' : '#fff'}`,
    `opacity:${active ? '1' : '0.72'}`,
    `z-index:${active ? 3 : 1}`,
  ].join(';')
  el.innerHTML = houseSvg(active ? '#fff' : '#52525b')
}

function lodgingMarker(id: StayId) {
  const stay = stays[id]
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'lodging-pin'
  button.dataset.stay = id
  button.setAttribute('aria-label', stay.shortName)
  paintLodgingPin(button, false)
  const popup = new Popup({ offset: 16, closeButton: true, maxWidth: '220px' }).setHTML(
    `<p style="margin:0;font:600 13px/1.3 Inter Variable,Inter,sans-serif;color:#18181b;">${stay.shortName}</p>
     <p style="margin:3px 0 0;font:400 12px/1.35 Inter Variable,Inter,sans-serif;color:#71717a;">${stay.dateLine}</p>
     <a href="${stay.invite}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:8px;font:600 12px/1.3 Inter Variable,Inter,sans-serif;color:#18181b;">Join this trip on Airbnb</a>`,
  )
  return new Marker({ element: button, anchor: 'center' })
    .setLngLat([stay.lng, stay.lat])
    .setPopup(popup)
}

function frameDay(
  map: MapLibreMap,
  marker: Marker,
  focus: MapFocus,
  stayId: StayId | null,
  animate: boolean,
) {
  const place = placeOf(focus)
  marker.setLngLat([place.lng, place.lat])
  const label = marker.getElement().querySelector('[data-label]')
  if (label) label.textContent = place.label
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = !animate || reduced ? 0 : 1100
  const stay = stayId ? stays[stayId] : null
  const near = stay != null && kmBetween(place, stay) < 25
  if (!stay || !near || kmBetween(place, stay) < 0.4) {
    map.flyTo({
      center: [place.lng, place.lat],
      zoom: place.zoom,
      duration,
      essential: true,
    })
    return
  }
  const bounds = new LngLatBounds([place.lng, place.lat], [stay.lng, stay.lat])
  map.fitBounds(bounds, {
    padding: { top: 56, bottom: 48, left: 48, right: 36 },
    maxZoom: 13,
    duration,
    essential: true,
  })
}

export function JapanMap({
  focus,
  stayId,
}: {
  focus: MapFocus
  stayId: StayId | null
}) {
  const root = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const lodgingRef = useRef<Partial<Record<StayId, Marker>>>({})
  const focusRef = useRef(focus)
  const stayRef = useRef(stayId)
  focusRef.current = focus
  stayRef.current = stayId

  useEffect(() => {
    const node = root.current
    if (!node) return
    let map: MapLibreMap | null = null
    let cancelled = false

    void englishPositron().then((style) => {
      if (cancelled || !node.isConnected) return
      const initialFocus = focusRef.current
      const initial = placeOf(initialFocus)
      map = new MapLibreMap({
        container: node,
        style,
        center: [initial.lng, initial.lat],
        zoom: initial.zoom,
        minZoom: 4,
        maxZoom: 17,
        attributionControl: { compact: true },
        dragPan: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        touchZoomRotate: true,
        doubleClickZoom: true,
        scrollZoom: true,
        boxZoom: true,
        keyboard: true,
        cooperativeGestures: false,
      })
      map.touchZoomRotate.disableRotation()
      map.addControl(
        new NavigationControl({ showCompass: false, showZoom: true }),
        'top-left',
      )
      const marker = new Marker({
        element: pinElement(initial.label),
        anchor: 'top',
        offset: [0, -7],
      })
        .setLngLat([initial.lng, initial.lat])
        .addTo(map)
      const lodging: Partial<Record<StayId, Marker>> = {}
      for (const id of stayOrder) {
        lodging[id] = lodgingMarker(id).addTo(map)
      }
      mapRef.current = map
      markerRef.current = marker
      lodgingRef.current = lodging
      emphasizeStay(lodging, stayRef.current)

      const remember = () => {
        const center = map?.getCenter()
        if (!map || !center) return
        node.dataset.zoom = map.getZoom().toFixed(2)
        node.dataset.lat = center.lat.toFixed(4)
        node.dataset.lng = center.lng.toFixed(4)
      }
      map.on('moveend', remember)
      map.on('zoomend', remember)
      map.once('load', () => {
        map?.resize()
        remember()
        if (map && markerRef.current) {
          frameDay(map, markerRef.current, focusRef.current, stayRef.current, true)
        }
      })

      const resize = new ResizeObserver(() => {
        map?.resize()
      })
      resize.observe(node)
      map.once('remove', () => resize.disconnect())
    })

    return () => {
      cancelled = true
      map?.remove()
      mapRef.current = null
      markerRef.current = null
      lodgingRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    emphasizeStay(lodgingRef.current, stayId)
    frameDay(map, marker, focus, stayId, true)
  }, [focus, stayId])

  const place = placeOf(focus)

  return (
    <div
      className="trip-map relative left-1/2 ml-[-50vw] aspect-square w-screen overflow-hidden border-y border-zinc-200 bg-[#f4f4f5] md:static md:left-auto md:ml-0 md:aspect-[2/1] md:w-full md:rounded-xl md:border"
      role="region"
      aria-label={`Map centered on ${place.label}`}
    >
      <div ref={root} className="h-full w-full" />
    </div>
  )
}
