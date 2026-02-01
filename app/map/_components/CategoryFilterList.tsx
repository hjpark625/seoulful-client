import { FilterChip } from '@/components/common/FilterChip'
import type { EventCategory } from '@/features/events/types/event'

const CATEGORY_FILTERS: { label: string; value: EventCategory }[] = [
  { label: '🎉 축제', value: 'FESTIVAL' },
  { label: '🎭 공연', value: 'PERFORMANCE' },
  { label: '🖼️ 전시', value: 'EXHIBITION' },
  { label: '🎸 기타', value: 'OTHER' },
]

interface CategoryFilterListProps {
  activeCategories?: EventCategory[]
  onSelect: (category: EventCategory) => void
}

export function CategoryFilterList({ activeCategories, onSelect }: CategoryFilterListProps) {
  return (
    <div className="scrollbar-hide absolute top-4 left-1/2 z-10 flex w-max max-w-[90%] -translate-x-1/2 gap-1.5 overflow-x-auto px-4">
      {CATEGORY_FILTERS.map((cat) => (
        <FilterChip
          key={cat.value}
          label={cat.label}
          isActive={activeCategories?.includes(cat.value) ?? false}
          onClick={() => onSelect(cat.value)}
        />
      ))}
    </div>
  )
}
