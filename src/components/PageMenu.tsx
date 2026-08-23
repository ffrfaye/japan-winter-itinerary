import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { tabs, type TabId } from '@/lib/itinerary'

export function PageMenu({
  tab,
  onChange,
}: {
  tab: TabId
  onChange: (next: TabId) => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const current = tabs.find((item) => item.id === tab)?.label ?? 'Itinerary'

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [])

  return (
    <div ref={root} className="relative w-fit">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-600 shadow-sm"
      >
        {current}
        <ChevronDown className="size-3.5" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-20 mt-1 min-w-36 rounded-xl border border-zinc-200 bg-white py-1 shadow-sm"
        >
          {tabs.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                aria-selected={item.id === tab}
                onClick={() => {
                  onChange(item.id)
                  setOpen(false)
                }}
                className="w-full px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
