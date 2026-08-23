import { useMemo, useState } from 'react'
import { BookNow } from './components/BookNow'
import { CityFilter } from './components/CityFilter'
import { DayCard } from './components/DayCard'
import { DayPicker } from './components/DayPicker'
import { Hero } from './components/Hero'
import { OpenDecisions } from './components/OpenDecisions'
import { PlanningBanner } from './components/PlanningBanner'
import { ReferencePanels } from './components/ReferencePanels'
import { RouteStrip } from './components/RouteStrip'
import { trip } from './trip'
import type { Trip } from './types/trip'

type FilterId = Trip['filters'][number]['id']

export default function App() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [openId, setOpenId] = useState(trip.days[0]?.id ?? '')

  const days = useMemo(
    () => (filter === 'all' ? trip.days : trip.days.filter((day) => day.city === filter)),
    [filter],
  )

  const selectedId = days.some((day) => day.id === openId) ? openId : (days[0]?.id ?? '')

  const onSelectDay = (id: string) => {
    setOpenId(id)
    document.getElementById(`day-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="page">
      <a className="skip" href="#itinerary">
        Skip to itinerary
      </a>
      <Hero />
      <PlanningBanner />
      <RouteStrip />

      <nav className="sticky-nav" aria-label="Itinerary controls">
        <CityFilter
          value={filter}
          onChange={(id) => {
            setFilter(id)
          }}
        />
        <DayPicker days={days} selectedId={selectedId} onSelect={onSelectDay} />
      </nav>

      <main id="itinerary">
        <div className="section-title">
          <h2>Day by day</h2>
          <p>Tap a day to expand it. The timeline only reads src/data/trip.json.</p>
        </div>
        <div className="days">
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              open={day.id === selectedId}
              onToggle={() => setOpenId((current) => (current === day.id ? '' : day.id))}
            />
          ))}
        </div>
        <OpenDecisions />
        <BookNow />
        <ReferencePanels />
      </main>

      <footer className="footer">
        <p>
          Facts live in <code>src/data/trip.json</code>. Unpublished calendars and unbooked rooms stay marked
          open. Friends can share the GitHub Pages URL once Actions has published main.
        </p>
      </footer>
    </div>
  )
}
