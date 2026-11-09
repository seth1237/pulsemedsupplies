'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import Container from '@/components/container'
import FacebookIcon from '@/components/facebook-icon'
import { FACEBOOK_URL, LOGO_URL, WHATSAPP_URL } from '@/lib/products'
import { cn } from '@/lib/utils'
import { ArrowUpRight, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'All Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-white transition-shadow duration-300',
          scrolled || isOpen ? 'border-border shadow-sm' : 'border-transparent',
        )}
      >
        <Container>
          <nav className="flex h-[4.5rem] items-center justify-between sm:h-20">
            <Link href="/" className="relative z-50 flex items-center" onClick={() => setIsOpen(false)}>
              <Image
                src={LOGO_URL}
                alt="Pulsemed Solutions Limited"
                width={916}
                height={748}
                className="h-14 w-auto transition-transform duration-300 hover:scale-[1.03] sm:h-16"
                priority
              />
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const active = isNavActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                      active
                        ? 'bg-muted text-ink'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-ink',
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Request Quote
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative z-50 inline-flex size-10 items-center justify-center rounded-xl border border-border bg-white shadow-sm lg:hidden"
              aria-label="Open menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open menu</span>
              <div className="flex w-4 flex-col gap-1.5">
                <span className="h-0.5 w-full rounded-full bg-ink" />
                <span className="h-0.5 w-full rounded-full bg-ink" />
                <span className="h-0.5 w-full rounded-full bg-ink" />
              </div>
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile menu — full page overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] lg:hidden',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-ink/50 transition-opacity duration-300',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#0b1220] text-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-sm',
            isOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="relative flex h-[4.5rem] items-center justify-between border-b border-white/10 px-5 sm:h-20">
            <div className="relative h-14 w-40 sm:h-16 sm:w-44">
              <Image
                src={LOGO_URL}
                alt="Pulsemed Solutions Limited"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="relative flex flex-1 flex-col px-5 py-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Menu
            </p>
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => {
                const active = isNavActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3 py-3.5 transition',
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-white/80 hover:bg-white/5 hover:text-white',
                    )}
                    style={{
                      transitionDelay: isOpen ? `${index * 40}ms` : '0ms',
                    }}
                  >
                    <span className="font-display text-2xl font-semibold tracking-tight">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      className={cn('size-5', active ? 'text-primary' : 'text-white/35')}
                    />
                  </Link>
                )
              })}
            </div>

            <div className="mt-auto space-y-3 border-t border-white/10 pt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-white transition hover:bg-[#0499d4]"
              >
                Request Quote on WhatsApp
              </a>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-white/20 bg-transparent text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Contact the Team
              </Link>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent text-sm font-semibold text-white transition hover:bg-[#1877F2] hover:border-[#1877F2]"
              >
                <FacebookIcon className="size-4" />
                Follow us on Facebook
              </a>
              <p className="pt-2 text-center text-xs text-white/40">
                Pulsemed Solutions Limited
              </p>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
