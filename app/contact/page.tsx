'use client'

import { FormEvent, useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import {
  EMAIL_DISPLAY,
  EMAIL_MAILTO,
  PHONE_TEL,
  SUPPORT_PHONE_DISPLAY,
  WHATSAPP_PHONE_DISPLAY,
  WHATSAPP_URL,
} from '@/lib/products'
import { Clock3, Mail, MessageCircle, Phone } from 'lucide-react'

const faqs = [
  {
    q: 'Do you offer bulk discounts?',
    a: 'Yes. We provide competitive pricing for bulk orders. Contact sales for a custom quote.',
  },
  {
    q: 'What is your delivery timeframe?',
    a: 'Standard delivery is typically 5–7 business days. Rush options are available for urgent needs.',
  },
  {
    q: 'Do you provide installation service?',
    a: 'Yes. We offer professional installation and training for most equipment. Additional fees may apply.',
  },
  {
    q: 'What warranty do you offer?',
    a: 'All products include a minimum 1-year manufacturer warranty. Extended warranties are available.',
  },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facility: '',
    message: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', facility: '', message: '' })
  }

  return (
    <>
      <Header />
      <main>
        <section>
          <Container className="py-14 sm:py-16">
            <div className="neu-surface rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
              <p className="mb-3 font-display text-sm font-semibold tracking-[0.28em] text-secondary">
                PULSEMED
              </p>
              <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink text-balance sm:text-5xl">
                Talk with our team
              </h1>
              <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">
                Inquiries, equipment consultations, installation support, or partnership conversations —
                we are ready to help.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                {[
                  {
                    icon: MessageCircle,
                    title: 'WhatsApp',
                    body: (
                      <>
                        <a
                          href={WHATSAPP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-ink transition hover:text-secondary"
                        >
                          {WHATSAPP_PHONE_DISPLAY}
                        </a>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Fastest for quotes and urgent support
                        </p>
                      </>
                    ),
                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    body: (
                      <a
                        href={PHONE_TEL}
                        className="text-lg font-semibold text-ink transition hover:text-secondary"
                      >
                        {SUPPORT_PHONE_DISPLAY}
                      </a>
                    ),
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    body: (
                      <a
                        href={EMAIL_MAILTO}
                        className="text-lg font-semibold text-ink transition hover:text-secondary"
                      >
                        {EMAIL_DISPLAY}
                      </a>
                    ),
                  },
                  {
                    icon: Clock3,
                    title: 'Service Hours',
                    body: (
                      <>
                        <p className="text-ink">Monday – Friday</p>
                        <p className="text-muted-foreground">9:00 AM – 5:00 PM EAT</p>
                        <p className="mt-2 text-sm text-muted-foreground">WhatsApp available 24/7</p>
                      </>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="neu-surface rounded-2xl p-6">
                    <div className="mb-3 flex items-center gap-2 text-secondary">
                      <item.icon className="size-4" />
                      <h3 className="text-sm font-semibold uppercase tracking-wider">{item.title}</h3>
                    </div>
                    {item.body}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="neu-surface rounded-[1.75rem] p-6 sm:p-8 lg:p-10">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  Send a message
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share a few details and we will follow up shortly.
                </p>

                {submitted ? (
                  <div className="neu-btn mt-6 rounded-xl px-4 py-3 text-sm text-ink">
                    Thank you. We will get back to you soon.
                  </div>
                ) : null}

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-1">
                    <span className="mb-2 block text-sm font-medium text-ink">Full name</span>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                      placeholder="Your name"
                    />
                  </label>

                  <label className="block sm:col-span-1">
                    <span className="mb-2 block text-sm font-medium text-ink">Email address</span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                      placeholder="you@facility.com"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-ink">Facility name</span>
                    <input
                      type="text"
                      value={formData.facility}
                      onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                      className="neu-input w-full rounded-xl px-4 py-3 text-sm text-ink"
                      placeholder="Hospital / clinic name"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-ink">Message</span>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="neu-input w-full resize-none rounded-xl px-4 py-3 text-sm text-ink"
                      placeholder="Tell us what you need..."
                    />
                  </label>
                </div>

                <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>
          </Container>
        </section>

        <section className="pb-20 sm:pb-28">
          <Container>
            <SectionHeading eyebrow="FAQ" title="Common questions" className="mb-8" />
            <div className="grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="neu-surface rounded-2xl p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {item.q}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
