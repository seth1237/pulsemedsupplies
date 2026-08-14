'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Container from '@/components/container'
import { isAdminLoggedIn } from '@/lib/admin-config'
import { fetchProducts, LOGO_URL, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'
import { Download, ImagePlus, Pencil, Upload, X } from 'lucide-react'

function adminHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token') || ''
  return { Authorization: `Bearer ${token}` }
}

async function readJsonResponse<T = any>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text.trim()) {
    throw new Error(
      response.ok
        ? 'Server returned an empty response'
        : `Upload failed (HTTP ${response.status})`,
    )
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(
      response.ok
        ? 'Server returned invalid JSON'
        : text.slice(0, 180) || `Upload failed (HTTP ${response.status})`,
    )
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [selectedDept, setSelectedDept] = useState('All')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!isAdminLoggedIn(token)) {
      localStorage.removeItem('admin_token')
      router.push('/admin/login')
      return
    }

    loadProducts()
  }, [router])

  const applyFilter = (list: Product[], dept: string) => {
    setFilteredProducts(dept === 'All' ? list : list.filter((p) => p.department === dept))
  }

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
      applyFilter(data, selectedDept)
      setDepartments(['All', ...Array.from(new Set(data.map((p) => p.department)))])
    } catch (loadError) {
      console.error('Error loading products:', loadError)
      setError('Could not load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentFilter = (dept: string) => {
    setSelectedDept(dept)
    applyFilter(products, dept)
  }

  const replaceProduct = (updated: Product) => {
    const next = products.map((p) => (p.id === updated.id ? updated : p))
    setProducts(next)
    applyFilter(next, selectedDept)
    if (editingId === updated.id) {
      setEditFormData(updated)
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingId(product.id)
    setEditFormData(product)
    setError('')
    setStatus('')
  }

  const handleSaveEdit = async () => {
    if (editingId === null) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/products/${encodeURIComponent(editingId)}`, {
        method: 'PUT',
        headers: {
          ...adminHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          specs: editFormData.specs,
          department: editFormData.department,
          image: editFormData.image,
        }),
      })
      const payload = await readJsonResponse<{ error?: string; product?: Product }>(response)
      if (!response.ok) {
        throw new Error(payload.error || 'Save failed')
      }
      if (!payload.product) {
        throw new Error('Save succeeded but no product was returned')
      }
      replaceProduct(payload.product)
      setStatus('Product saved')
      setEditingId(null)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (productId: string, file: File) => {
    setUploadingId(productId)
    setError('')
    setStatus('')
    try {
      const body = new FormData()
      body.append('file', file)
      const response = await fetch(`/api/admin/products/${encodeURIComponent(productId)}/image`, {
        method: 'POST',
        headers: adminHeaders(),
        body,
      })
      const payload = await readJsonResponse<{ error?: string; product?: Product }>(response)
      if (!response.ok) {
        throw new Error(payload.error || 'Upload failed')
      }
      if (!payload.product) {
        throw new Error('Upload succeeded but no product was returned')
      }
      replaceProduct({
        ...payload.product,
        image: String(payload.product.image).split('?')[0],
      })
      setStatus('Image uploaded successfully')
      // Keep edit form preview in sync when uploading from the dialog.
      setEditFormData((current) =>
        String(editingId) === String(productId)
          ? { ...current, image: String(payload.product!.image).split('?')[0] }
          : current,
      )
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploadingId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const missingImages = products.filter((p) => !p.image || p.image.includes('/cards/')).length

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
            <div className="relative h-14 w-40 sm:h-16 sm:w-48">
              <Image src={LOGO_URL} alt="Pulsemed" fill className="object-contain" />
            </div>
            <span className="hidden h-5 w-px bg-[#d8e2ec] sm:block" />
            <h1 className="font-display text-base font-semibold tracking-tight text-ink sm:text-lg">
              Catalogue admin
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/exports/pulsemed-erp-products.csv"
              download
              className={cn(
                'neu-btn inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold',
              )}
            >
              <Download className="size-3.5" />
              ERP CSV
            </a>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </Container>
      </header>

      <Container className="py-8 sm:py-10">
        {status ? (
          <p className="mb-4 rounded-xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'Departments', value: Math.max(departments.length - 1, 0) },
            { label: 'Need photo', value: missingImages },
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
            <table className="w-full min-w-[720px]">
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
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-lg bg-[#e4ebf3]">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : null}
                        </div>
                        <span className="text-sm font-medium text-ink">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{product.department}</td>
                    <td className="px-5 py-4 text-sm">
                      {product.image && !product.image.includes('/cards/') ? (
                        <span className="neu-btn inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold text-secondary">
                          Photo
                        </span>
                      ) : (
                        <span className="neu-btn inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          Placeholder
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="sr-only"
                            disabled={uploadingId === product.id}
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              if (file) void handleUpload(product.id, file)
                              event.target.value = ''
                            }}
                          />
                          <span className="neu-btn inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold">
                            <Upload className="size-3.5" />
                            {uploadingId === product.id ? 'Uploading…' : 'Photo'}
                          </span>
                        </label>
                        <Button onClick={() => handleEditClick(product)} variant="outline" size="sm">
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                      </div>
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
              <div className="overflow-hidden rounded-2xl bg-[#e4ebf3]">
                <div className="relative aspect-[4/3]">
                  {editFormData.image ? (
                    <Image
                      src={editFormData.image}
                      alt={editFormData.name || 'Product'}
                      fill
                      className="object-cover"
                      sizes="640px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image yet
                    </div>
                  )}
                </div>
                <label className="flex cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-ink hover:bg-white/50">
                  <ImagePlus className="size-4" />
                  {uploadingId === editingId ? 'Uploading…' : 'Upload new photo'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={uploadingId === editingId}
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file && editingId) void handleUpload(editingId, file)
                    }}
                  />
                </label>
              </div>

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

              <p className="text-xs text-muted-foreground">
                Photos are saved to the ERP catalogue on Vercel (or to{' '}
                <code>public/products/uploads/</code> in local mode).
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button onClick={handleSaveEdit} size="lg" className="flex-1" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
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
