import { NextResponse } from 'next/server'
import { fetchErpProductById, fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { applyImageOverrides } from '@/lib/product-image-overrides'
import { fetchLocalProducts } from '@/lib/products-local'

interface RouteParams {
  params: Promise<{ id: string }>
}

async function findErpProduct(id: string) {
  try {
    const product = await fetchErpProductById(id)
    if (product) return product
  } catch {
    // Deployed ERP may not have /products/:id yet
  }

  const products = await fetchErpProducts()
  return products.find((item) => item.id === id) || null
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    if (isErpConfigured()) {
      const product = await findErpProduct(id)
      if (product) {
        const [withImage] = await applyImageOverrides([product])
        return NextResponse.json({ source: 'erp', product: withImage })
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const products = await applyImageOverrides(await fetchLocalProducts())
    const product = products.find((item) => String(item.id) === String(id)) || null
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ source: 'local', product })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load product'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
