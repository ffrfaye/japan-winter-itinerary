import { Plane } from 'lucide-react'
import {
  flightPhrase,
  flightsOnDay,
  type FlightEntry,
} from '@/lib/flight-record'

export function FlightDayLine({
  dayId,
  flights,
}: {
  dayId: string
  flights: FlightEntry[]
}) {
  const arrivals = flightsOnDay(flights, dayId, 'arrival')
  const departures = flightsOnDay(flights, dayId, 'departure')
  if (arrivals.length === 0 && departures.length === 0) return null

  return (
    <div className="mt-1.5 space-y-1">
      {arrivals.length > 0 ? (
        <Line label="Arrivals" text={arrivals.map((entry) => flightPhrase(entry, 'arrival')).join(' · ')} />
      ) : null}
      {departures.length > 0 ? (
        <Line
          label="Departures"
          text={departures.map((entry) => flightPhrase(entry, 'departure')).join(' · ')}
        />
      ) : null}
    </div>
  )
}

function Line({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start gap-1.5 text-[12px] leading-snug text-zinc-600">
      <Plane className="mt-0.5 size-3.5 shrink-0 text-zinc-400" aria-hidden />
      <p>
        <span className="font-medium text-zinc-500">{label}</span>
        <span> · {text}</span>
      </p>
    </div>
  )
}
