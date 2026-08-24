import { Button } from '@/components/ui/button'
import type { ViewMode } from '@/lib/itinerary'

export function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode
  onChange: (next: ViewMode) => void
}) {
  return (
    <div
      role="group"
      aria-label="Itinerary view"
      className="flex shrink-0 items-center gap-2"
    >
      {(['list', 'cards'] as const).map((value) => {
        const active = mode === value
        return (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={active ? 'default' : 'outline'}
            aria-pressed={active}
            onClick={() => onChange(value)}
            className="h-auto rounded-lg px-3.5 py-2 text-sm font-medium"
          >
            {value === 'list' ? 'List' : 'Cards'}
          </Button>
        )
      })}
    </div>
  )
}
