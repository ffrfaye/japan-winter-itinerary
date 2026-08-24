import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GuestRsvpList } from '@/components/GuestRsvpList'
import { LodgingOption } from '@/components/LodgingOption'
import type { Guest, RsvpAnswer } from '@/lib/itinerary'
import { trip } from '@/trip'
import type { LodgingBand } from '@/types/trip'

export function RsvpPage({
  guests,
  answers,
  onAnswersChange,
}: {
  guests: Guest[]
  answers: Record<string, RsvpAnswer>
  onAnswersChange: (next: Record<string, RsvpAnswer>) => void
}) {
  const [bandId, setBandId] = useState<LodgingBand['id']>('4')
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

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <GuestRsvpList
          guests={guests}
          answers={answers}
          onChange={onAnswersChange}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Accommodation
        </h2>
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
                {item.heading}
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
    </div>
  )
}
