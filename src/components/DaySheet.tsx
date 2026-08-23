import { Badge } from '@/components/ui/badge'
import type { ItineraryDay } from '@/lib/itinerary'

export function DaySheet({
  day,
  onClose,
}: {
  day: ItineraryDay
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/40 p-3 md:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close day"
        onClick={onClose}
      />
      <div className="relative max-h-[85svh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-600">
              {day.weekday} {day.short}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{day.city}</Badge>
              <h2 className="text-base font-medium">{day.title}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-600 underline-offset-2 hover:underline"
          >
            Close
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm text-zinc-600">
          {day.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {day.photos.map((photo) => (
          <figure key={photo.src} className="mt-4">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full rounded-xl border border-zinc-200 object-cover"
            />
            <figcaption className="mt-2 text-sm text-zinc-600">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
