import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Plus, Upload } from 'lucide-react'
import {
  avatarClass,
  cityLabel,
  formatFlightDate,
  initialsFor,
  legsFromParsed,
  people,
  peopleLabel,
  type FlightEntry,
  type FlightLeg,
} from '@/lib/flight-record'
import { parseFlightImage, prepareFlightImage, saveFlight } from '@/lib/flights-context'

type Stage = 'idle' | 'reading' | 'found' | 'failed' | 'manual'

const emptyLeg = (): FlightLeg => ({
  airport: '',
  date: '',
  time: '',
  flight: '',
  airline: '',
})

export function FlightSheet({
  prefill,
  onClose,
  onSaved,
}: {
  prefill: string
  onClose: () => void
  onSaved: (label: string, count: number) => void
}) {
  const [name, setName] = useState(prefill)
  const [withNames, setWithNames] = useState<string[]>([])
  const [stage, setStage] = useState<Stage>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [arrival, setArrival] = useState<FlightLeg | null>(null)
  const [departure, setDeparture] = useState<FlightLeg | null>(null)
  const [editing, setEditing] = useState({ arrival: false, departure: false })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const companions = people.filter((person) => person !== name)

  async function onFile(file: File | undefined) {
    if (!file) return
    const looksImage =
      file.type.startsWith('image/') || /\.hei[cf]$/i.test(file.name)
    if (!looksImage) {
      setStage('failed')
      return
    }
    setStage('reading')
    setEditing({ arrival: false, departure: false })
    try {
      const prepared = await prepareFlightImage(file)
      setImage(prepared)
      setPreview(URL.createObjectURL(prepared))
      const parsed = await parseFlightImage(prepared)
      const legs = legsFromParsed(parsed.flights)
      setArrival(legs.arrival)
      setDeparture(legs.departure)
      if (parsed.name && !name.trim()) {
        const match = people.find(
          (person) => person.toLowerCase() === parsed.name?.toLowerCase(),
        )
        setName(match ?? parsed.name)
      }
      setStage('found')
    } catch {
      setStage('failed')
    }
  }

  function updateLeg(kind: 'arrival' | 'departure', patch: Partial<FlightLeg>) {
    const current = kind === 'arrival' ? arrival : departure
    const next = { ...(current ?? emptyLeg()), ...patch }
    if (kind === 'arrival') setArrival(next)
    else setDeparture(next)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const who = name.trim()
    if (!who || busy) return
    if (stage !== 'found' && stage !== 'manual') return
    const hasArrival = Boolean(arrival && (arrival.flight || arrival.date || arrival.airport))
    const hasDeparture = Boolean(
      departure && (departure.flight || departure.date || departure.airport),
    )
    if (!hasArrival && !hasDeparture) return
    setBusy(true)
    const group = [who, ...withNames.filter((person) => person !== who)]
    try {
      await saveFlight({
        people: group,
        arrival: hasArrival ? arrival : null,
        departure: hasDeparture ? departure : null,
        image,
      })
      onSaved(peopleLabel(group), group.length)
    } finally {
      setBusy(false)
    }
  }

  const showSubmit = stage === 'found' || stage === 'manual'
  const ready =
    showSubmit &&
    Boolean(name.trim()) &&
    Boolean(
      (arrival && (arrival.flight || arrival.date || arrival.airport)) ||
        (departure && (departure.flight || departure.date || departure.airport)),
    )

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/40"
        aria-label="Close add flight"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-flight-title"
        className="relative z-[2001] max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white pb-4 shadow-lg"
      >
        <div className="sticky top-0 z-10 bg-white pt-2.5 pb-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-zinc-300" />
        </div>
        <form className="px-5 pt-2" onSubmit={submit}>
          <h2 id="add-flight-title" className="text-lg font-semibold tracking-tight">
            Add your flight
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-zinc-500">
            Upload a screenshot and we’ll read the details. No account needed.
          </p>
          <label htmlFor="flight-name" className="mt-4 block text-[13px] font-medium">
            Name
          </label>
          <input
            id="flight-name"
            value={name}
            onChange={(event) => {
              const next = event.target.value
              setName(next)
              setWithNames((current) => current.filter((person) => person !== next))
            }}
            required
            placeholder="Your name"
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-950/10"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {people.map((person) => {
              const on = name === person
              return (
                <button
                  key={person}
                  type="button"
                  onClick={() => {
                    setName(person)
                    setWithNames((current) => current.filter((item) => item !== person))
                  }}
                  className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${
                    on
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  {person}
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-[13px] font-medium">
            Flying with <span className="font-normal text-zinc-400">optional</span>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {companions.map((person) => {
              const on = withNames.includes(person)
              return (
                <button
                  key={person}
                  type="button"
                  onClick={() =>
                    setWithNames((current) =>
                      on ? current.filter((item) => item !== person) : [...current, person],
                    )
                  }
                  className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${
                    on
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700'
                  }`}
                >
                  {person}
                </button>
              )
            })}
          </div>
          <input
            id="flight-shot"
            type="file"
            accept="image/png,image/jpeg,image/heic,image/heif,.heic,.heif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              void onFile(file)
            }}
          />
          <div className="mt-5">
            {stage === 'idle' ? <DropZone /> : null}
            {stage === 'reading' ? <Reading preview={preview} /> : null}
            {stage === 'found' ? (
              <Found
                preview={preview}
                arrival={arrival}
                departure={departure}
                editing={editing}
                onReplace={() => document.getElementById('flight-shot')?.click()}
                onToggle={(kind) =>
                  setEditing((current) => ({ ...current, [kind]: !current[kind] }))
                }
                onChange={updateLeg}
              />
            ) : null}
            {stage === 'failed' ? (
              <Failed
                onRetry={() => document.getElementById('flight-shot')?.click()}
                onManual={() => {
                  setArrival((current) => current ?? emptyLeg())
                  setDeparture((current) => current ?? emptyLeg())
                  setEditing({ arrival: true, departure: true })
                  setStage('manual')
                }}
              />
            ) : null}
            {stage === 'manual' ? (
              <Manual
                arrival={arrival}
                departure={departure}
                onChange={updateLeg}
                onUpload={() => document.getElementById('flight-shot')?.click()}
              />
            ) : null}
          </div>
          {showSubmit ? (
            <div className="sticky bottom-0 -mx-5 mt-6 border-t border-zinc-200 bg-white px-5 pt-3">
              <button
                type="submit"
                disabled={!ready || busy}
                className="flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
              >
                {stage === 'manual' ? 'Add my flight' : 'Looks right, add my flight'}
              </button>
            </div>
          ) : null}
        </form>
      </div>
    </div>,
    document.body,
  )
}

function DropZone() {
  return (
    <label
      htmlFor="flight-shot"
      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-9 text-center"
    >
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
        <Upload className="size-5 text-zinc-700" aria-hidden />
      </span>
      <p className="mt-3 max-w-[16rem] text-[15px] leading-snug font-semibold tracking-tight">
        Upload your flight screenshot. We’ll read the details
      </p>
      <span className="mt-4 inline-flex items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white">
        Choose a screenshot
      </span>
      <p className="mt-2 text-[11px] text-zinc-400">PNG, JPG, or HEIC · tap or drop</p>
    </label>
  )
}

function Reading({ preview }: { preview: string | null }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3.5 py-3">
      <Thumb src={preview} spinning />
      <div>
        <p className="text-sm font-medium">Reading your flight…</p>
        <p className="mt-0.5 text-[12px] text-zinc-400">This usually takes a few seconds.</p>
      </div>
    </div>
  )
}

function Failed({ onRetry, onManual }: { onRetry: () => void; onManual: () => void }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3.5 py-4">
      <p className="text-sm font-semibold tracking-tight">Couldn’t read that</p>
      <p className="mt-1 text-[13px] leading-snug text-zinc-500">
        Try a clearer shot of the confirmation, or enter the times yourself.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white"
      >
        Upload again
      </button>
      <p className="mt-3 text-center">
        <button
          type="button"
          onClick={onManual}
          className="text-[13px] font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-2"
        >
          Enter manually
        </button>
      </p>
    </div>
  )
}

function Found({
  preview,
  arrival,
  departure,
  editing,
  onReplace,
  onToggle,
  onChange,
}: {
  preview: string | null
  arrival: FlightLeg | null
  departure: FlightLeg | null
  editing: { arrival: boolean; departure: boolean }
  onReplace: () => void
  onToggle: (kind: 'arrival' | 'departure') => void
  onChange: (kind: 'arrival' | 'departure', patch: Partial<FlightLeg>) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="flex items-center gap-3 border-b border-zinc-100 px-3.5 py-3">
        <Thumb src={preview} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">We found</p>
          <p className="mt-0.5 truncate text-[13px] text-zinc-500">Flight screenshot</p>
        </div>
        <button
          type="button"
          onClick={onReplace}
          className="shrink-0 text-[12px] font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2"
        >
          Replace
        </button>
      </div>
      <LegBlock
        kind="arrival"
        leg={arrival}
        editing={editing.arrival}
        onToggle={() => onToggle('arrival')}
        onChange={(patch) => onChange('arrival', patch)}
      />
      <LegBlock
        kind="departure"
        leg={departure}
        editing={editing.departure}
        onToggle={() => onToggle('departure')}
        onChange={(patch) => onChange('departure', patch)}
        bordered
      />
    </div>
  )
}

function Manual({
  arrival,
  departure,
  onChange,
  onUpload,
}: {
  arrival: FlightLeg | null
  departure: FlightLeg | null
  onChange: (kind: 'arrival' | 'departure', patch: Partial<FlightLeg>) => void
  onUpload: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-3.5 py-3">
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          Enter manually
        </p>
        <button
          type="button"
          onClick={onUpload}
          className="text-[12px] font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2"
        >
          Upload a screenshot
        </button>
      </div>
      <div className="px-3.5 py-3">
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">Arrival</p>
        <EditFields kind="arrival" leg={arrival} onChange={(patch) => onChange('arrival', patch)} />
      </div>
      <div className="border-t border-zinc-100 px-3.5 py-3">
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">Departure</p>
        <EditFields
          kind="departure"
          leg={departure}
          onChange={(patch) => onChange('departure', patch)}
        />
      </div>
    </div>
  )
}

function LegBlock({
  kind,
  leg,
  editing,
  onToggle,
  onChange,
  bordered,
}: {
  kind: 'arrival' | 'departure'
  leg: FlightLeg | null
  editing: boolean
  onToggle: () => void
  onChange: (patch: Partial<FlightLeg>) => void
  bordered?: boolean
}) {
  return (
    <div className={`px-3.5 py-3 ${bordered ? 'border-t border-zinc-100' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
          {kind === 'arrival' ? 'Arrival' : 'Departure'}
        </p>
        <button
          type="button"
          onClick={onToggle}
          className="text-[12px] font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-2"
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <EditFields kind={kind} leg={leg} onChange={onChange} />
      ) : (
        <LegSummary kind={kind} leg={leg} />
      )}
    </div>
  )
}

function LegSummary({ kind, leg }: { kind: 'arrival' | 'departure'; leg: FlightLeg | null }) {
  if (!leg || (!leg.flight && !leg.airport && !leg.date)) {
    return <p className="mt-1.5 text-[13px] text-zinc-400">No {kind} found.</p>
  }
  const title = [leg.flight, leg.airport].filter(Boolean).join(' · ')
  const when = [leg.date ? formatFlightDate(leg.date) : '', leg.time].filter(Boolean).join(' · ')
  const other =
    kind === 'arrival'
      ? leg.fromAirport
        ? `from ${cityLabel(leg.fromAirport)}`
        : ''
      : leg.toAirport
        ? `to ${cityLabel(leg.toAirport)}`
        : ''
  const meta = [other, leg.airline].filter(Boolean).join(' · ')
  return (
    <div className="mt-1.5">
      <p className="text-sm font-medium">{title || 'Details to confirm'}</p>
      {when ? <p className="mt-0.5 text-[13px] text-zinc-500">{when}</p> : null}
      {meta ? <p className="mt-0.5 text-[11px] text-zinc-400">{meta}</p> : null}
    </div>
  )
}

function EditFields({
  kind,
  leg,
  onChange,
}: {
  kind: 'arrival' | 'departure'
  leg: FlightLeg | null
  onChange: (patch: Partial<FlightLeg>) => void
}) {
  const current = leg ?? emptyLeg()
  const otherKey = kind === 'arrival' ? 'fromAirport' : 'toAirport'
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <div className="col-span-2">
        <p className="mb-1 text-[11px] font-medium text-zinc-500">Airport</p>
        <div className="inline-flex rounded-lg bg-zinc-100 p-0.5">
          {(['NRT', 'HND'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onChange({ airport: code })}
              className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${
                current.airport === code
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
      <Field label="Date">
        <input
          type="date"
          value={current.date}
          onChange={(event) => onChange({ date: event.target.value })}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Time">
        <input
          type="time"
          value={current.time}
          onChange={(event) => onChange({ time: event.target.value })}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Flight #">
        <input
          value={current.flight}
          onChange={(event) => onChange({ flight: event.target.value.toUpperCase() })}
          placeholder="NH7"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm uppercase"
        />
      </Field>
      <Field label={kind === 'arrival' ? 'From' : 'To'}>
        <input
          value={current[otherKey] ?? ''}
          onChange={(event) =>
            onChange({ [otherKey]: event.target.value.toUpperCase() })
          }
          placeholder="SFO"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm uppercase"
        />
      </Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-zinc-500">{label}</span>
      {children}
    </label>
  )
}

function Thumb({ src, spinning }: { src: string | null; spinning?: boolean }) {
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-zinc-200">
      {src ? <img src={src} alt="" className="size-full object-cover" /> : null}
      {spinning ? (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/35">
          <Loader2 className="size-5 animate-spin text-white" aria-hidden />
        </div>
      ) : null}
    </div>
  )
}

export function AddFlightButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white"
    >
      <Plus className="size-4" aria-hidden />
      Add your flight
    </button>
  )
}

export function StillToAdd({
  names,
  onPick,
}: {
  names: string[]
  onPick: (name: string) => void
}) {
  if (names.length === 0) return null
  return (
    <section className="mt-6">
      <h3 className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
        Still to add
      </h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {names.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onPick(name)}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white py-1 pr-2.5 pl-1 text-[12px] font-medium text-zinc-700"
          >
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full text-[9px] font-medium text-white ${avatarClass(name)}`}
            >
              {initialsFor(name)}
            </span>
            {name}
          </button>
        ))}
      </div>
    </section>
  )
}

export function FlightGroups({
  flights,
  kind,
}: {
  flights: FlightEntry[]
  kind: 'arrival' | 'departure'
}) {
  const groups = new Map<string, FlightEntry[]>()
  for (const flight of flights) {
    const leg = flight[kind]
    if (!leg?.date) continue
    const list = groups.get(leg.date) ?? []
    list.push(flight)
    groups.set(leg.date, list)
  }
  const dates = [...groups.keys()].sort()
  if (dates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-3.5 py-4 text-[13px] text-zinc-400">
        None added yet.
      </div>
    )
  }
  return (
    <div className="space-y-2">
      {dates.map((date) => (
        <div key={date} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-3.5 py-2">
            <p className="text-[11px] font-medium tracking-wider text-zinc-400 uppercase">
              {formatFlightDate(date)}
            </p>
          </div>
          <ul className="divide-y divide-zinc-100">
            {(groups.get(date) ?? [])
              .sort((a, b) => (a[kind]?.time ?? '').localeCompare(b[kind]?.time ?? ''))
              .map((flight) => (
                <FlightRow key={`${flight.id}-${kind}`} flight={flight} kind={kind} />
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function FlightRow({
  flight,
  kind,
}: {
  flight: FlightEntry
  kind: 'arrival' | 'departure'
}) {
  const leg = flight[kind]
  if (!leg) return null
  const main = [leg.flight, leg.airport, leg.time].filter(Boolean).join(' · ')
  const sub =
    kind === 'arrival'
      ? [
          leg.airline,
          leg.fromAirport
            ? `leaves ${leg.fromAirport} ${leg.fromDate ? formatFlightDate(leg.fromDate) : ''} ${leg.fromTime ?? ''}`.trim()
            : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : leg.toAirport
        ? `Lands ${leg.toAirport}${leg.toTime ? ` ${leg.toTime}` : ''}${
            leg.toDate && leg.toDate === leg.date ? ' (same day)' : ''
          }`
        : ''
  return (
    <li className="flex items-center gap-3 px-3.5 py-3">
      <div className="flex shrink-0 -space-x-1.5">
        {flight.people.slice(0, 3).map((person) => (
          <span
            key={person}
            title={person}
            className={`${
              flight.people.length > 1 ? 'size-7 text-[10px]' : 'size-8 text-[11px]'
            } inline-flex items-center justify-center rounded-full font-medium text-white ring-2 ring-white ${avatarClass(person)}`}
          >
            {initialsFor(person)}
          </span>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {peopleLabel(flight.people)}
          {flight.nickname ? (
            <span className="ml-1.5 text-[11px] font-medium text-zinc-400">{flight.nickname}</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-zinc-500">
          {main || 'Details to confirm'}
        </p>
        {sub ? <p className="mt-0.5 text-[11px] leading-snug text-zinc-400">{sub}</p> : null}
      </div>
      {flight.screenshotPath ? (
        <img
          src={`/api/flights/image?id=${encodeURIComponent(flight.id)}`}
          alt=""
          className="size-10 shrink-0 rounded-md border border-zinc-200 object-cover"
        />
      ) : null}
    </li>
  )
}
