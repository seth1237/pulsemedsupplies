'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminLoggedIn } from '@/lib/admin-config'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (isAdminLoggedIn(token)) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  )
}
