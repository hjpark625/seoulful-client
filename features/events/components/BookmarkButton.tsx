'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BookmarkButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
      onClick={() => alert('북마크 기능은 준비 중입니다.')}
    >
      <Heart className="h-5 w-5" />
    </Button>
  )
}
