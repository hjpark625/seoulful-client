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
    let query = supabase.from('events').select('*')

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

    // 4. Weekend Logic
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

    const { data, error } = await query

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

    return NextResponse.json(events)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
