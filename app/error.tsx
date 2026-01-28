'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 에러 발생 시 로깅 서비스로 전송 가능
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 animate-pulse rounded-full bg-red-50 p-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">잠시 문제가 발생했어요.</h2>
      <p className="mb-8 text-slate-600">
        일시적인 오류일 수 있습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          다시 시도하기
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = '/')}>
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  )
}
