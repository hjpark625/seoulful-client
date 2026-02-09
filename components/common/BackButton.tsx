'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  fallbackUrl?: string
}

export function BackButton({ fallbackUrl = '/search' }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // 히스토리가 있으면 뒤로가기, 없으면 fallbackUrl로 이동
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full bg-white/50 backdrop-blur-sm hover:bg-white sm:bg-transparent"
      onClick={handleBack}
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  )
}
