import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { isAdminLoggedIn } from '@/lib/admin-config'
import {
  getErpBaseUrl,
  getErpOrgId,
  getErpRequestTimeoutMs,
  isErpConfigured,
} from '@/lib/erp/config'
import { normalizeErpProduct } from '@/lib/erp/normalize'
import type { ErpProductRaw } from '@/lib/erp/types'
import { updateLocalProduct } from '@/lib/products-local'
import { upsertImageOverride } from '@/lib/product-image-overrides'

interface RouteParams {
  params: Promise<{ id: string }>
}

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MAX_BYTES = 8 * 1024 * 1024

function getToken(request: Request): string | null {
  const header = request.headers.get('authorization') || ''
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim()
  }
  return request.headers.get('x-admin-token')
}

function isReadonlyServerFilesystem() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.cwd().startsWith('/var/task'),
  )
}

async function uploadImageToErp(productId: string, file: File, optimized: Buffer) {
  const orgId = getErpOrgId()
  if (!orgId) {
    throw new Error('ERP_ORG_ID is not configured')
  }

  const form = new FormData()
  form.append(
    'file',
    new Blob([new Uint8Array(optimized)], { type: 'image/webp' }),
    `${productId}.webp`,
  )

  const params = new URLSearchParams({ orgId })
  const headers: Record<string, string> = {
    'X-Org-Id': orgId,
  }
  const uploadSecret = String(
    process.env.ERP_WEBSITE_UPLOAD_SECRET || process.env.WEBSITE_UPLOAD_SECRET || '',
  ).trim()
  if (uploadSecret) {
    headers['X-Website-Key'] = uploadSecret
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), getErpRequestTimeoutMs())

  try {
    const response = await fetch(
      `${getErpBaseUrl()}/api/stock/public/products/${encodeURIComponent(productId)}/image?${params}`,
      {
        method: 'POST',
        headers,
        body: form,
        signal: controller.signal,
        cache: 'no-store',
      },
    )

    const text = await response.text()
    let payload: any = null
    try {
      payload = text ? JSON.parse(text) : null
    } catch {
      throw new Error(
        text.slice(0, 180) || `ERP image upload failed (HTTP ${response.status})`,
      )
    }

    if (!response.ok || payload?.success === false) {
      const detail =
        payload?.message || payload?.error || `HTTP ${response.status}`
      if (response.status === 404 || /route not found/i.test(String(detail))) {
        throw new Error(
          'ERP image upload API is not deployed yet on the backend. Deploy the latest employeehr server (POST /api/stock/public/products/:id/image), then retry.',
        )
      }
      throw new Error(`ERP image upload failed: ${detail}`)
    }

    const raw = (payload?.data || null) as ErpProductRaw | null
    const normalized = raw ? normalizeErpProduct(raw) : null
    const imageUrl =
      normalized?.image ||
      String(raw?.imageUrl || raw?.image || '').trim() ||
      ''

    if (!normalized && !imageUrl) {
      throw new Error('ERP accepted the upload but returned no product image')
    }

    return {
      product: normalized || {
        id: String(productId),
        name: String(raw?.name || productId),
        department: String(raw?.categoryName || 'Uncategorized'),
        description: String(raw?.description || ''),
        specs: String(raw?.description || ''),
        image: imageUrl,
      },
      source: 'erp' as const,
    }
  } finally {
    clearTimeout(timeout)
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    if (!isAdminLoggedIn(getToken(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
    }

    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 8MB or smaller' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Use a JPG, PNG, WEBP, or GIF image' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const optimized = await sharp(buffer)
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()

    // On Vercel/serverless the local filesystem is read-only — store on ERP instead.
    if (isErpConfigured() || isReadonlyServerFilesystem()) {
      if (!isErpConfigured()) {
        return NextResponse.json(
          {
            error:
              'Local photo uploads are not available on this host. Set CATALOG_SOURCE=erp and ERP_ORG_ID so images can be stored in the ERP.',
          },
          { status: 503 },
        )
      }

      const uploaded = await uploadImageToErp(id, file, optimized)
      return NextResponse.json({
        success: true,
        source: uploaded.source,
        product: {
          ...uploaded.product,
          image: `${uploaded.product.image}${uploaded.product.image.includes('?') ? '&' : '?'}v=${Date.now()}`,
        },
      })
    }

    const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_')
    const relativePath = `/products/uploads/${safeId}.webp`
    const diskPath = path.join(process.cwd(), 'public', 'products', 'uploads', `${safeId}.webp`)
    await mkdir(path.dirname(diskPath), { recursive: true })
    await writeFile(diskPath, optimized)

    const localProduct = await updateLocalProduct(id, { image: relativePath })
    await upsertImageOverride(id, relativePath)

    const product = localProduct || {
      id: String(id),
      name: String(id),
      department: 'Uncategorized',
      description: '',
      specs: '',
      image: relativePath,
    }

    return NextResponse.json({
      success: true,
      source: 'local',
      product: { ...product, image: `${relativePath}?v=${Date.now()}` },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('[admin image upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
