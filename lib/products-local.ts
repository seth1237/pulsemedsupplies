import { readFile } from 'fs/promises'
import path from 'path'
import type { Product, ProductsPayload } from '@/lib/products'

/** Read the static catalogue used when ERP is not configured or unreachable. */
export async function fetchLocalProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'public', 'products.json')
  const raw = await readFile(filePath, 'utf8')
  const data = JSON.parse(raw) as ProductsPayload
  return (data.products || []).map((product) => ({
    ...product,
    id: String(product.id),
  }))
}
