import type { TripDay } from '../types/trip'
import { StatusChip } from './StatusChip'

export function DayCard({
  day,
  open,
  onToggle,
}: {
  day: TripDay
  open: boolean
  onToggle: () => void
}) {
  return (
    <article className={`day ${open ? 'is-open' : ''}`} id={`day-${day.id}`}>
      <button
        type="button"
        className="day-head"
        aria-expanded={open}
        onClick={onToggle}
      >
        <div className="day-date">
          <b>{day.short.split(' ')[0]}</b>
          <span>
            {day.weekday} · {day.city}
          </span>
        </div>
        <div>
          <h3>{day.title}</h3>
          <p className="day-summary">{day.summary}</p>
        </div>
        <StatusChip status={day.status} />
      </button>
      <div className="day-body">
        {day.blocks.map((block) => (
          <section key={block.title} className="block">
            <StatusChip status={block.status} />
            <h4>{block.title}</h4>
            <p>{block.detail}</p>
            {block.links && block.links.length > 0 ? (
              <div className="links">
                {block.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  )
}
