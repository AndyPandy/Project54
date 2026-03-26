'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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

      {/* Hero — always visible */}
      <div className="relative w-full h-[70vh] lg:h-[56rem] overflow-hidden bg-brand-dark/30">
        {heroImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{
              opacity: i === heroIndex ? 1 : 0,
              filter: 'saturate(0.75) contrast(1.08) brightness(0.84)',
              transition: 'opacity 2.5s ease-in-out',
            }}
          />
        ))}
        {/* Warm charcoal overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(25,24,23,0.65) 0%, rgba(25,24,23,0.35) 50%, rgba(25,24,23,0.15) 100%)' }} />
        {/* Hero text — centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-raleway font-bold text-white uppercase tracking-[0.08em] text-3xl md:text-5xl lg:text-6xl leading-tight max-w-4xl drop-shadow">
            Hitta din nya bostad.
          </p>
          <p className="font-raleway font-normal text-white/85 uppercase tracking-[0.08em] text-base md:text-2xl lg:text-3xl leading-tight max-w-4xl drop-shadow mt-3">
            Utan mäklaravgifter. Utan krångel.
          </p>
          <a
            href="#listings"
            className="mt-8 flex flex-col items-center gap-3 group"
          >
            <span className="font-raleway font-bold text-white uppercase tracking-[0.2em] text-sm border-b border-white/60 pb-0.5 group-hover:border-white group-hover:text-white transition">
              Sök här
            </span>
            <svg
              className="w-5 h-5 text-white/70 group-hover:text-white transition animate-bounce"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Map — shown below hero when toggled */}
      {showMap && (
        <div id="map" className="max-w-5xl mx-auto px-4 lg:px-8 pt-10 pb-6">
          <ListingsMap key={mapKey} apartments={apartments} />
        </div>
      )}

      {/* Horizontal filter bar + Listings — centered */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pb-24 md:pb-8">

        {/* Desktop horizontal filter bar */}
        <div id="listings" className="hidden lg:block border-b border-brand-dark py-10">
          <ApartmentFilters horizontal searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => setShowMap((v) => !v)} />
        </div>

        {/* Count row — below filter bar, above listings */}
        <div className="hidden lg:flex items-center justify-between pt-6 pb-2">
          <span className="text-[9px] font-raleway font-light uppercase tracking-[0.12em] text-brand-muted">
            {apartments.length} {apartments.length !== 1 ? 'annonser' : 'annons'}
          </span>
          <select
            value={searchParams.sort ?? ''}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              if (e.target.value) params.set('sort', e.target.value)
              else params.delete('sort')
              router.push(`/?${params.toString()}`, { scroll: false })
            }}
            className="text-[9px] font-raleway font-medium text-brand-navy/60 border border-brand-navy/20 bg-brand-offwhite px-2 py-1.5 focus:outline-none focus:border-brand-navy/50 transition"
          >
            <option value="">Nyast</option>
            <option value="price_asc">Pris: lägst</option>
            <option value="price_desc">Pris: högst</option>
            <option value="size_desc">Störst</option>
            <option value="size_asc">Minst</option>
            <option value="rooms_desc">Flest rum</option>
          </select>
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
        onClick={() => { setShowMap((v) => !v); setTimeout(() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }), 50) }}
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
                onClick={() => { setShowMap((v) => !v); setShowFilters(false); setTimeout(() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' }), 50) }}
                className="border border-brand-sage text-brand-sage text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {showMap ? 'Visa lista' : 'Se på karta'}
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4">
              <ApartmentFilters searchParams={searchParams} count={apartments.length} showMap={showMap} onToggleMap={() => { setShowMap((v) => !v); setShowFilters(false) }} />
            </div>
            <div className="px-5 py-4 border-t border-brand-dark flex-shrink-0">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-brand-navy text-white text-[11px] font-bold uppercase tracking-[0.1em] py-3"
              >
                Visa {apartments.length} {apartments.length === 1 ? 'annons' : 'annonser'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
