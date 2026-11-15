import { del, get, put } from '@vercel/blob'
import { seedFlights, type FlightEntry } from '../src/lib/flight-record.ts'

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
