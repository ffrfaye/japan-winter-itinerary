import { Button } from '@/components/ui/button'
import { yesCount, type Guest, type RsvpAnswer } from '@/lib/itinerary'
import { trip } from '@/trip'

const answersOrder: { id: Exclude<RsvpAnswer, null>; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
]

export function GuestRsvpList({
  guests,
  answers,
  onChange,
}: {
  guests: Guest[]
  answers: Record<string, RsvpAnswer>
  onChange: (next: Record<string, RsvpAnswer>) => void
}) {
  const yes = yesCount(answers)

  return (
    <div className="space-y-2">
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
                  variant={answers[guest.id] === option.id ? 'default' : 'outline'}
                  disabled={guest.lockedYes && option.id !== 'yes'}
                  onClick={() =>
                    onChange({
                      ...answers,
                      [guest.id]: option.id,
                    })
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
