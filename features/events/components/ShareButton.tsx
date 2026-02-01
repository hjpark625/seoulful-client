'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeoulEvent } from '@/features/events/types/event'
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

    const host = process.env.NEXT_PUBLIC_API_URL
    const { id, title, description, thumbnailUrl, startDate, endDate, locationName } = event
    const period = `${formatDate(startDate)} ~ ${formatDate(endDate)}`

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: `${period} | ${locationName}\n${description || ''}`.slice(0, 100),
        imageUrl: thumbnailUrl || `${host}/logo.png`, // 기본 이미지 처리
        link: {
          mobileWebUrl: `${host}/events/${id}`,
          webUrl: `${host}/events/${id}`,
        },
      },
      buttons: [
        {
          title: '자세히 보기',
          link: {
            mobileWebUrl: `${host}/events/${id}`,
            webUrl: `${host}/events/${id}`,
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
