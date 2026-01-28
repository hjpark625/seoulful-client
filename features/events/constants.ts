// @/features/events/constants.ts

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
