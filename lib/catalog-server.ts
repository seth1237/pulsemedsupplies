import { fetchErpProductById, fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { applyImageOverrides } from '@/lib/product-image-overrides'
import type { Product } from '@/lib/products'
import { fetchLocalProducts } from '@/lib/products-local'

export async function getCatalogProductById(id: string): Promise<Product | null> {
  if (isErpConfigured()) {
    try {
      const product = await fetchErpProductById(id)
      if (product) {
        const [withImage] = await applyImageOverrides([product])
        return withImage
      }
    } catch {
      // Deployed ERP may not have /products/:id yet
    }

    const products = await fetchErpProducts()
    const found = products.find((item) => item.id === id)
    if (found) {
      const [withImage] = await applyImageOverrides([found])
      return withImage
    }
    return null
  }

  const products = await applyImageOverrides(await fetchLocalProducts())
  return products.find((item) => String(item.id) === String(id)) || null
}
