'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const nav = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/listings',
    label: 'Listings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    href: '/admin/listings/new',
    label: 'New',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 bg-brand-dark flex-col min-h-screen">
        <div className="px-5 py-5 border-b border-brand-navy/10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nordhem" width={130} height={48} className="flex-shrink-0 object-contain grayscale" />
          </Link>
          <p className="text-brand-muted text-xs mt-1 pl-10">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${isActive(item.href) ? 'bg-brand-navy/10 text-brand-navy' : 'text-brand-muted hover:text-brand-navy hover:bg-brand-navy/5'}`}
            >
              {item.icon}
              {item.label === 'New' ? 'New listing' : item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-brand-navy/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-muted hover:text-brand-navy hover:bg-brand-navy/5 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-muted hover:text-brand-navy hover:bg-brand-navy/5 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-brand-navy/10 flex items-center">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold transition ${isActive(item.href) ? 'text-brand-navy' : 'text-brand-muted'}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          target="_blank"
          className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-brand-muted"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-semibold text-brand-muted"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </nav>
    </>
  )
}
