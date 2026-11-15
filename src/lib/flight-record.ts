export const people = [
  'Faye',
  'Will',
  'Lampe',
  'Sri',
  'Cal',
  'Clem',
  'Eric',
  'Macy',
  'James',
  'Seb',
] as const

export type PersonName = (typeof people)[number]

const avatarTones = [
  'bg-zinc-800',
  'bg-stone-600',
  'bg-neutral-700',
  'bg-slate-700',
  'bg-zinc-600',
  'bg-stone-700',
]

const initials = (() => {
  const used = new Set<string>()
  const map: Record<string, string> = {}
  for (const name of people) {
    let label = name[0] ?? ''
    let index = 2
    while (used.has(label.toUpperCase()) && index <= name.length) {
      label = name.slice(0, index)
      index += 1
    }
    used.add(label.toUpperCase())
    map[name] = label
  }
  return map
})()

export function initialsFor(name: string) {
  return initials[name] ?? name.slice(0, 2)
}

export function avatarClass(name: string) {
  const index = people.indexOf(name as PersonName)
  return avatarTones[(index < 0 ? 0 : index) % avatarTones.length]
}

export function peopleLabel(names: string[]) {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} & ${names[1]}`
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

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

export type ParsedLeg = {
  direction: 'arrival' | 'departure'
  flightNumber: string
  airline: string
  from: string
  to: string
  departLocal: string
  arriveLocal: string
}

export const seedFlights: FlightEntry[] = [
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

const airportCity: Record<string, string> = {
  SFO: 'San Francisco',
  HND: 'Tokyo Haneda',
  NRT: 'Tokyo Narita',
  LAX: 'Los Angeles',
  JFK: 'New York',
  ORD: 'Chicago',
  SEA: 'Seattle',
  SJC: 'San Jose',
  OAK: 'Oakland',
  HNL: 'Honolulu',
  IAD: 'Washington',
}

export function cityLabel(code: string) {
  const id = code.toUpperCase()
  return airportCity[id] ? `${airportCity[id]} (${id})` : id
}

export function formatFlightDate(iso: string) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return iso
  const date = new Date(Date.UTC(year, month - 1, day))
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getUTCDay()]} ${day} ${months[month - 1]}`
}

export function splitLocal(value: string) {
  const [date, time] = value.split('T')
  return { date: date ?? '', time: (time ?? '').slice(0, 5) }
}

export function legsFromParsed(flights: ParsedLeg[]) {
  const arrivalFlight =
    flights.find((flight) => flight.direction === 'arrival') ??
    flights.find((flight) => flight.to === 'NRT' || flight.to === 'HND') ??
    flights[0]
  const departureFlight =
    flights.find((flight) => flight.direction === 'departure') ??
    flights.find(
      (flight) =>
        (flight.from === 'NRT' || flight.from === 'HND') && flight !== arrivalFlight,
    )

  function toArrival(flight: ParsedLeg | undefined): FlightLeg | null {
    if (!flight) return null
    const arrive = splitLocal(flight.arriveLocal)
    const depart = splitLocal(flight.departLocal)
    return {
      airport: flight.to,
      date: arrive.date,
      time: arrive.time,
      flight: flight.flightNumber,
      airline: flight.airline,
      fromAirport: flight.from,
      fromDate: depart.date,
      fromTime: depart.time,
    }
  }

  function toDeparture(flight: ParsedLeg | undefined): FlightLeg | null {
    if (!flight) return null
    const depart = splitLocal(flight.departLocal)
    const arrive = splitLocal(flight.arriveLocal)
    return {
      airport: flight.from,
      date: depart.date,
      time: depart.time,
      flight: flight.flightNumber,
      airline: flight.airline,
      toAirport: flight.to,
      toDate: arrive.date,
      toTime: arrive.time,
    }
  }

  return {
    arrival: toArrival(arrivalFlight),
    departure: toDeparture(departureFlight),
  }
}

export function flightsOnDay(entries: FlightEntry[], dayId: string, kind: 'arrival' | 'departure') {
  return entries
    .filter((entry) => entry[kind]?.date === dayId)
    .sort((a, b) => (a[kind]?.time ?? '').localeCompare(b[kind]?.time ?? ''))
}

export function flightPhrase(entry: FlightEntry, kind: 'arrival' | 'departure') {
  const leg = entry[kind]
  if (!leg) return ''
  const verb =
    kind === 'arrival'
      ? entry.people.length === 1
        ? 'lands'
        : 'land'
      : entry.people.length === 1
        ? 'leaves'
        : 'leave'
  return [peopleLabel(entry.people), verb, leg.airport, leg.time].filter(Boolean).join(' ')
}
