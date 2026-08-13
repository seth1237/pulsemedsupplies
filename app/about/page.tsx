import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { LOGO_URL, WHATSAPP_URL } from '@/lib/products'
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
        <section className="relative overflow-hidden">
          <Container className="relative py-16 sm:py-20">
            <div className="neu-surface rounded-[2rem] px-6 py-12 sm:px-10 sm:py-16">
              <p className="mb-4 font-display text-sm font-semibold tracking-[0.28em] text-secondary">
                PULSEMED
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
                Built to support healthcare delivery across East Africa
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                We specialize in medical equipment and consumables supply, with installation,
                commissioning, preventive maintenance, and biomedical engineering support.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="neu-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
                <SectionHeading
                  eyebrow="Mission"
                  title="Equip facilities with solutions they can rely on"
                  description="Pulsemed supports hospitals, diagnostic centers, laboratories, NGOs, and faith-based organizations with compliant medical equipment and hands-on technical support."
                />
                <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Our work covers the full lifecycle of equipment — from sourcing and delivery to
                    installation, commissioning, and ongoing maintenance.
                  </p>
                  <p>
                    We focus on long-term partnerships that keep clinical environments operational,
                    compliant, and ready for care.
                  </p>
                </div>
              </div>

              <div className="neu-surface flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] p-10 text-center sm:p-12">
                <div className="relative mb-6 h-28 w-56">
                  <Image src={LOGO_URL} alt="Pulsemed" fill className="object-contain" />
                </div>
                <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Healthcare technology partner
                </p>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                  Supply · Install · Maintain · Support
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <SectionHeading
              eyebrow="Values"
              title="What guides every engagement"
              className="mb-10"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={value.title} className="neu-surface rounded-2xl p-6">
                  <p className="mb-4 font-display text-sm font-semibold text-secondary">
                    0{index + 1}
                  </p>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-20 sm:pb-28">
          <Container>
            <div className="neu-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
                <SectionHeading
                  eyebrow="Presence"
                  title="Active partnerships across the region"
                  description="We work with healthcare partners in Kenya, Uganda, and Tanzania to keep facilities equipped and supported."
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  {regions.map((region) => (
                    <div key={region} className="neu-btn rounded-2xl px-5 py-6">
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
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
