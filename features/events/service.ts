import type { SeoulEvent, EventFilter } from '@/features/events/types/event'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  return 'http://localhost:3000'
}

export const getEvents = async (filter?: EventFilter): Promise<SeoulEvent[]> => {
  const params = new URLSearchParams()
  const baseUrl = getBaseUrl()

  if (filter?.category && filter.category.length > 0) {
    params.append('category', filter.category.join(','))
  }
  if (filter?.search) params.append('search', filter.search)
  if (filter?.startDate) params.append('startDate', filter.startDate)
  if (filter?.endDate) params.append('endDate', filter.endDate)
  if (filter?.geohashes && filter.geohashes.length > 0) {
    params.append('geohashes', filter.geohashes.join(','))
  }

  const res = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
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
    const res = await fetch(`${baseUrl}/api/events/${eventId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Failed to fetch event detail: ${res.statusText}`)
    }

    return res.json()
  } catch (error) {
    console.error(error)
    return null
  }
}
