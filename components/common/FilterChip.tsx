// @/components/common/FilterChip.tsx
interface FilterChipProps {
  label: string
  isActive: boolean
  onClick: () => void
  activeIcon?: string
  inactiveIcon?: string
}

export function FilterChip({ label, isActive, onClick, activeIcon = '✨', inactiveIcon = '📅' }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold whitespace-nowrap shadow-lg transition-all active:scale-95 ${
        isActive
          ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2'
          : 'bg-white text-slate-700 hover:bg-slate-50'
      } `}
    >
      {isActive ? (
        <>
          <span>{activeIcon}</span>
          <span>{label} (ON)</span>
        </>
      ) : (
        <>
          <span>{inactiveIcon}</span>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
