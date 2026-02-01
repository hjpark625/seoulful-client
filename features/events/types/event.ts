/**
 * Supabase DB Raw Data (snake_case)
 */

export interface DbEvent {
  event_id: number
  category_seq: number
  gu_seq: number
  event_name: string
  period: string
  place: string
  org_name: string
  use_target: string
  ticket_price: string
  player: string
  describe: string
  etc_desc: string
  homepage_link: string
  main_img: string
  reg_date: string // Date string
  is_public: boolean
  start_date: string // Date string
  end_date: string // Date string
  theme: string
  latitude: number
  longitude: number
  is_free: boolean
  detail_url: string
  geohash: string
}

/**
 * Frontend Domain Entity (camelCase)
 */
export interface SeoulEvent {
  id: number
  title: string
  description?: string
  category: EventCategory
  startDate: string
  endDate: string
  locationName: string
  latitude: number
  longitude: number
  thumbnailUrl?: string
  externalLink?: string

  // Detailed Info
  isFree?: boolean
  ticketPrice?: string
  useTarget?: string
  player?: string
  orgName?: string
  theme?: string
  etcDescription?: string
}

export interface EventFilter {
  category?: EventCategory[]
  search?: string
  startDate?: string
  endDate?: string
  geohashes?: string[] // 중심 + 인접 8방향 geohash 배열
}

export type EventCategory = 'FESTIVAL' | 'EXHIBITION' | 'PERFORMANCE' | 'OTHER'
