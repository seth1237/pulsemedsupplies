/** ERP public API config — used only on the server (API routes / RSC). */

export function getErpBaseUrl(): string {
  if (process.env.ERP_API_BASE_URL) {
    return process.env.ERP_API_BASE_URL.replace(/\/$/, '')
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5010'
  }

  return 'https://backend.codewithseth.co.ke'
}

export function getErpOrgId(): string | null {
  const orgId = process.env.ERP_ORG_ID?.trim()
  return orgId || null
}

/** When CATALOG_SOURCE=local, the site uses public/products.json instead of ERP. */
export function useLocalCatalog(): boolean {
  return (process.env.CATALOG_SOURCE || '').trim().toLowerCase() === 'local'
}

export function isErpConfigured(): boolean {
  return Boolean(getErpOrgId()) && !useLocalCatalog()
}

export const ERP_ORG_ID_HEADER = 'X-Org-Id'

export function getErpHeaders(contentType = 'application/json'): HeadersInit {
  const orgId = getErpOrgId()
  if (!orgId) {
    throw new Error('ERP_ORG_ID is not configured')
  }

  const headers: Record<string, string> = {
    [ERP_ORG_ID_HEADER]: orgId,
  }

  if (contentType) {
    headers['Content-Type'] = contentType
  }

  return headers
}

export function getErpRequestTimeoutMs(): number {
  const raw = Number(process.env.ERP_REQUEST_TIMEOUT || 10000)
  return Number.isFinite(raw) && raw > 0 ? raw : 10000
}
