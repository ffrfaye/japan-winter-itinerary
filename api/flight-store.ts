import { del, get, put } from '@vercel/blob'

export type FlightLeg = {
  airport: string
  date: string
  time: string
  flight: string
  airline: string
  fromAirport?: string
  fromDate?: string
  fromTime?: string
  toAirport?: string
  toDate?: string
  toTime?: string
}

export type FlightEntry = {
  id: string
  people: string[]
  nickname: string | null
  screenshotPath: string | null
  arrival: FlightLeg | null
  departure: FlightLeg | null
}

const seedFlights: FlightEntry[] = [
  {
    id: 'seed-fyll',
    people: ['Faye', 'Will'],
    nickname: 'Fyll',
    screenshotPath: null,
    arrival: {
      airport: 'NRT',
      date: '2026-12-27',
      time: '15:00',
      flight: 'UA837',
      airline: 'United',
      fromAirport: 'SFO',
      fromDate: '2026-12-26',
      fromTime: '10:40',
    },
    departure: {
      airport: 'NRT',
      date: '2027-01-09',
      time: '16:50',
      flight: 'UA838',
      airline: 'United',
      toAirport: 'SFO',
      toDate: '2027-01-09',
      toTime: '09:25',
    },
  },
]

const indexPath = 'flights/index.json'

export async function readStoredFlights(): Promise<FlightEntry[]> {
  try {
    const result = await get(indexPath, { access: 'private', useCache: false })
    if (!result || result.statusCode !== 200 || !result.stream) return []
    const text = await new Response(result.stream).text()
    const parsed = JSON.parse(text) as { flights?: FlightEntry[] }
    return Array.isArray(parsed.flights) ? parsed.flights : []
  } catch {
    return []
  }
}

export async function writeStoredFlights(flights: FlightEntry[]) {
  await put(indexPath, JSON.stringify({ flights }), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

export function publicFlights(stored: FlightEntry[]) {
  const extra = stored.filter((flight) => flight.id !== 'seed-fyll')
  return [...seedFlights, ...extra]
}

export async function saveScreenshot(id: string, bytes: Uint8Array, contentType: string) {
  const extension = contentType.includes('png') ? 'png' : 'jpg'
  const pathname = `flights/shots/${id}.${extension}`
  await put(pathname, Buffer.from(bytes), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
  })
  return pathname
}

export async function removeScreenshot(pathname: string | null) {
  if (!pathname?.startsWith('flights/shots/')) return
  await del(pathname).catch(() => undefined)
}
