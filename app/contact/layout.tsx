import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Lab Equipment Sales in Kenya',
  description:
    'Talk to Pulsemed Solutions Limited in Kenya about laboratory setups, medical equipment quotes, installation, and biomedical support. Call or WhatsApp +254 100 020464.',
  alternates: { canonical: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
