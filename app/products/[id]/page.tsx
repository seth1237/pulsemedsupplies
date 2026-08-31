import type { Metadata } from 'next'
import { getCatalogProductById } from '@/lib/catalog-server'
import { SITE_SHORT_NAME } from '@/lib/site'
import ProductDetailClient from './product-detail-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getCatalogProductById(id)

  if (!product) {
    return { title: 'Product not found' }
  }

  const description = product.description.replace(/\s+/g, ' ').trim().slice(0, 160)

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${id}` },
    openGraph: {
      title: `${product.name} | ${SITE_SHORT_NAME}`,
      description,
      url: `/products/${id}`,
      ...(product.image ? { images: [{ url: product.image, alt: product.name }] } : {}),
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  return <ProductDetailClient id={id} />
}
