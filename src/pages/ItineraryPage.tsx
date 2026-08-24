import { useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { CardPager } from '@/components/CardPager'
import { DayJump } from '@/components/DayJump'
import { DaySheet } from '@/components/DaySheet'
import { PlaceCards } from '@/components/PlaceCards'
import { JapanMap } from '@/components/JapanMap'
import {
  dayHeading,
  groupDays,
  mapDays,
  type ItineraryDay,
  type ViewMode,
} from '@/lib/itinerary'
import { trip } from '@/trip'

export function ItineraryPage({ mode }: { mode: ViewMode }) {
  const days = useMemo(() => mapDays(trip), [])
  const groups = useMemo(() => groupDays(days), [days])
  const [desktop, setDesktop] = useState(false)
  const [index, setIndex] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [jumpOpen, setJumpOpen] = useState(false)
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
    const sync = () => setDesktop(media.matches)
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

  useEffect(() => {
    if (mode !== 'cards' || !emblaApi) return
    emblaApi.scrollTo(index, true)
  }, [mode, emblaApi])

  useEffect(() => {
    if (mode !== 'cards') return

    function onKey(event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (openId || jumpOpen) return
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="dialog"], [role="listbox"]',
        )
      ) {
        return
      }
      event.preventDefault()
      if (event.key === 'ArrowLeft') emblaApi?.scrollPrev()
      else emblaApi?.scrollNext()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, openId, jumpOpen, emblaApi])

  const active = days[index] ?? days[0]
  const openDay = days.find((day) => day.id === openId) ?? null
  const canPrev = index > 0
  const canNext = index < days.length - 1
  const showPager = mode === 'cards' && desktop && !openDay && !jumpOpen

  function openCard(id: string) {
    if (dragged.current) return
    setOpenId(id)
  }

  function jumpTo(next: number) {
    setIndex(next)
    emblaApi?.scrollTo(next)
  }

  return (
    <div className="space-y-5">
      {mode === 'list' ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.id}>
              {group.id === 'overview' ? null : (
                <h2 className="text-xs font-medium tracking-wide text-zinc-600 uppercase">
                  {group.label}
                </h2>
              )}
              <ul className={group.id === 'overview' ? '' : 'divide-y divide-zinc-200'}>
                {group.days.map((day) => (
                  <DayRow key={day.id} day={day} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="relative z-10 space-y-4">
          <DayJump
            days={days}
            index={index}
            onJump={jumpTo}
            onOpenChange={setJumpOpen}
          />
          <JapanMap
            pins={active.pins}
            showTravelLine={active.showTravelLine}
            showCluster={active.showCluster}
            pinLinks={active.pinLinks}
            softLabels={active.overview}
          />
          <div className="relative">
            {showPager ? (
              <CardPager
                canPrev={canPrev}
                canNext={canNext}
                onPrev={() => emblaApi?.scrollPrev()}
                onNext={() => emblaApi?.scrollNext()}
              />
            ) : null}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {days.map((day) => (
                  <div key={day.id} className="min-w-0 shrink-0 grow-0 basis-full px-px">
                    {day.overview ? (
                      <OverviewCard day={day} />
                    ) : (
                      <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                        <button
                          type="button"
                          onClick={() => openCard(day.id)}
                          className="w-full text-left"
                        >
                          <p className="text-sm text-zinc-600">{dayHeading(day)}</p>
                          <p className="mt-1 text-sm font-medium">{day.title}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                            {day.summary}
                          </p>
                        </button>
                        {day.places.length > 0 ? (
                          <div className="mt-3">
                            <PlaceCards places={day.places} />
                          </div>
                        ) : null}
                      </article>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1.5">
            {days.map((day, dayIndex) => (
              <button
                key={day.id}
                type="button"
                aria-label={day.overview ? 'Overview' : `Day ${day.dayNumber}`}
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

function OverviewCard({ day }: { day: ItineraryDay }) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
        Overview
      </p>
      <p className="mt-1 text-sm font-medium">{day.title}</p>
      <p className="mt-1 text-[13px] text-zinc-500">Trip at a glance</p>
      <p className="mt-2 text-sm text-zinc-600">{day.summary}</p>
      {day.places.length > 0 ? (
        <div className="mt-3">
          <PlaceCards places={day.places} />
        </div>
      ) : null}
    </article>
  )
}

function DayRow({ day }: { day: ItineraryDay }) {
  if (day.overview) {
    return (
      <li className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
        <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
          Overview
        </p>
        <p className="mt-1 text-sm font-medium">{day.title}</p>
        <p className="mt-1 text-sm text-zinc-600">{day.summary}</p>
        <div className="mt-3">
          <PlaceCards places={day.places} />
        </div>
      </li>
    )
  }

  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-4 px-0 py-4">
      <div className="text-sm">
        <p className="text-zinc-600">Day {day.dayNumber}</p>
        <p className="font-medium">{day.short}</p>
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{day.title}</p>
        <p className="text-sm text-zinc-600">{day.summary}</p>
        <PlaceCards places={day.places} />
      </div>
    </li>
  )
}
