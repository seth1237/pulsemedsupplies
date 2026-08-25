import { NextResponse } from 'next/server'
import { fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { applyImageOverrides } from '@/lib/product-image-overrides'
import { fetchLocalProducts } from '@/lib/products-local'
import type { Product } from '@/lib/products'

export const revalidate = 60

function slimProduct(product: Product): Product {
  const description = String(product.description || '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    id: product.id,
    name: product.name,
    department: product.department,
    categoryId: product.categoryId,
    description: description.slice(0, 180),
    specs: '',
    image: product.image,
    sellingPrice: product.sellingPrice,
    productType: product.productType,
  }
}

function withCacheHeaders(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIds = searchParams
      .get('categoryIds')
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    const lite = searchParams.get('lite') === '1' || searchParams.get('lite') === 'true'
    const limitRaw = Number(searchParams.get('limit') || 0)
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 0
    const preferLab =
      searchParams.get('preferLab') === '1' || searchParams.get('preferLab') === 'true'

    let products = isErpConfigured()
      ? await applyImageOverrides(await fetchErpProducts(categoryIds))
      : await applyImageOverrides(await fetchLocalProducts())

    if (preferLab) {
      products = [...products].sort((a, b) => {
        const aLab = /lab(oratory)?/i.test(a.department) ? 0 : 1
        const bLab = /lab(oratory)?/i.test(b.department) ? 0 : 1
        return aLab - bLab
      })
    }

    if (limit > 0) {
      products = products.slice(0, limit)
    }

    if (lite) {
      products = products.map(slimProduct)
    }

    return withCacheHeaders({
      source: isErpConfigured() ? 'erp' : 'local',
      products,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load products'

    // Only fall back to local catalogue when ERP is not the active source
    if (!isErpConfigured()) {
      try {
        const products = await applyImageOverrides(await fetchLocalProducts())
        return withCacheHeaders({
          source: 'local',
          products,
          warning: message,
        })
      } catch {
        // continue to error response
      }
    }

    return NextResponse.json({ error: message }, { status: 502 })
  }
}
