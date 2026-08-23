import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlaceLine } from '@/components/PlaceLine'
import {
  emptyAnswers,
  filterHouses,
  guestsFromTrip,
  remainingGuests,
  tokyoAptNote,
  yesCount,
  type RsvpAnswer,
} from '@/lib/itinerary'
import { trip } from '@/trip'

const answersOrder: { id: Exclude<RsvpAnswer, null>; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
]

export function RsvpPage() {
  const guests = useMemo(() => guestsFromTrip(trip), [])
  const [answers, setAnswers] = useState(() => emptyAnswers(guests))
  const yes = yesCount(answers)
  const remaining = remainingGuests(trip.group.invited, answers)
  const houses = filterHouses(trip.rsvpHouses, remaining)
  const nozawa = houses.filter((house) => house.city === 'Nozawa')
  const tokyo = houses.filter((house) => house.city === 'Tokyo')

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">
          {trip.group.rsvpHeadline}
        </h1>
        <p className="text-sm text-zinc-600">{trip.group.rsvpSub}</p>
        <p className="text-sm font-medium">
          {yes} of {trip.group.invited} yes
        </p>
      </header>

      <ul className="space-y-5">
        {trip.group.pairs.map((pair) => (
          <li key={pair.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium">{pair.nickname}</p>
            <ul className="mt-3 divide-y divide-zinc-200">
              {guests
                .filter((guest) => guest.pairId === pair.id)
                .map((guest) => (
                  <li
                    key={guest.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <p className="text-sm">{guest.name}</p>
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
          </li>
        ))}
      </ul>

      <Button type="button" disabled className="w-full">
        Save RSVP
      </Button>
      <p className="text-sm text-zinc-600">{trip.group.rsvpSaveNote}</p>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Lodging
        </h2>
        <p className="text-sm text-zinc-600">
          Showing houses that fit {remaining} remaining guests. All unbooked.
        </p>
        <p className="text-sm text-zinc-600">{trip.group.nyeSoldoutNote}</p>
        <ul className="divide-y divide-zinc-200">
          {nozawa.map((house) => (
            <PlaceLine key={house.id} place={house} />
          ))}
          {tokyo.map((house) => (
            <PlaceLine
              key={house.id}
              place={{ ...house, note: tokyoAptNote(remaining) }}
            />
          ))}
        </ul>
      </section>

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
            <li
              key={item.id}
              className="flex items-baseline justify-between gap-4 py-3"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
