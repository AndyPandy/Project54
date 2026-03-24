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
    <header className="sticky top-0 z-50 bg-brand-offwhite/96 backdrop-blur-sm border-b border-brand-dark">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-8">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="Nordhem" width={130} height={44} className="object-contain" />
        </Link>

        {isHome && (
          <nav className="hidden md:flex items-center flex-1 gap-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <Link
                  key={tab.value}
                  href={tab.value === 'all' ? '/' : `/?listingType=${tab.value}`}
                  className={`px-4 h-14 flex items-center text-xs font-bold uppercase tracking-[0.1em] transition-colors whitespace-nowrap border-b-2 -mb-px ${
                    isActive
                      ? 'text-brand-navy border-brand-navy'
                      : 'text-brand-muted border-transparent hover:text-brand-navy'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        )}

        {!isHome && <div className="flex-1" />}
        {isHome && <div className="flex-1 md:hidden" />}

        <Link
          href="/admin"
          className="flex-shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}
