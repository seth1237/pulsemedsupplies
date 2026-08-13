import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Pulsemed Solutions Limited Kenya',
  description:
    'Pulsemed Solutions Limited supplies and supports laboratory and medical equipment for hospitals and diagnostic labs in Kenya, with regional coverage in Uganda and Tanzania.',
  alternates: { canonical: '/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
