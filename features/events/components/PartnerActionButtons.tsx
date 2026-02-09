'use client'

import { Button } from '@/components/ui/button'

export function ParkingButton() {
  const handleParkingClick = () => {
    // TODO: 모두의주차장 딥링크 또는 제휴 페이지 연결
    alert('모두의주차장 연동 기능은 준비 중입니다.')
  }

  return (
    <Button
      variant="outline"
      className="flex h-auto w-full flex-col gap-1 border-indigo-200 bg-indigo-50 py-3 transition-all hover:border-indigo-300 hover:bg-indigo-100"
      onClick={handleParkingClick}
    >
      <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase">Partner</span>
      <span className="text-sm font-bold text-indigo-700">모두의주차장에서 주차권 구매하기</span>
    </Button>
  )
}
