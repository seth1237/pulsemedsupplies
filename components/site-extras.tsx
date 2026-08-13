'use client'

import { usePathname } from 'next/navigation'
import ContactSidebar from '@/components/contact-sidebar'

export default function SiteExtras() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <ContactSidebar />
}
