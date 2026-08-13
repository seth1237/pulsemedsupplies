import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/container'
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  LOGO_URL,
  PHONE_TEL,
  SUPPORT_PHONE_DISPLAY,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from '@/lib/products'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products?department=lab', label: 'Lab Equipment' },
  { href: '/products', label: 'Catalogue' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const services = [
  'Laboratory Setup',
  'Equipment Supply',
  'Installation & Commissioning',
  'Preventive Maintenance',
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-ink text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <div className="mb-5 inline-flex rounded-lg bg-white px-3.5 py-2.5">
              <div className="relative h-16 w-48 sm:h-[4.5rem] sm:w-56">
                <Image src={LOGO_URL} alt="Pulsemed" fill className="object-contain" />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Laboratory and medical equipment supplier for hospitals and diagnostic centres in Kenya.
              Installation, commissioning, and biomedical support from Nairobi.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-white/80 transition hover:text-primary"
              >
                WhatsApp {WHATSAPP_PHONE_DISPLAY}
              </a>
              <a href={PHONE_TEL} className="block text-white/80 transition hover:text-primary">
                {SUPPORT_PHONE_DISPLAY}
              </a>
              <a href={EMAIL_MAILTO} className="block text-white/80 transition hover:text-primary">
                {EMAIL_DISPLAY}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Navigate
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Regions
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>Kenya (Nairobi)</li>
              <li>Uganda</li>
              <li>Tanzania</li>
            </ul>
            <a
              href="https://www.pulsemedsolutionslimited.co.ke/"
              className="mt-6 block text-sm text-white/75 transition hover:text-primary"
            >
              pulsemedsolutionslimited.co.ke
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61590708625873"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-white/75 transition hover:text-primary"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} Pulsemed Solutions Limited. All rights reserved.
          </p>
          <a
            href="https://codewithseth.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/45 transition hover:text-white/80"
          >
            <span>System built and managed by</span>
            <span className="relative inline-block size-5 overflow-hidden">
              <Image src="/logos/smo.png" alt="Code With Seth" fill className="object-contain" />
            </span>
            <span className="font-medium text-white/70">codewithseth.co.ke</span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
