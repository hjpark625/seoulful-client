import { getCategoryStyle } from '@/features/events/constants'
import { cn } from '@/lib/cn'

interface CategoryBadgeProps {
  category: string
  className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const style = getCategoryStyle(category)

  return (
    <div
      className={cn(
        'inline-block rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm',
        style.color,
        className,
      )}
    >
      {style.label}
    </div>
  )
}
