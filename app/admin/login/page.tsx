'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { validateAdminCredentials, generateAdminToken } from '@/lib/admin-config'
import { Button } from '@/components/ui/button'
import { LOGO_URL } from '@/lib/products'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (validateAdminCredentials(username, password)) {
      const token = generateAdminToken()
      localStorage.setItem('admin_token', token)
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password')
    }

    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef3f8] px-3 py-12 sm:px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="neu-surface rounded-[1.75rem] p-8 sm:p-10">
          <div className="mb-8 flex justify-center">
            <div className="relative h-24 w-64 sm:h-28 sm:w-72">
              <Image src={LOGO_URL} alt="Pulsemed" fill className="object-contain" />
            </div>
          </div>

          <h1 className="text-center font-display text-2xl font-semibold tracking-tight text-ink">
            Admin access
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to manage the Pulsemed catalogue
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Username</span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                placeholder="Enter username"
                disabled={loading}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                placeholder="Enter password"
                disabled={loading}
              />
            </label>

            {error ? (
              <div className="neu-btn rounded-xl px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={loading || !username || !password}
              size="lg"
              className="w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 text-center">
            <Link href="/" className="neu-btn inline-flex rounded-xl px-4 py-2 text-sm font-medium text-secondary">
              Back to website
            </Link>
          </div>
        </div>

        <div className="neu-btn mt-5 rounded-2xl px-4 py-3 text-center text-xs text-muted-foreground">
          <p className="font-medium text-ink">Demo credentials</p>
          <p className="mt-1">admin · pulsemed@2024</p>
        </div>
      </div>
    </div>
  )
}
