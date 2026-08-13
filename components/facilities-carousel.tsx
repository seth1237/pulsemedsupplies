'use client'

import { useEffect, useRef } from 'react'
import Container from '@/components/container'
import SectionHeading from '@/components/section-heading'

const facilities = [
  'Tenwek Hospital',
  'Bethesda Hospital',
  'Equity Afia Group',
  'Bamburi Medical Centre',
  'Tawfiq Hospital',
  'JOOTRH',
  'Avenue Healthcare',
  'Kisumu District Hospital',
  'Mediforte Hospital',
  'Oasis Specialist Hospital',
  "St. Mary's Mission Hospital",
]

export default function FacilitiesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    let offset = 0
    const speed = 0.45

    const tick = () => {
      offset += speed
      const half = track.scrollWidth / 2
      if (offset >= half) offset = 0
      track.style.transform = `translate3d(-${offset}px, 0, 0)`
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <Container className="mb-10">
        <SectionHeading
          eyebrow="Trusted partners"
          title="Supporting leading healthcare facilities"
          description="Kenyan hospitals and diagnostic laboratories we support — plus regional partners in Uganda and Tanzania."
          align="center"
          className="mx-auto"
        />
      </Container>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#eef3f8] to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#eef3f8] to-transparent sm:w-20" />

        <div className="overflow-hidden">
          <div ref={trackRef} className="flex w-max gap-4 will-change-transform px-3 sm:px-4">
            {[...facilities, ...facilities].map((facility, index) => (
              <div
                key={`${facility}-${index}`}
                className="neu-btn flex h-14 shrink-0 items-center rounded-full px-6 text-sm font-semibold text-ink/80"
              >
                {facility}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
