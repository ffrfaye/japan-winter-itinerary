import { Badge } from '@/components/ui/badge'
import type { LodgingBookStatus, LodgingOption as LodgingOptionData } from '@/types/trip'

const statusLabel: Record<LodgingBookStatus, string> = {
  available: 'Available',
  enquire: 'Enquire',
  waitlist: 'Waitlist',
  'sold-out': 'Sold out',
}

function telHref(phone: string) {
  return `tel:${phone.replace(/(?!^\+)\D/g, '')}`
}

const contactClass = 'underline-offset-2 hover:underline'

export function LodgingOption({ option }: { option: LodgingOptionData }) {
  const name = option.url ? (
    <a
      href={option.url}
      target="_blank"
      rel="noreferrer"
      className="font-medium underline-offset-2 hover:underline"
    >
      {option.property}
    </a>
  ) : (
    <span className="font-medium">{option.property}</span>
  )

  return (
    <li className="space-y-1 py-3">
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-sm">
        {name}
        <span className="text-zinc-600">· {option.city}</span>
        <span className="text-zinc-600">· {option.beds}</span>
        <Badge variant="outline">{statusLabel[option.status]}</Badge>
        {option.perPerson ? (
          <span className="text-zinc-600">{option.perPerson} pp</span>
        ) : null}
      </div>
      {option.note ? (
        <p className="text-sm text-zinc-600">{option.note}</p>
      ) : null}
      <p className="text-sm text-zinc-500">
        {option.nextStep}
        {option.email ? (
          <>
            {' '}
            <a href={`mailto:${option.email}`} className={contactClass}>
              {option.email}
            </a>
          </>
        ) : null}
        {option.phone ? (
          <>
            {' '}
            <a href={telHref(option.phone)} className={contactClass}>
              {option.phone}
            </a>
          </>
        ) : null}
      </p>
    </li>
  )
}
