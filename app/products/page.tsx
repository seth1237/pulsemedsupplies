'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import ProductCard from '@/components/product-card'
import CategorySidebar from '@/components/category-sidebar'
import {
  fetchCategories,
  fetchProducts,
  WHATSAPP_URL,
  type Product,
  type ProductCategory,
} from '@/lib/products'
import { MessageCircle, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState('All')
  const [query, setQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ])
        setProducts(productData)
        setCategories(categoryData)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const departments = useMemo(() => {
    const fromCategories = categories.map((category) => category.name)
    const fromProducts = products.map((product) => product.department)
    return ['All', ...Array.from(new Set([...fromCategories, ...fromProducts].filter(Boolean)))]
  }, [categories, products])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: products.length }
    for (const product of products) {
      map[product.department] = (map[product.department] || 0) + 1
    }
    return map
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((product) => {
      const matchesDept = selectedDept === 'All' || product.department === selectedDept
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.department.toLowerCase().includes(q)
      return matchesDept && matchesQuery
    })
  }, [products, selectedDept, query])

  const clearFilters = () => {
    setSelectedDept('All')
    setQuery('')
  }

  const hasActiveFilters = selectedDept !== 'All' || query.trim().length > 0

  return (
    <>
      <Header />
      <main>
        <section>
          <Container className="py-10 sm:py-12">
            <div className="neu-surface rounded-[1.75rem] px-5 py-8 sm:px-8 sm:py-10">
              <p className="mb-3 font-display text-sm font-semibold tracking-[0.28em] text-secondary">
                PULSEMED
              </p>
              <h1 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl">
                Medical equipment catalogue
              </h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
                Browse triage, laboratory, ICU, dental, and radiology solutions selected for clinical
                environments across East Africa.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-14 sm:pb-20">
          <Container>
            <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
              {/* Desktop sidebar — AsterMed-style categories */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="sticky top-24">
                  <CategorySidebar
                    departments={departments}
                    selected={selectedDept}
                    onSelect={setSelectedDept}
                    counts={counts}
                  />
                </div>
              </div>

              {/* Main content */}
              <div className="lg:col-span-3">
                <div className="neu-surface mb-5 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name, department, or keyword..."
                        className="neu-input w-full rounded-xl py-3 pr-4 pl-10 text-sm text-ink"
                        aria-label="Search products"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(true)}
                      className="neu-btn rounded-xl px-4 py-3 text-sm font-semibold text-ink lg:hidden"
                    >
                      Categories
                    </button>

                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="neu-btn inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold"
                      >
                        <X className="size-3.5" />
                        Clear
                      </button>
                    ) : null}

                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn-accent hidden items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:inline-flex"
                    >
                      <MessageCircle className="size-4" />
                      Quote
                    </a>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    Showing{' '}
                    <span className="font-semibold text-ink">
                      {loading ? '…' : filtered.length}
                    </span>{' '}
                    products
                    {selectedDept !== 'All' ? (
                      <span>
                        {' '}
                        in <span className="font-semibold text-ink">{selectedDept}</span>
                      </span>
                    ) : null}
                  </p>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="neu-surface h-72 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="neu-surface flex flex-col items-center rounded-[1.75rem] px-6 py-16 text-center">
                    <p className="font-display text-xl font-semibold text-ink">No products found</p>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">
                      Try another category or clear your search to browse the full catalogue.
                    </p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="neu-btn-gold mt-6 rounded-xl px-5 py-3 text-sm font-semibold"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                    {filtered.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-fade-up"
                        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                      >
                        <ProductCard
                          id={product.id}
                          image={product.image}
                          name={product.name}
                          description={product.description}
                          department={product.department}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filtered.length > 0 ? (
                  <div className="neu-surface mt-10 flex flex-col items-start justify-between gap-5 rounded-[1.75rem] p-6 sm:flex-row sm:items-center sm:p-8">
                    <div>
                      <p className="font-display text-xl font-semibold tracking-tight text-ink">
                        Need help choosing equipment?
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Our team can recommend the right setup for your department.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-btn-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                      >
                        <MessageCircle className="size-4" />
                        WhatsApp
                      </a>
                      <Link
                        href="/contact"
                        className="neu-btn inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold text-ink"
                      >
                        Contact form
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Mobile category drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileFiltersOpen ? 'visible' : 'invisible pointer-events-none',
        )}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-ink/40 transition-opacity',
            mobileFiltersOpen ? 'opacity-100' : 'opacity-0',
          )}
          aria-label="Close categories"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-[min(88vw,320px)] bg-[#eef3f8] p-4 shadow-2xl transition-transform duration-300',
            mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-ink">Categories</p>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="neu-btn inline-flex size-9 items-center justify-center rounded-xl"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <CategorySidebar
            departments={departments}
            selected={selectedDept}
            onSelect={(dept) => {
              setSelectedDept(dept)
              setMobileFiltersOpen(false)
            }}
            counts={counts}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}
