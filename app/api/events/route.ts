import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { getWeekendRange } from '@/lib/utils/date'
import type { DbEvent, SeoulEvent, EventCategory } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'
import { sanitizeNull } from '@/lib/utils/string'

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

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract Query Params
    const categories = searchParams.get('category')?.split(',') as EventCategory[] | undefined
    const search = searchParams.get('search')
    const isWeekendOnly = searchParams.get('weekend') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const guSeq = searchParams.get('guSeq')
    const geohashes = searchParams.get('geohashes')?.split(',')

    // Pagination Params
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase.from('events').select('*', { count: 'exact' })

    // 2. Category Filter
    if (categories && categories.length > 0) {
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
    if (guSeq) {
      query = query.eq('gu_seq', parseInt(guSeq))
    }

    // 5. Geohash Filter (For Map)
    if (geohashes && geohashes.length > 0) {
      // Filter out empty strings if any
      const validGeohashes = geohashes.filter((g) => g.trim() !== '')
      if (validGeohashes.length > 0) {
        // Use prefix matching (LIKE) instead of exact match (IN)
        // Because DB might store longer precision geohashes (e.g., 7 chars) while client sends 5 chars.
        const orCondition = validGeohashes.map((hash) => `geohash.like.${hash}%`).join(',')
        query = query.or(orCondition)
      }
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
