'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'

const TABS = [
  { value: 'all',      label: 'Alla' },
  { value: 'rent',     label: 'Till uthyrning' },
  { value: 'sale',     label: 'Till salu' },
  { value: 'kommande', label: 'Kommande' },
]

export default function Navbar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const activeTab = searchParams.get('listingType') ?? 'all'
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 bg-brand-offwhite/95 backdrop-blur-md border-b border-brand-dark/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" alt="NyLya" width={160} height={60} className="object-contain grayscale brightness-0" />
        </Link>

        {isHome && (
          <nav className="hidden md:flex items-center flex-1 justify-center">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              const isKommande = tab.value === 'kommande'
              return (
                <Link
                  key={tab.value}
                  href={tab.value === 'all' ? '/' : `/?listingType=${tab.value}`}
                  className={`px-5 h-16 flex flex-col items-center justify-center gap-0.5 transition whitespace-nowrap font-raleway font-black text-lg ${
                    isActive
                      ? isKommande ? 'text-amber-700' : 'text-brand-navy'
                      : 'text-brand-muted hover:text-brand-navy'
                  }`}
                >
                  {tab.label}
                  <span className={`h-0.5 w-full rounded-full transition-colors ${
                    isActive
                      ? isKommande ? 'bg-amber-500' : 'bg-brand-navy'
                      : 'bg-transparent group-hover:bg-gray-300'
                  }`} />
                </Link>
              )
            })}
          </nav>
        )}

        {!isHome && <div className="flex-1" />}

        <Link
          href="/admin"
          className="flex-shrink-0 text-xs font-bold text-brand-muted hover:text-brand-navy border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition"
        >
          Admin →
        </Link>
      </div>
    </header>
  )
}
