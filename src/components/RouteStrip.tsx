import { trip } from '../trip'
import { StatusChip } from './StatusChip'

export function RouteStrip() {
  return (
    <section className="route" aria-label={trip.route.label}>
      <div className="route-head">
        <span>{trip.route.label}</span>
        <StatusChip status={trip.route.status} />
      </div>
      <ol className="route-track">
        {trip.route.stops.map((stop) => (
          <li key={stop.id} className="route-stop">
            <i />
            <strong>{stop.city}</strong>
            <small>{stop.dates}</small>
            <em>
              {stop.nights > 0 ? `${stop.nights} nights · ` : ''}
              {stop.note}
            </em>
          </li>
        ))}
      </ol>
    </section>
  )
}
