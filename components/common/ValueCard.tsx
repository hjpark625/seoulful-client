// @/components/common/ValueCard.tsx
interface ValueCardProps {
  icon: React.ReactNode
  title: string
  desc: string
}

export function ValueCard({ icon, title, desc }: ValueCardProps) {
  return (
    <div className="flex flex-col items-start rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">{icon}</div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  )
}
