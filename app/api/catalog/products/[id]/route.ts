import { NextResponse } from 'next/server'
import { getCatalogProductByParam } from '@/lib/catalog-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id: ref } = await params
    const product = await getCatalogProductByParam(ref)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ source: 'catalog', product })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load product'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
