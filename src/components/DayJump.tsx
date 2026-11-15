import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ItineraryDay } from '@/lib/itinerary'

export function DayJump({
  days,
  index,
  onJump,
  onOpenChange,
}: {
  days: ItineraryDay[]
  index: number
  onJump: (next: number) => void
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  function setMenu(next: boolean) {
    setOpen(next)
    onOpenChange?.(next)
  }
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const current = days[index]
  const dated = days.map((day, dayIndex) => ({ day, dayIndex }))

  function placeMenu() {
    const rect = trigger.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ top: rect.bottom + 4, left: rect.left })
  }

  useLayoutEffect(() => {
    if (open) placeMenu()
  }, [open])

  useEffect(() => {
    return () => onOpenChange?.(false)
  }, [onOpenChange])

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      const target = event.target as Node
      if (trigger.current?.contains(target) || menu.current?.contains(target)) {
        return
      }
      setMenu(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenu(false)
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

  function option(day: ItineraryDay, dayIndex: number) {
    return (
      <button
        type="button"
        role="option"
        aria-selected={dayIndex === index}
        onClick={() => {
          onJump(dayIndex)
          setMenu(false)
        }}
        className={cn(
          'w-full px-3 py-1.5 text-left text-sm hover:bg-zinc-50',
          'text-zinc-700',
        )}
      >
        {day.jumpLabel}
      </button>
    )
  }

  return (
    <div className="relative z-[3000] w-fit min-w-0">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Jump to day"
        onClick={() => setMenu(!open)}
        className="relative z-[3000] inline-flex max-w-full min-w-0 items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-600 shadow-sm"
      >
        <span className="min-w-0 truncate">{current?.jumpLabel ?? 'Overview'}</span>
        <ChevronDown className="size-3.5 shrink-0" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menu}
              role="listbox"
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-[3000] max-h-80 min-w-44 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-sm"
            >
              {dated.map(({ day, dayIndex }) => (
                <div key={day.id}>{option(day, dayIndex)}</div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
