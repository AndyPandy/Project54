'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ApartmentCard from '@/components/ApartmentCard'
import ApartmentFilters from '@/components/ApartmentFilters'
import ListingsMap from '@/components/ListingsMap'
import HeroTypewriter from '@/components/HeroTypewriter'
import type { Apartment } from '@/types'

interface Props {
  apartments: Apartment[]
  searchParams: { [key: string]: string | undefined }
}

export default function ListingsClient({ apartments, searchParams }: Props) {
  const [showMap, setShowMap]         = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [heroIndex, setHeroIndex]     = useState(0)
  const heroImages = ['/hero.jpeg', '/hero2.jpg', '/hero3.jpg']

  useEffect(() => {
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [])
  const mapKey = apartments.map((a) => a.id).join(',')

  const hasFilters = !!(
    searchParams.search || (searchParams.listingType && searchParams.listingType !== 'all') ||
    searchParams.minPrice || searchParams.maxPrice || searchParams.minRooms ||
    searchParams.maxRooms || searchParams.minSize || searchParams.maxSize || searchParams.features
  )

  return (
    <div>

      {/* Hero / Map — full viewport width */}
      {showMap ? (
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6">
          <ListingsMap key={mapKey} apartments={apartments} />
        </div>
      ) : (
        <div className="relative w-full h-[70vh] lg:h-[28rem] overflow-hidden bg-brand-dark/30">
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
              style={{
                opacity: i === heroIndex ? 1 : 0,
                filter: 'saturate(0.75) contrast(1.08) brightness(0.84)',
              }}
            />
          ))}
          {/* Warm charcoal overlay — B&O #191817 */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(25,24,23,0.72) 0%, rgba(25,24,23,0.18) 55%, rgba(25,24,23,0.04) 100%)' }} />
          <HeroTypewriter count={apartments.length} />
        </div>
      )}

      {/* Horizontal filter bar + Listings — centered */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pb-24 md:pb-8">

        {/* Desktop horizontal filter bar */}
        <div className="hidden lg:block border-b border-brand-dark py-10">
          <ApartmentFilters horizontal searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => setShowMap((v) => !v)} />
        </div>

        {/* Count row — below filter bar, above listings */}
        <div className="hidden lg:flex items-center pt-6 pb-2">
          <span className="text-[9px] font-raleway font-light uppercase tracking-[0.12em] text-brand-muted">
            {apartments.length} {apartments.length !== 1 ? 'annonser' : 'annons'}
          </span>
        </div>

        {/* Listings */}
        <div className="pt-4 lg:pt-0">
          {apartments.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-brand-muted text-sm">Inga annonser matchar dina filter.</p>
              <Link href="/" className="text-brand-navy text-xs font-bold uppercase tracking-[0.1em] hover:opacity-60 mt-3 inline-block transition-opacity">Rensa filter</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
              {apartments.map((apt) => (
                <ApartmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating map button — desktop */}
      <button
        onClick={() => { setShowMap((v) => !v); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        className="hidden lg:flex fixed bottom-8 right-8 z-40 items-center gap-2 bg-brand-navy text-white px-5 py-3 text-[10px] font-raleway font-light uppercase tracking-[0.12em] shadow-lg hover:bg-black transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        {showMap ? 'Visa lista' : 'Visa på karta'}
      </button>

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
        <button
          onClick={() => { setShowMap((v) => !v); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-navy text-brand-navy font-bold text-[11px] uppercase tracking-[0.1em]"
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
          <div className="relative bg-brand-offwhite max-h-[88vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-dark flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-brand-muted hover:text-brand-navy transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-[11px] font-bold text-brand-navy uppercase tracking-[0.12em]">Filtrera</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-brand-navy text-white text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2"
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
