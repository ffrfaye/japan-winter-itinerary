import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { onsenLabel, roomsLine } from '@/lib/lodging'
import type { LodgingCompareCard as CardData } from '@/types/lodging'

export function LodgingCompareCard({
  card,
  active,
  onSelect,
}: {
  card: CardData
  active: boolean
  onSelect: () => void
}) {
  const rooms = roomsLine(card)

  return (
    <article
      id={`lodging-card-${card.id}`}
      className={cn(
        'w-full overflow-hidden rounded-xl border bg-white shadow-sm',
        active ? 'border-zinc-900' : 'border-zinc-200',
      )}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        {card.photo ? (
          <img
            src={card.photo}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        ) : null}
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-sm">
            <span className="font-medium">{card.name}</span>
            <span className="text-zinc-600">· {card.lodgingType}</span>
            {card.price ? (
              <span className="text-zinc-600">· {card.price}</span>
            ) : null}
            {rooms ? <span className="text-zinc-600">· {rooms}</span> : null}
          </div>
          <div className="flex flex-wrap gap-1">
            {card.fits.map((count) => (
              <Badge key={count} variant="outline">
                Fits {count}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-zinc-600">
            {[card.availability, card.bookingMethod, onsenLabel(card.onsen)]
              .filter(Boolean)
              .join(' · ')}
          </p>
          {card.location === 'Nozawa' ? (
            <p className="text-sm text-zinc-600">
              {[card.walkToLift, card.walkToVillage, card.vehicleAccess]
                .filter(Boolean)
                .join(' · ')}
            </p>
          ) : null}
          {card.pros.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4 text-sm text-zinc-600">
              {card.pros.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {card.cons.length > 0 ? (
            <ul className="list-disc space-y-0.5 pl-4 text-sm text-zinc-500">
              {card.cons.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </button>
    </article>
  )
}
