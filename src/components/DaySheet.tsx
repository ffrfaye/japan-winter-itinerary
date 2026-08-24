import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayLinks } from '@/components/DayLinks'
import { dayHeading, type ItineraryDay } from '@/lib/itinerary'

export function DaySheet({
  day,
  onClose,
}: {
  day: ItineraryDay
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-[2000] isolate flex items-end justify-center bg-zinc-950/40 p-3 md:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close day"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="day-sheet-title"
        className="relative z-[2001] max-h-[85svh] w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-lg"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-600">{dayHeading(day)}</p>
            <h2 id="day-sheet-title" className="mt-1 text-base font-medium">
              {day.title}
            </h2>
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
        {day.links.length > 0 ? (
          <div className="mt-4">
            <DayLinks links={day.links} />
          </div>
        ) : null}
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
    </div>,
    document.body,
  )
}
