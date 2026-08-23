import { useEffect, useState } from 'react'
import { CalendarDays, Check, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseTab, tabs, type TabId } from '@/lib/itinerary'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { PlanningPage } from '@/pages/PlanningPage'
import { RsvpPage } from '@/pages/RsvpPage'

const icons = {
  itinerary: CalendarDays,
  rsvp: Check,
  planning: ClipboardList,
}

const widths: Record<TabId, string> = {
  itinerary: 'max-w-lg',
  rsvp: 'max-w-xl',
  planning: 'max-w-lg',
}

export default function App() {
  const [tab, setTab] = useState<TabId>(() =>
    parseTab(typeof window === 'undefined' ? '' : window.location.hash),
  )

  useEffect(() => {
    const onHash = () => setTab(parseTab(window.location.hash))
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#itinerary')
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(next: TabId) {
    window.location.hash = next
    setTab(next)
  }

  return (
    <div className="min-h-svh bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white max-md:hidden">
        <div className={cn('mx-auto flex gap-1 px-5 py-3', widths[tab])}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={cn(
                'rounded-xl px-3 py-1.5 text-sm',
                tab === item.id
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <main
        className={cn(
          'mx-auto w-full px-5 py-8 pb-24 md:py-10 md:pb-10',
          widths[tab],
        )}
      >
        {tab === 'itinerary' ? <ItineraryPage /> : null}
        {tab === 'rsvp' ? <RsvpPage /> : null}
        {tab === 'planning' ? <PlanningPage /> : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-3">
          {tabs.map((item) => {
            const Icon = icons[item.id]
            const active = tab === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    'flex w-full flex-col items-center gap-1 py-3 text-xs',
                    active ? 'text-zinc-950' : 'text-zinc-600',
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
