import { useEffect, useRef } from 'react'
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
  type StyleSpecification,
} from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import { mapPlaces, type MapFocus } from '@/lib/map-focus'

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

function sameView(map: MapLibreMap, focus: MapFocus) {
  const place = placeOf(focus)
  const center = map.getCenter()
  return (
    Math.abs(center.lng - place.lng) < 0.02 &&
    Math.abs(center.lat - place.lat) < 0.02 &&
    Math.abs(map.getZoom() - place.zoom) < 0.15
  )
}

function showPlace(map: MapLibreMap, marker: Marker, focus: MapFocus, animate: boolean) {
  const place = placeOf(focus)
  marker.setLngLat([place.lng, place.lat])
  const label = marker.getElement().querySelector('[data-label]')
  if (label) label.textContent = place.label
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!animate || reduced || sameView(map, focus)) {
    if (!sameView(map, focus)) {
      map.jumpTo({ center: [place.lng, place.lat], zoom: place.zoom })
    }
    return
  }
  map.flyTo({
    center: [place.lng, place.lat],
    zoom: place.zoom,
    duration: 1100,
    essential: true,
  })
}

export function JapanMap({ focus }: { focus: MapFocus }) {
  const root = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const focusRef = useRef(focus)
  focusRef.current = focus

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
      mapRef.current = map
      markerRef.current = marker

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
        const latest = focusRef.current
        if (latest !== initialFocus && map && markerRef.current) {
          showPlace(map, markerRef.current, latest, true)
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
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    showPlace(map, marker, focus, true)
  }, [focus])

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
