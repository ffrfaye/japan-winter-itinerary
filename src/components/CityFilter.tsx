import { trip } from '../trip'
import type { Trip } from '../types/trip'

type FilterId = Trip['filters'][number]['id']

export function CityFilter({
  value,
  onChange,
}: {
  value: FilterId
  onChange: (id: FilterId) => void
}) {
  return (
    <div className="filters" role="group" aria-label="Filter by city">
      {trip.filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className="filter"
          aria-pressed={value === filter.id}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
