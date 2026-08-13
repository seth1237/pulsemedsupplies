import type { Product, ProductCategory } from '@/lib/products'
import {
  getErpBaseUrl,
  getErpHeaders,
  getErpOrgId,
  getErpRequestTimeoutMs,
  isErpConfigured,
} from './config'
import {
  extractListData,
  normalizeErpCategories,
  normalizeErpProduct,
  normalizeErpProducts,
} from './normalize'
import type { ErpCategoryRaw, ErpListResponse, ErpProductRaw } from './types'

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) return {} as T
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('ERP returned an invalid response')
  }
}

async function erpFetch(path: string, init?: RequestInit): Promise<Response> {
  const baseUrl = getErpBaseUrl()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), getErpRequestTimeoutMs())

  try {
    return await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...getErpHeaders(),
        ...(init?.headers || {}),
      },
      signal: controller.signal,
      cache: 'no-store',
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`ERP request timed out contacting ${baseUrl}`)
    }
    throw new Error(
      `Cannot reach ERP at ${baseUrl}. Start the ERP or set ERP_API_BASE_URL.`,
    )
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchErpProducts(categoryIds?: string[]): Promise<Product[]> {
  if (!isErpConfigured()) {
    throw new Error('ERP_ORG_ID is not configured')
  }

  const params = new URLSearchParams()
  const orgId = getErpOrgId()
  if (orgId) params.set('orgId', orgId)
  if (categoryIds?.length) params.set('categoryIds', categoryIds.join(','))

  const query = params.toString()
  const response = await erpFetch(`/api/stock/public/products${query ? `?${query}` : ''}`)
  const payload = await parseJson<ErpListResponse<ErpProductRaw[]> | ErpProductRaw[]>(response)

  if (!response.ok) {
    const message =
      (!Array.isArray(payload) && payload.message) ||
      `ERP returned ${response.status} while loading products`
    throw new Error(message)
  }

  if (!Array.isArray(payload) && payload.success === false) {
    throw new Error(payload.message || 'ERP rejected the products request')
  }

  return normalizeErpProducts(extractListData<ErpProductRaw>(payload))
}

export async function fetchErpProductById(id: string): Promise<Product | null> {
  if (!isErpConfigured()) {
    throw new Error('ERP_ORG_ID is not configured')
  }

  const orgId = getErpOrgId()
  const params = new URLSearchParams()
  if (orgId) params.set('orgId', orgId)

  const response = await erpFetch(
    `/api/stock/public/products/${encodeURIComponent(id)}?${params.toString()}`,
  )

  if (response.status === 404) {
    return null
  }

  const payload = await parseJson<ErpListResponse<ErpProductRaw> | ErpProductRaw>(response)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && payload.message) ||
      `ERP returned ${response.status} while loading product`
    throw new Error(String(message))
  }

  const raw =
    payload && typeof payload === 'object' && 'data' in payload && payload.data
      ? (payload.data as ErpProductRaw)
      : (payload as ErpProductRaw)

  return normalizeErpProduct(raw)
}

export async function fetchErpCategories(): Promise<ProductCategory[]> {
  if (!isErpConfigured()) {
    throw new Error('ERP_ORG_ID is not configured')
  }

  const orgId = getErpOrgId()
  const params = new URLSearchParams()
  if (orgId) params.set('orgId', orgId)

  const response = await erpFetch(`/api/stock/public/categories?${params.toString()}`)
  const payload = await parseJson<ErpListResponse<ErpCategoryRaw[]> | ErpCategoryRaw[]>(
    response,
  )

  if (!response.ok) {
    const message =
      (!Array.isArray(payload) && payload.message) ||
      `ERP returned ${response.status} while loading categories`
    throw new Error(message)
  }

  if (!Array.isArray(payload) && payload.success === false) {
    throw new Error(payload.message || 'ERP rejected the categories request')
  }

  return normalizeErpCategories(extractListData<ErpCategoryRaw>(payload))
}
