import { stayOrder, stays, type StayId } from '@/data/stays'
import { Button } from '@/components/ui/button'

export function LodgingPage() {
  return (
    <div>
      <div className="mb-5 rounded-xl border border-zinc-200 bg-white px-3 pt-3.5 pb-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            Three stays
          </p>
          <p className="text-[11px] font-medium text-zinc-500">13 nights · booked</p>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {stayOrder.map((id) => {
            const stay = stays[id]
            return (
              <a
                key={id}
                href={`#stay-${id}`}
                className="min-w-0 px-1 text-center"
                onClick={(event) => {
                  event.preventDefault()
                  document.getElementById(`stay-${id}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}
              >
                <p className="text-[12px] font-semibold tracking-tight">
                  {stay.timelineCity}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-500">{stay.timelineDates}</p>
                <p className="text-[10px] text-zinc-400">{stay.nights} nights</p>
              </a>
            )
          })}
        </div>
        <div className="mt-3 flex items-center px-5" aria-hidden>
          <span className="size-2.5 shrink-0 rounded-full bg-zinc-950" />
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="size-2.5 shrink-0 rounded-full bg-zinc-950" />
          <span className="h-px flex-1 bg-zinc-200" />
          <span className="size-2.5 shrink-0 rounded-full bg-zinc-950" />
        </div>
      </div>
      <div className="space-y-4 pb-6">
        {stayOrder.map((id) => (
          <StayCard key={id} id={id} />
        ))}
      </div>
    </div>
  )
}

function StayCard({ id }: { id: StayId }) {
  const stay = stays[id]
  return (
    <article
      id={`stay-${id}`}
      className="scroll-mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-100">
        <img
          src={stay.photo}
          alt={stay.shortName}
          className="h-full w-full object-cover"
          style={{ objectPosition: stay.photoPos }}
        />
      </div>
      <div className="px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex rounded-md bg-zinc-950 px-1.5 py-px text-[10px] font-medium text-white">
            Booked
          </span>
          <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium text-zinc-600">
            {stay.cityChip}
          </span>
        </div>
        <h2 className="mt-2 text-[16px] leading-snug font-semibold tracking-tight">
          {stay.titleEn}
        </h2>
        <p className="mt-1 text-[11px] leading-snug text-zinc-400">{stay.titleJp}</p>
        <p className="mt-3 text-[13px] font-medium text-zinc-950">{stay.dateLine}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-zinc-500">
          Check-in {stay.checkIn} · Check-out {stay.checkOut} · {stay.nights} nights
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-zinc-500">{stay.area}</p>
        <p className="mt-1 text-[13px] text-zinc-500">
          {stay.guests} · Host {stay.host}
        </p>
        {stay.note ? (
          <p className="mt-1 text-[13px] text-zinc-500">{stay.note}</p>
        ) : null}
        <Button asChild className="mt-4 h-10 w-full rounded-xl">
          <a href={stay.invite} target="_blank" rel="noreferrer">
            Join this trip on Airbnb
          </a>
        </Button>
        <p className="mt-3 text-center">
          <a
            href={stay.listing}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2"
          >
            View listing
          </a>
        </p>
      </div>
    </article>
  )
}
