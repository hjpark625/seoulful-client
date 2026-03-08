import { addDays, format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { EventStatus } from '@/features/events/types/event'

const SEOUL_TIME_ZONE = 'Asia/Seoul'
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/
const HAS_TIME_ZONE_REGEX = /(Z|[+-]\d{2}:\d{2})$/

export function formatDate(date: string | Date, includeTime = false): string {
  const d = typeof date === 'string' ? parseISO(date) : date

  // 만약 includeTime이 명시되지 않았는데 시간 정보가 있다면 표시할지 결정하는 로직이 필요할 수 있으나,
  // 요청사항에 따라 "시간이 있을 때는" 자동으로 포맷을 바꾸거나, 호출자가 제어하게 할 수 있음.
  // 여기서는 호출자가 제어하거나, 간단히 시간 성분이 있는지 확인하는 로직을 추가할 수 있음.
  // 하지만 API 데이터가 보통 ISO string이므로 'includeTime' 플래그로 제어하는 것이 명확함.

  // 우선 기본 포맷
  const formatStr = includeTime ? 'yyyy-MM-dd(eee) HH:mm' : 'yyyy-MM-dd(eee)'

  return format(d, formatStr, { locale: ko })
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const partMap = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return {
    year: partMap.year,
    month: partMap.month,
    day: partMap.day,
    hour: partMap.hour,
    minute: partMap.minute,
    second: partMap.second,
  }
}

export function getNowInSeoul(now = new Date()): Date {
  const { year, month, day, hour, minute, second } = getTimeZoneParts(now, SEOUL_TIME_ZONE)
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}+09:00`)
}

export function getTodayInSeoulDateString(now = new Date()): string {
  const { year, month, day } = getTimeZoneParts(now, SEOUL_TIME_ZONE)
  return `${year}-${month}-${day}`
}

function normalizeEventDate(date: string | Date, boundary: 'start' | 'end'): Date {
  if (date instanceof Date) return date

  if (DATE_ONLY_REGEX.test(date)) {
    const time = boundary === 'start' ? '00:00:00.000' : '23:59:59.999'
    return new Date(`${date}T${time}+09:00`)
  }

  const normalized = date.replace(' ', 'T')

  if (HAS_TIME_ZONE_REGEX.test(normalized)) {
    return parseISO(normalized)
  }

  return new Date(`${normalized}+09:00`)
}

export function getEventStatus(startDate: string | Date, endDate: string | Date, now = new Date()): EventStatus {
  const start = normalizeEventDate(startDate, 'start')
  const end = normalizeEventDate(endDate, 'end')
  const current = getNowInSeoul(now)

  if (current < start) return 'UPCOMING'
  if (current > end) return 'ENDED'
  return 'ONGOING'
}

export function getEventStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'UPCOMING':
      return '예정'
    case 'ONGOING':
      return '진행 중'
    case 'ENDED':
      return '종료'
    default:
      return ''
  }
}

export function getWeekendRange() {
  const now = getNowInSeoul()
  const day = now.getDay() // 0(일) ~ 6(토)

  // 금요일 0시 계산
  // 오늘이 금(5) -> 0일 후
  // 오늘이 토(6) -> -1일 후
  // 오늘이 일(0) -> -2일 후
  // 오늘이 월~목(1~4) -> 5-day일 후
  // const diffToFriday = day === 6 ? -1 : day === 0 ? -2 : 5 - day

  // 주의: diffToFriday가 5 - day 로직만 쓰면 월요일(1) 기준 4일 뒤인 금요일이 됨.
  // 이 로직은 "돌아오는 주말"을 의미함.

  const friday = new Date(now)
  friday.setDate(now.getDate() + (day >= 5 || day === 0 ? (day === 6 ? -1 : day === 0 ? -2 : 0) : 5 - day))
  // 로직 수정:
  // - 금, 토, 일이면 이번주 금요일로 설정
  // - 월~목이면 돌아오는 금요일로 설정

  friday.setHours(0, 0, 0, 0)

  // 일요일 23:59:59 계산
  const sunday = new Date(friday)
  sunday.setDate(friday.getDate() + 2)
  sunday.setHours(23, 59, 59, 999)

  return { start: friday, end: sunday }
}

export function addDaysToDateString(dateString: string, amount: number): string {
  const baseDate = normalizeEventDate(dateString, 'start')
  return format(addDays(baseDate, amount), 'yyyy-MM-dd')
}
