'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from './product-card'
import { buttonVariants } from '@/components/ui/button'
import { fetchProducts, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(limit ? data.slice(0, limit) : data)
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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            description={product.description}
            department={product.department}
            compact={compact}
          />
        ))}
      </div>
      {limit && showViewMore ? (
        <div className="mt-10 flex justify-center">
          <Link href="/products" className={cn(buttonVariants({ variant: 'dark', size: 'default' }))}>
            View Full Catalogue
          </Link>
        </div>
      ) : null}
    </div>
  )
}
