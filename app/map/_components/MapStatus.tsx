'use client'

import { Loader2, AlertCircle } from 'lucide-react'

export function ErrorView() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-red-50 p-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-600" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-red-900">지도를 불러올 수 없습니다.</h2>
        <p className="text-sm text-red-700">관리자에게 문의해주세요. (API Key Error)</p>
      </div>
    </div>
  )
}

export function LoadingView() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="animate-pulse text-sm font-medium text-slate-500">서울의 낭만을 불러오는 중...</p>
    </div>
  )
}

export function DataLoadingIndicator() {
  return (
    <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
    </div>
  )
}
