import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

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

export function getWeekendRange() {
  const now = new Date()
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
