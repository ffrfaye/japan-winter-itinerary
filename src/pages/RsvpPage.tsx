import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LodgingOption } from '@/components/LodgingOption'
import { emptyAnswers, guestsFromTrip, yesCount, type RsvpAnswer } from '@/lib/itinerary'
import { trip } from '@/trip'
import type { LodgingBand } from '@/types/trip'

const answersOrder: { id: Exclude<RsvpAnswer, null>; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
]

export function RsvpPage() {
  const guests = useMemo(() => guestsFromTrip(trip), [])
  const [answers, setAnswers] = useState(() => emptyAnswers(guests))
  const [bandId, setBandId] = useState<LodgingBand['id']>('4')
  const yes = yesCount(answers)
  const band =
    trip.lodging.bands.find((item) => item.id === bandId) ?? trip.lodging.bands[0]

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">
          {trip.group.rsvpHeadline}
        </h1>
        <p className="text-sm text-zinc-600">{trip.group.rsvpSub}</p>
      </header>

      <section className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            {trip.budget.heading}
          </h2>
          <Badge variant="outline">{trip.budget.label}</Badge>
        </div>
        <p className="text-sm text-zinc-600">{trip.budget.basis}</p>
        <ul className="divide-y divide-zinc-200">
          {trip.budget.lines.map((item) => (
            <li key={item.id} className="space-y-1 py-3">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-zinc-600">{item.detail}</p>
              </div>
              {item.note ? (
                <p className="text-sm text-zinc-500">{item.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Lodging
        </h2>
        <p className="text-sm text-zinc-600">{band.why}</p>
        <div
          role="tablist"
          aria-label="Bedroom count"
          className="flex flex-wrap items-center gap-2"
        >
          {trip.lodging.bands.map((item) => {
            const active = item.id === band.id
            return (
              <Button
                key={item.id}
                type="button"
                role="tab"
                size="xs"
                aria-selected={active}
                variant={active ? 'default' : 'outline'}
                onClick={() => setBandId(item.id)}
                className="h-7 rounded-lg px-3 py-0.5 text-[13px] font-medium leading-none"
              >
                {item.id}
              </Button>
            )
          })}
        </div>
        <ul className="divide-y divide-zinc-200">
          {band.options.map((option) => (
            <LodgingOption key={option.id} option={option} />
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">
          {yes} of {trip.group.invited} yes
        </p>
        <p className="text-sm text-zinc-500">{trip.group.rsvpSaveNote}</p>
        <ul className="divide-y divide-zinc-200">
          {guests.map((guest) => (
            <li
              key={guest.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <p className="text-[15px] font-medium">{guest.name}</p>
              <div className="flex gap-1">
                {answersOrder.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    size="xs"
                    variant={
                      answers[guest.id] === option.id ? 'default' : 'outline'
                    }
                    disabled={guest.lockedYes && option.id !== 'yes'}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [guest.id]: option.id,
                      }))
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
