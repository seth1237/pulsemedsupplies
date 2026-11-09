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
    <aside className={cn('neu-surface rounded-2xl p-4', className)}>
      <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Departments
      </h2>

      <div className="max-h-[min(70vh,520px)] space-y-1 overflow-y-auto pr-1">
        {departments.map((dept) => {
          const active = selected === dept
          return (
            <button
              key={dept}
              type="button"
              onClick={() => onSelect(dept)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                active ? 'bg-secondary text-white' : 'text-ink hover:bg-muted',
              )}
            >
              <span className="pr-2">{dept === 'All' ? 'All Products' : dept}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground',
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
