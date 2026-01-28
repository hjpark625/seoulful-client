// @/features/events/types/event.ts

export type EventCategory = 'FESTIVAL' | 'EXHIBITION' | 'PERFORMANCE' | 'OTHER'

export interface SeoulEvent {
  id: string
  title: string
  description: string
  category: EventCategory
  start_date: string // ISO Date
  end_date: string // ISO Date
  location_name: string
  latitude: number
  longitude: number
  thumbnail_url?: string
  external_link?: string
  is_published: boolean
  created_at: string
}

export interface EventFilter {
  category?: EventCategory
  isWeekendOnly?: boolean
}
