import { NextResponse } from 'next/server'
import { fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { applyImageOverrides } from '@/lib/product-image-overrides'
import { fetchLocalProducts } from '@/lib/products-local'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIds = searchParams
      .get('categoryIds')
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    if (isErpConfigured()) {
      const products = await applyImageOverrides(await fetchErpProducts(categoryIds))
      return NextResponse.json({
        source: 'erp',
        products,
      })
    }

    const products = await applyImageOverrides(await fetchLocalProducts())
    return NextResponse.json({
      source: 'local',
      products,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load products'

    // Only fall back to local catalogue when ERP is not the active source
    if (!isErpConfigured()) {
      try {
        const products = await applyImageOverrides(await fetchLocalProducts())
        return NextResponse.json({
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
