import { useEffect, useMemo, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { CardPager } from '@/components/CardPager'
import { DayJump } from '@/components/DayJump'
import { DaySheet } from '@/components/DaySheet'
import { JapanMap } from '@/components/JapanMap'
import { FlightDayLine } from '@/components/FlightDayLine'
import { LodgingJoinRow } from '@/components/LodgingJoinRow'
import { useFlights } from '@/lib/flights-context'
import { ViewToggle } from '@/components/ViewToggle'
import { groupDays, itineraryDays, type ItineraryDay, type ViewMode } from '@/lib/itinerary'

export function ItineraryPage({
  mode,
  onModeChange,
}: {
  mode: ViewMode
  onModeChange: (next: ViewMode) => void
}) {
  const days = useMemo(() => itineraryDays, [])
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
    if (mode === 'cards') {
      emblaApi?.scrollTo(next)
      return
    }
    const day = days[next]
    if (!day) return
    document.getElementById(`day-${day.id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="space-y-5">
      <div className="relative z-20 flex flex-nowrap items-center justify-start gap-[18px]">
        <DayJump
          days={days}
          index={index}
          onJump={jumpTo}
          onOpenChange={setJumpOpen}
        />
        <ViewToggle mode={mode} onChange={onModeChange} />
      </div>
      {mode === 'list' ? (
        <div className="space-y-7">
          {groups.map((group) => (
            <section key={group.id}>
              <h2 className="mb-2 text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
                {group.label}
              </h2>
              <div className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200 bg-white">
                {group.days.map((day) => (
                  <DayRow key={day.id} day={day} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="relative z-10 space-y-3">
          <JapanMap focus={active.mapFocus} />
          <div className="relative">
            {showPager ? (
              <CardPager
                canPrev={canPrev}
                canNext={canNext}
                onPrev={() => emblaApi?.scrollPrev()}
                onNext={() => emblaApi?.scrollNext()}
              />
            ) : null}
            <div className="overflow-hidden" ref={emblaRef} data-card-scroller>
              <div className="flex">
                {days.map((day) => (
                  <div key={day.id} className="min-w-0 shrink-0 grow-0 basis-full px-px">
                    <DayCard day={day} onOpen={() => openCard(day.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {days.map((day, dayIndex) => (
              <button
                key={day.id}
                type="button"
                aria-label={`${day.dateLabel}, ${day.title}`}
                aria-current={dayIndex === index ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(dayIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  dayIndex === index ? 'w-4 bg-zinc-900' : 'w-1.5 bg-zinc-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {openDay ? <DaySheet day={openDay} onClose={() => setOpenId(null)} /> : null}
    </div>
  )
}

function CityChip({ city }: { city: string }) {
  return (
    <span className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-px text-[10px] font-medium text-zinc-600">
      {city}
    </span>
  )
}

function DayRow({ day }: { day: ItineraryDay }) {
  const { flights } = useFlights()
  return (
    <div id={`day-${day.id}`} className="flex scroll-mt-6 gap-3 px-3.5 py-3">
      <div className="w-14 shrink-0 pt-0.5 text-[13px] font-medium whitespace-nowrap text-zinc-500">
        {day.dateLabel}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <CityChip city={day.city} />
          {day.kinds.map((kind) => (
            <span key={kind} className="text-[10px] text-zinc-400">
              {kind}
            </span>
          ))}
        </div>
        <p className="mt-0.5 text-sm font-medium text-zinc-950">{day.title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-zinc-500">{day.summary}</p>
        <FlightDayLine dayId={day.id} flights={flights} />
        {day.lodging.length > 0 ? (
          <div className="mt-1">
            {day.lodging.map((stop) => (
              <LodgingJoinRow
                key={`${stop.stayId}-${stop.action}`}
                stayId={stop.stayId}
                action={stop.action}
                when={stop.when}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function DayCard({ day, onOpen }: { day: ItineraryDay; onOpen: () => void }) {
  const { flights } = useFlights()
  return (
    <article className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 shadow-sm">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-zinc-500">{day.dateLabel}</span>
              <CityChip city={day.city} />
            </div>
            <h3 className="mt-0.5 text-[15px] font-semibold tracking-tight">{day.title}</h3>
            <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-zinc-500">
              {day.summary}
            </p>
            <FlightDayLine dayId={day.id} flights={flights} />
            {day.lodging.length > 0 ? (
              <p className="mt-1 text-[11px] font-medium text-zinc-500">
                {day.lodging.map((stop) => `${stop.action}`).join(' · ')}
              </p>
            ) : (
              <p className="mt-1 text-[11px] font-medium text-zinc-400">Tap for the full day</p>
            )}
          </div>
          {day.photo ? (
            <img
              src={day.photo.src}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          ) : null}
        </div>
      </button>
      {day.lodging.length > 0 ? (
        <div className="mt-1">
          {day.lodging.map((stop) => (
            <LodgingJoinRow
              key={`${stop.stayId}-${stop.action}`}
              stayId={stop.stayId}
              action={stop.action}
              when={stop.when}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}
