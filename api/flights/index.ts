import { del, get, put } from '@vercel/blob'

type FlightLeg = {
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

type FlightEntry = {
  id: string
  people: string[]
  nickname: string | null
  screenshotPath: string | null
  arrival: FlightLeg | null
  departure: FlightLeg | null
}

const indexPath = 'flights/index.json'

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

async function readStoredFlights(): Promise<FlightEntry[]> {
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

async function writeStoredFlights(flights: FlightEntry[]) {
  await put(indexPath, JSON.stringify({ flights }), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

function cleanLeg(value: unknown): FlightLeg | null {
  if (!value || typeof value !== 'object') return null
  const leg = value as FlightLeg
  if (!leg.date && !leg.time && !leg.flight && !leg.airport) return null
  return {
    airport: String(leg.airport ?? '').toUpperCase(),
    date: String(leg.date ?? ''),
    time: String(leg.time ?? ''),
    flight: String(leg.flight ?? '').replace(/\s+/g, '').toUpperCase(),
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
  const extra = stored.filter((flight) => flight.id !== 'seed-fyll')
  return Response.json({ flights: [...seedFlights, ...extra] })
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
    const type = file.type || 'image/jpeg'
    const extension = type.includes('png') ? 'png' : 'jpg'
    screenshotPath = `flights/shots/${id}.${extension}`
    await put(screenshotPath, Buffer.from(await file.arrayBuffer()), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: type,
    })
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
  if (found?.screenshotPath?.startsWith('flights/shots/')) {
    await del(found.screenshotPath).catch(() => undefined)
  }
  await writeStoredFlights(stored.filter((flight) => flight.id !== id))
  return Response.json({ ok: true })
}
