import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'
import { DEPARTMENTS } from '@/components/department-grid'
import FacebookIcon from '@/components/facebook-icon'
import Reveal from '@/components/reveal'
import { buttonVariants } from '@/components/ui/button'
import { FACEBOOK_URL, LOGO_SQUARE_URL, WHATSAPP_URL } from '@/lib/products'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

const values = [
  {
    title: 'Reliability',
    desc: 'Dependable medical equipment and consistent post-sale support.',
  },
  {
    title: 'Innovation',
    desc: 'Practical technology choices that improve clinical workflows.',
  },
  {
    title: 'Compliance',
    desc: 'Solutions aligned with international medical standards.',
  },
  {
    title: 'Partnership',
    desc: 'Long-term relationships built on trust and responsiveness.',
  },
]

const regions = ['Kenya', 'Uganda', 'Tanzania']

export default function About() {
  return (
    <>
      <Header />
      <main>
        <section>
          <Container className="py-14 sm:py-16">
            <div className="neu-surface rounded-2xl px-6 py-12 sm:px-10 sm:py-16">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                About us
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink text-balance sm:text-5xl">
                Your medical equipment partner in Kenya
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Pulsemed Solutions Limited supplies medical equipment for every department of a
                healthcare facility — from theatre and ICU to maternity, wards, laboratory,
                radiology, and dental — with installation, commissioning, and biomedical support
                from Nairobi.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal className="neu-surface rounded-2xl p-6 sm:p-8 lg:p-10">
                <SectionHeading
                  eyebrow="Mission"
                  title="Equip healthcare facilities with solutions they can rely on"
                  description="We support hospitals, clinics, diagnostic centres, NGOs, and faith-based organisations with compliant equipment and hands-on technical support."
                />
                <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Whether you are fitting out a new facility, upgrading a single department, or
                    replacing one item, we help you choose equipment that fits your clinical needs
                    and budget.
                  </p>
                  <p>
                    Our work covers the full lifecycle, from sourcing and delivery to installation,
                    commissioning, user training, and ongoing maintenance.
                  </p>
                </div>
              </Reveal>

              <Reveal
                delay={120}
                className="neu-surface flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-10 text-center sm:min-h-[360px] sm:p-12"
              >
                <div className="relative mb-8 h-44 w-44 sm:h-52 sm:w-52">
                  <Image
                    src={LOGO_SQUARE_URL}
                    alt="Pulsemed Solutions Limited"
                    fill
                    className="object-contain"
                    sizes="208px"
                    priority
                  />
                </div>
                <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Healthcare equipment partner
                </p>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                  Supply · Install · Maintain
                </p>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="What we cover"
                title="Equipment for every department"
                description="One partner for the whole facility, so procurement, installation, and servicing stay simple."
                className="mb-8"
              />
            </Reveal>
            <Reveal delay={100} className="flex flex-wrap gap-2.5">
              {DEPARTMENTS.map((department) => (
                <Link
                  key={department.name}
                  href={`/products?department=${encodeURIComponent(department.name)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-secondary hover:text-secondary"
                >
                  <department.icon className="size-4 text-secondary" strokeWidth={1.75} />
                  {department.name}
                </Link>
              ))}
            </Reveal>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow="Values"
                title="What guides every engagement"
                className="mb-10"
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 90} className="neu-surface rounded-2xl p-6">
                  <p className="mb-4 font-display text-sm font-semibold text-secondary">
                    0{index + 1}
                  </p>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-20 sm:pb-28">
          <Container>
            <Reveal className="neu-surface rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
                <SectionHeading
                  eyebrow="Presence"
                  title="Headquartered in Nairobi"
                  description="We serve hospitals and clinics across Kenya first, with active partnerships in Uganda and Tanzania."
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  {regions.map((region) => (
                    <div key={region} className="rounded-xl border border-border px-5 py-6">
                      <MapPin className="mb-4 size-5 text-secondary" strokeWidth={1.75} />
                      <p className="font-display text-lg font-semibold text-ink">{region}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}
                >
                  Connect with Our Team
                </a>
                <Link href="/contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                  Contact form
                </Link>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-[#1877F2] text-white hover:bg-[#166fe0]',
                  )}
                >
                  <FacebookIcon className="size-4" />
                  Facebook
                </a>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
