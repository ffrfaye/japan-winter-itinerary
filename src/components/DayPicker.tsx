import type { TripDay } from '../types/trip'

export function DayPicker({
  days,
  selectedId,
  onSelect,
}: {
  days: TripDay[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="day-picker" role="tablist" aria-label="Day timeline">
      {days.map((day) => (
        <button
          key={day.id}
          type="button"
          className="day-tab"
          role="tab"
          aria-current={selectedId === day.id}
          onClick={() => onSelect(day.id)}
        >
          <small>
            {day.weekday} · {day.city}
          </small>
          <strong>{day.short}</strong>
        </button>
      ))}
    </div>
  )
}
