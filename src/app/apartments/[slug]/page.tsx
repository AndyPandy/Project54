import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import ImageGallery from '@/components/ImageGallery'
import MapView from '@/components/MapView'
import ContactForm from '@/components/ContactForm'
import { LISTING_TAGS } from '@/lib/tags'
import ShowingsList from '@/components/ShowingsList'
import FloorPlanButton from '@/components/FloorPlanButton'
import type { Apartment, Showing } from '@/types'

async function getApartment(slug: string): Promise<Apartment | null> {
  const raw = await prisma.apartment.findUnique({ where: { slug, status: 'published' } })
  if (!raw) return null
  return {
    ...raw,
    images: JSON.parse(raw.images || '[]'),
    tags:   JSON.parse(raw.tags   || '[]'),
    status: raw.status as 'draft' | 'published',
    listingType: raw.listingType as 'rent' | 'sale' | 'kommande',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const apt = await getApartment(params.slug)
  if (!apt) return { title: 'Not Found' }
  return {
    title: apt.title,
    description: apt.description.slice(0, 160),
  }
}

async function getShowings(apartmentId: string): Promise<Showing[]> {
  const rows = await prisma.showing.findMany({
    where: { apartmentId },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })
  return rows.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))
}

export default async function ApartmentPage({ params }: { params: { slug: string } }) {
  const apt = await getApartment(params.slug)
  if (!apt) notFound()
  const showings = await getShowings(apt.id)

  const priceLabel =
    apt.listingType === 'rent'
      ? `${apt.price.toLocaleString('sv-SE')} kr/mån`
      : `${apt.price.toLocaleString('sv-SE')} kr`

  return (
    <>
      <Suspense fallback={null}><Navbar /></Suspense>

      <main className="pb-28 lg:pb-10">
        {/* Full-width gallery */}
        <ImageGallery images={apt.images} title={apt.title} />

        <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-muted mb-8 uppercase tracking-[0.08em]">
          <a href="/" className="hover:text-brand-navy transition-colors">Annonser</a>
          <span className="mx-2">›</span>
          <span className="text-brand-navy">{apt.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title + price */}
            <div>
              <div className="flex gap-2 mb-3">
                {apt.listingType === 'kommande' ? (
                  <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    Kommande
                  </span>
                ) : (
                  <span className={`inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white ${apt.listingType === 'rent' ? '' : 'bg-brand-green'}`} style={apt.listingType === 'rent' ? { backgroundColor: '#BE9CB3' } : {}}>
                    {apt.listingType === 'rent' ? 'Till uthyrning' : 'Till salu'}
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-black text-brand-navy font-serif">{apt.title}</h1>
                  <p className="text-brand-muted mt-1">{apt.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-brand-green">{priceLabel}</p>
                  {apt.listingType === 'sale' && (
                    <p className="text-xs text-brand-muted mt-1">Utropspris</p>
                  )}
                </div>
              </div>

              {/* Fact box */}
              <div className="mt-5 bg-brand-dark/30 border border-gray-300 rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3">
                  {apt.propertyType != null && apt.propertyType !== '' && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 22V12h6v10" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Bostadstyp</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.propertyType}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 12h16M12 4v16" /></svg>
                    <div>
                      <p className="text-xs text-brand-muted leading-none">Antal rum</p>
                      <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.rooms} rum</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    <div>
                      <p className="text-xs text-brand-muted leading-none">Boarea</p>
                      <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.sizeSqm} m²</p>
                    </div>
                  </div>
                  {apt.floor != null && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4a1 1 0 011-1h2a1 1 0 011 1v4m-4 0h4" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Våning</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.floor}</p>
                      </div>
                    </div>
                  )}
                  {apt.fee != null && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Avgift</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.fee.toLocaleString('sv-SE')} kr/mån</p>
                      </div>
                    </div>
                  )}
                  {apt.operatingCost != null && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Driftkostnad</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.operatingCost.toLocaleString('sv-SE')} kr/år</p>
                      </div>
                    </div>
                  )}
                  {apt.buildYear != null && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Byggår</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.buildYear}</p>
                      </div>
                    </div>
                  )}
                  {apt.tenure != null && apt.tenure !== '' && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <div>
                        <p className="text-xs text-brand-muted leading-none">Boendeform</p>
                        <p className="text-sm font-bold text-brand-navy mt-0.5">{apt.tenure}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags + floor plan button */}
            {(apt.tags.length > 0 || apt.floorPlan) && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {apt.tags.map((value) => {
                    const tag = LISTING_TAGS.find((t) => t.value === value)
                    if (!tag) return null
                    return (
                      <span key={value} className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border border-stone-300 ${tag.color}`}>
                        {tag.label}
                      </span>
                    )
                  })}
                </div>
                {apt.floorPlan && <FloorPlanButton floorPlan={apt.floorPlan} />}
              </div>
            )}

            {/* Description */}
            <div>
              <div className="bg-brand-dark/30 border border-gray-300 rounded-xl p-5">
                <h2 className="text-lg font-bold text-brand-navy mb-3">Om bostaden</h2>
                <p className="text-brand-muted leading-relaxed whitespace-pre-line">{apt.description}</p>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-lg font-bold text-brand-navy mb-3">Läge</h2>
              <MapView lat={apt.latitude} lng={apt.longitude} address={apt.address} />
            </div>
          </div>

          {/* Right column — contact + showings */}
          <div id="contact" className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <ContactForm apartmentTitle={apt.title} apartmentId={apt.id} />
              <ShowingsList showings={showings} apartmentTitle={apt.title} address={apt.address} />
            </div>
          </div>
        </div>
        </div>{/* /max-w-6xl */}
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-offwhite border-t border-brand-dark px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-brand-muted uppercase tracking-[0.08em] truncate">{apt.title}</p>
          <p className="text-base font-black text-brand-navy">{priceLabel}</p>
        </div>
        <a
          href="#contact"
          className="flex-shrink-0 bg-brand-navy text-white font-bold text-[11px] uppercase tracking-[0.1em] px-6 py-3"
        >
          Kontakta
        </a>
      </div>
    </>
  )
}
