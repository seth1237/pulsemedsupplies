import Link from 'next/link'
import {
  Ambulance,
  BedDouble,
  Baby,
  HeartPulse,
  Microscope,
  ScanLine,
  Scissors,
  Smile,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import Reveal from '@/components/reveal'
import { cn } from '@/lib/utils'

export const DEPARTMENTS: { name: string; icon: LucideIcon; blurb: string }[] = [
  { name: 'Theatre', icon: Scissors, blurb: 'Operating tables, lights, and surgical units' },
  { name: 'ICU', icon: HeartPulse, blurb: 'Critical care beds, monitors, and support' },
  { name: 'Triage', icon: Ambulance, blurb: 'Emergency assessment and first response' },
  { name: 'Maternity & Neonatal', icon: Baby, blurb: 'Delivery, infant care, and warmers' },
  { name: 'Wards', icon: BedDouble, blurb: 'Hospital beds, furniture, and patient care' },
  { name: "Doctor's Room", icon: Stethoscope, blurb: 'Consultation and diagnostic essentials' },
  { name: 'Laboratory', icon: Microscope, blurb: 'Analysers, microscopes, and sterilisation' },
  { name: 'Radiology', icon: ScanLine, blurb: 'Imaging equipment and accessories' },
  { name: 'Dental', icon: Smile, blurb: 'Dental chairs, units, and instruments' },
]

export default function DepartmentGrid({ className }: { className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 lg:gap-4', className)}>
      {DEPARTMENTS.map((department, index) => (
        <Reveal key={department.name} delay={(index % 3) * 70}>
          <Link
            href={`/products?department=${encodeURIComponent(department.name)}`}
            className="neu-surface group flex h-full items-start gap-3 rounded-xl p-4 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-md sm:p-5"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors duration-300 group-hover:bg-secondary group-hover:text-white">
              <department.icon className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold text-ink sm:text-base">
                {department.name}
              </span>
              <span className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
                {department.blurb}
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
