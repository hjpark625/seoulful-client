const getSiteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const getAbsoluteUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  return new URL(path, getSiteUrl()).toString()
}

export const getEventImageUrl = (thumbnailUrl?: string) => {
  if (!thumbnailUrl) return `${getSiteUrl()}/logo.png`

  return getAbsoluteUrl(thumbnailUrl)
}

export const getEventPageUrl = (eventId: number | string) => `${getSiteUrl()}/events/${eventId}`
