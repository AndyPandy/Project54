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

      <main className="max-w-6xl mx-auto px-4 pt-6 pb-28 lg:pb-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-muted mb-4 font-raleway font-light uppercase tracking-[0.1em]">
          <a href="/" className="hover:text-brand-navy">Annonser</a>
          <span className="mx-2">›</span>
          <span className="text-brand-navy">{apt.address}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image with badge overlay */}
            <div className="relative">
              <ImageGallery images={apt.images} title={apt.title} />
              <div className="absolute top-3 left-3 z-10">
                {apt.listingType === 'kommande' ? (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 bg-amber-100 text-amber-800">Kommande</span>
                ) : (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 text-white" style={{ backgroundColor: apt.listingType === 'rent' ? '#BE9CB3' : '#1A1815' }}>
                    {apt.listingType === 'rent' ? 'Till uthyrning' : 'Till salu'}
                  </span>
                )}
              </div>
            </div>

            {/* Title + price + separator */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-raleway font-medium text-xl text-brand-navy uppercase tracking-[0.1em]">{apt.address}</h1>
                {apt.floorPlan && <FloorPlanButton floorPlan={apt.floorPlan} />}
              </div>
              <p className="font-raleway font-medium text-base text-brand-navy mt-1">{priceLabel}</p>
              {apt.listingType === 'sale' && (
                <p className="text-[9px] font-raleway uppercase tracking-[0.1em] text-brand-muted mt-0.5">Utropspris</p>
              )}
              <div className="border-b border-brand-dark mt-4" />

              {/* Fact box */}
              <div className="mt-5 bg-brand-offwhite">
                <div className="grid grid-cols-3 lg:grid-cols-5">
                  {apt.propertyType != null && apt.propertyType !== '' && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Bostadstyp</p>
                      <p className="text-sm font-light text-brand-navy">{apt.propertyType}</p>
                    </div>
                  )}
                  <div className="p-4">
                    <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Rum</p>
                    <p className="text-sm font-light text-brand-navy">{apt.rooms} rum</p>
                  </div>
                  <div className="p-4">
                    <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5"/></svg>
                    <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Boarea</p>
                    <p className="text-sm font-light text-brand-navy">{apt.sizeSqm} m²</p>
                  </div>
                  {apt.floor != null && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Våning</p>
                      <p className="text-sm font-light text-brand-navy">{apt.floor}</p>
                    </div>
                  )}
                  {apt.fee != null && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="1"/><path d="M2 11h20M6 15h.01M10 15h4"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Avgift</p>
                      <p className="text-sm font-light text-brand-navy">{apt.fee.toLocaleString('sv-SE')} kr/mån</p>
                    </div>
                  )}
                  {apt.operatingCost != null && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Driftkostnad</p>
                      <p className="text-sm font-light text-brand-navy">{apt.operatingCost.toLocaleString('sv-SE')} kr/år</p>
                    </div>
                  )}
                  {apt.buildYear != null && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Byggår</p>
                      <p className="text-sm font-light text-brand-navy">{apt.buildYear}</p>
                    </div>
                  )}
                  {apt.tenure != null && apt.tenure !== '' && (
                    <div className="p-2.5">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6M7 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V8l-5-5H7z"/><path d="M14 3v5h5"/></svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Boendeform</p>
                      <p className="text-sm font-light text-brand-navy">{apt.tenure}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {apt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {apt.tags.map((value) => {
                  const tag = LISTING_TAGS.find((t) => t.value === value)
                  if (!tag) return null
                  return (
                    <span key={value} className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 border border-brand-dark ${tag.color}`}>
                      {tag.label}
                    </span>
                  )
                })}
              </div>
            )}

            {/* Description */}
            <div className="border-t border-brand-dark pt-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-muted mb-4">Om bostaden</h2>
              <p className="text-sm text-brand-navy leading-relaxed whitespace-pre-line">{apt.description}</p>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-lg font-bold text-brand-navy mb-3">Läge</h2>
              <MapView lat={apt.latitude} lng={apt.longitude} address={apt.address} />
            </div>
          </div>

          {/* Right column — contact + showings */}
          <div id="contact" className="lg:col-span-1">
            <div className="sticky top-[72px] space-y-4">
              <ContactForm apartmentTitle={apt.title} apartmentId={apt.id} />
              <ShowingsList showings={showings} apartmentTitle={apt.title} address={apt.address} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-offwhite border-t border-brand-dark px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-brand-muted uppercase tracking-[0.08em] truncate">{apt.title}</p>
          <p className="text-base font-black text-brand-navy">{priceLabel}</p>
        </div>
        <a
          href="#contact"
          className="flex-shrink-0 bg-brand-sage hover:bg-brand-sage-d text-white font-bold text-[11px] uppercase tracking-[0.1em] px-6 py-3 transition"
        >
          Kontakta
        </a>
      </div>
    </>
  )
}
