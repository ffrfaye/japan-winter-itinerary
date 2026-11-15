import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { stays } from '@/data/stays'
import { cn } from '@/lib/utils'

type Leg = {
  name: string
  dates: string
  nights: number
  people: number
  total: number
  schedule: string
}

const legs: Leg[] = [
  {
    name: stays.sumida.shortName,
    dates: 'Sun 27 Dec – Wed 30 Dec 2026',
    nights: stays.sumida.nights,
    people: stays.sumida.people,
    total: 1077.41,
    schedule: 'Scheduled Dec 5, 2026',
  },
  {
    name: stays.ski.shortName,
    dates: 'Wed 30 Dec – Tue 5 Jan 2027',
    nights: stays.ski.nights,
    people: stays.ski.people,
    total: 6193.11,
    schedule: 'Scheduled Nov 22, 2026',
  },
  {
    name: stays.kokoro.shortName,
    dates: 'Tue 5 Jan – Sat 9 Jan 2027',
    nights: stays.kokoro.nights,
    people: stays.kokoro.people,
    total: 2118.54,
    schedule: 'Scheduled Dec 14, 2026',
  },
]

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function money(value: number) {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const perPerson = legs.map((leg) => round2(leg.total / leg.people))
const lodgingPerPerson = round2(perPerson.reduce((sum, value) => sum + value, 0))
const totalLow = round2(lodgingPerPerson + 1380 + 178 + 106 + 133)
const totalHigh = round2(lodgingPerPerson + 1824 + 194 + 106 + 231)

const estimates = [
  {
    label: 'Flights',
    amount: '$1,380 – $1,824',
    note: 'est. from Google Flights search Nov 15 · SFO→Tokyo, Dec 26/27–Jan 9/10, 1 adult economy. Low is 2-stop; high is a typical nonstop.',
  },
  {
    label: 'Lift tickets',
    amount: '$178 – $194',
    note: 'est. from Ryuoo / Shiga Kogen 2026–27 posted lift rates · 4 ski days at Ryuoo, Shiga Kogen, maybe Madarao.',
  },
  {
    label: 'Trains',
    amount: '$106',
    note: 'est. from JR reserved-seat fare · Tokyo to Nagano shinkansen round trip. Cars cover the local Nagano to Yamanouchi leg.',
  },
  {
    label: 'Rental cars',
    amount: '$133 – $231',
    note: 'est. from Times Car Rental high-season rates · 2–3 SUVs, 6 days, Nagano Station, split 10 ways.',
  },
]

export function BudgetPage() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">Budget</h2>
      <p className="mt-1.5 text-sm leading-snug text-zinc-500">
        Per person, if you stay all three legs. Lodging is actual; the other lines are
        estimates.
      </p>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white px-3.5 py-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
            Estimated total per person
          </p>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
            Estimate
          </span>
        </div>
        <p className="mt-1 text-[1.65rem] font-semibold tracking-tight tabular-nums">
          {money(totalLow)} – {money(totalHigh)}
        </p>
        <p className="mt-1.5 text-[12px] leading-snug text-zinc-500">
          Lodging ({money(lodgingPerPerson)} actual) plus flights, lift tickets, trains,
          and rental cars. The range is mostly flights (connecting vs nonstop) and 2 vs 3
          cars.
        </p>
      </section>

      <section className="mt-8 mb-6">
        <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          Line items
        </h3>
        <div className="mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <article className="border-b border-zinc-100">
            <button
              type="button"
              id="budget-lodge-toggle"
              className="flex w-full items-start gap-3 px-3.5 py-3 text-left"
              aria-expanded={open}
              aria-controls="lodging-breakdown"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold tracking-tight">Lodging</span>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-emerald-700 uppercase">
                    Actual
                  </span>
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-zinc-400">
                  From Airbnb confirmations. Full trip, split {stays.sumida.people} /{' '}
                  {stays.ski.people} / {stays.kokoro.people} by leg.
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {money(lodgingPerPerson)}
              </span>
              <ChevronDown
                aria-hidden
                className={cn(
                  'mt-1 size-4 shrink-0 text-zinc-400 transition-transform',
                  open && 'rotate-180',
                )}
              />
            </button>
            <div
              id="lodging-breakdown"
              hidden={!open}
              className="border-t border-zinc-100 px-3.5 pt-1 pb-3"
            >
              {legs.map((leg, index) => {
                const each = perPerson[index]
                const perNight = round2(leg.total / leg.people / leg.nights)
                return (
                  <div
                    key={leg.name}
                    className={
                      index
                        ? 'mt-2.5 border-t border-zinc-100 pt-2.5'
                        : 'pt-1.5'
                    }
                  >
                    <p className="text-[13px] font-semibold tracking-tight">{leg.name}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-zinc-500">
                      {leg.dates} · {leg.nights} nights ·{' '}
                      <span className="whitespace-nowrap">{leg.people} people</span>
                    </p>
                    <dl className="mt-1.5 space-y-0.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[12px] text-zinc-500">Total</dt>
                        <dd className="text-[12px] font-medium text-zinc-950 tabular-nums">
                          {money(leg.total)}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[12px] text-zinc-500">Per person</dt>
                        <dd className="text-[12px] text-zinc-950 tabular-nums">
                          {money(each)}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[12px] text-zinc-500">Per person / night</dt>
                        <dd className="text-[12px] text-zinc-950 tabular-nums">
                          {money(perNight)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-1 text-[11px] text-zinc-400">{leg.schedule}</p>
                  </div>
                )
              })}
            </div>
          </article>
          {estimates.map((item) => (
            <article
              key={item.label}
              className="border-b border-zinc-100 px-3.5 py-3 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                    <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
                      Estimate
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-zinc-400">{item.note}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums">{item.amount}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
