import { cn } from '@/lib/cn'

interface FilterChipProps {
  label: string
  isActive: boolean
  onClick: () => void
  className?: string
}

export function FilterChip({ label, isActive, onClick, className }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap shadow-sm transition-all active:scale-95',
        isActive
          ? 'bg-blue-600 text-white ring-2 shadow-blue-200 ring-blue-300 ring-offset-1'
          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        className,
      )}
    >
      <span>{label}</span>
    </button>
  )
}
