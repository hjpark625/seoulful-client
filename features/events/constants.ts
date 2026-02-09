// @/features/events/constants.ts

import type { EventCategory } from '@/features/events/types/event'

export const EVENT_STYLES = {
  FESTIVAL: {
    label: '축제',
    icon: '🎉',
    color: 'bg-orange-500',
    ring: 'ring-orange-200',
    shadow: 'shadow-orange-500/40',
  },
  EXHIBITION: {
    label: '전시',
    icon: '🖼️',
    color: 'bg-indigo-500',
    ring: 'ring-indigo-200',
    shadow: 'shadow-indigo-500/40',
  },
  PERFORMANCE: {
    label: '공연',
    icon: '🎤',
    color: 'bg-rose-500',
    ring: 'ring-rose-200',
    shadow: 'shadow-rose-500/40',
  },
  OTHER: {
    label: '기타',
    icon: '📍',
    color: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    shadow: 'shadow-emerald-500/40',
  },
} as const

// 기본값 (매칭되는 게 없을 때)
export const DEFAULT_EVENT_STYLE = EVENT_STYLES.OTHER

export const getCategoryStyle = (category?: EventCategory) => {
  if (!category) return DEFAULT_EVENT_STYLE
  return EVENT_STYLES[category] || DEFAULT_EVENT_STYLE
}

// DB Category Seq -> Frontend Category Mapping
export const mapCategorySeqToCategory = (seq: number): EventCategory => {
  if ([9, 10, 11, 12, 13].includes(seq)) return 'FESTIVAL'
  if (seq === 8) return 'EXHIBITION'
  if ([2, 3, 4, 5, 6, 14, 15].includes(seq)) return 'PERFORMANCE'
  return 'OTHER'
}

export const SEOUL_GU_MAP: Record<number, string> = {
  1: '강북구',
  2: '강남구',
  3: '강동구',
  4: '강서구',
  5: '관악구',
  6: '광진구',
  7: '구로구',
  8: '금천구',
  9: '노원구',
  10: '도봉구',
  11: '동대문구',
  12: '동작구',
  13: '마포구',
  14: '서대문구',
  15: '서초구',
  16: '성동구',
  17: '성북구',
  18: '송파구',
  19: '양천구',
  20: '영등포구',
  21: '용산구',
  22: '은평구',
  23: '종로구',
  24: '중구',
  25: '중랑구',
  26: '기타(서울대공원 등)',
}

export const SEOUL_GU_LIST = Object.entries(SEOUL_GU_MAP).map(([id, name]) => ({
  id: parseInt(id),
  name,
}))
