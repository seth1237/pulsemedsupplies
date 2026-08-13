import { NextResponse } from 'next/server'
import { fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { fetchLocalProducts } from '@/lib/products-local'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryIds = searchParams.get('categoryIds')
      ?.split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    if (isErpConfigured()) {
      const products = await fetchErpProducts(categoryIds)
      return NextResponse.json({
        source: 'erp',
        products,
      })
    }

    const products = await fetchLocalProducts()
    return NextResponse.json({
      source: 'local',
      products,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load products'

    // Fall back to local catalogue if ERP is unreachable
    try {
      const products = await fetchLocalProducts()
      return NextResponse.json({
        source: 'local',
        products,
        warning: message,
      })
    } catch {
      return NextResponse.json({ error: message }, { status: 502 })
    }
  }
}
