import { useCallback, useMemo, useState } from 'react'
import { GhostTabs } from '@/components/GhostTabs'
import { LodgingCompareCard } from '@/components/LodgingCompareCard'
import { LodgingCompareMap } from '@/components/LodgingCompareMap'
import {
  filterLodgingCards,
  loadLodgingCards,
  lodgingBedrooms,
  lodgingLocations,
} from '@/lib/lodging'
import type { BedroomCount, LodgingLocation } from '@/types/lodging'

export function LodgingPage() {
  const catalog = useMemo(() => loadLodgingCards(), [])
  const [location, setLocation] = useState<LodgingLocation>('Tokyo')
  const [bedrooms, setBedrooms] = useState<BedroomCount>(4)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const cards = useMemo(
    () => filterLodgingCards(catalog, location, bedrooms),
    [catalog, location, bedrooms],
  )

  const select = useCallback((id: string) => {
    setSelectedId(id)
    document.getElementById(`lodging-card-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [])

  return (
    <div className="space-y-4">
      <header className="space-y-3">
        <h1 className="text-3xl font-medium tracking-tight">Lodging</h1>
        <GhostTabs
          label="Location"
          value={location}
          onChange={(next) => {
            setLocation(next)
            setSelectedId(null)
          }}
          options={lodgingLocations}
        />
        <GhostTabs
          label="Bedrooms"
          value={bedrooms}
          onChange={(next) => {
            setBedrooms(next)
            setSelectedId(null)
          }}
          options={lodgingBedrooms}
        />
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="order-1 h-[40vh] md:order-2 md:sticky md:top-6 md:h-[calc(100svh-8rem)] md:w-[40%] md:shrink-0">
          <LodgingCompareMap
            location={location}
            cards={cards}
            selectedId={selectedId}
            onSelect={select}
          />
        </div>
        <div className="order-2 min-w-0 space-y-4 md:order-1 md:w-[60%]">
          {cards.length === 0 ? (
            <p className="text-sm text-zinc-600">Properties coming</p>
          ) : (
            cards.map((card) => (
              <LodgingCompareCard
                key={card.id}
                card={card}
                active={card.id === selectedId}
                onSelect={() => setSelectedId(card.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
