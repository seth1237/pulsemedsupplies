import { NextResponse } from 'next/server'
import { fetchErpCategories, fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { fetchLocalProducts } from '@/lib/products-local'
import type { ProductCategory } from '@/lib/products'

function categoriesFromProducts(
  products: { department: string; categoryId?: string }[],
): ProductCategory[] {
  const map = new Map<string, ProductCategory>()
  for (const product of products) {
    const name = product.department?.trim()
    if (!name) continue
    const key = product.categoryId || name
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export async function GET() {
  try {
    if (isErpConfigured()) {
      try {
        const categories = await fetchErpCategories()
        if (categories.length > 0) {
          return NextResponse.json({ source: 'erp', categories })
        }
      } catch {
        // Older ERP builds may not expose /public/categories yet
      }

      const products = await fetchErpProducts()
      return NextResponse.json({
        source: 'erp',
        categories: categoriesFromProducts(products),
      })
    }

    const products = await fetchLocalProducts()
    return NextResponse.json({
      source: 'local',
      categories: categoriesFromProducts(products),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load categories'

    if (!isErpConfigured()) {
      try {
        const products = await fetchLocalProducts()
        return NextResponse.json({
          source: 'local',
          categories: categoriesFromProducts(products),
          warning: message,
        })
      } catch {
        // continue
      }
    }

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
