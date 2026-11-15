/**
 * Booked stays, in date order.
 * Invite links, listing pages, guest counts, hosts, and times live here only.
 * Headcount is 8 / 10 / 9 people (Sumida, Alpine Cottage, KOKORO INN).
 */
export const stays = {
  sumida: {
    id: 'sumida',
    cityChip: 'Tokyo',
    timelineCity: 'Tokyo',
    timelineDates: '27–30 Dec',
    shortName: 'Sumida house',
    titleEn: 'Japanese-modern × Scandinavian house',
    titleJp:
      '和モダンX北欧スタイル｜80㎡超の一軒家｜最大10名｜公園・桜を望む｜浅草・スカイツリー近郊',
    area: 'Higashimukōjima, Sumida, Tokyo',
    photo: '/lodging/sumida.jpg',
    photoPos: '50% 38%',
    dateLine: 'Sun 27 Dec – Wed 30 Dec 2026',
    checkIn: 'after 4pm',
    checkOut: 'by 10am',
    nights: 3,
    people: 8,
    guests: '8 people',
    host: 'Haru',
    invite: 'https://www.airbnb.com/l/F73W8xFV',
    listing: 'https://www.airbnb.com/rooms/1739051335302845037',
    note: null,
    /** Higashimukōjima neighborhood. The listing does not publish a street address. */
    lat: 35.72433,
    lng: 139.81932,
    coordApprox: true,
  },
  ski: {
    id: 'ski',
    cityChip: 'Nagano',
    timelineCity: 'Ski',
    timelineDates: '30 Dec–5 Jan',
    shortName: 'Alpine Cottage',
    titleEn: 'Japanese Ski Home for 12, Nozawa & Shiga Kogen',
    titleJp: '和風の貸切別荘12名／テラス・ハンモック／竜王・志賀・野沢',
    area: 'Yomase, Yamanouchi, Nagano',
    photo: '/lodging/ski.jpg',
    photoPos: '50% 42%',
    dateLine: 'Wed 30 Dec 2026 – Tue 5 Jan 2027',
    checkIn: 'after 3pm',
    checkOut: 'by 10am',
    nights: 6,
    people: 10,
    guests: '10 people',
    host: 'Alpine Cottage-MARU',
    invite: 'https://www.airbnb.com/l/PAKj2Brw',
    listing: 'https://www.airbnb.com/rooms/1536728419485230997',
    note: 'Free parking for 3 cars',
    /** Yomase quarter, not the cottage door. The listing does not publish a street address. */
    lat: 36.78421,
    lng: 138.4342,
    coordApprox: true,
  },
  kokoro: {
    id: 'kokoro',
    cityChip: 'Tokyo',
    timelineCity: 'Tokyo',
    timelineDates: '5–9 Jan',
    shortName: 'KOKORO INN',
    titleEn: '5-min walk to Sensō-ji, 4-story house, 2 bathrooms',
    titleJp:
      'KOKORO INN 東京｜浅草寺徒歩5分｜四階建て一戸建て・二浴室付きラグジュアリーハウス',
    area: 'Asakusa, Taito, Tokyo',
    photo: '/lodging/kokoro.jpg',
    photoPos: '50% 50%',
    dateLine: 'Tue 5 Jan – Sat 9 Jan 2027',
    checkIn: 'after 4pm',
    checkOut: 'by 10am',
    nights: 4,
    people: 9,
    guests: '9 people',
    host: '千夏',
    invite: 'https://www.airbnb.com/l/HX0YVhIg',
    listing: 'https://www.airbnb.com/rooms/1584476764724908680',
    note: null,
    /** Asakusa neighborhood, a short walk from Sensō-ji. The listing does not publish a street address. */
    lat: 35.7176,
    lng: 139.79756,
    coordApprox: true,
  },
} as const

export const stayOrder = ['sumida', 'ski', 'kokoro'] as const

export type StayId = keyof typeof stays

export type Stay = (typeof stays)[StayId]

export function stayById(id: StayId): Stay {
  return stays[id]
}

export function stayNeighborhood(stay: Stay) {
  return stay.area.split(',')[0] ?? stay.area
}

/** Where the group sleeps that night. Jan 9 is a morning checkout, so no stay is emphasized. */
export function stayForNight(dayId: string): StayId | null {
  if (dayId >= '2026-12-27' && dayId <= '2026-12-29') return 'sumida'
  if (dayId >= '2026-12-30' && dayId <= '2027-01-04') return 'ski'
  if (dayId >= '2027-01-05' && dayId <= '2027-01-08') return 'kokoro'
  return null
}
