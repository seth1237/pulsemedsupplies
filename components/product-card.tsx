import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  id: string | number
  image: string
  name: string
  description: string
  department?: string
  className?: string
  compact?: boolean
}

export default function ProductCard({
  id,
  image,
  name,
  description,
  department,
  className,
  compact = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className={cn(
        'neu-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5',
        compact ? 'rounded-xl' : 'rounded-2xl',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-[#e4ebf3]',
          compact ? 'aspect-square' : 'aspect-[4/3]',
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes={
              compact
                ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
                : '(max-width: 768px) 50vw, 33vw'
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eef3f8] to-secondary/10">
            <span className="font-display text-xs font-medium text-muted-foreground">PULSEMED</span>
          </div>
        )}
        {department && !compact ? (
          <span className="absolute left-3 top-3 rounded-lg bg-[#eef3f8]/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink shadow-[3px_3px_6px_rgb(163_177_198_/_0.25),_-2px_-2px_5px_rgb(255_255_255_/_0.8)] backdrop-blur">
            {department}
          </span>
        ) : null}
      </div>

      <div className={cn('flex flex-1 flex-col', compact ? 'p-2.5 sm:p-3' : 'p-4 sm:p-5')}>
        <div className={cn('flex items-start justify-between gap-2', compact ? 'mb-0' : 'mb-3')}>
          <h3
            className={cn(
              'font-display font-semibold tracking-tight text-ink line-clamp-2',
              compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg',
            )}
          >
            {name}
          </h3>
          {!compact ? (
            <span className="neu-btn mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-secondary group-hover:neu-btn-accent group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          ) : null}
        </div>
        {!compact ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : (
          <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
            {department || description}
          </p>
        )}
      </div>
    </Link>
  )
}
