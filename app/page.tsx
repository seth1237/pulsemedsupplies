import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'
import ProductList from '@/components/product-list'
import HeroCarousel from '@/components/hero-carousel'
import DepartmentGrid from '@/components/department-grid'
import Reveal from '@/components/reveal'
import { buttonVariants } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/products'
import { cn } from '@/lib/utils'
import { ArrowRight, ShieldCheck, Wrench, Handshake } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Certified Quality',
    description: 'Equipment selected to meet international medical standards and Kenyan facility requirements.',
  },
  {
    icon: Wrench,
    title: 'Expert Support',
    description: 'Installation, commissioning, preventive maintenance, and biomedical engineering in Kenya.',
  },
  {
    icon: Handshake,
    title: 'Partnership Focused',
    description: 'Long-term relationships with hospitals, clinics, and diagnostic centres across the country.',
  },
]

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <HeroCarousel>
          <Container className="flex flex-1 flex-col justify-end pb-20 pt-24 sm:pb-24 sm:pt-28 lg:justify-center lg:pb-28">
            <div className="max-w-2xl animate-fade-up">
              <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Medical equipment for East African hospitals and diagnostic facilities
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base text-pretty">
                PulseMed Solutions Limited supplies, installs, and services precision lab analyzers, microscopes, autoclaves, and clinical equipment—delivering dependable technical support to keep vital healthcare operations running without interruption.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-ink transition hover:bg-[#f0a400]"
                >
                  Browse Products
                  <ArrowRight className="size-3.5" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/35 bg-transparent px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  WhatsApp Quote Request
                </a>
              </div>
            </div>
          </Container>
        </HeroCarousel>

        <section className="py-14 sm:py-16">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Departments"
                title="Shop by department"
                description="Equipment for every part of your facility — from theatre and ICU to maternity, wards, laboratory, radiology, and dental."
                className="mb-8"
              />
            </Reveal>
            <DepartmentGrid />
          </Container>
        </section>

        <section className="border-y border-border bg-white py-14 sm:py-16">
          <Container>
            <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Catalogue"
                title="Featured equipment"
                description="A selection from across our departments. Browse the full catalogue for everything we supply."
              />
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'shrink-0 self-start sm:self-auto',
                )}
              >
                View all products
                <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
            <ProductList limit={8} showViewMore compact columns={4} />
          </Container>
        </section>

        <section className="py-14 sm:py-16">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Why Pulsemed"
                title="A Kenya-based partner for dependable healthcare delivery"
                description="We focus on compliant equipment, practical support, and relationships that last beyond delivery day."
                className="mb-10"
              />
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {values.map((item, index) => (
                <Reveal
                  key={item.title}
                  delay={index * 90}
                  className="neu-surface rounded-xl p-6"
                >
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <item.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-14 sm:pb-20">
          <Container>
            <Reveal className="rounded-2xl bg-ink px-6 py-10 text-white sm:px-10 sm:py-12">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Next step
                  </p>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                    Ready to equip your facility?
                  </h2>
                  <p className="mt-3 text-sm text-white/70 sm:text-base">
                    Tell us what your departments need. We will help you select, quote, install,
                    and support the right equipment.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <Link
                    href="/contact"
                    className={cn(buttonVariants({ variant: 'default', size: 'sm' }))}
                  >
                    Start a Conversation
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
                  >
                    WhatsApp Sales
                  </a>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
