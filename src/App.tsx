import { useEffect, useState } from 'react'
import { PageMenu } from '@/components/PageMenu'
import { cn } from '@/lib/utils'
import { parseTab, type TabId } from '@/lib/itinerary'
import { ItineraryPage } from '@/pages/ItineraryPage'
import { PlanningPage } from '@/pages/PlanningPage'
import { RsvpPage } from '@/pages/RsvpPage'
import { trip } from '@/trip'

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
      <main className={cn('mx-auto w-full px-5 py-8 md:py-10', widths[tab])}>
        <header className="mb-5 space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">{trip.meta.title}</h1>
          <p className="text-sm text-zinc-600">{trip.meta.datesLabel}</p>
          <PageMenu tab={tab} onChange={go} />
        </header>
        {tab === 'itinerary' ? <ItineraryPage /> : null}
        {tab === 'rsvp' ? <RsvpPage /> : null}
        {tab === 'planning' ? <PlanningPage /> : null}
      </main>
    </div>
  )
}
