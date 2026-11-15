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
    kinds: [],
    title: 'Check in',
    summary: 'Arrive and check in at the Sumida house after 4pm.',
    logistics: [],
    fun: [],
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
    title: 'Open day',
    summary: 'Open day. No planned activities.',
    logistics: [],
    fun: [],
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
    kinds: ['Maybe'],
    title: 'Maybe: double teamLab (Planets + Borderless) + Acid City day',
    summary: 'Maybe: double teamLab (Planets + Borderless) + Acid City day.',
    logistics: [],
    fun: [],
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
      'Last mile to the Yomase house is open, not a locked transfer.',
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
    title: 'Ski day + NYE party at the ski house',
    summary: 'Ski day: Ryuoo or another nearby hill. Evening NYE party at the ski house.',
    logistics: [],
    fun: [
      'Ski Ryuoo or a nearby hill.',
      'Evening NYE party at the ski house.',
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
      'Ski Shiga Kogen lower: Sun Valley, Hasuike, or Ichinose. Optional light shrine.',
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
    summary: 'Rest day. Jigokudani snow monkey park, close to Yamanouchi.',
    logistics: ['Confirm tickets and parking. Icy trail, so wear winter boots.'],
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
    summary: 'Ski day: Ryuoo or another nearby hill. Light day.',
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
      'Optional short ski in the morning only if timing allows, which is unlikely for the full group.',
      'Buffer travel day.',
    ],
    fun: [
      'On Tuesday, do not assume Ghibli is open. January 2027 open days are unpublished.',
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
    kinds: [],
    title: 'Ghibli Museum Mitaka tour with local guide (booked)',
    summary:
      'Booked GetYourGuide tour with Yummy Guide. English-speaking guide, about 1.5 hours, then free time. Entry time TBD. Night at KOKORO INN, Asakusa.',
    logistics: [
      'Night at KOKORO INN, Asakusa.',
      'Asakusa to Mitaka by train is about 1 hour: JR Chuo line to Mitaka, then about a 15 min walk along Tamagawa Josui, or the community bus.',
      'Meet outside the museum entrance, 1-1-83 Shimorenjaku, Mitaka, Tokyo 181-0013. No pickup. The tour ends at the museum.',
      'Entry time is TBD, set by Yummy Guide. Possible slots are 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, or 16:00 JST. They message the meeting time once it is confirmed.',
      'Bring a passport or ID matching the booking name, comfy shoes, and cash plus a card. The GetYourGuide QR is not the museum ticket; the guide hands out tickets at the meeting point.',
      'No food, drinks, or photos inside the museum.',
    ],
    fun: [
      'Booked via GetYourGuide, run by Yummy Guide. English-speaking guide, about 1.5 hours: guided highlights, then free time in the rooftop garden, cafe, and shop.',
      '9 adults.',
      'Afternoon kimono and a mid-size shrine still fit if the entry slot is a morning one.',
    ],
    lodging: [],
    mapFocus: 'Ghibli',
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
    kinds: [],
    title: 'Open day',
    summary: 'Open day. Confirm the flight and collect bags.',
    logistics: ['Confirm the flight and collect bags.'],
    fun: [],
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
    kinds: [],
    title: 'Open day',
    summary:
      'Open day. Check out of KOKORO INN by 10am. Fly HND or NRT. The airport is an open decision.',
    logistics: ['Fly HND or NRT. The airport is an open decision.'],
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
