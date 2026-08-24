import { Badge } from '@/components/ui/badge'
import { BudgetList } from '@/components/BudgetList'
import { GuestRsvpList } from '@/components/GuestRsvpList'
import { LodgingOption } from '@/components/LodgingOption'
import type { Guest, RsvpAnswer } from '@/lib/itinerary'
import { trip } from '@/trip'
import type { StatusId } from '@/types/trip'

function statusLabel(status: StatusId) {
  return trip.statusLegend.find((item) => item.id === status)?.label ?? status
}

export function PlanningPage({
  guests,
  answers,
  onAnswersChange,
}: {
  guests: Guest[]
  answers: Record<string, RsvpAnswer>
  onAnswersChange: (next: Record<string, RsvpAnswer>) => void
}) {
  const leftovers = trip.openDecisions.filter(
    (item) =>
      item.status === 'open' &&
      item.id !== 'nye-fork' &&
      item.id !== 'lodging',
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">Planning</h1>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <GuestRsvpList
          guests={guests}
          answers={answers}
          onChange={onAnswersChange}
        />
      </section>

      <BudgetList />

      <section className="space-y-8">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Accommodation
        </h2>
        <p className="text-sm text-zinc-600">{trip.lodging.tokyoNote}</p>
        {trip.lodging.bands.map((band) => (
          <section key={band.id} className="space-y-2">
            <h3 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
              {band.heading}
            </h3>
            <ul className="divide-y divide-zinc-200">
              {band.options.map((option) => (
                <LodgingOption key={option.id} option={option} />
              ))}
            </ul>
          </section>
        ))}
      </section>

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
          Transport
        </h2>
        <p className="text-sm text-zinc-600">{trip.transport.train.text}</p>
        <p className="text-sm text-zinc-600">{trip.transport.transfer.text}</p>
        <p className="text-sm text-zinc-600">{trip.transport.yamato.text}</p>
      </section>

      <p className="text-sm text-zinc-600">{trip.meta.photoCredit}</p>
    </div>
  )
}
