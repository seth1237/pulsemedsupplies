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
    description: 'Long-term relationships with hospitals, labs, and diagnostic centres across the country.',
  },
]

const departments = [
  {
    icon: FlaskConical,
    title: 'Laboratory',
    description: 'Analysers, microscopes, autoclaves, and full lab setups for Kenyan hospitals and diagnostic centres.',
    href: '/products?department=lab',
    featured: true,
  },
  {
    icon: Activity,
    title: 'Triage & Emergency',
    description: 'Rapid-response tools for first-line clinical assessment.',
    href: '/products?department=Triage%20%26%20Emergency',
  },
  {
    icon: Stethoscope,
    title: 'ICU Setup',
    description: 'Beds, monitors, ventilators, and infusion systems.',
    href: '/products?department=ICU%20Setup',
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
                PULSEMED · KENYA
              </p>
              <h1 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Laboratory equipment for Kenyan hospitals and diagnostic labs
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base text-pretty">
                Pulsemed Solutions Limited supplies, installs, and supports lab analysers, microscopes,
                autoclaves, and clinical equipment from Nairobi — serving facilities across Kenya.
              </p>
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link
                  href="/products?department=lab"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-ink transition hover:bg-[#f0a400]"
                >
                  Browse Lab Equipment
                  <ArrowRight className="size-3.5" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/35 bg-transparent px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  WhatsApp a Lab Quote
                </a>
              </div>
            </div>
          </Container>
        </HeroCarousel>

        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Kenya focus"
              title="Built around the laboratory"
              description="Most Kenyan facilities start with a reliable lab. We equip haematology, chemistry, microscopy, and sterilisation — then support ICU, triage, and imaging."
              className="mb-8"
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {departments.map((dept) => (
                <Link
                  key={dept.title}
                  href={dept.href}
                  className={cn(
                    'neu-surface group rounded-xl p-4 transition duration-300 hover:-translate-y-0.5',
                    dept.featured && 'sm:col-span-2 lg:col-span-2 lg:p-6',
                  )}
                >
                  <dept.icon
                    className={cn(
                      'mb-3 text-secondary transition group-hover:scale-110',
                      dept.featured ? 'size-6' : 'size-4',
                    )}
                    strokeWidth={1.75}
                  />
                  <h3
                    className={cn(
                      'font-display font-semibold tracking-tight text-ink',
                      dept.featured ? 'text-lg sm:text-xl' : 'text-sm sm:text-base',
                    )}
                  >
                    {dept.title}
                    {dept.featured ? (
                      <span className="ml-2 rounded-md bg-secondary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                        Kenya priority
                      </span>
                    ) : null}
                  </h3>
                  <p
                    className={cn(
                      'mt-1.5 leading-relaxed text-muted-foreground',
                      dept.featured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm',
                    )}
                  >
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
                eyebrow="Lab catalogue"
                title="Featured laboratory equipment"
                description="Analysers, microscopes, and sterilisation systems selected for Kenyan diagnostic labs — plus supporting clinical equipment."
              />
              <Link
                href="/products?department=lab"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'shrink-0 self-start sm:self-auto',
                )}
              >
                View lab catalogue
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ProductList limit={8} showViewMore={false} compact columns={4} preferLab />
          </Container>
        </section>

        <section className="relative overflow-hidden py-14 sm:py-16">
          <Container className="relative">
            <SectionHeading
              eyebrow="Why Pulsemed"
              title="A Kenya-based partner for dependable healthcare delivery"
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
                    Ready to equip your laboratory?
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    Tell us what your Kenyan facility needs. We will help you select, quote, install,
                    and support the right lab and clinical equipment.
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
