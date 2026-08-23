import { useEffect, useState } from 'react'
import { trip } from '../trip'
import { StatusChip } from './StatusChip'

const storageKey = 'japan-winter-checklist'

export function BookNow() {
  const [done, setDone] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>)
    } catch {
      setDone({})
    }
  }, [])

  const toggle = (id: string) => {
    setDone((current) => {
      const next = { ...current, [id]: !current[id] }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return (
    <section>
      <div className="section-title">
        <h2>Book-now list</h2>
        <p>Checks stay on this browser only. No login. The list itself still comes from trip.json.</p>
      </div>
      <div className="check-list">
        {trip.checklist.map((item) => (
          <label key={item.id} className={`check ${done[item.id] ? 'is-done' : ''}`}>
            <input
              type="checkbox"
              checked={Boolean(done[item.id])}
              onChange={() => toggle(item.id)}
            />
            <div>
              <div className="priority">{item.priority}</div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <div style={{ marginTop: 8 }}>
                <StatusChip status={item.status} />
              </div>
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}
