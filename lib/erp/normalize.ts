import type { Product, ProductCategory } from '@/lib/products'
import type { ErpCategoryRaw, ErpProductRaw } from './types'
import { getErpBaseUrl } from './config'

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i

function resolveAssetUrl(path: string | undefined, erpBaseUrl: string): string {
  if (!path) return ''
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('/')) {
    if (path.startsWith('/uploads/') || path.startsWith('/api/')) {
      return `${erpBaseUrl.replace(/\/$/, '')}${path}`
    }
    return path
  }
  return `${erpBaseUrl.replace(/\/$/, '')}/${path}`
}

function categoryLabel(raw: ErpProductRaw): string {
  if (raw.categoryName?.trim()) return raw.categoryName.trim()
  const cat = String(raw.category || '').trim()
  if (cat && !OBJECT_ID_RE.test(cat)) return cat
  // Until ERP public categories / categoryName enrichment is deployed
  if (cat && OBJECT_ID_RE.test(cat)) return `Category ${cat.slice(-6)}`
  return 'Uncategorized'
}

function buildSpecs(raw: ErpProductRaw): string {
  const parts: string[] = []
  if (raw.manufacturer && raw.manufacturer.toLowerCase() !== 'none') {
    parts.push(`Manufacturer: ${raw.manufacturer}`)
  }
  if (raw.productType) {
    parts.push(`Type: ${raw.productType}`)
  }
  if (raw.unit) {
    parts.push(`Unit: ${raw.unit}`)
  }
  if (raw.description?.trim()) {
    parts.push(raw.description.trim())
  }
  return parts.join('\n')
}

export function normalizeErpProduct(
  raw: ErpProductRaw,
  erpBaseUrl = getErpBaseUrl(),
): Product | null {
  const id = String(raw._id || raw.id || raw.productId || '').trim()
  const name = String(raw.name || raw.productName || '').trim()

  if (!id || !name || raw.isActive === false) {
    return null
  }

  const description = String(raw.description || name).trim()
  const imagePath = raw.imageUrl || raw.image

  return {
    id,
    name,
    department: categoryLabel(raw),
    categoryId: raw.category ? String(raw.category) : undefined,
    description,
    specs: buildSpecs(raw) || description,
    image: resolveAssetUrl(imagePath, erpBaseUrl),
    sellingPrice:
      typeof raw.sellingPrice === 'number' ? raw.sellingPrice : undefined,
    productType: raw.productType,
  }
}

export function normalizeErpProducts(rawList: ErpProductRaw[]): Product[] {
  const baseUrl = getErpBaseUrl()
  return rawList
    .map((raw) => normalizeErpProduct(raw, baseUrl))
    .filter((product): product is Product => product !== null)
}

export function normalizeErpCategory(raw: ErpCategoryRaw): ProductCategory | null {
  const id = String(raw._id || raw.id || '').trim()
  const name = String(raw.name || '').trim()
  if (!id || !name) return null
  return {
    id,
    name,
    description: raw.description ? String(raw.description) : undefined,
  }
}

export function normalizeErpCategories(rawList: ErpCategoryRaw[]): ProductCategory[] {
  return rawList
    .map(normalizeErpCategory)
    .filter((category): category is ProductCategory => category !== null)
}

export function extractListData<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.products)) return record.products as T[]
    if (Array.isArray(record.categories)) return record.categories as T[]
    if (record.data && typeof record.data === 'object') {
      const nested = record.data as Record<string, unknown>
      if (Array.isArray(nested.products)) return nested.products as T[]
      if (Array.isArray(nested.categories)) return nested.categories as T[]
    }
  }
  return []
}
