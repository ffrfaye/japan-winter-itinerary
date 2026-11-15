import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { LodgingJoinRow } from '@/components/LodgingJoinRow'
import type { ItineraryDay } from '@/lib/itinerary'

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
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[13px] font-medium text-zinc-500">{day.dateLabel}</span>
              <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium text-zinc-600">
                {day.city}
              </span>
              {day.kinds.map((kind) => (
                <span key={kind} className="text-[10px] text-zinc-400">
                  {kind}
                </span>
              ))}
            </div>
            <h2 id="day-sheet-title" className="mt-2 text-lg font-semibold tracking-tight">
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
        {day.lodging.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              Logistics
            </h3>
            {day.lodging.map((stop) => (
              <LodgingJoinRow
                key={`${stop.stayId}-${stop.action}`}
                stayId={stop.stayId}
                action={stop.action}
                when={stop.when}
              />
            ))}
          </div>
        ) : null}
        <BulletList
          title={day.lodging.length > 0 ? 'Also this day' : 'Logistics'}
          items={day.logistics}
        />
        <BulletList title="The day" items={day.fun} />
        {day.photo ? (
          <figure className="mt-4 overflow-hidden rounded-xl">
            <img src={day.photo.src} alt={day.photo.alt} className="h-48 w-full object-cover" />
            <figcaption className="pt-1.5 text-[11px] text-zinc-400">{day.photo.caption}</figcaption>
          </figure>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="mt-4">
      <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">{title}</h3>
      <ul className="mt-1.5 list-disc space-y-1.5 pl-4 text-[14px] leading-snug text-zinc-600">
        {items.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
