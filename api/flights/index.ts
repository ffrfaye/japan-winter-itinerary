import type { FlightEntry, FlightLeg } from '../flight-store'
import {
  publicFlights,
  readStoredFlights,
  removeScreenshot,
  saveScreenshot,
  writeStoredFlights,
} from '../flight-store'

function cleanLeg(value: unknown): FlightLeg | null {
  if (!value || typeof value !== 'object') return null
  const leg = value as FlightLeg
  if (!leg.date && !leg.time && !leg.flight && !leg.airport) return null
  return {
    airport: String(leg.airport ?? '').toUpperCase(),
    date: String(leg.date ?? ''),
    time: String(leg.time ?? ''),
    flight: String(leg.flight ?? '').toUpperCase(),
    airline: String(leg.airline ?? ''),
    fromAirport: leg.fromAirport ? String(leg.fromAirport).toUpperCase() : undefined,
    fromDate: leg.fromDate ? String(leg.fromDate) : undefined,
    fromTime: leg.fromTime ? String(leg.fromTime) : undefined,
    toAirport: leg.toAirport ? String(leg.toAirport).toUpperCase() : undefined,
    toDate: leg.toDate ? String(leg.toDate) : undefined,
    toTime: leg.toTime ? String(leg.toTime) : undefined,
  }
}

export async function GET() {
  const stored = await readStoredFlights()
  return Response.json({ flights: publicFlights(stored) })
}

export async function POST(request: Request) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Expected form data.' }, { status: 400 })
  }
  const raw = form.get('entry')
  if (typeof raw !== 'string') {
    return Response.json({ error: 'Missing entry.' }, { status: 400 })
  }
  const body = JSON.parse(raw) as {
    people?: string[]
    arrival?: FlightLeg | null
    departure?: FlightLeg | null
  }
  const names = (body.people ?? []).map((name) => name.trim()).filter(Boolean)
  if (names.length === 0) {
    return Response.json({ error: 'Name is required.' }, { status: 400 })
  }
  const arrival = cleanLeg(body.arrival)
  const departure = cleanLeg(body.departure)
  if (!arrival && !departure) {
    return Response.json({ error: 'Add a flight.' }, { status: 400 })
  }
  const id = `flt-${Date.now()}`
  let screenshotPath: string | null = null
  const file = form.get('image')
  if (file instanceof File && file.size > 0) {
    screenshotPath = await saveScreenshot(
      id,
      new Uint8Array(await file.arrayBuffer()),
      file.type || 'image/jpeg',
    )
  }
  const entry: FlightEntry = {
    id,
    people: names,
    nickname: null,
    screenshotPath,
    arrival,
    departure,
  }
  const stored = await readStoredFlights()
  stored.push(entry)
  await writeStoredFlights(stored)
  return Response.json({ flight: entry })
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  if (!id || id === 'seed-fyll') {
    return Response.json({ error: 'Cannot delete that flight.' }, { status: 400 })
  }
  const stored = await readStoredFlights()
  const found = stored.find((flight) => flight.id === id)
  if (!found) return Response.json({ ok: true })
  await removeScreenshot(found.screenshotPath)
  await writeStoredFlights(stored.filter((flight) => flight.id !== id))
  return Response.json({ ok: true })
}
