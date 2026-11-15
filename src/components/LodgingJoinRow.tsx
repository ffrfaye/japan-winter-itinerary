import { ExternalLink } from 'lucide-react'
import { stayById, stayNeighborhood, type StayId } from '@/data/stays'

export function LodgingJoinRow({
  stayId,
  action,
  when,
}: {
  stayId: StayId
  action: string
  when: string
}) {
  const stay = stayById(stayId)
  return (
    <a
      href={stay.invite}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${stay.shortName} on Airbnb`}
      className="mt-2 flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2 py-1.5 hover:bg-zinc-50"
    >
      <img
        src={stay.photo}
        alt=""
        className="h-10 w-10 shrink-0 rounded-md object-cover"
        style={{ objectPosition: stay.photoPos }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-medium text-zinc-950">
          {action} · {stay.shortName}
        </span>
        <span className="block text-[11px] leading-snug text-zinc-500">
          {when} · {stayNeighborhood(stay)} ·{' '}
          <span className="whitespace-nowrap">{stay.guests}</span>
        </span>
      </span>
      <ExternalLink className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
    </a>
  )
}
