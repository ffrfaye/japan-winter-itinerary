import { trip } from '../trip'
import { StatusChip } from './StatusChip'

export function OpenDecisions() {
  return (
    <section>
      <div className="section-title">
        <h2>Still open</h2>
        <p>These are not booked and not group-locked. They stay on the wooden plaques until someone decides.</p>
      </div>
      <div className="ema-grid">
        {trip.openDecisions.map((item) => (
          <article key={item.id} className="ema">
            <StatusChip status={item.status} />
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
