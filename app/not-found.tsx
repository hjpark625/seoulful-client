import Link from 'next/link'
import { MapPinOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 rounded-full bg-slate-100 p-6">
        <MapPinOff className="h-12 w-12 text-slate-400" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">길을 잃으셨나요?</h2>
      <p className="mb-8 text-slate-600">
        요청하신 페이지를 찾을 수 없습니다.
        <br />
        삭제되었거나 주소가 잘못 입력되었을 수 있어요.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline">홈으로 가기</Button>
        </Link>
        <Link href="/map">
          <Button>지도 보러 가기</Button>
        </Link>
      </div>
    </div>
  )
}
