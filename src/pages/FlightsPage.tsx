import { useState } from 'react'
import {
  AddFlightButton,
  FlightGroups,
  FlightSheet,
  StillToAdd,
} from '@/components/FlightSheet'
import { people } from '@/lib/flight-record'
import { useFlights } from '@/lib/flights-context'

export function FlightsPage() {
  const { flights, reload } = useFlights()
  const [sheet, setSheet] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const named = new Set(flights.flatMap((flight) => flight.people))
  const pending = people.filter((name) => !named.has(name))

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Flights</h2>
      <p className="mt-1.5 text-sm leading-snug text-zinc-500">
        Add your flight so we know who lands when.
      </p>
      <AddFlightButton onClick={() => setSheet('')} />
      <StillToAdd names={pending} onPick={(name) => setSheet(name)} />
      <section className="mt-7">
        <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          Arrivals
        </h3>
        <div className="mt-2">
          <FlightGroups flights={flights} kind="arrival" />
        </div>
      </section>
      <section className="mt-7 mb-6">
        <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          Departures
        </h3>
        <div className="mt-2">
          <FlightGroups flights={flights} kind="departure" />
        </div>
      </section>
      {sheet !== null ? (
        <FlightSheet
          prefill={sheet}
          onClose={() => setSheet(null)}
          onSaved={(label, count) => {
            setSheet(null)
            void reload()
            setToast(`Got it — ${label} ${count === 1 ? 'is' : 'are'} on the flights list.`)
            window.setTimeout(() => setToast(null), 2600)
          }}
        />
      ) : null}
      {toast ? (
        <p className="fixed bottom-28 left-1/2 z-[1800] -translate-x-1/2 rounded-full bg-zinc-950 px-3 py-1.5 text-[12px] text-white">
          {toast}
        </p>
      ) : null}
    </div>
  )
}
