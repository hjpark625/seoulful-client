import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface EventInfoRowProps {
  icon: LucideIcon
  children: React.ReactNode
  className?: string
  iconClassName?: string
}

export function EventInfoRow({ icon: Icon, children, className, iconClassName }: EventInfoRowProps) {
  return (
    <div className={cn('flex items-start gap-2 text-sm text-gray-600', className)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconClassName)} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
