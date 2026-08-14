import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const OVERRIDES_FILE = path.join(process.cwd(), 'public', 'products', 'image-overrides.json')

type OverrideMap = Record<string, string>

async function readOverrides(): Promise<OverrideMap> {
  try {
    const raw = await readFile(OVERRIDES_FILE, 'utf8')
    const data = JSON.parse(raw) as OverrideMap
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

export async function getImageOverrides(): Promise<OverrideMap> {
  return readOverrides()
}

export async function upsertImageOverride(id: string, imagePath: string): Promise<void> {
  const key = String(id || '').trim()
  if (!key || !imagePath) return

  const current = await readOverrides()
  current[key] = imagePath

  await mkdir(path.dirname(OVERRIDES_FILE), { recursive: true })
  await writeFile(OVERRIDES_FILE, `${JSON.stringify(current, null, 2)}\n`, 'utf8')
}

export async function applyImageOverrides<T extends { id: string; image?: string }>(
  products: T[],
): Promise<T[]> {
  const overrides = await readOverrides()
  if (!Object.keys(overrides).length) return products

  return products.map((product) => {
    const override = overrides[String(product.id)]
    if (!override) return product
    return { ...product, image: override }
  })
}
