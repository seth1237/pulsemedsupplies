'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import ProductCard from '@/components/product-card'
import CategorySidebar from '@/components/category-sidebar'
import { fetchProducts, WHATSAPP_URL, type Product } from '@/lib/products'
import { buildProductSlugMap } from '@/lib/product-slug'
import { isLabDepartment, matchesDepartmentFilter, sortDepartments } from '@/lib/site'
import { ChevronDown, MessageCircle, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 12

type SortKey = 'featured' | 'name-asc' | 'name-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

function interleaveByDepartment(items: Product[]): Product[] {
  const groups = new Map<string, Product[]>()
  for (const item of items) {
    const group = groups.get(item.department)
    if (group) group.push(item)
    else groups.set(item.department, [item])
  }
  const queues = sortDepartments([...groups.keys()]).map((dept) => groups.get(dept) || [])
  const result: Product[] = []
  for (let i = 0; result.length < items.length; i++) {
    for (const queue of queues) {
      if (i < queue.length) result.push(queue[i])
    }
  }
  return result
}

export default function ProductsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const departmentParam = searchParams.get('department') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [selectedDept, setSelectedDept] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setLoadError(false)
      try {
        setProducts(await fetchProducts({ lite: true }))
      } catch (error) {
        console.error('Error loading products:', error)
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reloadKey])

  const departments = useMemo(
    () => ['All', ...sortDepartments(products.map((product) => product.department))],
    [products],
  )

  useEffect(() => {
    if (!departmentParam) {
      setSelectedDept('All')
      return
    }
    const names = departments.slice(1)
    const match =
      names.find((name) => matchesDepartmentFilter(name, departmentParam)) ||
      (/^lab(oratory)?$/i.test(departmentParam) ? names.find(isLabDepartment) : undefined)
    if (match) setSelectedDept(match)
  }, [departmentParam, departments])

  const chipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const strip = chipsRef.current
    const chip = strip?.querySelector<HTMLElement>('[data-active]')
    if (!strip || !chip) return
    strip.scrollTo({
      left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }, [selectedDept, departments])

  const selectDepartment = (dept: string) => {
    setSelectedDept(dept)
    if (window.scrollY > 160) window.scrollTo({ top: 0, behavior: 'smooth' })
    const params = new URLSearchParams(searchParams.toString())
    if (dept === 'All') params.delete('department')
    else params.set('department', dept)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: products.length }
    for (const product of products) {
      map[product.department] = (map[product.department] || 0) + 1
    }
    return map
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = products.filter((product) => {
      const matchesDept =
        selectedDept === 'All' ||
        product.department === selectedDept ||
        matchesDepartmentFilter(product.department, selectedDept)
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.department.toLowerCase().includes(q)
      return matchesDept && matchesQuery
    })
    if (sort === 'name-asc') return [...matches].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'name-desc') return [...matches].sort((a, b) => b.name.localeCompare(a.name))
    return selectedDept === 'All' ? interleaveByDepartment(matches) : matches
  }, [products, selectedDept, query, sort])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [selectedDept, query, sort])

  const visibleProducts = filtered.slice(0, visibleCount)
  const hasMoreProducts = filtered.length > visibleCount
  const slugMap = useMemo(() => buildProductSlugMap(products), [products])

  const clearFilters = () => {
    selectDepartment('All')
    setQuery('')
  }

  const trimmedQuery = query.trim()
  const hasActiveFilters = selectedDept !== 'All' || trimmedQuery.length > 0
  const title = selectedDept === 'All' ? 'All Products' : selectedDept

  return (
    <>
      <Header />
      <main>
        <section className="pb-14 pt-4 sm:pb-20 sm:pt-6">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
              <div className="hidden lg:block">
                <div className="sticky top-24 space-y-4">
                  <CategorySidebar
                    departments={departments}
                    selected={selectedDept}
                    onSelect={selectDepartment}
                    counts={counts}
                  />
                  <div className="rounded-2xl bg-ink p-5 text-white">
                    <p className="font-display text-base font-semibold">Need a quote?</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">
                      Send us your list on WhatsApp and our team will respond with pricing and
                      availability.
                    </p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe57]"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp us
                    </a>
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <nav className="mb-0.5 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                      <Link href="/" className="transition hover:text-ink">
                        Home
                      </Link>
                      <span>/</span>
                      <span className="text-ink">Products</span>
                    </nav>
                    <h1 className="truncate font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {title}
                    </h1>
                  </div>
                  {!loadError ? (
                    <p className="shrink-0 pb-0.5 text-xs text-muted-foreground sm:text-sm">
                      <span className="font-semibold text-ink">{loading ? '…' : filtered.length}</span>{' '}
                      {filtered.length === 1 ? 'product' : 'products'}
                    </p>
                  ) : null}
                </div>

                <div className="sticky top-[4.5rem] z-30 -mx-5 mt-3 border-b border-border bg-background px-5 pb-3 pt-2 sm:top-20 sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative min-w-0 flex-1">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="neu-input h-10 w-full rounded-xl pr-4 pl-10 text-sm text-ink sm:h-11"
                        aria-label="Search products"
                      />
                    </div>
                    <label className="relative w-32 shrink-0 sm:w-48">
                      <span className="sr-only">Sort products</span>
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="neu-input h-10 w-full cursor-pointer appearance-none rounded-xl pr-9 pl-3.5 text-sm text-ink sm:h-11"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </label>
                  </div>

                  <div
                    ref={chipsRef}
                    className="no-scrollbar -mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:hidden"
                  >
                    {departments.map((dept) => {
                      const active = selectedDept === dept
                      return (
                        <button
                          key={dept}
                          type="button"
                          data-active={active || undefined}
                          onClick={() => selectDepartment(dept)}
                          className={cn(
                            'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                            active
                              ? 'border-secondary bg-secondary text-white'
                              : 'border-border bg-white text-ink hover:border-secondary/50',
                          )}
                        >
                          {dept === 'All' ? 'All' : dept}
                          <span className={cn('ml-1.5 tabular-nums', active ? 'text-white/75' : 'text-muted-foreground')}>
                            {counts[dept] ?? 0}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {hasActiveFilters ? (
                  <div
                    className={cn(
                      'mt-3 flex-wrap items-center gap-2 lg:mt-4',
                      trimmedQuery ? 'flex' : 'hidden lg:flex',
                    )}
                  >
                    {selectedDept !== 'All' ? (
                      <button
                        type="button"
                        onClick={() => selectDepartment('All')}
                        className="hidden items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary transition hover:bg-secondary/20 lg:inline-flex"
                      >
                        {selectedDept}
                        <X className="size-3" />
                      </button>
                    ) : null}
                    {trimmedQuery ? (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary transition hover:bg-secondary/20"
                      >
                        “{trimmedQuery}”
                        <X className="size-3" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                ) : null}

                <div className="mt-3 sm:mt-4 lg:mt-5">
                  {loading ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="neu-surface overflow-hidden rounded-2xl">
                          <div className="aspect-[4/3] animate-pulse bg-muted" />
                          <div className="space-y-2 p-4">
                            <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted" />
                            <div className="h-3.5 w-4/5 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : loadError ? (
                    <div className="neu-surface flex flex-col items-center rounded-2xl px-6 py-16 text-center">
                      <p className="font-display text-xl font-semibold text-ink">
                        We couldn&apos;t load the catalogue
                      </p>
                      <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Please check your connection and try again, or send us your list on WhatsApp.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setReloadKey((key) => key + 1)}
                          className="neu-btn-gold rounded-xl px-5 py-3 text-sm font-semibold"
                        >
                          Try again
                        </button>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neu-btn rounded-xl px-5 py-3 text-sm font-semibold text-ink"
                        >
                          WhatsApp us
                        </a>
                      </div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="neu-surface flex flex-col items-center rounded-2xl px-6 py-16 text-center">
                      <Search className="mb-4 size-8 text-muted-foreground/60" />
                      <p className="font-display text-xl font-semibold text-ink">No products found</p>
                      <p className="mt-2 max-w-md text-sm text-muted-foreground">
                        Try another department or clear your search to browse the full catalogue.
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
                    <>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                        {visibleProducts.map((product, index) => (
                          <div
                            key={product.id}
                            className="animate-fade-up"
                            style={{ animationDelay: `${Math.min(index % PAGE_SIZE, 8) * 40}ms` }}
                          >
                            <ProductCard
                              slug={slugMap.get(product.id) || product.id}
                              image={product.image}
                              name={product.name}
                              description={product.description}
                              department={product.department}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-10 flex flex-col items-center gap-3">
                        <p className="text-xs text-muted-foreground">
                          Showing {visibleProducts.length} of {filtered.length} products
                        </p>
                        <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-secondary transition-[width] duration-500"
                            style={{ width: `${(visibleProducts.length / filtered.length) * 100}%` }}
                          />
                        </div>
                        {hasMoreProducts ? (
                          <button
                            type="button"
                            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                            className="neu-btn mt-1 rounded-xl px-6 py-2.5 text-sm font-semibold text-ink"
                          >
                            View more
                          </button>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>

                {!loading && filtered.length > 0 ? (
                  <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-white p-6 sm:flex-row sm:items-center sm:p-8 lg:hidden">
                    <div>
                      <p className="font-display text-lg font-semibold tracking-tight text-ink">
                        Need help choosing equipment?
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Our Nairobi team can help you specify equipment for any department.
                      </p>
                    </div>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn-accent inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                    >
                      <MessageCircle className="size-4" />
                      WhatsApp us
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
