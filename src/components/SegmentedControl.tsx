import { cn } from '@/lib/utils'

/** In-page segmented control: muted track, white active pill. */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (next: T) => void
  options: { id: T; label: string }[]
  label: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex max-w-full flex-wrap items-center rounded-lg bg-zinc-100 p-0.5"
    >
      {options.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              'h-7 rounded-md px-3 py-0.5 text-[13px] font-medium leading-none transition-colors',
              active
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900',
            )}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
