import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import ContactForm from '@/components/ContactForm'
import type { Inquiry } from '@/types'

async function getInquiry(slug: string): Promise<Inquiry | null> {
  const raw = await prisma.inquiry.findUnique({ where: { slug, status: 'published' } })
  if (!raw) return null
  return {
    ...raw,
    status: raw.status as 'draft' | 'published',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const inq = await getInquiry(params.slug)
  if (!inq) return { title: 'Not Found' }
  return {
    title: inq.title,
    description: inq.description.slice(0, 160),
  }
}

export default async function InquiryPage({ params }: { params: { slug: string } }) {
  const inq = await getInquiry(params.slug)
  if (!inq) notFound()

  const features = [
    inq.fireplaceReq && 'Eldstad',
    inq.elevatorReq  && 'Hiss',
    inq.terraceReq   && 'Terrass',
    inq.patioReq     && 'Uteplats',
    inq.balconyReq   && 'Balkong',
  ].filter(Boolean) as string[]

  function range(min: number | null, max: number | null, unit: string) {
    if (min != null && max != null) return `${min.toLocaleString('sv-SE')}–${max.toLocaleString('sv-SE')} ${unit}`
    if (min != null) return `Från ${min.toLocaleString('sv-SE')} ${unit}`
    if (max != null) return `Till ${max.toLocaleString('sv-SE')} ${unit}`
    return null
  }

  return (
    <>
      <Suspense fallback={null}><Navbar /></Suspense>

      <main className="max-w-6xl mx-auto px-4 pt-6 pb-28 lg:pb-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-muted mb-4 font-raleway font-light uppercase tracking-[0.1em]">
          <a href="/kopforfragan" className="hover:text-brand-navy">Köpförfrågningar</a>
          <span className="mx-2">›</span>
          <span className="text-brand-navy">{inq.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title */}
            <div>
              <span className="inline-block text-[9px] font-bold uppercase tracking-[0.12em] text-brand-muted mb-2">Köpförfrågan</span>
              <h1 className="font-raleway font-medium text-base sm:text-xl text-brand-navy uppercase tracking-[0.1em]">
                {inq.title}
              </h1>
              {inq.desiredLocation && (
                <p className="font-raleway font-light text-sm text-brand-muted mt-1 uppercase tracking-[0.08em]">
                  {inq.desiredLocation}
                </p>
              )}
              <div className="border-b border-brand-dark mt-4" />

              {/* Fact box */}
              <div className="mt-5 bg-brand-offwhite">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {range(inq.minRooms, inq.maxRooms, 'rum') && (
                    <div className="p-4">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                      </svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Rum</p>
                      <p className="text-sm font-light text-brand-navy">{range(inq.minRooms, inq.maxRooms, 'rum')}</p>
                    </div>
                  )}
                  {range(inq.minSize, inq.maxSize, 'm²') && (
                    <div className="p-4">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5"/>
                      </svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Boarea</p>
                      <p className="text-sm font-light text-brand-navy">{range(inq.minSize, inq.maxSize, 'm²')}</p>
                    </div>
                  )}
                  {range(inq.minFee, inq.maxFee, 'kr/mån') && (
                    <div className="p-4">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M2 11h20M6 15h.01M10 15h4"/>
                      </svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Avgift</p>
                      <p className="text-sm font-light text-brand-navy">{range(inq.minFee, inq.maxFee, 'kr/mån')}</p>
                    </div>
                  )}
                  {inq.desiredFloor && (
                    <div className="p-4">
                      <svg className="w-5 h-5 text-brand-muted mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>
                      </svg>
                      <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Önskad våning</p>
                      <p className="text-sm font-light text-brand-navy">{inq.desiredFloor}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((f) => (
                  <span key={f} className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 border border-brand-dark text-brand-muted">
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="border-t border-brand-dark pt-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-brand-muted mb-4">Om förfrågan</h2>
              <p className="text-sm text-brand-navy leading-relaxed whitespace-pre-line">{inq.description}</p>
            </div>
          </div>

          {/* Right column — contact */}
          <div id="contact" className="lg:col-span-1">
            <div className="sticky top-[72px] space-y-4">
              <ContactForm apartmentTitle={inq.title} apartmentId={inq.id} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-brand-offwhite border-t border-brand-dark px-4 py-3 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-brand-muted uppercase tracking-[0.08em] truncate">Köpförfrågan</p>
          <p className="text-sm font-bold text-brand-navy truncate">{inq.title}</p>
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
