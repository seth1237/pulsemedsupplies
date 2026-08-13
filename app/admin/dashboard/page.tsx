'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Container from '@/components/container'
import { fetchProducts, LOGO_URL, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'
import { Pencil, X } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [selectedDept, setSelectedDept] = useState('All')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Product>>({})

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
      setFilteredProducts(data)
      setDepartments(['All', ...Array.from(new Set(data.map((p) => p.department)))])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentFilter = (dept: string) => {
    setSelectedDept(dept)
    if (dept === 'All') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.department === dept))
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingId(product.id)
    setEditFormData(product)
  }

  const handleSaveEdit = () => {
    if (editingId !== null) {
      const updatedProducts = products.map((p) =>
        p.id === editingId ? { ...p, ...editFormData } : p,
      )
      setProducts(updatedProducts)
      setFilteredProducts(
        selectedDept === 'All'
          ? updatedProducts
          : updatedProducts.filter((p) => p.department === selectedDept),
      )
      setEditingId(null)
      setEditFormData({})
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f8]">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eef3f8]">
      <header className="sticky top-0 z-20 bg-[#eef3f8]/92 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <div className="neu-surface flex items-center gap-3 rounded-2xl px-3 py-2">
            <div className="relative h-10 w-28">
              <Image src={LOGO_URL} alt="Pulsemed" fill className="object-contain" />
            </div>
            <span className="hidden h-5 w-px bg-[#d8e2ec] sm:block" />
            <h1 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
              Admin Dashboard
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Logout
          </Button>
        </Container>
      </header>

      <Container className="py-8 sm:py-10">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Departments', value: Math.max(departments.length - 1, 0) },
            {
              label: 'With Images',
              value: products.filter((p) => p.image).length,
            },
          ].map((stat) => (
            <div key={stat.label} className="neu-surface rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="neu-surface mb-6 rounded-2xl p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Filter by department</h2>
          <div className="flex flex-wrap gap-2.5">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => handleDepartmentFilter(dept)}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-sm font-semibold',
                  selectedDept === dept ? 'neu-btn neu-btn-active text-ink' : 'neu-btn',
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="neu-surface overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#d8e2ec] text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Image
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#d8e2ec] last:border-b-0 transition hover:bg-white/40"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-ink">{product.name}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{product.department}</td>
                    <td className="px-5 py-4 text-sm">
                      {product.image ? (
                        <span className="neu-btn inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold text-secondary">
                          Available
                        </span>
                      ) : (
                        <span className="neu-btn inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Button onClick={() => handleEditClick(product)} variant="outline" size="sm">
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {editingId !== null ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="neu-surface max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem]">
            <div className="sticky top-0 flex items-center justify-between bg-[#eef3f8]/95 px-6 py-5 backdrop-blur">
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                Edit product
              </h2>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="neu-btn inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:text-ink"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Product name</span>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Description</span>
                <textarea
                  value={editFormData.description || ''}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  rows={3}
                  className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Specifications</span>
                <textarea
                  value={editFormData.specs || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, specs: e.target.value })}
                  rows={4}
                  className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">Image path</span>
                <input
                  type="text"
                  value={editFormData.image || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  placeholder="/products/image-name.png"
                  className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                />
                <p className="mt-2 text-xs text-muted-foreground">Example: /products/device.png</p>
              </label>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={handleSaveEdit} size="lg" className="flex-1">
                  Save Changes
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
