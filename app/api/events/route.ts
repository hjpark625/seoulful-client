import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { getWeekendRange } from '@/lib/utils/date'
import type { DbEvent, SeoulEvent, EventCategory } from '@/features/events/types/event'
import { mapCategorySeqToCategory } from '@/features/events/constants'

// Helper to map Frontend Category -> DB Sequences
const getCategorySeqs = (category: EventCategory): number[] => {
  switch (category) {
    case 'FESTIVAL':
      return [9, 10, 11, 12, 13]
    case 'EXHIBITION':
      return [8]
    case 'PERFORMANCE':
      return [2, 3, 4, 5, 6, 14, 15]
    case 'OTHER':
      return [1, 7, 16]
    default:
      return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract Query Params
    const categories = searchParams.get('category')?.split(',') as EventCategory[] | undefined
    const search = searchParams.get('search')
    const isWeekendOnly = searchParams.get('weekend') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const query = supabase.from('events').select('*')

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

    // 6. Limit
    query = query.limit(100)

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
      description: event.describe,
      category: mapCategorySeqToCategory(event.category_seq),
      startDate: event.start_date,
      endDate: event.end_date,
      locationName: event.org_name, // Fallback since specific place name is missing in type
      latitude: event.latitude,
      longitude: event.longitude,
      thumbnailUrl: event.main_img,
      externalLink: event.hompage_link,
      // Detailed Info
      isFree: event.is_free,
      ticketPrice: event.ticket_price,
      useTarget: event.use_target,
      player: event.player,
      orgName: event.org_name,
      theme: event.theme,
      etcDescription: event.etc_desc,
    }))

    // console.log('API Response Sample (First Item):', events[0])

    return NextResponse.json(events)
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
