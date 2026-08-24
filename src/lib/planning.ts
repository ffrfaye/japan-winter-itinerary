import { trip } from '@/trip'
import type { StatusId, TripLink } from '@/types/trip'

export type PlanningIdea = {
  id: string
  title: string
  status: StatusId
  detail: string
  when?: string
  lines: string[]
  links: TripLink[]
}

function statusLabel(status: StatusId) {
  return trip.statusLegend.find((item) => item.id === status)?.label ?? status
}

export { statusLabel }

export function tokyoIdeas(): PlanningIdea[] {
  return trip.activities.filter((item) => item.group === 'tokyo')
}

export function nozawaIdeas(): PlanningIdea[] {
  return trip.activities.filter((item) => item.group === 'nozawa')
}

export function lastBlockIdeas(): PlanningIdea[] {
  return trip.activities.filter((item) => item.group === 'last-block')
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

export function planningCalendar(priority: 'soon' | 'later') {
  return trip.bookNow.filter((item) => item.priority === priority)
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
