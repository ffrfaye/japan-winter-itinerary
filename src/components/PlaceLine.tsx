import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import type { NamedPlace, RsvpHouse } from '@/types/trip'

const contactPattern =
  /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+81[\d\- ]{8,}\d)/g

function telHref(phone: string) {
  return `tel:${phone.replace(/(?!^\+)\D/g, '')}`
}

function contactClassName() {
  return 'text-sm text-zinc-600 underline-offset-2 hover:underline'
}

function linkedNote(text: string) {
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0
  for (const match of text.matchAll(contactPattern)) {
    const value = match[0]
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    nodes.push(
      value.includes('@') ? (
        <a key={key} href={`mailto:${value}`} className={contactClassName()}>
          {value}
        </a>
      ) : (
        <a key={key} href={telHref(value)} className={contactClassName()}>
          {value}
        </a>
      ),
    )
    key += 1
    last = start + value.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function PlaceLine({
  place,
}: {
  place: NamedPlace | (RsvpHouse & { stayA?: string; stayB?: string })
}) {
  const note = place.note ?? ''

  return (
    <li className="space-y-1 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex flex-wrap items-baseline gap-2">
          {'url' in place && place.url ? (
            <a
              href={place.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium underline-offset-2 hover:underline"
            >
              {place.name}
            </a>
          ) : (
            <p className="text-sm font-medium">{place.name}</p>
          )}
          {'city' in place ? (
            <Badge variant="outline">{place.city}</Badge>
          ) : null}
        </div>
        <div className="flex flex-wrap items-baseline justify-end gap-x-3">
          {place.email ? (
            <a href={`mailto:${place.email}`} className={contactClassName()}>
              {place.email}
            </a>
          ) : null}
          {place.phone ? (
            <a href={telHref(place.phone)} className={contactClassName()}>
              {place.phone}
            </a>
          ) : null}
        </div>
      </div>
      {'stayA' in place && (place.stayA || place.stayB) ? (
        <div className="grid grid-cols-2 gap-x-4 text-sm text-zinc-600">
          <p>{place.stayA}</p>
          <p>{place.stayB}</p>
        </div>
      ) : null}
      {note ? <p className="text-sm text-zinc-600">{linkedNote(note)}</p> : null}
    </li>
  )
}
