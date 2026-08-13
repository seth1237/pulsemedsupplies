'use client'

import { cn } from '@/lib/utils'

interface CategorySidebarProps {
  departments: string[]
  selected: string
  onSelect: (dept: string) => void
  counts: Record<string, number>
  className?: string
}

export default function CategorySidebar({
  departments,
  selected,
  onSelect,
  counts,
  className,
}: CategorySidebarProps) {
  return (
    <aside className={cn('neu-surface rounded-2xl p-4 sm:p-5', className)}>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Categories
        </p>
        <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
          Shop by department
        </h2>
      </div>

      <div className="max-h-[min(70vh,520px)] space-y-2 overflow-y-auto pr-1">
        {departments.map((dept) => {
          const active = selected === dept
          return (
            <button
              key={dept}
              type="button"
              onClick={() => onSelect(dept)}
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors',
                active
                  ? 'bg-secondary text-white'
                  : 'bg-[#e8eef5] text-ink hover:bg-[#dfe8f2]',
              )}
            >
              <span className="pr-2">{dept === 'All' ? 'All Categories' : dept}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-white/80 text-muted-foreground',
                )}
              >
                {counts[dept] ?? 0}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
