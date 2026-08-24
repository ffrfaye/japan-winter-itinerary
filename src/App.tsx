import { useEffect, useMemo, useState } from 'react'
import { PageMenu } from '@/components/PageMenu'
import { ViewToggle } from '@/components/ViewToggle'
import { cn } from '@/lib/utils'
import {
  emptyAnswers,
  guestsFromTrip,
  parseTab,
  type TabId,
  type ViewMode,
} from '@/lib/itinerary'
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
  const [mode, setMode] = useState<ViewMode>('cards')
  const guests = useMemo(() => guestsFromTrip(trip), [])
  const [answers, setAnswers] = useState(() => emptyAnswers(guests))

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setMode(media.matches ? 'list' : 'cards')
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

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
        <header className="relative z-20 mb-5 space-y-2">
          <h1 className="text-3xl font-medium tracking-tight">{trip.meta.title}</h1>
          <p className="text-sm text-zinc-600">{trip.meta.datesLabel}</p>
          <div className="relative z-20 flex flex-nowrap items-center justify-start gap-[18px]">
            <PageMenu tab={tab} onChange={go} />
            {tab === 'itinerary' ? (
              <ViewToggle mode={mode} onChange={setMode} />
            ) : null}
          </div>
        </header>
        {tab === 'itinerary' ? <ItineraryPage mode={mode} /> : null}
        {tab === 'rsvp' ? (
          <RsvpPage
            guests={guests}
            answers={answers}
            onAnswersChange={setAnswers}
          />
        ) : null}
        {tab === 'planning' ? <PlanningPage /> : null}
      </main>
    </div>
  )
}
