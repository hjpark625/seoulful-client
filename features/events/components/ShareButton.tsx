'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeoulEvent } from '@/features/events/types/event'
import { getEventImageUrl, getEventPageUrl } from '@/features/events/utils/share'
import { formatDate } from '@/lib/utils/date'

interface ShareButtonProps {
  event: SeoulEvent
}

export function ShareButton({ event }: ShareButtonProps) {
  const handleShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.')
      return
    }

    const { id, title, description, thumbnailUrl, startDate, endDate, locationName } = event
    const period = `${formatDate(startDate)} ~ ${formatDate(endDate)}`
    const eventUrl = getEventPageUrl(id)

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: `${period} | ${locationName}\n${description || ''}`.slice(0, 100),
        imageUrl: getEventImageUrl(thumbnailUrl),
        link: {
          mobileWebUrl: eventUrl,
          webUrl: eventUrl,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: eventUrl,
            webUrl: eventUrl,
          },
        },
      ],
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
      onClick={handleShare}
    >
      <Share2 className="h-5 w-5" />
    </Button>
  )
}
