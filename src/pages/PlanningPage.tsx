import { Badge } from '@/components/ui/badge'
import {
  nozawaIdeas,
  planningCalendar,
  planningOpenDecisions,
  quietConstraints,
  statusLabel,
  tokyoIdeas,
  type PlanningIdea,
} from '@/lib/planning'
import { trip } from '@/trip'
import type { StatusId, TripLink } from '@/types/trip'

function IdeaCard({ idea }: { idea: PlanningIdea }) {
  return (
    <li className="space-y-2 py-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-medium">{idea.title}</p>
        <Badge variant="outline">{statusLabel(idea.status)}</Badge>
      </div>
      {idea.when ? <p className="text-sm text-zinc-500">{idea.when}</p> : null}
      <p className="text-sm text-zinc-600">{idea.detail}</p>
      {idea.lines.map((line) => (
        <p key={line} className="text-sm text-zinc-500">
          {line}
        </p>
      ))}
      <IdeaLinks links={idea.links} />
    </li>
  )
}

function IdeaLinks({ links }: { links: TripLink[] }) {
  if (links.length === 0) return null
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-600">
      {links.map((link) => (
        <a
          key={`${link.label}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {link.label}
        </a>
      ))}
    </p>
  )
}

function DecisionRow({
  title,
  status,
  detail,
}: {
  title: string
  status: StatusId
  detail: string
}) {
  return (
    <li className="space-y-1 py-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className="text-sm font-medium">{title}</p>
        <Badge variant="outline">{statusLabel(status)}</Badge>
      </div>
      <p className="text-sm text-zinc-600">{detail}</p>
    </li>
  )
}

export function PlanningPage() {
  const tokyo = tokyoIdeas()
  const nozawa = nozawaIdeas()
  const open = planningOpenDecisions()
  const soon = planningCalendar('soon')
  const later = planningCalendar('later')
  const constraints = quietConstraints()
  const concert = trip.concert

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-medium tracking-tight">Planning</h1>
        <p className="text-sm text-zinc-600">Park other activity planning here.</p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Tokyo
        </h2>
        <ul className="divide-y divide-zinc-200">
          {tokyo.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Nozawa
        </h2>
        <ul className="divide-y divide-zinc-200">
          {nozawa.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Still open
        </h2>
        <ul className="divide-y divide-zinc-200">
          {open.map((item) => (
            <DecisionRow
              key={item.id}
              title={item.title}
              status={item.status}
              detail={item.detail}
            />
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          UVERworld
        </h2>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="text-sm font-medium">
            {concert.artist} · {concert.tour}
          </p>
          <Badge variant="outline">{statusLabel(concert.status)}</Badge>
        </div>
        <p className="text-sm text-zinc-600">{concert.venue}</p>
        <p className="text-sm text-zinc-600">{concert.groupRule}</p>
        <p className="text-sm text-zinc-600">{concert.sameNightReturn}</p>
        <ul className="divide-y divide-zinc-200">
          {concert.shows.map((show) => (
            <li key={show.date} className="space-y-1 py-3">
              <p className="text-sm font-medium">{show.date}</p>
              <p className="text-sm text-zinc-600">
                Doors {show.doors} · start {show.start} · {show.seat} ·{' '}
                {show.price}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500">{concert.tickets.fcLotteries}</p>
        <p className="text-sm text-zinc-500">{concert.tickets.creatorLifeSize}</p>
        <p className="text-sm text-zinc-500">{concert.tickets.generalSale}</p>
        <IdeaLinks links={concert.links} />
      </section>

      {soon.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Book this month
          </h2>
          <ul className="divide-y divide-zinc-200">
            {soon.map((item) => (
              <DecisionRow
                key={item.id}
                title={item.title}
                status={item.status}
                detail={item.detail}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {later.length > 0 ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
            Later
          </h2>
          <ul className="divide-y divide-zinc-200">
            {later.map((item) => (
              <DecisionRow
                key={item.id}
                title={item.title}
                status={item.status}
                detail={item.detail}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
          Constraints
        </h2>
        <ul className="divide-y divide-zinc-200">
          {constraints.map((text) => (
            <li key={text} className="py-4 text-sm text-zinc-600">
              {text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
