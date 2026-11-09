'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  slug: string
  image: string
  name: string
  description: string
  department?: string
  className?: string
  compact?: boolean
}

export default function ProductCard({
  slug,
  image,
  name,
  description,
  department,
  className,
  compact = false,
}: ProductCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link
      href={`/products/${slug}`}
      className={cn(
        'neu-surface group flex h-full flex-col overflow-hidden transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-[#c5d3e1] hover:shadow-lg',
        compact ? 'rounded-xl' : 'rounded-2xl',
        className,
      )}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-[#f4f7fb]',
          // Fixed frame so square, landscape, and portrait photos all sit evenly
          'aspect-[4/3]',
        )}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            onLoad={() => setLoaded(true)}
            className={cn(
              'img-fade object-contain group-hover:scale-[1.04]',
              loaded && 'is-loaded',
              compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4',
            )}
            sizes={
              compact
                ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
                : '(max-width: 768px) 50vw, 33vw'
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-xs font-medium text-muted-foreground">PULSEMED</span>
          </div>
        )}
        {department && !compact ? (
          <span className="absolute left-3 top-3 z-10 rounded-md border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
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
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-secondary transition-colors group-hover:border-secondary group-hover:bg-secondary group-hover:text-white">
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
