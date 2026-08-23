import { trip } from '../trip'

const flakes = [
  { left: '8%', delay: '0s', duration: '9s' },
  { left: '22%', delay: '1.4s', duration: '11s' },
  { left: '41%', delay: '0.6s', duration: '8s' },
  { left: '63%', delay: '2s', duration: '12s' },
  { left: '78%', delay: '0.2s', duration: '10s' },
  { left: '91%', delay: '1.8s', duration: '9s' },
]

export function Hero() {
  const { meta, group } = trip
  return (
    <header className="hero">
      <div className="snow" aria-hidden="true">
        {flakes.map((flake) => (
          <span
            key={flake.left}
            className="flake"
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
            }}
          />
        ))}
      </div>
      <div className="seal" aria-hidden="true">
        {meta.seal}
      </div>
      <div className="hero-kicker">{meta.kicker}</div>
      <div className="hero-title-row">
        <h1>{meta.title}</h1>
        <div className="hero-jp">{meta.japaneseTitle}</div>
      </div>
      <div className="hero-meta">
        <div>
          <strong>{meta.datesLabel}</strong>
          <div>{meta.nights} nights · {meta.nightsBreakdown}</div>
        </div>
        <div>
          <strong>{group.lead} + {group.sizeLabel}</strong>
          <div>{meta.tone}</div>
        </div>
        <div>
          <strong>{meta.cityBase}</strong>
          <div>{meta.airports}</div>
        </div>
      </div>
    </header>
  )
}
