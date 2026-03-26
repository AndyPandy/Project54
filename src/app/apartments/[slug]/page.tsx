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
                <h1 className="font-raleway font-light text-xl text-brand-navy uppercase tracking-[0.1em]">{apt.address}</h1>
                {apt.floorPlan && <FloorPlanButton floorPlan={apt.floorPlan} />}
              </div>
              <p className="font-raleway font-light text-base text-brand-navy mt-1">{priceLabel}</p>
              {apt.listingType === 'sale' && (
                <p className="text-[9px] font-raleway uppercase tracking-[0.1em] text-brand-muted mt-0.5">Utropspris</p>
              )}
              <div className="border-b border-brand-dark mt-4" />

              {/* Fact box */}
              <div className="mt-5 bg-brand-offwhite">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {apt.propertyType != null && apt.propertyType !== '' && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Bostadstyp</p>
                      <p className="text-sm font-light text-brand-navy">{apt.propertyType}</p>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Rum</p>
                    <p className="text-sm font-light text-brand-navy">{apt.rooms} rum</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Boarea</p>
                    <p className="text-sm font-light text-brand-navy">{apt.sizeSqm} m²</p>
                  </div>
                  {apt.floor != null && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Våning</p>
                      <p className="text-sm font-light text-brand-navy">{apt.floor}</p>
                    </div>
                  )}
                  {apt.fee != null && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Avgift</p>
                      <p className="text-sm font-light text-brand-navy">{apt.fee.toLocaleString('sv-SE')} kr/mån</p>
                    </div>
                  )}
                  {apt.operatingCost != null && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Driftkostnad</p>
                      <p className="text-sm font-light text-brand-navy">{apt.operatingCost.toLocaleString('sv-SE')} kr/år</p>
                    </div>
                  )}
                  {apt.buildYear != null && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Byggår</p>
                      <p className="text-sm font-light text-brand-navy">{apt.buildYear}</p>
                    </div>
                  )}
                  {apt.tenure != null && apt.tenure !== '' && (
                    <div className="p-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-1">Boendeform</p>
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
