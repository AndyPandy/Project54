'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Till Salu',        href: '/' },
  { label: 'Köpförfrågningar', href: '/kopforfragan' },
  { label: 'Uthyrning',        href: '/uthyrning' },
]

export default function Navbar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-brand-offwhite border-b border-brand-dark">
      <div className="max-w-6xl mx-auto px-4 h-14 relative flex items-center justify-center">

        {/* Logo — left */}
        <Link href="/" className="absolute left-4 flex-shrink-0">
          <Image src="/logo.png" alt="Nordhem" width={130} height={44} className="object-contain" />
        </Link>

        {/* Nav tabs — centered */}
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => {
            const active = isActive(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 h-14 flex items-center text-xs font-raleway font-light uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                  active ? 'text-brand-navy' : 'text-brand-muted hover:text-brand-navy'
                }`}
              >
                <span className={`border-b-2 pb-0.5 ${active ? 'border-brand-sage' : 'border-transparent'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Admin — right */}
        <Link
          href="/admin"
          className="absolute right-4 text-[11px] font-normal uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition-colors"
        >
          Admin
        </Link>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-brand-offwhite border-t border-brand-dark flex">
        {TABS.map((tab) => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex items-center justify-center h-14 text-[11px] font-raleway font-medium uppercase tracking-[0.1em] transition-colors ${
                active ? 'text-brand-navy' : 'text-brand-navy/50'
              }`}
            >
              <span className={`border-b-2 pb-0.5 ${active ? 'border-brand-sage' : 'border-transparent'}`}>
                {tab.label === 'Köpförfrågningar' ? 'Förfrågningar' : tab.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
