'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './product-card'
import { buttonVariants } from '@/components/ui/button'
import { buildProductSlugMap } from '@/lib/product-slug'
import { fetchProducts, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

export default function ProductList({
  limit = 6,
  showViewMore = true,
  compact = false,
  columns = 3,
  preferLab = false,
}: {
  limit?: number
  showViewMore?: boolean
  compact?: boolean
  columns?: 3 | 4 | 6
  preferLab?: boolean
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const slugMap = buildProductSlugMap(products)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch one extra item so we know whether a "View more" control is needed
        const fetchLimit = limit && limit > 0 ? limit + 1 : undefined
        const data = await fetchProducts({
          limit: fetchLimit,
          lite: true,
          preferLab,
        })
        if (limit && limit > 0 && data.length > limit) {
          setProducts(data.slice(0, limit))
          setHasMore(true)
        } else {
          setProducts(data)
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [limit, preferLab])

  const gridClass =
    columns === 6
      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4'
      : columns === 4
        ? 'grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4'
        : 'grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5'

  if (loading) {
    return (
      <div className={gridClass}>
        {[...Array(limit || 6)].map((_, i) => (
          <div
            key={i}
            className={cn('animate-pulse rounded-xl bg-muted', compact ? 'h-48' : 'h-72 rounded-2xl')}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className={gridClass}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={slugMap.get(product.id) || product.id}
            image={product.image}
            name={product.name}
            description={product.description}
            department={product.department}
            compact={compact}
          />
        ))}
      </div>
      {showViewMore && hasMore ? (
        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href={preferLab ? '/products?department=Laboratory' : '/products'}
            className={cn(buttonVariants({ variant: 'dark', size: 'default' }))}
          >
            View more
          </Link>
        </div>
      ) : null}
    </div>
  )
}
