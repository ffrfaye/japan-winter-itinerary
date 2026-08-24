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
            size="xs"
            variant={active ? 'default' : 'outline'}
            aria-pressed={active}
            onClick={() => onChange(value)}
            className="h-7 rounded-lg px-3 py-0.5 text-[13px] font-medium leading-none"
          >
            {value === 'list' ? 'List' : 'Cards'}
          </Button>
        )
      })}
    </div>
  )
}
