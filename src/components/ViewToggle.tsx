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
      className="inline-flex h-7 w-[84px] shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
    >
      {(['list', 'cards'] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={mode === value}
          onClick={() => onChange(value)}
          className={cn(
            'flex-1 text-[13px] font-medium',
            mode === value ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600',
          )}
        >
          {value === 'list' ? 'List' : 'Cards'}
        </button>
      ))}
    </div>
  )
}
