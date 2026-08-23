import { useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DaySheet } from '@/components/DaySheet'
import { JapanMap } from '@/components/JapanMap'
import {
  groupDays,
  mapDays,
  type ItineraryDay,
  type ViewMode,
} from '@/lib/itinerary'
import { trip } from '@/trip'

export function ItineraryPage() {
  const days = mapDays(trip)
  const groups = groupDays(days)
  const [mode, setMode] = useState<ViewMode>('cards')
  const [index, setIndex] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const dragged = useRef(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    skipSnaps: false,
    duration: 16,
    dragFree: false,
  })

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setMode(media.matches ? 'list' : 'cards')
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const sync = () => setIndex(emblaApi.selectedScrollSnap())
    const markDrag = () => {
      dragged.current = true
    }
    const resetDrag = () => {
      dragged.current = false
    }
    sync()
    emblaApi.on('select', sync)
    emblaApi.on('pointerDown', resetDrag)
    emblaApi.on('scroll', markDrag)
    return () => {
      emblaApi.off('select', sync)
      emblaApi.off('pointerDown', resetDrag)
      emblaApi.off('scroll', markDrag)
    }
  }, [emblaApi])

  const active = days[index] ?? days[0]
  const openDay = days.find((day) => day.id === openId) ?? null

  function openCard(id: string) {
    if (dragged.current) return
    setOpenId(id)
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {(['list', 'cards'] as const).map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={mode === value ? 'default' : 'outline'}
            onClick={() => setMode(value)}
          >
            {value === 'list' ? 'List' : 'Cards'}
          </Button>
        ))}
      </div>

      {mode === 'list' ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.id}>
              <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
                {group.label}
              </h2>
              <ul className="divide-y divide-zinc-200">
                {group.days.map((day) => (
                  <DayRow key={day.id} day={day} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <JapanMap active={active.mapCity} travelTo={active.travelTo} />
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {days.map((day) => (
                <div key={day.id} className="min-w-0 shrink-0 grow-0 basis-full">
                  <button
                    type="button"
                    onClick={() => openCard(day.id)}
                    className="w-full px-px text-left"
                  >
                    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <p className="text-sm text-zinc-600">
                        {day.weekday} {day.short}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{day.city}</Badge>
                        <p className="text-sm font-medium">{day.title}</p>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                        {day.summary}
                      </p>
                    </article>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5">
            {days.map((day, dayIndex) => (
              <button
                key={day.id}
                type="button"
                aria-label={day.short}
                onClick={() => emblaApi?.scrollTo(dayIndex)}
                className={`size-1.5 rounded-full ${
                  dayIndex === index ? 'bg-zinc-900' : 'bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {openDay ? (
        <DaySheet day={openDay} onClose={() => setOpenId(null)} />
      ) : null}
    </div>
  )
}

function DayRow({ day }: { day: ItineraryDay }) {
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-4 px-0 py-4">
      <div className="text-sm">
        <p className="text-zinc-600">{day.weekday}</p>
        <p className="font-medium">{day.short}</p>
      </div>
      <div className="min-w-0 space-y-1">
        <Badge variant="outline">{day.city}</Badge>
        <p className="text-sm font-medium">{day.title}</p>
        <p className="text-sm text-zinc-600">{day.body[0]}</p>
      </div>
    </li>
  )
}
