'use client'

import { useState, useCallback, memo, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar as CalendarIcon, X, Shapes } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { SEOUL_GU_LIST } from '@/features/events/constants'
import type { EventCategory } from '@/features/events/types/event'
import { cn } from '@/lib/cn'

const CATEGORY_OPTIONS: { label: string; value: EventCategory }[] = [
  { label: '축제', value: 'FESTIVAL' },
  { label: '전시', value: 'EXHIBITION' },
  { label: '공연', value: 'PERFORMANCE' },
  { label: '기타', value: 'OTHER' },
]

export const SearchFilters = memo(function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Default dates: Today ~ 7 days later
  const defaultStart = useMemo(() => new Date(), [])
  const defaultEnd = useMemo(() => addDays(new Date(), 7), [])

  // Local state initialized from URL or defaults
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [selectedGu, setSelectedGu] = useState<string>(searchParams.get('gu') || 'all')
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all')
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('start') ? new Date(searchParams.get('start')!) : defaultStart,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('end') ? new Date(searchParams.get('end')!) : defaultEnd,
  )

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()

    if (keyword.trim()) params.set('q', keyword.trim())
    if (selectedGu !== 'all') params.set('gu', selectedGu)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (startDate) params.set('start', format(startDate, 'yyyy-MM-dd'))
    if (endDate) params.set('end', format(endDate, 'yyyy-MM-dd'))

    router.push(`/search?${params.toString()}`)
  }, [keyword, selectedGu, selectedCategory, startDate, endDate, router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2 rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="relative flex-1">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="행사 명칭을 입력하세요"
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pr-10 focus-visible:bg-white"
          />

          {keyword && (
            <button onClick={() => setKeyword('')} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button onClick={handleSearch} className="h-11 rounded-xl bg-blue-600 px-6 font-bold">
          검색
        </Button>
      </div>

      {/* Filters Area */}

      <div className="mt-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Region Select */}

          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-bold text-slate-500">지역 선택</label>

            <Select value={selectedGu} onValueChange={setSelectedGu}>
              <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none focus:ring-1 focus:ring-blue-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />

                  <SelectValue placeholder="지역 선택" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">지역 전체</SelectItem>

                {SEOUL_GU_LIST.map((gu) => (
                  <SelectItem key={gu.id} value={gu.id.toString()}>
                    {gu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}

          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-bold text-slate-500">카테고리 선택</label>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white shadow-none focus:ring-1 focus:ring-blue-500">
                <div className="flex items-center gap-2">
                  <Shapes className="h-4 w-4 text-slate-400" />

                  <SelectValue placeholder="카테고리 선택" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">카테고리 전체</SelectItem>

                {CATEGORY_OPTIONS.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}

          <div className="min-w-0 space-y-1.5">
            <label className="ml-1 text-xs font-bold text-slate-500">기간 설정</label>

            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-10 min-w-0 justify-start rounded-lg border-slate-200 px-2 text-left font-normal shadow-none hover:bg-white sm:px-3',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    <span className="truncate">{startDate ? format(startDate, 'yyyy-MM-dd') : '시작일'}</span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={ko} />
                </PopoverContent>
              </Popover>

              <span className="text-slate-400">~</span>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-10 min-w-0 justify-start rounded-lg border-slate-200 px-2 text-left font-normal shadow-none hover:bg-white sm:px-3',
                      !endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    <span className="truncate">{endDate ? format(endDate, 'yyyy-MM-dd') : '종료일'}</span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={ko}
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})
