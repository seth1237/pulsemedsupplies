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

export async function fetchProducts(categoryIds?: string[]): Promise<Product[]> {
  const params = new URLSearchParams()
  if (categoryIds?.length) {
    params.set('categoryIds', categoryIds.join(','))
  }
  const query = params.toString()
  const response = await fetch(`/api/catalog/products${query ? `?${query}` : ''}`)
  if (!response.ok) {
    throw new Error('Failed to load products')
  }
  const data = await response.json()
  return (data.products || []) as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const response = await fetch(`/api/catalog/products/${encodeURIComponent(id)}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to load product')
  }
  const data = await response.json()
  return (data.product || null) as Product | null
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const response = await fetch('/api/catalog/categories')
  if (!response.ok) {
    throw new Error('Failed to load categories')
  }
  const data = await response.json()
  return (data.categories || []) as ProductCategory[]
}

export const LOGO_URL = '/logos/pulsemed.png'
export const LOGO_SQUARE_URL = '/logos/logopulsemedsquare.png'
export const WHATSAPP_URL = 'https://wa.me/254100020464'
export const PHONE_TEL = 'tel:+254100020464'
export const EMAIL_MAILTO = 'mailto:pulsemedsolutions1@gmail.com'
export const SUPPORT_PHONE_DISPLAY = '+254 100 020464'
export const WHATSAPP_PHONE_DISPLAY = '+254 100 020464'
export const EMAIL_DISPLAY = 'pulsemedsolutions1@gmail.com'
