import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedFlights, type FlightEntry, type FlightLeg } from '@/lib/flight-record'

type FlightsContextValue = {
  flights: FlightEntry[]
  reload: () => Promise<void>
}

const FlightsContext = createContext<FlightsContextValue | null>(null)

export function FlightsProvider({ children }: { children: React.ReactNode }) {
  const [flights, setFlights] = useState<FlightEntry[]>(seedFlights)

  const reload = useCallback(async () => {
    const response = await fetch('/api/flights')
    if (!response.ok) return
    const data = (await response.json()) as { flights?: FlightEntry[] }
    if (Array.isArray(data.flights) && data.flights.length > 0) {
      setFlights(data.flights)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const value = useMemo(() => ({ flights, reload }), [flights, reload])
  return <FlightsContext.Provider value={value}>{children}</FlightsContext.Provider>
}

export function useFlights() {
  const value = useContext(FlightsContext)
  if (!value) throw new Error('useFlights needs FlightsProvider')
  return value
}

export type DraftLeg = FlightLeg

export async function prepareFlightImage(file: File) {
  const heic =
    /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name)
  if (!heic) return file
  const heic2any = (await import('heic2any')).default
  const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const blob = Array.isArray(converted) ? converted[0] : converted
  if (!blob) throw new Error('heic')
  return new File([blob], file.name.replace(/\.hei[cf]$/i, '.jpg'), {
    type: 'image/jpeg',
  })
}

export async function parseFlightImage(file: File) {
  const body = new FormData()
  body.set('image', file)
  const response = await fetch('/api/flights/parse', { method: 'POST', body })
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(payload?.error || 'unreadable')
  }
  return (await response.json()) as {
    name?: string
    flights: import('@/lib/flight-record').ParsedLeg[]
  }
}

export async function saveFlight(input: {
  people: string[]
  arrival: FlightLeg | null
  departure: FlightLeg | null
  image: File | null
}) {
  const body = new FormData()
  body.set(
    'entry',
    JSON.stringify({
      people: input.people,
      arrival: input.arrival,
      departure: input.departure,
    }),
  )
  if (input.image) body.set('image', input.image)
  const response = await fetch('/api/flights', { method: 'POST', body })
  if (!response.ok) throw new Error('save')
}
