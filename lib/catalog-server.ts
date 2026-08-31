import { fetchErpProductById, fetchErpProducts } from '@/lib/erp/client'
import { isErpConfigured } from '@/lib/erp/config'
import { applyImageOverrides } from '@/lib/product-image-overrides'
import {
  findProductBySlug,
  isProductObjectId,
  resolveProductFromParam,
} from '@/lib/product-slug'
import type { Product } from '@/lib/products'
import { fetchLocalProducts } from '@/lib/products-local'

async function loadCatalogProducts(): Promise<Product[]> {
  if (isErpConfigured()) {
    return applyImageOverrides(await fetchErpProducts())
  }
  return applyImageOverrides(await fetchLocalProducts())
}

export async function getCatalogProducts(): Promise<Product[]> {
  return loadCatalogProducts()
}

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
  }

  const products = await loadCatalogProducts()
  return products.find((item) => item.id === id) || null
}

export async function getCatalogProductByParam(param: string): Promise<Product | null> {
  const value = param.trim()
  if (!value) return null

  if (isProductObjectId(value)) {
    return getCatalogProductById(value)
  }

  const products = await loadCatalogProducts()
  return resolveProductFromParam(products, value) || findProductBySlug(products, value) || null
}
