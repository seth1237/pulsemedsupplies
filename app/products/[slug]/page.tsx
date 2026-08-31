import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getCatalogProductByParam, getCatalogProducts } from '@/lib/catalog-server'
import { getProductSlug } from '@/lib/product-slug'
import { SITE_SHORT_NAME } from '@/lib/site'
import ProductDetailClient from './product-detail-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const [products, product] = await Promise.all([
    getCatalogProducts(),
    getCatalogProductByParam(slug),
  ])

  if (!product) {
    return { title: 'Product not found' }
  }

  const canonicalSlug = getProductSlug(product, products)
  const description = product.description.replace(/\s+/g, ' ').trim().slice(0, 160)

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${canonicalSlug}` },
    openGraph: {
      title: `${product.name} | ${SITE_SHORT_NAME}`,
      description,
      url: `/products/${canonicalSlug}`,
      ...(product.image ? { images: [{ url: product.image, alt: product.name }] } : {}),
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug: param } = await params
  const [products, product] = await Promise.all([
    getCatalogProducts(),
    getCatalogProductByParam(param),
  ])

  if (!product) {
    notFound()
  }

  const canonicalSlug = getProductSlug(product, products)
  if (param !== canonicalSlug) {
    permanentRedirect(`/products/${canonicalSlug}`)
  }

  return <ProductDetailClient slug={canonicalSlug} initialProduct={product} />
}
