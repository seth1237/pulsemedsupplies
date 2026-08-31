import type { Product } from '@/lib/products'

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i

export function isProductObjectId(value: string): boolean {
  return OBJECT_ID_RE.test(value.trim())
}

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function buildProductSlugMap(products: Product[]): Map<string, string> {
  const baseCounts = new Map<string, number>()
  const slugById = new Map<string, string>()

  for (const product of products) {
    const base = slugifyProductName(product.name) || 'product'
    baseCounts.set(base, (baseCounts.get(base) || 0) + 1)
  }

  for (const product of products) {
    const base = slugifyProductName(product.name) || 'product'
    const slug =
      (baseCounts.get(base) || 0) > 1 ? `${base}-${product.id.slice(-6).toLowerCase()}` : base
    slugById.set(product.id, slug)
  }

  return slugById
}

export function getProductSlug(product: Pick<Product, 'id' | 'name'>, products?: Product[]): string {
  if (products?.length) {
    return buildProductSlugMap(products).get(product.id) || slugifyProductName(product.name) || product.id
  }

  return slugifyProductName(product.name) || product.id
}

export function getProductPath(
  product: Pick<Product, 'id' | 'name'>,
  products?: Product[],
): string {
  return `/products/${getProductSlug(product, products)}`
}

export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  const normalized = slug.trim().toLowerCase()
  const slugMap = buildProductSlugMap(products)
  return products.find((product) => slugMap.get(product.id)?.toLowerCase() === normalized)
}

export function resolveProductFromParam(products: Product[], param: string): Product | undefined {
  const value = param.trim()
  if (!value) return undefined

  if (isProductObjectId(value)) {
    return products.find((product) => product.id === value)
  }

  return findProductBySlug(products, value)
}
