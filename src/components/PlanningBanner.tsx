import { trip } from '../trip'
import { StatusChip } from './StatusChip'

export function PlanningBanner() {
  const { planningBanner } = trip.meta
  return (
    <aside className="banner" aria-label={planningBanner.eyebrow}>
      <div className="banner-eyebrow">{planningBanner.eyebrow}</div>
      <h2>{planningBanner.title}</h2>
      <p>{planningBanner.body}</p>
      <div className="legend">
        {trip.statusLegend.map((item) => (
          <StatusChip key={item.id} status={item.id} label={`${item.label}: ${item.meaning}`} />
        ))}
      </div>
    </aside>
  )
}
