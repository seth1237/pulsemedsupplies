'use client'

import Link from 'next/link'
import { EMAIL_MAILTO, PHONE_TEL, WHATSAPP_URL } from '@/lib/products'
import { Mail, MessageCircle, Phone } from 'lucide-react'

export default function ContactSidebar() {
  const items = [
    {
      href: WHATSAPP_URL,
      label: 'WhatsApp',
      icon: MessageCircle,
      external: true,
      className: 'bg-[#25D366] text-white hover:bg-[#1ebe57]',
    },
    {
      href: PHONE_TEL,
      label: 'Call',
      icon: Phone,
      external: false,
      className: 'bg-secondary text-white hover:bg-[#0499d4]',
    },
    {
      href: EMAIL_MAILTO,
      label: 'Email',
      icon: Mail,
      external: false,
      className: 'bg-primary text-ink hover:bg-[#f0a400]',
    },
  ]

  return (
    <div className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          className={`group flex items-center overflow-hidden rounded-l-xl shadow-lg transition-all ${item.className}`}
          aria-label={item.label}
        >
          <span className="flex size-11 items-center justify-center">
            <item.icon className="size-5" />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-xs font-bold uppercase tracking-wide transition-all duration-300 group-hover:max-w-[7rem] group-hover:pr-4">
            {item.label}
          </span>
        </a>
      ))}
      <Link
        href="/contact"
        className="group flex items-center overflow-hidden rounded-l-xl bg-ink text-white shadow-lg transition-all hover:bg-[#152033]"
        aria-label="Contact"
      >
        <span className="flex size-11 items-center justify-center text-xs font-bold">?</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-xs font-bold uppercase tracking-wide transition-all duration-300 group-hover:max-w-[7rem] group-hover:pr-4">
          Contact
        </span>
      </Link>
    </div>
  )
}
