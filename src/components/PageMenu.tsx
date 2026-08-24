import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLUListElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const current = tabs.find((item) => item.id === tab)?.label ?? 'Itinerary'

  function placeMenu() {
    const rect = trigger.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ top: rect.bottom + 4, left: rect.left })
  }

  useLayoutEffect(() => {
    if (open) placeMenu()
  }, [open])

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      const target = event.target as Node
      if (trigger.current?.contains(target) || menu.current?.contains(target)) {
        return
      }
      setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', placeMenu)
    window.addEventListener('scroll', placeMenu, true)
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', placeMenu)
      window.removeEventListener('scroll', placeMenu, true)
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative z-[3000] min-w-0 w-fit max-w-full">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative z-[3000] inline-flex max-w-full min-w-0 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-600 shadow-sm"
      >
        <span className="min-w-0 truncate">{current}</span>
        <ChevronDown className="size-3.5 shrink-0" />
      </button>
      {open
        ? createPortal(
            <ul
              ref={menu}
              role="listbox"
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-[3000] min-w-36 rounded-xl border border-zinc-200 bg-white py-1 shadow-sm"
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
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
}
