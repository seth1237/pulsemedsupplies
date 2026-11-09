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
              compact ? 'p-2.5 sm:p-3' : 'p-2.5 sm:p-4',
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
      </div>

      {compact ? (
        <div className="flex flex-1 flex-col p-2.5 sm:p-3">
          <h3 className="line-clamp-2 font-display text-xs font-semibold tracking-tight text-ink sm:text-sm">
            {name}
          </h3>
          <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-muted-foreground">
            {department || description}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col border-t border-border/70 p-3 sm:p-4">
          {department ? (
            <p className="mb-1 line-clamp-1 text-[10px] sm:mb-1.5 font-semibold uppercase tracking-[0.14em] text-secondary sm:text-[11px]">
              {department}
            </p>
          ) : null}
          <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug tracking-tight text-ink sm:text-[15px]">
            {name}
          </h3>
          <p className="mt-1.5 line-clamp-2 hidden text-xs leading-relaxed text-muted-foreground sm:block sm:text-[13px]">
            {description}
          </p>
          <span className="mt-auto hidden items-center gap-1 pt-3 text-xs font-semibold text-secondary sm:inline-flex">
            View details
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      )}
    </Link>
  )
}
