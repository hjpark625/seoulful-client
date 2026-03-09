import type { SeoulEvent, EventFilter, EventsResponse } from '@/features/events/types/event'

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
}

export const getEvents = async (filter?: EventFilter): Promise<EventsResponse> => {
  const params = new URLSearchParams()
  const baseUrl = getBaseUrl()

  if (filter?.category && filter.category.length > 0) {
    params.append('category', filter.category.join(','))
  }
  if (filter?.search) params.append('search', filter.search)
  if (filter?.startDate) params.append('startDate', filter.startDate)
  if (filter?.endDate) params.append('endDate', filter.endDate)
  if (filter?.guSeq) params.append('guSeq', filter.guSeq.toString())
  if (filter?.page) params.append('page', filter.page.toString())
  if (filter?.limit) params.append('limit', filter.limit.toString())
  if (filter?.geohashes && filter.geohashes.length > 0) {
    params.append('geohashes', filter.geohashes.join(','))
  }

  const query = params.toString()
  const url = `${baseUrl}/events${query ? `?${query}&t=${Date.now()}` : `?t=${Date.now()}`}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store', // or 'force-cache' based on requirements
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.statusText}`)
  }

  return res.json()
}

export const getEventDetail = async (eventId: string): Promise<SeoulEvent | null> => {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/events/${eventId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Failed to fetch event detail: ${res.statusText}`)
    }

    const result = await res.json()

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}
