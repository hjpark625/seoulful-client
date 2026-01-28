// @/lib/utils/date.ts
export function getWeekendRange() {
  const now = new Date()
  const day = now.getDay() // 0(일) ~ 6(토)

  // 금요일 0시 계산
  // 오늘이 금(5) -> 0일 후
  // 오늘이 토(6) -> -1일 후
  // 오늘이 일(0) -> -2일 후
  // 오늘이 월~목(1~4) -> 5-day일 후
  const diffToFriday = day === 6 ? -1 : day === 0 ? -2 : 5 - day

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
