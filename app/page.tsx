import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'
import ProductList from '@/components/product-list'
import HeroCarousel from '@/components/hero-carousel'
import { buttonVariants } from '@/components/ui/button'
import { WHATSAPP_URL } from '@/lib/products'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Handshake,
  FlaskConical,
  Activity,
  Scan,
  Stethoscope,
} from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Certified Quality',
    description: 'Equipment selected to meet international medical standards and facility requirements.',
  },
  {
    icon: Wrench,
    title: 'Expert Support',
    description: 'Installation, commissioning, preventive maintenance, and biomedical engineering.',
  },
  {
    icon: Handshake,
    title: 'Partnership Focused',
    description: 'Long-term relationships built on reliability, compliance, and responsive service.',
  },
]

const departments = [
  {
    icon: Activity,
    title: 'Triage & Emergency',
    description: 'Rapid-response tools for first-line clinical assessment.',
    href: '/products',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory',
    description: 'Analysers, microscopes, and sterilisation setups.',
    href: '/products',
  },
  {
    icon: Stethoscope,
    title: 'ICU Setup',
    description: 'Beds, monitors, ventilators, and infusion systems.',
    href: '/products',
  },
  {
    icon: Scan,
    title: 'Radiology & Dental',
    description: 'Imaging and dental equipment for specialised care.',
    href: '/products',
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
              <p className="mb-4 font-display text-sm font-semibold tracking-[0.28em] text-primary">
                PULSEMED
              </p>
              <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Medical equipment built for real clinical work
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base text-pretty">
                Supply, install, and support professional-grade equipment for hospitals, labs, and
                care networks across East Africa.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-ink transition hover:bg-[#f0a400]"
                >
                  Browse Equipment
                  <ArrowRight className="size-3.5" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/35 bg-transparent px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Talk to Sales
                </a>
              </div>
            </div>
          </Container>
        </HeroCarousel>

        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Departments"
              title="Solutions for every clinical setting"
              description="Explore equipment organised around the departments your facility actually runs."
              className="mb-8"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {departments.map((dept) => (
                <Link
                  key={dept.title}
                  href={dept.href}
                  className="neu-surface group rounded-xl p-4 transition duration-300 hover:-translate-y-0.5"
                >
                  <dept.icon className="mb-3 size-4 text-secondary transition group-hover:scale-110" strokeWidth={1.75} />
                  <h3 className="font-display text-sm font-semibold tracking-tight text-ink sm:text-base">
                    {dept.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {dept.description}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-14 sm:py-16">
          <Container>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Catalogue"
                title="Featured equipment"
                description="A snapshot of our range — from triage essentials to ICU and laboratory systems."
              />
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'shrink-0 self-start sm:self-auto',
                )}
              >
                View full catalogue
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ProductList limit={16} showViewMore={false} compact columns={4} />
          </Container>
        </section>

        <section className="relative overflow-hidden py-14 sm:py-16">
          <Container className="relative">
            <SectionHeading
              eyebrow="Why Pulsemed"
              title="A partner for dependable healthcare delivery"
              description="We focus on compliant equipment, practical support, and relationships that last beyond delivery day."
              className="mb-10"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {values.map((item, index) => (
                <div
                  key={item.title}
                  className="neu-surface animate-fade-up rounded-xl p-5"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <item.icon className="mb-4 size-5 text-secondary" strokeWidth={1.75} />
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-14 sm:pb-20">
          <Container>
            <div className="neu-surface relative overflow-hidden rounded-[1.75rem] bg-[#eef3f8] px-5 py-10 sm:px-8 sm:py-12">
              <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative grid gap-6 lg:grid-cols-[1.4fr_auto] lg:items-end">
                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Next step
                  </p>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl text-balance">
                    Ready to equip your facility?
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    Tell us what your department needs. We will help you select, quote, and support
                    the right equipment.
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
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
