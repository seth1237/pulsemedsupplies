import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { isAdminLoggedIn } from '@/lib/admin-config'
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

    const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_')
    const relativePath = `/products/uploads/${safeId}.webp`
    const diskPath = path.join(process.cwd(), 'public', 'products', 'uploads', `${safeId}.webp`)
    await mkdir(path.dirname(diskPath), { recursive: true })
    await writeFile(diskPath, optimized)

    // Prefer updating the local catalogue when the product exists there.
    const localProduct = await updateLocalProduct(id, { image: relativePath })
    // Always keep an override map so ERP-sourced products can show uploaded photos.
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
      product: { ...product, image: `${relativePath}?v=${Date.now()}` },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('[admin image upload]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
