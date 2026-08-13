'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const slides = [
  {
    src: '/products/thermometer.png',
    alt: 'Laboratory diagnostics equipment',
    label: 'Laboratory · Kenya',
  },
  {
    src: '/products/oxygen-meter.png',
    alt: 'Clinical analyser and monitoring',
    label: 'Lab Diagnostics',
  },
  {
    src: '/products/hospital-bed.png',
    alt: 'ICU hospital bed',
    label: 'ICU Setup',
  },
  {
    src: '/products/wheelchair.png',
    alt: 'Professional wheelchair',
    label: 'Triage & Emergency',
  },
  {
    src: '/products/blood-pressure.png',
    alt: 'Blood pressure monitor',
    label: 'Patient Monitoring',
  },
  {
    src: '/products/stethoscope.png',
    alt: 'Digital stethoscope',
    label: 'Clinical Assessment',
  },
]

const INTERVAL_MS = 5500

export default function HeroCarousel({
  children,
}: {
  children: React.ReactNode
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <section
      className="relative min-h-[88vh] overflow-hidden bg-ink text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={cn(
              'absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              index === active
                ? 'opacity-100 scale-100'
                : 'pointer-events-none opacity-0 scale-105',
            )}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/45" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[88vh] flex-col">
        {children}

        <div className="absolute inset-x-0 bottom-8 z-20 sm:bottom-10">
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
            <p className="text-xs font-medium tracking-[0.16em] text-white/55 uppercase">
              {slides[active].label}
            </p>

            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${slide.label}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    'relative h-1.5 overflow-hidden rounded-full transition-all duration-500',
                    index === active ? 'w-10 bg-white/25' : 'w-2.5 bg-white/30 hover:bg-white/50',
                  )}
                >
                  {index === active ? (
                    <span
                      key={`${active}-${paused}`}
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-full bg-primary',
                        paused ? 'w-full' : 'animate-hero-progress',
                      )}
                      style={paused ? undefined : { animationDuration: `${INTERVAL_MS}ms` }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
