import { trip } from '@/trip'
import type { ChecklistItem, StatusId, TripLink } from '@/types/trip'

export type PlanningIdea = {
  id: string
  title: string
  status: StatusId
  detail: string
  lines: string[]
  links: TripLink[]
}

function statusLabel(status: StatusId) {
  return trip.statusLegend.find((item) => item.id === status)?.label ?? status
}

export { statusLabel }

const lodgingChecklistIds = new Set(['tokyo-hotel', 'nozawa-hotel'])

export function tokyoIdeas(): PlanningIdea[] {
  const teamlab = trip.checklist.find((item) => item.id === 'teamlab')
  const ideas: PlanningIdea[] = [
    {
      id: 'ghibli',
      title: trip.ghibli.museum,
      status: trip.ghibli.status,
      detail: trip.ghibli.unpublished
        ? 'January 2027 days are unpublished. Do not claim tickets exist.'
        : trip.ghibli.sale,
      lines: [
        trip.ghibli.sale,
        trip.ghibli.lastYearClosure,
        trip.ghibli.tuesdayNote,
        trip.ghibli.primaryDay,
        ...trip.ghibli.rules,
      ],
      links: trip.ghibli.links,
    },
  ]
  if (teamlab) {
    ideas.push({
      id: teamlab.id,
      title: teamlab.title,
      status: teamlab.status,
      detail: teamlab.detail,
      lines: [],
      links: [],
    })
  }
  return ideas
}

export function nozawaIdeas(): PlanningIdea[] {
  return [
    {
      id: 'lifts',
      title: `Lift tickets · ${trip.ski.mountain}`,
      status: 'recommended',
      detail: trip.ski.properDays,
      lines: [
        `Adult day ${trip.ski.tickets.adultDay}. Adult 3-day ${trip.ski.tickets.adult3Day}.`,
        trip.ski.tickets.season,
      ],
      links: trip.ski.links.filter((link) => link.label === 'Ticket prices'),
    },
    {
      id: 'rental',
      title: trip.ski.rental.shop,
      status: 'open',
      detail: trip.group.skiGear,
      lines: [`Adult day set ${trip.ski.rental.adultDaySet}.`],
      links: trip.ski.links.filter((link) => link.label === 'Salomon rental'),
    },
    {
      id: 'soto-yu',
      title: 'Soto-yu',
      status: 'recommended',
      detail: trip.ski.onsen.sotoYu,
      lines: [],
      links: trip.ski.links.filter((link) => link.label === 'Soto-yu'),
    },
    {
      id: 'monkeys',
      title: 'Snow monkeys',
      status: trip.snowMonkeys.status,
      detail: `${trip.snowMonkeys.rule} ${trip.snowMonkeys.operator}. Reservations open ${trip.snowMonkeys.reservationsOpen}.`,
      lines: [
        trip.snowMonkeys.window,
        trip.snowMonkeys.price,
        trip.snowMonkeys.childTour,
        trip.snowMonkeys.parkAdmission
          ? `Park gate ${trip.snowMonkeys.parkAdmission}`
          : undefined,
      ].filter((line): line is string => Boolean(line)),
      links: [
        { label: 'Kotsu tour', url: trip.snowMonkeys.url },
        ...(trip.snowMonkeys.parkUrl
          ? [{ label: 'Park guide', url: trip.snowMonkeys.parkUrl }]
          : []),
      ],
    },
  ]
}

export function planningOpenDecisions() {
  const skeleton = trip.checklist.find((item) => item.id === 'confirm-skeleton')
  const fromTrip = trip.openDecisions.filter((item) => item.id !== 'lodging')
  const items: { id: string; status: StatusId; title: string; detail: string }[] =
    []
  if (skeleton) {
    items.push({
      id: skeleton.id,
      status: skeleton.status,
      title: skeleton.title,
      detail: skeleton.detail,
    })
  }
  for (const item of fromTrip) {
    if (items.some((existing) => existing.id === item.id)) continue
    items.push(item)
  }
  return items
}

export function planningCalendar(priority: ChecklistItem['priority']) {
  return trip.checklist.filter(
    (item) =>
      item.priority === priority &&
      !lodgingChecklistIds.has(item.id) &&
      (item.id === 'teamlab' ||
        item.id === 'ghibli-watch' ||
        item.id === 'monkeys' ||
        item.id === 'hakutaka'),
  )
}

export function quietConstraints() {
  return [
    ...trip.constraints
      .filter((item) => item.id === 'tokyo-base')
      .map((item) => item.text),
    trip.transport.train.text,
    trip.transport.yamato.text,
  ]
}
