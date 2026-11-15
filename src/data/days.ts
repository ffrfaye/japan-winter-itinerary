import type { StayId } from '@/data/stays'
import type { MapFocus } from '@/lib/map-focus'

export type LodgingStop = {
  stayId: StayId
  action: 'Check in' | 'Check out'
  when: string
}

export type ItineraryDay = {
  id: string
  dateLabel: string
  weekday: string
  short: string
  dayNumber: number
  city: 'Tokyo' | 'Yamanouchi'
  kinds: string[]
  title: string
  summary: string
  logistics: string[]
  fun: string[]
  lodging: LodgingStop[]
  mapFocus: MapFocus
  stayId: string
  stayLabel: string
  jumpLabel: string
  photo?: { src: string; alt: string; caption: string }
}

export type StayGroup = {
  id: string
  label: string
  days: ItineraryDay[]
}

const tokyo1 = 'Tokyo · 27–29 Dec · 3 nights'
const skiWeek = 'Yamanouchi ski week · 30 Dec–5 Jan · 6 nights'
const tokyo2 = 'Tokyo · 5–8 Jan · 4 nights'
const depart = 'Depart · 9 Jan'

export const itineraryDays: ItineraryDay[] = [
  {
    id: '2026-12-27',
    dateLabel: 'Sun 27',
    weekday: 'Sun',
    short: '27 Dec',
    dayNumber: 1,
    city: 'Tokyo',
    kinds: ['Travel'],
    title: 'Land, hotel only',
    summary:
      'Land HND (easier with bags) or NRT. Check in to the Sumida house after 4pm.',
    logistics: [
      'Land HND (easier with bags) or NRT — airport is an open decision.',
      'Send ski bags to the ski house today or 28 Dec via Yamato Ski TA-Q-BIN.',
    ],
    fun: ['Hotel only. No timed tickets.'],
    lodging: [{ stayId: 'sumida', action: 'Check in', when: 'After 4pm' }],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-1',
    stayLabel: tokyo1,
    jumpLabel: 'Sun 27',
  },
  {
    id: '2026-12-28',
    dateLabel: 'Mon 28',
    weekday: 'Mon',
    short: '28 Dec',
    dayNumber: 2,
    city: 'Tokyo',
    kinds: [],
    title: 'Nakano Broadway',
    summary: 'Nakano Broadway + lunch. Reserved koshitsu izakaya — not booked.',
    logistics: [],
    fun: [
      'Nakano Broadway + lunch.',
      'Dinner: reserved koshitsu izakaya — not booked.',
    ],
    lodging: [],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-1',
    stayLabel: tokyo1,
    jumpLabel: 'Mon 28',
  },
  {
    id: '2026-12-29',
    dateLabel: 'Tue 29',
    weekday: 'Tue',
    short: '29 Dec',
    dayNumber: 3,
    city: 'Tokyo',
    kinds: ['Undecided'],
    title: 'teamLab + last indie-shop day',
    summary: 'teamLab Planets or Borderless (timed). Last indie-shop day.',
    logistics: [],
    fun: [
      'teamLab Planets or Borderless (timed) — pick once dates lock.',
      'Afternoon: Donguri + Skytree or Shibuya / Pokémon.',
      'Last indie-shop day.',
    ],
    lodging: [],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-1',
    stayLabel: tokyo1,
    jumpLabel: 'Tue 29',
  },
  {
    id: '2026-12-30',
    dateLabel: 'Wed 30',
    weekday: 'Wed',
    short: '30 Dec',
    dayNumber: 4,
    city: 'Yamanouchi',
    kinds: ['Travel'],
    title: 'Train to the ski house',
    summary:
      'Check out of Sumida by 10am. Train to the Nagano / Yudanaka area. Check in to the ski house after 3pm.',
    logistics: [
      'Hakutaka Tokyo / Ueno → Iiyama or Nagano.',
      'Last mile to the Yomase house is open — not a locked transfer.',
    ],
    fun: [
      'House settle. Short Yudanaka / Shibu walk or day-use onsen if energy allows.',
      'Full group skips Fukuoka this day.',
    ],
    lodging: [
      { stayId: 'sumida', action: 'Check out', when: 'By 10am' },
      { stayId: 'ski', action: 'Check in', when: 'After 3pm' },
    ],
    mapFocus: 'Yamanouchi',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Wed 30',
  },
  {
    id: '2026-12-31',
    dateLabel: 'Thu 31',
    weekday: 'Thu',
    short: '31 Dec',
    dayNumber: 5,
    city: 'Yamanouchi',
    kinds: ['Ski'],
    title: 'Ski Ryuoo · quiet NYE',
    summary: "Ski Ryuoo, the closest hill. Quiet New Year's Eve at the ski house.",
    logistics: [],
    fun: [
      'Ski Ryuoo — keep the day reasonable.',
      'Quiet night at the house. Many restaurants close NYE.',
    ],
    lodging: [],
    mapFocus: 'Yamanouchi',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Thu 31',
  },
  {
    id: '2027-01-01',
    dateLabel: 'Fri 1',
    weekday: 'Fri',
    short: '1 Jan',
    dayNumber: 6,
    city: 'Yamanouchi',
    kinds: ['Ski'],
    title: 'Ski Shiga Kogen',
    summary:
      'Ski Shiga Kogen lower — Sun Valley, Hasuike, or Ichinose. Optional light shrine.',
    logistics: [],
    fun: [
      'Ski Shiga Kogen lower (Sun Valley → Hasuike / Ichinose).',
      'Optional light shrine. Onsen after.',
    ],
    lodging: [],
    mapFocus: 'Yamanouchi',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Fri 1',
  },
  {
    id: '2027-01-02',
    dateLabel: 'Sat 2',
    weekday: 'Sat',
    short: '2 Jan',
    dayNumber: 7,
    city: 'Yamanouchi',
    kinds: [],
    title: 'Snow monkeys · rest day',
    summary: 'Rest day. Jigokudani snow monkey park — close to Yamanouchi.',
    logistics: ['Confirm tickets and parking. Icy trail — winter boots.'],
    fun: [
      'Jigokudani snow monkeys in the morning.',
      'Optional Shibu Onsen stroll or day bath.',
    ],
    lodging: [],
    mapFocus: 'Jigokudani',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Sat 2',
    photo: {
      src: '/snow-monkeys.jpg',
      alt: 'Jigokudani snow monkeys',
      caption: 'Jigokudani snow monkeys',
    },
  },
  {
    id: '2027-01-03',
    dateLabel: 'Sun 3',
    weekday: 'Sun',
    short: '3 Jan',
    dayNumber: 8,
    city: 'Yamanouchi',
    kinds: ['Ski'],
    title: 'Ski Shiga or Madarao',
    summary: 'Ski deeper Shiga if weather is okay, or Madarao.',
    logistics: [],
    fun: ['Deeper Shiga (Takamagahara / Yokoteyama if weather is OK) or Madarao.'],
    lodging: [],
    mapFocus: 'Yamanouchi',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Sun 3',
  },
  {
    id: '2027-01-04',
    dateLabel: 'Mon 4',
    weekday: 'Mon',
    short: '4 Jan',
    dayNumber: 9,
    city: 'Yamanouchi',
    kinds: ['Ski'],
    title: 'Ski day',
    summary: 'Ski day — Ryuoo or another nearby hill. Light day.',
    logistics: [
      'If sending ski bags back to Tokyo, confirm the house can accept a Yamato pickup (need 48–72h).',
    ],
    fun: ['Ski Ryuoo or a nearby hill.'],
    lodging: [],
    mapFocus: 'Yamanouchi',
    stayId: 'yamanouchi',
    stayLabel: skiWeek,
    jumpLabel: 'Mon 4',
  },
  {
    id: '2027-01-05',
    dateLabel: 'Tue 5',
    weekday: 'Tue',
    short: '5 Jan',
    dayNumber: 10,
    city: 'Tokyo',
    kinds: ['Travel', 'Buffer'],
    title: 'Train back · buffer',
    summary:
      'Check out of the ski house by 10am. Midday train back. Check in to KOKORO INN after 4pm.',
    logistics: [
      'Optional short ski AM only if timing allows — unlikely for the full group.',
      'Buffer travel day.',
    ],
    fun: [
      'Tuesday — do not assume Ghibli is open. January 2027 open days are unpublished.',
    ],
    lodging: [
      { stayId: 'ski', action: 'Check out', when: 'By 10am' },
      { stayId: 'kokoro', action: 'Check in', when: 'After 4pm' },
    ],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-2',
    stayLabel: tokyo2,
    jumpLabel: 'Tue 5',
  },
  {
    id: '2027-01-06',
    dateLabel: 'Wed 6',
    weekday: 'Wed',
    short: '6 Jan',
    dayNumber: 11,
    city: 'Tokyo',
    kinds: ['Undecided'],
    title: 'Ghibli if possible · kimono + shrine',
    summary:
      'Ghibli if calendar + 10 Dec Lawson work. Else Inokashira. Afternoon kimono + mid-size shrine.',
    logistics: ['Book kimono in Nov. Boots, not geta.'],
    fun: [
      'Ghibli Museum Mitaka if calendar + 10 Dec Lawson sale work. January 2027 days are unpublished — do not claim tickets exist.',
      'Else Inokashira + Kichijōji + Donguri.',
      'Afternoon kimono rental + mid-size shrine.',
    ],
    lodging: [],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-2',
    stayLabel: tokyo2,
    jumpLabel: 'Wed 6',
  },
  {
    id: '2027-01-07',
    dateLabel: 'Thu 7',
    weekday: 'Thu',
    short: '7 Jan',
    dayNumber: 12,
    city: 'Tokyo',
    kinds: [],
    title: 'Leftovers',
    summary: 'Leftovers: Asakusa, Akihabara, whatever you missed.',
    logistics: [],
    fun: ['Leftovers: Asakusa, Akihabara, whatever you missed.'],
    lodging: [],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-2',
    stayLabel: tokyo2,
    jumpLabel: 'Thu 7',
  },
  {
    id: '2027-01-08',
    dateLabel: 'Fri 8',
    weekday: 'Fri',
    short: '8 Jan',
    dayNumber: 13,
    city: 'Tokyo',
    kinds: ['Buffer'],
    title: 'Empty buffer',
    summary: 'Empty buffer. Confirm flight, collect bags.',
    logistics: ['Confirm flight, collect bags.'],
    fun: ['Empty buffer.'],
    lodging: [],
    mapFocus: 'Tokyo',
    stayId: 'tokyo-2',
    stayLabel: tokyo2,
    jumpLabel: 'Fri 8',
  },
  {
    id: '2027-01-09',
    dateLabel: 'Sat 9',
    weekday: 'Sat',
    short: '9 Jan',
    dayNumber: 14,
    city: 'Tokyo',
    kinds: ['Travel', 'Undecided'],
    title: 'Fly',
    summary:
      'Check out of KOKORO INN by 10am. Fly HND or NRT — airport is an open decision.',
    logistics: ['Fly HND or NRT — airport is an open decision.'],
    fun: [],
    lodging: [{ stayId: 'kokoro', action: 'Check out', when: 'By 10am' }],
    mapFocus: 'Tokyo',
    stayId: 'depart',
    stayLabel: depart,
    jumpLabel: 'Sat 9',
  },
]

export function groupDays(days: ItineraryDay[]): StayGroup[] {
  const groups: StayGroup[] = []
  for (const day of days) {
    const last = groups[groups.length - 1]
    if (last && last.id === day.stayId) last.days.push(day)
    else groups.push({ id: day.stayId, label: day.stayLabel, days: [day] })
  }
  return groups
}
