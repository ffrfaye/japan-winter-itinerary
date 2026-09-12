import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  availabilityLabel,
  contactHref,
  isBooked,
  onsenLabel,
  priceLine,
  propertyUrl,
  roomsLine,
  skiLine,
  thumbUrl,
  tokyoLine,
  typicalPriceLine,
} from '@/lib/lodging'
import type { LodgingProperty } from '@/types/lodging'

export function LodgingCompareCard({
  card,
  faded,
  active,
  onSelect,
}: {
  card: LodgingProperty
  faded: boolean
  active: boolean
  onSelect: () => void
}) {
  const photo = thumbUrl(card)
  const rooms = roomsLine(card)
  const price = priceLine(card.price)
  const typical = typicalPriceLine(card.price)
  const onsen = onsenLabel(card.onsen)
  const ski = skiLine(card)
  const tokyo = tokyoLine(card.tokyo_logistics)
  const contact = card.booking_contact
    ? contactHref(card.booking_contact)
    : null
  const listing = propertyUrl(card)
  const booked = isBooked(card)
  const confirmation = card.confirmation?.trim() || null
  const availability = [
    availabilityLabel(card.availability_status),
    confirmation,
    card.availability_notes,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article
      id={`lodging-card-${card.id}`}
      className={cn(
        'w-full overflow-hidden rounded-xl border bg-white shadow-sm',
        active ? 'border-zinc-900' : 'border-zinc-200',
        faded && 'opacity-[0.48]',
      )}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        {photo ? (
          <img src={photo} alt="" className="aspect-[16/9] w-full object-cover" />
        ) : null}
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-sm">
            {listing ? (
              <a
                href={listing}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 underline-offset-2 hover:underline"
                onClick={(event) => event.stopPropagation()}
              >
                {card.name}
              </a>
            ) : (
              <span className="font-medium text-zinc-900">{card.name}</span>
            )}
            {card.type ? (
              <span className="text-zinc-600">· {card.type}</span>
            ) : null}
            {price ? <span className="text-zinc-600">· {price}</span> : null}
            {!price && typical ? (
              <span className="text-zinc-500">· {typical}</span>
            ) : null}
          </div>
          {booked || card.badge || faded ? (
            <div className="flex flex-wrap items-center gap-1">
              {booked ? (
                <Badge variant="outline">
                  {confirmation
                    ? `Booked · ${confirmation}`
                    : availabilityLabel(card.availability_status)}
                </Badge>
              ) : null}
              {card.badge ? (
                <Badge variant="outline">{card.badge}</Badge>
              ) : null}
              {faded && !booked ? (
                <Badge variant="outline">
                  {availabilityLabel(card.availability_status)}
                </Badge>
              ) : null}
            </div>
          ) : null}
          {rooms ? <p className="text-sm text-zinc-600">{rooms}</p> : null}
          <div className="flex flex-wrap gap-1">
            {card.scenarios.map((count) => (
              <Badge key={count} variant="outline">
                {count}
              </Badge>
            ))}
          </div>
          {card.scenario_notes ? (
            <p className="text-sm text-zinc-500">{card.scenario_notes}</p>
          ) : null}
          {card.quiet_notes && card.quiet_notes.length > 0
            ? card.quiet_notes.map((note) => (
                <p key={note} className="text-sm text-zinc-500">
                  {note}
                </p>
              ))
            : null}
          {availability ? (
            <p className="text-sm text-zinc-600">{availability}</p>
          ) : null}
          {listing || card.booking_url || card.listing_url || contact ? (
            <p className="text-sm text-zinc-600">
              {listing ? (
                <a
                  href={listing}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-2 hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  Official page
                </a>
              ) : null}
              {card.booking_url ? (
                <>
                  {listing ? ' · ' : null}
                  <a
                    href={card.booking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Check dates
                  </a>
                </>
              ) : null}
              {card.listing_url ? (
                <>
                  {listing || card.booking_url ? ' · ' : null}
                  <a
                    href={card.listing_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 underline-offset-2 hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Listing
                  </a>
                </>
              ) : null}
              {contact ? (
                <>
                  {listing || card.booking_url || card.listing_url
                    ? ' · '
                    : null}
                  <a
                    href={contact}
                    className="underline-offset-2 hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {card.booking_contact}
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          {onsen ? <p className="text-sm text-zinc-600">{onsen}</p> : null}
          {card.location === 'nozawa' && ski ? (
            <p className="text-sm text-zinc-600">{ski}</p>
          ) : null}
          {card.location === 'tokyo' && tokyo ? (
            <p className="text-sm text-zinc-600">{tokyo}</p>
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
