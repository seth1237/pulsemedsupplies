import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Laboratory & Medical Equipment Catalogue Kenya',
  description:
    'Browse laboratory analysers, microscopes, autoclaves, and hospital equipment for Kenyan hospitals, diagnostic centres, and labs. Request a quote from Pulsemed Solutions Limited.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Laboratory Equipment Catalogue | Pulsemed Kenya',
    description:
      'Lab and medical equipment for Kenyan healthcare facilities — analysers, microscopes, sterilisation, ICU, and more.',
    url: '/products',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
