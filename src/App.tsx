import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { trip } from '@/trip'
import type { StatusId, Trip } from '@/types/trip'

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

export default function App() {
  const recommended = trip.statusLegend.find((item) => item.id === 'recommended')
  const lodgingDecision = trip.openDecisions.find((item) => item.id === 'lodging')
  const ghibliDecision = trip.openDecisions.find((item) => item.id === 'ghibli')
  const urgentStays = trip.checklist.filter((item) => urgentStayIds.has(item.id))
  const laterItems = trip.checklist.filter(
    (item) => item.priority === 'later' || item.id === 'hakutaka',
  )
  const groups = daysByRoute(trip.days, trip.route.stops)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium tracking-tight">{trip.meta.title}</h1>
            <p className="text-sm text-muted-foreground">
              {trip.meta.datesLabel}
              <span aria-hidden="true"> · </span>
              {trip.group.sizeLabel}
            </p>
          </div>
          <Badge variant="outline">
            {recommended?.label ?? 'Recommended'} · not locked
          </Badge>
          <p className="text-sm text-muted-foreground">{trip.meta.tone}</p>
        </header>

        <Separator className="my-12" />

        <Alert>
          <AlertTitle>{trip.meta.planningBanner.title}</AlertTitle>
          <AlertDescription>{trip.meta.planningBanner.body}</AlertDescription>
        </Alert>

        <section className="mt-14 space-y-5">
          <h2 className="text-sm font-medium text-muted-foreground">Open decisions</h2>
          <ul className="divide-y">
            {trip.openDecisions.map((item) => (
              <li key={item.id} className="space-y-1 px-0 py-4 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant="outline">{statusLabel(item.status)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 space-y-5">
          <h2 className="text-sm font-medium text-muted-foreground">Book this month</h2>
          <ul className="divide-y">
            {urgentStays.map((item) => (
              <li key={item.id} className="space-y-1 px-0 py-4 first:pt-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant="outline">{statusLabel(item.status)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Later
            <span aria-hidden="true"> · </span>
            {laterItems.map((item) => item.title).join(' · ')}
          </p>
        </section>

        <section className="mt-14 space-y-10">
          {groups.map(({ stop, days }) => (
            <div key={stop.id}>
              <h2 className="text-sm font-medium text-muted-foreground">
                {stop.city}
                {stop.nights > 0 ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    {stop.nights} nights
                  </>
                ) : null}
              </h2>
              <ul className="mt-3 divide-y">
                {days.map((day) => (
                  <li key={day.id} className="grid grid-cols-[4.5rem_1fr] gap-4 px-0 py-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground">{day.weekday}</p>
                      <p className="font-medium">{day.short}</p>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{day.city}</Badge>
                        {day.status !== 'recommended' ? (
                          <Badge variant="outline">{statusLabel(day.status)}</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">{day.title}</p>
                      <p className="text-sm text-muted-foreground">{day.summary}</p>
                      {day.blocks.length > 0 ? (
                        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
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

        <footer className="mt-16 space-y-1 text-sm text-muted-foreground">
          {lodgingDecision ? <p>{lodgingDecision.title}</p> : null}
          {trip.ghibli.unpublished && ghibliDecision ? <p>{ghibliDecision.title}</p> : null}
        </footer>
      </main>
    </div>
  )
}
