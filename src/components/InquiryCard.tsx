import Link from 'next/link'
import type { Inquiry } from '@/types'

interface Props {
  inquiry: Inquiry
}

function ApartmentIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 10.5L12 3l9 7.5V21H3V10.5z"/>
      <path d="M9 21v-6h6v6"/>
    </svg>
  )
}

function TownhouseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M1 11.5L5 8l4 3.5V21H1V11.5z"/>
      <path d="M9 11.5L13 8l4 3.5V21H9V11.5z"/>
      <path d="M3 21v-5h4v5M11 21v-5h4v5"/>
      <path d="M17 11.5L21 8"/>
      <path d="M17 21h4V11.5"/>
    </svg>
  )
}

export default function InquiryCard({ inquiry }: Props) {
  const features = [
    inquiry.fireplaceReq && 'Eldstad',
    inquiry.elevatorReq  && 'Hiss',
    inquiry.terraceReq   && 'Terrass',
    inquiry.patioReq     && 'Uteplats',
    inquiry.balconyReq   && 'Balkong',
  ].filter(Boolean) as string[]

  const hasRooms = inquiry.minRooms != null || inquiry.maxRooms != null
  const hasSize  = inquiry.minSize  != null || inquiry.maxSize  != null
  const hasFee   = inquiry.minFee   != null || inquiry.maxFee   != null

  function rangeVal(min: number | null, max: number | null) {
    if (min != null && max != null) return `${min}–${max}`
    if (min != null) return `${min}+`
    if (max != null) return `max ${max}`
    return null
  }

  function range(min: number | null, max: number | null, unit: string) {
    if (min != null && max != null) return `${min}–${max} ${unit}`
    if (min != null) return `Från ${min} ${unit}`
    if (max != null) return `Till ${max} ${unit}`
    return null
  }

  const moveInLabel = (() => {
    if (!inquiry.moveInFrom && !inquiry.moveInTo) return null
    const fmt = (d: string) => new Date(d).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short' })
    if (inquiry.moveInFrom && inquiry.moveInTo) return `${fmt(inquiry.moveInFrom)} – ${fmt(inquiry.moveInTo)}`
    if (inquiry.moveInFrom) return `Från ${fmt(inquiry.moveInFrom)}`
    return `Till ${fmt(inquiry.moveInTo!)}`
  })()

  const PropertyIcon =
    inquiry.propertyType === 'Villa'   ? HouseIcon :
    inquiry.propertyType === 'Radhus'  ? TownhouseIcon :
    inquiry.propertyType === 'Lägenhet' ? ApartmentIcon :
    null

  return (
    <Link
      href={`/kopforfragan/${inquiry.slug}`}
      className="group block border border-brand-dark hover:border-brand-navy/50 transition-colors overflow-hidden"
      style={{ backgroundColor: 'rgba(143, 176, 130, 0.07)' }}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-brand-navy w-full" />

      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-start gap-4">
        {/* Property type icon */}
        {PropertyIcon && (
          <div className="flex-shrink-0 w-10 h-10 border border-brand-dark bg-brand-dark/40 flex items-center justify-center text-brand-navy mt-0.5">
            <PropertyIcon />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-brand-muted">
              {inquiry.propertyType || 'Köpförfrågan'}
            </span>
            <span className="text-[9px] font-raleway font-light uppercase tracking-[0.1em] text-brand-muted flex-shrink-0">
              {new Date(inquiry.createdAt).toLocaleDateString('sv-SE')}
            </span>
          </div>
          <h2 className="font-raleway font-medium text-sm uppercase tracking-[0.1em] text-brand-navy group-hover:text-brand-navy/70 transition line-clamp-1">
            {inquiry.title}
          </h2>
          {inquiry.desiredLocation && (
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-3 h-3 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-7.5-8-12a8 8 0 1116 0c0 4.5-8 12-8 12z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <p className="text-[10px] text-brand-muted font-raleway uppercase tracking-[0.08em] truncate">
                {inquiry.desiredLocation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      {(hasRooms || hasSize || hasFee) && (
        <div className="mx-5 mb-4 border border-brand-dark/60 divide-x divide-brand-dark/60 flex">
          {hasRooms && (
            <div className="flex-1 px-3 py-2.5 flex flex-col items-center">
              <svg className="w-3.5 h-3.5 text-brand-navy/50 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              <p className="text-sm font-raleway font-light text-brand-navy leading-none">{rangeVal(inquiry.minRooms, inquiry.maxRooms)}</p>
              <p className="text-[8px] font-raleway uppercase tracking-[0.1em] text-brand-muted mt-0.5">rum</p>
            </div>
          )}
          {hasSize && (
            <div className="flex-1 px-3 py-2.5 flex flex-col items-center">
              <svg className="w-3.5 h-3.5 text-brand-navy/50 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5"/>
              </svg>
              <p className="text-sm font-raleway font-light text-brand-navy leading-none">{rangeVal(inquiry.minSize, inquiry.maxSize)}</p>
              <p className="text-[8px] font-raleway uppercase tracking-[0.1em] text-brand-muted mt-0.5">m²</p>
            </div>
          )}
          {hasFee && (
            <div className="flex-1 px-3 py-2.5 flex flex-col items-center">
              <svg className="w-3.5 h-3.5 text-brand-navy/50 mb-1" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M2 11h20M6 15h.01M10 15h4"/>
              </svg>
              <p className="text-sm font-raleway font-light text-brand-navy leading-none">{rangeVal(inquiry.minFee, inquiry.maxFee)}</p>
              <p className="text-[8px] font-raleway uppercase tracking-[0.1em] text-brand-muted mt-0.5">kr/mån</p>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="px-5 pb-4">
        {moveInLabel && (
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3 h-3 text-brand-navy/50 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span className="text-[9px] font-raleway font-medium uppercase tracking-[0.08em] text-brand-navy/70">
              Inflyttning: {moveInLabel}
            </span>
          </div>
        )}

        <p className="text-xs text-brand-navy/75 leading-relaxed line-clamp-2">{inquiry.description}</p>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {features.map((f) => (
              <span key={f} className="text-[9px] font-raleway font-medium uppercase tracking-[0.08em] px-2 py-0.5 border border-brand-dark text-brand-muted">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3 border-t border-brand-dark/60 flex items-center justify-between">
        <span className="text-[8px] font-raleway uppercase tracking-[0.12em] text-brand-muted">Köpförfrågan</span>
        <span className="text-[9px] font-raleway font-medium uppercase tracking-[0.15em] text-brand-navy/60 group-hover:text-brand-navy transition">
          Svara →
        </span>
      </div>
    </Link>
  )
}
