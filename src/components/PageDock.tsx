import { Calendar, ClipboardList, Users } from 'lucide-react'
import type { TabId } from '@/lib/itinerary'
import { cn } from '@/lib/utils'

const items = [
  { id: 'itinerary', label: 'Itinerary', Icon: Calendar },
  { id: 'rsvp', label: 'RSVP', Icon: Users },
  { id: 'planning', label: 'Planning', Icon: ClipboardList },
] as const

export function PageDock({
  tab,
  onChange,
}: {
  tab: TabId
  onChange: (next: TabId) => void
}) {
  return (
    <nav
      aria-label="Pages"
      className="fixed right-4 z-[1100] flex flex-col rounded-2xl border border-zinc-200 bg-white/90 p-1 shadow-sm backdrop-blur"
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {items.map((item) => {
        const current = item.id === tab
        const Icon = item.Icon
        return (
          <button
            key={item.id}
            type="button"
            aria-current={current ? 'page' : undefined}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative flex items-center gap-2 rounded-xl py-1.5 pr-2.5 pl-3 text-left transition-colors duration-[120ms]',
              current
                ? 'text-zinc-900'
                : 'text-zinc-500 hover:bg-zinc-100',
            )}
          >
            {current ? (
              <span
                aria-hidden
                className="absolute top-1/2 left-1 h-3 w-0.5 -translate-y-1/2 rounded-full bg-zinc-900"
              />
            ) : null}
            <Icon
              className="size-3.5 shrink-0"
              strokeWidth={current ? 2.25 : 1.75}
              aria-hidden
            />
            <span className="text-[12px] font-medium leading-none">
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
