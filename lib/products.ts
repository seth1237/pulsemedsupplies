import { absoluteUrl } from '@/lib/site'

export interface Product {
  id: string
  name: string
  department: string
  categoryId?: string
  description: string
  specs: string
  image: string
  sellingPrice?: number
  productType?: string
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
}

export interface ProductsPayload {
  products: Product[]
}

export async function fetchProducts(options?: {
  categoryIds?: string[]
  limit?: number
  lite?: boolean
  preferLab?: boolean
}): Promise<Product[]> {
  const params = new URLSearchParams()
  if (options?.categoryIds?.length) {
    params.set('categoryIds', options.categoryIds.join(','))
  }
  if (options?.limit && options.limit > 0) {
    params.set('limit', String(options.limit))
  }
  if (options?.lite) params.set('lite', '1')
  if (options?.preferLab) params.set('preferLab', '1')

  const query = params.toString()
  const response = await fetch(`/api/catalog/products${query ? `?${query}` : ''}`, {
    // Browser + CDN can reuse catalogue responses briefly
    next: { revalidate: 60 },
  })
  const text = await response.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Failed to load products (invalid response)')
  }
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load products')
  }
  return (data?.products || []) as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const response = await fetch(`/api/catalog/products/${encodeURIComponent(id)}`)
  if (response.status === 404) {
    return null
  }
  const text = await response.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Failed to load product (invalid response)')
  }
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load product')
  }
  return (data?.product || null) as Product | null
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const response = await fetch('/api/catalog/categories')
  const text = await response.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Failed to load categories (invalid response)')
  }
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to load categories')
  }
  return (data?.categories || []) as ProductCategory[]
}

export const LOGO_URL = '/logos/pulsemed.png'
export const LOGO_SQUARE_URL = '/logos/logopulsemedsquare.png'
export const WHATSAPP_NUMBER = '254100020464'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const PHONE_TEL = 'tel:+254100020464'
export const EMAIL_MAILTO = 'mailto:pulsemedsolutions1@gmail.com'
export const SUPPORT_PHONE_DISPLAY = '+254 100 020464'
export const WHATSAPP_PHONE_DISPLAY = '+254 100 020464'
export const EMAIL_DISPLAY = 'pulsemedsolutions1@gmail.com'

/** Build a WhatsApp deep link with a prefilled quote for a product. */
export function buildWhatsAppQuoteUrl(
  product: Pick<Product, 'name' | 'id'>,
): string {
  const name = String(product.name || '').trim() || 'this product'
  const id = String(product.id || '').trim()
  const productUrl = id ? absoluteUrl(`/products/${encodeURIComponent(id)}`) : ''
  const text = productUrl
    ? `Hey, I am requesting a quote for ${name}.\n\n${productUrl}`
    : `Hey, I am requesting a quote for ${name}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
