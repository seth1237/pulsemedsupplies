import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/container'
import FacebookIcon from '@/components/facebook-icon'
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  FACEBOOK_URL,
  LOGO_URL,
  PHONE_TEL,
  SUPPORT_PHONE_DISPLAY,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from '@/lib/products'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const services = [
  'Equipment Supply',
  'Facility & Department Setup',
  'Installation & Commissioning',
  'Preventive Maintenance',
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-ink text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <div className="mb-5">
              <div className="relative h-24 w-32 sm:h-28 sm:w-36">
                <Image
                  src={LOGO_URL}
                  alt="Pulsemed Solutions Limited"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Medical equipment supplier for hospitals, clinics, and diagnostic centres in Kenya —
              across laboratory, ICU, theatre, maternity, dental, radiology, and more. Installation,
              commissioning, and biomedical support from Nairobi.
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
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#166fe0]"
            >
              <FacebookIcon className="size-4" />
              Follow Pulsemed Solutions Limited
            </a>
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
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/75 transition hover:text-primary"
            >
              <FacebookIcon className="size-3.5" />
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
