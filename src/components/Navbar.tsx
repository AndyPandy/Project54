'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'

const TABS = [
  { value: 'all',      label: 'Alla' },
  { value: 'rent',     label: 'Uthyrning' },
  { value: 'sale',     label: 'Till salu' },
  { value: 'kommande', label: 'Kommande' },
]

export default function Navbar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const activeTab = searchParams.get('listingType') ?? 'all'
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 bg-brand-offwhite border-b border-brand-dark">
      <div className="max-w-6xl mx-auto px-4 h-14 relative flex items-center justify-center">

        {/* Logo — left */}
        <Link href="/" className="absolute left-4 flex-shrink-0">
          <Image src="/logo.png" alt="Nordhem" width={130} height={44} className="object-contain" />
        </Link>

        {/* Nav tabs — centered */}
        {isHome && (
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <Link
                  key={tab.value}
                  href={tab.value === 'all' ? '/' : `/?listingType=${tab.value}`}
                  className={`px-4 h-14 flex items-center text-xs font-raleway font-light uppercase tracking-[0.15em] transition-colors whitespace-nowrap ${
                    isActive ? 'text-brand-navy' : 'text-brand-muted hover:text-brand-navy'
                  }`}
                >
                  <span className={`border-b-2 pb-0.5 ${isActive ? 'border-brand-sage' : 'border-transparent'}`}>
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* Admin — right */}
        <Link
          href="/admin"
          className="absolute right-4 text-[11px] font-normal uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}
