import { Badge } from '@/components/ui/badge'
import { PlaceLine } from '@/components/PlaceLine'
import { trip } from '@/trip'
import type { StatusId } from '@/types/trip'

function statusLabel(status: StatusId) {
  return trip.statusLegend.find((item) => item.id === status)?.label ?? status
}

export function PlanningPage() {
  const leftovers = trip.openDecisions.filter(
    (item) =>
      item.status === 'open' &&
      item.id !== 'nye-fork' &&
      item.id !== 'lodging',
  )
  const tokyo = trip.lodging.tokyo.candidates.filter(
    (place) => place.stayA || place.stayB,
  )
  const nozawa = [
    ...trip.lodging.nozawa.selfCatered,
    ...trip.lodging.nozawa.halfBoard,
    ...trip.lodging.nozawa.closed,
  ]
  const later = trip.checklist.filter(
    (item) => item.priority === 'later' || item.id === 'hakutaka',
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">Planning</h1>
        <p className="text-sm text-zinc-600">{trip.meta.planningBanner.body}</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Still open
        </h2>
        <ul className="divide-y divide-zinc-200">
          {leftovers.map((item) => (
            <li key={item.id} className="space-y-1 py-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-sm font-medium">{item.title}</p>
                <Badge variant="outline">{statusLabel(item.status)}</Badge>
              </div>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Ghibli
        </h2>
        <p className="text-sm font-medium">{trip.ghibli.museum}</p>
        <p className="text-sm text-zinc-600">{trip.ghibli.sale}</p>
        <p className="text-sm text-zinc-600">{trip.ghibli.lastYearClosure}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Book this month
        </h2>
        <p className="text-sm text-zinc-600">
          {trip.checklist.find((item) => item.id === 'tokyo-hotel')?.detail}
        </p>
        <ul className="divide-y divide-zinc-200">
          {tokyo.map((place) => (
            <PlaceLine key={place.name} place={place} />
          ))}
        </ul>
        <p className="pt-4 text-sm text-zinc-600">
          {trip.checklist.find((item) => item.id === 'nozawa-hotel')?.detail}
        </p>
        <ul className="divide-y divide-zinc-200">
          {nozawa.map((place) => (
            <PlaceLine key={place.name} place={place} />
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Later
        </h2>
        <ul className="divide-y divide-zinc-200">
          {later.map((item) => (
            <li key={item.id} className="space-y-1 py-4">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Transport
        </h2>
        <p className="text-sm text-zinc-600">{trip.transport.train.text}</p>
        <p className="text-sm text-zinc-600">{trip.transport.transfer.text}</p>
        <p className="text-sm text-zinc-600">{trip.transport.yamato.text}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Constraints
        </h2>
        <ul className="divide-y divide-zinc-200">
          {trip.constraints.map((item) => (
            <li key={item.id} className="py-4 text-sm text-zinc-600">
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          UVERworld
        </h2>
        <p className="text-sm text-zinc-600">{trip.concert.groupRule}</p>
        <p className="text-sm text-zinc-600">{trip.concert.sameNightReturn}</p>
      </section>

      <p className="text-sm text-zinc-600">{trip.meta.photoCredit}</p>
    </div>
  )
}
