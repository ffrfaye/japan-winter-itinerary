import { cn } from '@/lib/utils'
import type { PlaceCard } from '@/types/trip'

export function PlaceCards({
  places,
  variant,
}: {
  places: PlaceCard[]
  variant: 'card' | 'sheet'
}) {
  if (places.length === 0) return null

  const sheet = variant === 'sheet'

  return (
    <ul
      className={cn(
        'grid gap-2',
        variant === 'card' && places.length === 3
          ? 'grid-cols-1 md:grid-cols-3'
          : 'grid-cols-1',
      )}
    >
      {places.map((place, index) => {
        const size = sheet ? 'size-24' : 'size-[72px]'
        const thumbClass =
          sheet || index === 0 ? size : cn(size, 'hidden md:flex')
        return (
          <li key={place.url}>
            <a
              href={place.url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5"
            >
              <PlaceThumb place={place} className={thumbClass} />
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-zinc-950">
                  {place.title}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[13px] text-zinc-600">
                  {place.description}
                </span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function PlaceThumb({
  place,
  className,
}: {
  place: PlaceCard
  className: string
}) {
  if (place.thumb) {
    return (
      <img
        src={place.thumb}
        alt=""
        className={cn(
          'shrink-0 rounded-md object-cover',
          className,
        )}
      />
    )
  }
  return (
    <span
      className={cn(
        'flex shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-zinc-200',
        className,
      )}
      aria-hidden
    >
      <span className="size-3.5 rounded-full bg-zinc-900 shadow-[0_0_0_2px_#fff]" />
      <span className="text-[11px] font-semibold text-zinc-700">
        {place.mark}
      </span>
    </span>
  )
}
