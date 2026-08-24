import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  flightGroups,
  flightNumbersLabel,
  flights,
  stopsLabel,
  usd,
} from '@/lib/flights'
import type { FlightOption, FlightOriginGroup } from '@/types/flights'

function FlightRow({ option }: { option: FlightOption }) {
  const faded = option.not_recommended
  const numbers = flightNumbersLabel(option)

  return (
    <li
      className={cn('space-y-1 py-3', faded && 'opacity-[0.48]')}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-zinc-900">
          {option.airlines}
          {numbers ? ` · ${numbers}` : ''}
          {` · ${option.dest}`}
        </p>
        <p className="text-sm text-zinc-600">{usd(option.price_usd)}</p>
      </div>
      <p className="text-sm text-zinc-600">
        {option.depart_local} → {option.arrive_local} · {option.duration} ·{' '}
        {stopsLabel(option)}
        {option.layover ? ` · ${option.layover}` : ''}
        {` · ${option.cabin}`}
      </p>
      <div className="flex flex-wrap items-baseline gap-2">
        {option.sane_cheapest ? (
          <Badge variant="outline">Cheapest sane</Badge>
        ) : null}
        {option.not_recommended ? (
          <Badge variant="outline">Not recommended</Badge>
        ) : null}
        {option.unbundled ? <Badge variant="outline">Unbundled</Badge> : null}
      </div>
      {option.notes.map((note) => (
        <p key={note} className="text-sm text-zinc-500">
          {note}
        </p>
      ))}
      <p className="text-sm text-zinc-500">{option.last_refreshed}</p>
      <p className="text-sm text-zinc-600">
        <a
          href={option.booking_url}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:underline"
        >
          Google Flights
        </a>
      </p>
    </li>
  )
}

function OriginGroup({ group }: { group: FlightOriginGroup }) {
  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          {group.heading}
        </h2>
        <p className="text-sm text-zinc-500">{group.cheapest_sane_label}</p>
        <p className="text-sm text-zinc-600">
          <a
            href={group.search_url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Google Flights
          </a>
        </p>
      </div>
      {group.options.length === 0 ? (
        <p className="py-4 text-sm text-zinc-500">Waiting on live quotes.</p>
      ) : (
        <ul className="divide-y divide-zinc-200">
          {group.options.map((option) => (
            <FlightRow key={option.id} option={option} />
          ))}
        </ul>
      )}
    </section>
  )
}

export function FlightsPage() {
  const groups = flightGroups()
  const refreshed = flights.refreshed_at.label
  const caveat = flights.caveats[0]
  const returnLeg = flights.caveats[1]
  const kix = flights.caveats[3]

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">Flights</h1>
        <p className="text-sm text-zinc-600">
          Quotes for 27 Dec 2026 – 9 Jan 2027, 1 adult economy RT, Google
          Flights. Target dates were quoted.
        </p>
        <p className="text-sm text-zinc-500">{refreshed}</p>
        {caveat ? <p className="text-sm text-zinc-500">{caveat}</p> : null}
        {returnLeg ? (
          <p className="text-sm text-zinc-500">
            Return legs were not expanded on Google Flights.
          </p>
        ) : null}
        {kix ? <p className="text-sm text-zinc-500">{kix}</p> : null}
      </header>

      {groups.map((group) => (
        <OriginGroup key={group.id} group={group} />
      ))}
    </div>
  )
}
