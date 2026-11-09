'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './product-card'
import { buttonVariants } from '@/components/ui/button'
import { buildProductSlugMap } from '@/lib/product-slug'
import { fetchProducts, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

/** Take products round-robin across departments so no single department dominates. */
function pickAcrossDepartments(products: Product[], limit: number): Product[] {
  const byDepartment = new Map<string, Product[]>()
  for (const product of products) {
    const key = product.department || 'Other'
    const list = byDepartment.get(key)
    if (list) list.push(product)
    else byDepartment.set(key, [product])
  }

  const queues = Array.from(byDepartment.values())
  const picked: Product[] = []
  while (picked.length < limit && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift()
      if (next) picked.push(next)
      if (picked.length >= limit) break
    }
  }
  return picked
}

export default function ProductList({
  limit = 6,
  showViewMore = true,
  compact = false,
  columns = 3,
}: {
  limit?: number
  showViewMore?: boolean
  compact?: boolean
  columns?: 3 | 4 | 6
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const slugMap = buildProductSlugMap(products)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ lite: true })
        if (limit && limit > 0) {
          setProducts(pickAcrossDepartments(data, limit))
          setHasMore(data.length > limit)
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
  }, [limit])

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
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
          >
            <ProductCard
              slug={slugMap.get(product.id) || product.id}
              image={product.image}
              name={product.name}
              description={product.description}
              department={product.department}
              compact={compact}
            />
          </div>
        ))}
      </div>
      {showViewMore && hasMore ? (
        <div className="mt-8 flex justify-center sm:mt-10">
          <Link href="/products" className={cn(buttonVariants({ variant: 'dark', size: 'default' }))}>
            View all products
          </Link>
        </div>
      ) : null}
    </div>
  )
}
