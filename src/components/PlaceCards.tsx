import type { PlaceCard } from '@/types/trip'

export function PlaceCards({ places }: { places: PlaceCard[] }) {
  if (places.length === 0) return null

  return (
    <ul className="flex flex-col gap-2">
      {places.map((place) => (
        <li key={place.url}>
          <a
            href={place.url}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5"
          >
            <PlaceThumb place={place} />
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
      ))}
    </ul>
  )
}

function PlaceThumb({ place }: { place: PlaceCard }) {
  if (place.thumb) {
    return (
      <img
        src={place.thumb}
        alt=""
        className="size-[72px] shrink-0 rounded-md object-cover"
      />
    )
  }
  return (
    <span
      className="flex size-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-zinc-200"
      aria-hidden
    >
      <span className="size-3.5 rounded-full bg-zinc-900 shadow-[0_0_0_2px_#fff]" />
      <span className="text-[11px] font-semibold text-zinc-700">
        {place.mark}
      </span>
    </span>
  )
}
