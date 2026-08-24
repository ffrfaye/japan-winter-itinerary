import { cn } from '@/lib/utils'
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
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(value)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-[13px] font-medium',
              active
                ? 'border border-zinc-900 bg-zinc-100 text-zinc-900'
                : 'border border-transparent bg-transparent text-zinc-500',
            )}
          >
            {value === 'list' ? 'List' : 'Cards'}
          </button>
        )
      })}
    </div>
  )
}
