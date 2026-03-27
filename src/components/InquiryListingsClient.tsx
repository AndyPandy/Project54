'use client'

import { useState } from 'react'
import Link from 'next/link'
import InquiryCard from '@/components/InquiryCard'
import InquiryFilters from '@/components/InquiryFilters'
import type { Inquiry } from '@/types'

interface Props {
  inquiries: Inquiry[]
  searchParams: { [key: string]: string | undefined }
}

export default function InquiryListingsClient({ inquiries, searchParams }: Props) {
  const [showFilters, setShowFilters] = useState(false)

  const hasFilters = !!(
    searchParams.search || searchParams.minRooms || searchParams.maxRooms ||
    searchParams.minSize || searchParams.maxSize || searchParams.minFee ||
    searchParams.maxFee || searchParams.features
  )

  return (
    <div>
      {/* Page header */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-10 pb-6">
        <h1 className="font-raleway font-light text-2xl md:text-3xl text-brand-navy uppercase tracking-[0.1em]">
          Köpförfrågningar
        </h1>
        <p className="text-xs text-brand-muted mt-2 font-raleway tracking-[0.05em]">
          Privatpersoner som söker bostad — kontakta dem direkt.
        </p>
      </div>

      {/* Desktop horizontal filter bar */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="hidden lg:block border-b border-brand-dark py-6">
          <InquiryFilters horizontal searchParams={searchParams} count={inquiries.length} />
        </div>
      </div>

      {/* Count row */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="hidden lg:flex items-center pt-6 pb-2">
          <span className="text-[9px] font-raleway font-light uppercase tracking-[0.12em] text-brand-muted">
            {inquiries.length} {inquiries.length !== 1 ? 'förfrågningar' : 'förfrågan'}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pb-24 md:pb-8">
        <div className="pt-4 lg:pt-0">
          {inquiries.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-brand-muted text-sm">Inga förfrågningar matchar dina filter.</p>
              <Link href="/kopforfragan" className="text-brand-navy text-xs font-bold uppercase tracking-[0.1em] hover:opacity-60 mt-3 inline-block transition-opacity">
                Rensa filter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {inquiries.map((inq) => (
                <InquiryCard key={inq.id} inquiry={inq} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-offwhite border-t border-brand-dark px-4 py-3 flex gap-3">
        <button
          onClick={() => setShowFilters(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-navy text-white font-bold text-[11px] uppercase tracking-[0.1em]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6M11 16h2" />
          </svg>
          Filtrera
          {hasFilters && <span className="bg-white text-brand-navy rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-black">!</span>}
        </button>
      </div>

      {/* Mobile filter bottom sheet */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="relative bg-brand-offwhite max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-dark flex-shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(false)} className="text-brand-muted hover:text-brand-navy transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-[11px] font-bold text-brand-navy uppercase tracking-[0.12em]">Filtrera</h2>
              </div>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <InquiryFilters searchParams={searchParams} count={inquiries.length} />
            </div>
            <div className="px-5 py-4 border-t border-brand-dark flex-shrink-0">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-brand-navy text-white text-[11px] font-bold uppercase tracking-[0.1em] py-3"
              >
                Visa {inquiries.length} {inquiries.length === 1 ? 'förfrågan' : 'förfrågningar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
