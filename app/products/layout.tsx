import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Medical Equipment Catalogue Kenya',
  description:
    'Browse medical equipment for every hospital department — theatre, ICU, triage, maternity, wards, laboratory, radiology, and dental. Request a quote from Pulsemed Solutions Limited.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Medical Equipment Catalogue | Pulsemed Kenya',
    description:
      'Hospital equipment for Kenyan healthcare facilities across theatre, ICU, triage, maternity, wards, laboratory, radiology, and dental.',
    url: '/products',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
