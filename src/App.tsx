import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { trip } from '@/trip'
import type { NamedPlace, StatusId, Trip } from '@/types/trip'

const urgentStayIds = new Set(['tokyo-hotel', 'nozawa-hotel'])

function statusLabel(status: StatusId) {
  return trip.statusLegend.find((item) => item.id === status)?.label ?? status
}

function daysByRoute(days: Trip['days'], stops: Trip['route']['stops']) {
  let cursor = 0
  return stops
    .map((stop, stopIndex) => {
      const remainingDays = days.length - cursor
      const remainingStops = stops.length - stopIndex
      const take =
        stop.nights > 0 ? stop.nights : remainingStops === 1 ? remainingDays : 1
      const slice = days.slice(cursor, cursor + take)
      cursor += slice.length
      return { stop, days: slice }
    })
    .filter((group) => group.days.length > 0)
}

function PlaceLine({ place }: { place: NamedPlace }) {
  return (
    <li className="space-y-1 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        {place.url ? (
          <a
            href={place.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline-offset-2 hover:underline"
          >
            {place.name}
          </a>
        ) : (
          <p className="text-sm font-medium">{place.name}</p>
        )}
        {place.email ? (
          <a
            href={`mailto:${place.email}`}
            className="text-sm text-zinc-600 underline-offset-2 hover:underline"
          >
            {place.email}
          </a>
        ) : null}
      </div>
      {place.stayA || place.stayB ? (
        <div className="grid grid-cols-2 gap-x-4 text-sm text-zinc-600">
          <p>{place.stayA}</p>
          <p>{place.stayB}</p>
        </div>
      ) : null}
      {place.note ? <p className="text-sm text-zinc-600">{place.note}</p> : null}
    </li>
  )
}

export default function App() {
  const openItems = trip.openDecisions.filter((item) => item.status === 'open')
  const urgentStays = trip.checklist.filter((item) => urgentStayIds.has(item.id))
  const laterItems = trip.checklist.filter(
    (item) => item.priority === 'later' || item.id === 'hakutaka',
  )
  const groups = daysByRoute(trip.days, trip.route.stops)
  const tokyoCandidates = trip.lodging.tokyo.candidates
  const nozawaPlaces = [
    ...trip.lodging.nozawa.selfCatered,
    ...trip.lodging.nozawa.halfBoard,
    ...trip.lodging.nozawa.closed,
  ]

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <main className="mx-auto w-full max-w-[672px] px-5 py-10 sm:px-6">
        <header className="space-y-2 py-4">
          <h1 className="text-3xl font-medium tracking-tight">{trip.meta.title}</h1>
          <p className="text-sm text-zinc-600">
            {trip.meta.datesLabel}
            <span aria-hidden="true"> · </span>
            {trip.group.sizeLabel}
          </p>
          <Badge variant="outline">{trip.meta.planningBanner.eyebrow}</Badge>
          <p className="text-sm text-zinc-600">{trip.meta.planningBanner.body}</p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white px-4 py-4">
          <p className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            {trip.route.label}
          </p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-4">
            {trip.route.stops.map((stop) => (
              <li key={stop.id} className="space-y-1">
                <p className="text-sm font-medium">{stop.city}</p>
                <p className="text-sm text-zinc-600">{stop.dates}</p>
                <p className="text-sm text-zinc-600">
                  {stop.nights > 0 ? `${stop.nights} nights` : stop.note}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <Separator className="my-8 bg-zinc-200" />

        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Open decisions
          </h2>
          <ul className="divide-y divide-zinc-200">
            {openItems.map((item) => (
              <li key={item.id} className="space-y-1 px-0 py-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant="outline">{statusLabel(item.status)}</Badge>
                </div>
                <p className="text-sm text-zinc-600">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Book this month
          </h2>
          <ul className="divide-y divide-zinc-200">
            {urgentStays.map((item) => (
              <li key={item.id} className="space-y-2 px-0 py-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant="outline">{statusLabel(item.status)}</Badge>
                </div>
                <p className="text-sm text-zinc-600">{item.detail}</p>
                {item.id === 'tokyo-hotel' ? (
                  <ul className="divide-y divide-zinc-200">
                    {tokyoCandidates.map((place) => (
                      <PlaceLine key={place.name} place={place} />
                    ))}
                  </ul>
                ) : null}
                {item.id === 'nozawa-hotel' ? (
                  <ul className="divide-y divide-zinc-200">
                    {nozawaPlaces.map((place) => (
                      <PlaceLine key={place.name} place={place} />
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="text-sm text-zinc-600">
            Later
            <span aria-hidden="true"> · </span>
            {laterItems.map((item) => item.title).join(' · ')}
          </p>
        </section>

        <section className="mt-10 space-y-8">
          {groups.map(({ stop, days }) => (
            <div key={stop.id}>
              <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
                {stop.city}
                {stop.nights > 0 ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    {stop.nights} nights
                  </>
                ) : null}
              </h2>
              <ul className="divide-y divide-zinc-200">
                {days.map((day) => (
                  <li key={day.id} className="grid grid-cols-[4.5rem_1fr] gap-4 px-0 py-4">
                    <div className="text-sm">
                      <p className="text-zinc-600">{day.weekday}</p>
                      <p className="font-medium">{day.short}</p>
                    </div>
                    <div className="min-w-0 space-y-1">
                      {day.status !== 'recommended' && day.status !== 'locked' ? (
                        <Badge variant="outline">{statusLabel(day.status)}</Badge>
                      ) : null}
                      <p className="text-sm font-medium">{day.title}</p>
                      <p className="text-sm text-zinc-600">{day.summary}</p>
                      {day.blocks.length > 0 ? (
                        <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-600">
                          {day.blocks.slice(0, 2).map((block) => (
                            <li key={block.title}>{block.title}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
