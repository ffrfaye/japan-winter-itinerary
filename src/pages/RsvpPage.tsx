import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { emptyAnswers, guestsFromTrip, yesCount, type RsvpAnswer } from '@/lib/itinerary'
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
                  variant={answers[guest.id] === option.id ? 'default' : 'outline'}
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

      <Button type="button" disabled className="w-full">
        Save RSVP
      </Button>
      <p className="text-sm text-zinc-600">{trip.group.rsvpSaveNote}</p>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Lodging
        </h2>
        <p className="text-sm text-zinc-600">
          Shortlist lives on Planning. Headcount picks the house. Nothing booked.
        </p>
        <p className="text-sm text-zinc-600">{trip.group.nyeSoldoutNote}</p>
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
