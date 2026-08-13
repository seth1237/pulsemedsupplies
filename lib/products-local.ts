import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { Product, ProductsPayload } from '@/lib/products'

const PRODUCTS_FILE = path.join(process.cwd(), 'public', 'products.json')

function serializeId(id: string): string | number {
  return /^\d+$/.test(id) ? Number(id) : id
}

/** Read the static catalogue used when ERP is not configured or unreachable. */
export async function fetchLocalProducts(): Promise<Product[]> {
  const raw = await readFile(PRODUCTS_FILE, 'utf8')
  const data = JSON.parse(raw) as ProductsPayload
  return (data.products || []).map((product) => ({
    ...product,
    id: String(product.id),
  }))
}

export async function updateLocalProduct(
  id: string,
  patch: Partial<Pick<Product, 'name' | 'description' | 'specs' | 'image' | 'department'>>,
): Promise<Product | null> {
  const raw = await readFile(PRODUCTS_FILE, 'utf8')
  const data = JSON.parse(raw) as ProductsPayload
  const index = (data.products || []).findIndex((product) => String(product.id) === String(id))
  if (index < 0) return null

  const current = data.products[index]
  const updated: Product = {
    ...current,
    id: String(current.id),
    name: patch.name ?? current.name,
    department: patch.department ?? current.department,
    description: patch.description ?? current.description,
    specs: patch.specs ?? current.specs,
    image: patch.image ?? current.image,
  }

  data.products[index] = {
    ...updated,
    id: serializeId(updated.id) as Product['id'],
  }

  await writeFile(PRODUCTS_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  return updated
}
