import { Button } from '@/components/ui/button'

export function GhostTabs<T extends string | number>({
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
    <div role="tablist" aria-label={label} className="flex flex-wrap items-center gap-2">
      {options.map((item) => {
        const active = item.id === value
        return (
          <Button
            key={String(item.id)}
            type="button"
            role="tab"
            size="xs"
            aria-selected={active}
            variant={active ? 'default' : 'outline'}
            onClick={() => onChange(item.id)}
            className="h-7 rounded-lg px-3 py-0.5 text-[13px] font-medium leading-none"
          >
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}
