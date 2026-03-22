'use client'

import { useState } from 'react'
import Link from 'next/link'
import ApartmentCard from '@/components/ApartmentCard'
import ApartmentFilters from '@/components/ApartmentFilters'
import ListingsMap from '@/components/ListingsMap'
import type { Apartment } from '@/types'

interface Props {
  apartments: Apartment[]
  searchParams: { [key: string]: string | undefined }
}

export default function ListingsClient({ apartments, searchParams }: Props) {
  const [showMap, setShowMap]         = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const mapKey = apartments.map((a) => a.id).join(',')

  const hasFilters = !!(
    searchParams.search || (searchParams.listingType && searchParams.listingType !== 'all') ||
    searchParams.minPrice || searchParams.maxPrice || searchParams.minRooms ||
    searchParams.maxRooms || searchParams.minSize || searchParams.maxSize || searchParams.features
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Desktop filters sidebar */}
        <div className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-brand-dark/8 p-5 sticky top-24">
            <h2 className="text-sm font-black text-brand-navy uppercase tracking-wide mb-5">Filtrera annonser</h2>
            <ApartmentFilters searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => setShowMap((v) => !v)} />
          </div>
        </div>

        {/* Map / Image + Listings */}
        <div className="flex-1 space-y-4">
          {showMap ? (
            <ListingsMap key={mapKey} apartments={apartments} />
          ) : (
            <div className="relative w-full h-52 md:h-72 rounded-2xl overflow-hidden bg-brand-dark/30">
              <img src="/hero.jpeg" alt="Stockholm" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-black text-xl md:text-2xl font-sans drop-shadow">Hitta din nästa bostad</p>
                <p className="text-white/80 text-sm mt-0.5 drop-shadow">{apartments.length} {apartments.length === 1 ? 'annons' : 'annonser'}</p>
              </div>
            </div>
          )}

          {apartments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="text-brand-muted font-medium">Inga annonser matchar dina filter.</p>
              <Link href="/" className="text-brand-green font-bold text-sm hover:underline mt-2 inline-block">Rensa filter</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {apartments.map((apt) => (
                <ApartmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-3 flex gap-3">
        <button
          onClick={() => setShowFilters(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-navy text-white rounded-xl font-bold text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6M11 16h2" />
          </svg>
          Filtrera
          {hasFilters && <span className="bg-brand-green text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-black">!</span>}
        </button>
        <button
          onClick={() => setShowMap((v) => !v)}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-navy text-brand-navy rounded-xl font-bold text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          {showMap ? 'Lista' : 'Karta'}
        </button>
      </div>

      {/* Mobile filter bottom sheet */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white rounded-t-2xl max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-base font-black text-brand-navy">Filtrera annonser</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-brand-navy text-white text-sm font-bold px-4 py-1.5 rounded-full"
              >
                Visa {apartments.length} {apartments.length === 1 ? 'annons' : 'annonser'}
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <ApartmentFilters searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => { setShowMap((v) => !v); setShowFilters(false) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
