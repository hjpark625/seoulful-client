'use client'

import { useState, useCallback, memo, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar as CalendarIcon, X } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { SEOUL_GU_LIST } from '@/features/events/constants'
import { cn } from '@/lib/cn'

export const SearchFilters = memo(function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Default dates: Today ~ 7 days later
  const defaultStart = useMemo(() => new Date(), [])
  const defaultEnd = useMemo(() => addDays(new Date(), 7), [])

  // Local state initialized from URL or defaults
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [selectedGu, setSelectedGu] = useState<string>(searchParams.get('gu') || 'all')
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
    if (startDate) params.set('start', format(startDate, 'yyyy-MM-dd'))
    if (endDate) params.set('end', format(endDate, 'yyyy-MM-dd'))

    router.push(`/search?${params.toString()}`)
  }, [keyword, selectedGu, startDate, endDate, router])

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          {/* Date Picker */}

          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-bold text-slate-500">기간 설정</label>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-10 flex-1 justify-start rounded-lg border-slate-200 px-3 text-left font-normal shadow-none hover:bg-white',
                      !startDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {startDate ? format(startDate, 'yyyy-MM-dd') : <span>시작일</span>}
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
                      'h-10 flex-1 justify-start rounded-lg border-slate-200 px-3 text-left font-normal shadow-none hover:bg-white',
                      !endDate && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                    {endDate ? format(endDate, 'yyyy-MM-dd') : <span>종료일</span>}
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
