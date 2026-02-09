import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { getWeekendRange } from '@/lib/utils/date'
import type { DbEvent, SeoulEvent, EventCategory } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'
import { sanitizeNull } from '@/lib/utils/string'

const VALID_CATEGORIES: EventCategory[] = ['FESTIVAL', 'EXHIBITION', 'PERFORMANCE', 'OTHER']
const GEOHASH_REGEX = /^[0123456789bcdefghjkmnpqrstuvwxyz]+$/i
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 300

// Helper to map Frontend Category -> DB Sequences
const getCategorySeqs = (category: EventCategory): number[] => {
  switch (category) {
    case 'FESTIVAL':
      return [9, 10, 11, 12, 13]
    case 'EXHIBITION':
      return [8]
    case 'PERFORMANCE':
      return [2, 3, 4, 5, 6, 7, 14, 15]
    case 'OTHER':
      return [1, 16]
    default:
      return []
  }
}

const parsePositiveInt = (value: string | null, fallback: number, max?: number): number => {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  if (max && parsed > max) return max
  return parsed
}

const sanitizeSearchTerm = (value: string | null): string | null => {
  if (!value) return null
  const trimmed = value.trim().slice(0, 100)
  if (!trimmed) return null

  // Supabase or-filter 구문 파싱 충돌 방지를 위해 예약 문자를 제거
  return trimmed.replace(/[(),]/g, ' ')
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract Query Params
    const categories =
      searchParams
        .get('category')
        ?.split(',')
        .filter((value): value is EventCategory => VALID_CATEGORIES.includes(value as EventCategory)) || []
    const search = sanitizeSearchTerm(searchParams.get('search'))
    const isWeekendOnly = searchParams.get('weekend') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const guSeq = parsePositiveInt(searchParams.get('guSeq'), 0)
    const geohashes =
      searchParams
        .get('geohashes')
        ?.split(',')
        .map((hash) => hash.trim().toLowerCase())
        .filter((hash) => hash.length > 0 && GEOHASH_REGEX.test(hash)) || []

    // Pagination Params
    const page = parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE)
    const limit = parsePositiveInt(searchParams.get('limit'), DEFAULT_LIMIT, MAX_LIMIT)
    const offset = (page - 1) * limit

    let query = supabase.from('events').select('*', { count: 'exact' })

    // 2. Category Filter
    if (categories.length > 0) {
      const allSeqs = categories.flatMap((cat) => getCategorySeqs(cat))
      if (allSeqs.length > 0) {
        query = query.in('category_seq', allSeqs)
      }
    }

    // 3. Search Filter
    if (search) {
      query = query.or(`event_name.ilike.%${search}%,org_name.ilike.%${search}%`)
    }

    // 4. Gu Filter
    if (guSeq > 0) {
      query = query.eq('gu_seq', guSeq)
    }

    // 5. Geohash Filter (For Map)
    if (geohashes.length > 0) {
      // Use prefix matching (LIKE) instead of exact match (IN)
      // because DB might store longer precision geohashes than client.
      const orCondition = geohashes.map((hash) => `geohash.like.${hash}%`).join(',')
      query = query.or(orCondition)
    }

    // 6. Weekend Logic
    if (isWeekendOnly) {
      const { start, end } = getWeekendRange()
      query = query.lte('start_date', end.toISOString()).gte('end_date', start.toISOString())
    }

    // 5. Date Range (explicit)
    if (startDate) {
      query = query.gte('end_date', startDate)
    }
    if (endDate) {
      query = query.lte('start_date', endDate)
    }

    // Pagination
    const { data, error, count } = await query
      .order('start_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const dbEvents = data as DbEvent[]

    // Transform to CamelCase
    const events: SeoulEvent[] = dbEvents.map((event) => ({
      id: event.event_id,
      title: event.event_name,
      description: sanitizeNull(event.describe),
      category: mapCategorySeqToCategory(event.category_seq),
      startDate: event.start_date,
      endDate: event.end_date,
      locationName: sanitizeNull(event.place) || sanitizeNull(event.org_name) || '장소 정보 없음',
      latitude: event.latitude,
      longitude: event.longitude,
      thumbnailUrl: event.main_img,
      externalLink: event.homepage_link || event.detail_url || '',
      // Detailed Info
      isFree: event.is_free,
      ticketPrice: sanitizeNull(event.ticket_price),
      useTarget: sanitizeNull(event.use_target),
      player: sanitizeNull(event.player),
      orgName: sanitizeNull(event.org_name),
      theme: sanitizeNull(event.theme),
      etcDescription: sanitizeNull(event.etc_desc),
      displayTime: sanitizeNull(event.display_time),
    }))

    return NextResponse.json({
      events,
      totalCount: count || 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
