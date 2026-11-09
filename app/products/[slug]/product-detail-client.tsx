'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import ProductCard from '@/components/product-card'
import { buttonVariants } from '@/components/ui/button'
import { buildProductSlugMap } from '@/lib/product-slug'
import {
  EMAIL_MAILTO,
  buildWhatsAppQuoteUrl,
  fetchProducts,
  type Product,
} from '@/lib/products'
import { cn } from '@/lib/utils'
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react'

export default function ProductDetailClient({
  slug,
  initialProduct,
}: {
  slug: string
  initialProduct: Product
}) {
  const [product] = useState<Product>(initialProduct)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  const slugMap = useMemo(() => buildProductSlugMap([product, ...products]), [product, products])

  useEffect(() => {
    const loadCatalogue = async () => {
      try {
        setProducts(await fetchProducts({ lite: true }))
      } catch (error) {
        console.error('Error loading related products:', error)
      } finally {
        setLoadingRelated(false)
      }
    }

    loadCatalogue()
  }, [slug])

  const related = products
    .filter((p) => p.id !== product.id && p.department === product.department)
    .slice(0, 3)
  const fallbackRelated =
    related.length > 0 ? related : products.filter((p) => p.id !== product.id).slice(0, 3)

  return (
    <>
      <Header />
      <main>
        <Container className="pt-6 sm:pt-8">
          <nav className="neu-surface inline-flex flex-wrap items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted-foreground">
            <Link href="/" className="transition hover:text-ink">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="transition hover:text-ink">
              Products
            </Link>
            <span>/</span>
            <span className="text-ink">{product.name}</span>
          </nav>
        </Container>

        <section className="py-8 sm:py-12">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="neu-surface relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-square">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-5 sm:p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-lg font-medium text-muted-foreground">
                      PULSEMED
                    </span>
                  </div>
                )}
              </div>

              <div className="neu-surface flex flex-col justify-center rounded-2xl p-6 sm:p-8 lg:p-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                  {product.department}
                </p>
                <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl text-balance">
                  {product.name}
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {product.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={buildWhatsAppQuoteUrl(product, products.length ? products : [product])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
                  >
                    <MessageCircle className="size-4" />
                    Request Quote
                  </a>
                  <a href={EMAIL_MAILTO} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                    <Mail className="size-4" />
                    Email Us
                  </a>
                </div>

                <Link
                  href="/products"
                  className="neu-btn mt-8 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink"
                >
                  <ArrowLeft className="size-4" />
                  Back to catalogue
                </Link>
              </div>
            </div>

            {product.specs ? (
              <div className="neu-surface mt-6 rounded-2xl p-6 sm:p-8 lg:p-10">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Key specifications
                </h2>
                <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.specs}
                </p>
              </div>
            ) : null}

            <div className="mt-10">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Related equipment
                </h2>
                <Link href="/products" className="neu-btn rounded-xl px-4 py-2 text-sm font-semibold text-secondary">
                  View all
                </Link>
              </div>
              {loadingRelated ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="neu-surface h-72 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {fallbackRelated.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct.id}
                      slug={slugMap.get(relatedProduct.id) || relatedProduct.id}
                      image={relatedProduct.image}
                      name={relatedProduct.name}
                      description={relatedProduct.description}
                      department={relatedProduct.department}
                    />
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
