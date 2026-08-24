import type { TripLink } from '@/types/trip'

export function DayLinks({ links }: { links: TripLink[] }) {
  if (links.length === 0) return null
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-600 underline underline-offset-2 hover:text-zinc-950"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
