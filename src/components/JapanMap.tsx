type JapanMapProps = {
  active: 'Tokyo' | 'Nozawa'
  travelTo?: 'Tokyo' | 'Nozawa'
}

const pins = {
  Tokyo: { x: 148, y: 128 },
  Nozawa: { x: 118, y: 96 },
}

export function JapanMap({ active, travelTo }: JapanMapProps) {
  const destination = travelTo ?? active

  return (
    <div className="aspect-square w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        role="img"
        aria-label={`Japan map. ${destination} is the active city.`}
      >
        <path
          d="M118 18c8 6 14 16 12 28-2 10 6 14 14 12 8-2 16 8 12 18-3 8 2 14 10 16 6 2 10 10 6 16-6 10-4 22 2 30 4 6 0 14-8 16-10 2-14 12-8 20 4 6-2 12-10 12-12 0-18 10-14 20 3 8-6 14-16 12-12-3-22 6-20 16 1 6-8 10-16 6-10-4-22 0-24-12-2-10-14-12-20-4-6 8-18 4-20-6-2-12 6-22 16-26 8-4 10-14 4-20-8-8-4-20 6-24 8-4 10-14 4-20C70 92 62 80 70 70c6-8 4-20-6-24-6-3-4-12 4-14 12-4 22 4 24 14 2 8 12 10 18 4 8-8 20-6 26 2z"
          className="fill-zinc-100 stroke-zinc-300"
          strokeWidth="1.2"
        />
        {travelTo ? (
          <line
            x1={pins.Tokyo.x}
            y1={pins.Tokyo.y}
            x2={pins.Nozawa.x}
            y2={pins.Nozawa.y}
            className="stroke-zinc-800"
            strokeWidth="1.5"
          />
        ) : null}
        {(['Tokyo', 'Nozawa'] as const).map((city) => {
          const filled = city === destination
          return (
            <g key={city}>
              <circle
                cx={pins[city].x}
                cy={pins[city].y}
                r={filled ? 5.5 : 4.5}
                className={filled ? 'fill-zinc-900' : 'fill-white stroke-zinc-900'}
                strokeWidth="1.5"
              />
              <text
                x={pins[city].x + 8}
                y={pins[city].y + 4}
                className="fill-zinc-700"
                fontSize="8"
              >
                {city}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
