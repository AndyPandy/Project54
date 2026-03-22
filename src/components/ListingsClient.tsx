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
  const [showMap, setShowMap] = useState(false)
  const mapKey = apartments.map((a) => a.id).join(',')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-brand-dark/8 p-5 sticky top-24">
            <h2 className="text-sm font-black text-brand-navy uppercase tracking-wide mb-5">Filtrera annonser</h2>
            <ApartmentFilters searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => setShowMap((v) => !v)} />
          </div>
        </div>

        {/* Image / Map + Listings */}
        <div className="flex-1 space-y-6">
          {showMap ? (
            <ListingsMap key={mapKey} apartments={apartments} />
          ) : (
            <div className="relative w-full h-72 rounded-2xl overflow-hidden bg-brand-dark/30">
              <img src="/hero.jpeg" alt="Stockholm" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white font-black text-2xl font-sans drop-shadow">Hitta din nästa bostad</p>
                <p className="text-white/80 text-sm mt-1 drop-shadow">Bläddra bland {apartments.length} {apartments.length === 1 ? 'annons' : 'annonser'}</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {apartments.map((apt) => (
                <ApartmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
