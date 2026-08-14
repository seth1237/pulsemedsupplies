import { NextResponse } from 'next/server'
import { isAdminLoggedIn } from '@/lib/admin-config'
import { updateLocalProduct } from '@/lib/products-local'

interface RouteParams {
  params: Promise<{ id: string }>
}

function getToken(request: Request): string | null {
  const header = request.headers.get('authorization') || ''
  if (header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim()
  }
  return request.headers.get('x-admin-token')
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    if (!isAdminLoggedIn(getToken(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = (await request.json()) as {
      name?: string
      description?: string
      specs?: string
      department?: string
      image?: string
    }

    const product = await updateLocalProduct(id, {
      name: body.name?.trim(),
      description: body.description?.trim(),
      specs: body.specs?.trim(),
      department: body.department?.trim(),
      image: body.image?.trim(),
    })

    if (!product) {
      return NextResponse.json(
        {
          error:
            'Product not found in local catalogue. With ERP mode enabled, upload a photo instead — text edits must be done in the ERP admin.',
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Save failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
