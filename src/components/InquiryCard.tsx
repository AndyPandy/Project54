import Link from 'next/link'
import type { Inquiry } from '@/types'

interface Props {
  inquiry: Inquiry
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

  function range(min: number | null, max: number | null, unit: string) {
    if (min != null && max != null) return `${min}–${max} ${unit}`
    if (min != null) return `Från ${min} ${unit}`
    if (max != null) return `Till ${max} ${unit}`
    return null
  }

  return (
    <Link
      href={`/kopforfragan/${inquiry.slug}`}
      className="group block border border-brand-dark hover:border-brand-navy transition"
      style={{ backgroundColor: 'rgba(143, 176, 130, 0.08)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-brand-dark">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-brand-sage">Köpförfrågan</span>
          <span className="text-[9px] font-raleway font-light uppercase tracking-[0.1em] text-brand-muted">{new Date(inquiry.createdAt).toLocaleDateString('sv-SE')}</span>
        </div>
        <h2 className="font-raleway font-medium text-sm uppercase tracking-[0.1em] text-brand-navy group-hover:text-brand-sage transition line-clamp-1">
          {inquiry.title}
        </h2>
        {inquiry.desiredLocation && (
          <p className="text-[10px] text-brand-muted mt-1 font-raleway uppercase tracking-[0.08em]">
            {inquiry.desiredLocation}
          </p>
        )}
        {(inquiry.moveInFrom || inquiry.moveInTo) && (
          <p className="text-[10px] text-brand-muted mt-0.5 font-raleway uppercase tracking-[0.08em]">
            Inflyttning:{' '}
            {inquiry.moveInFrom && inquiry.moveInTo
              ? `${new Date(inquiry.moveInFrom).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short' })} – ${new Date(inquiry.moveInTo).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short' })}`
              : inquiry.moveInFrom
              ? `Från ${new Date(inquiry.moveInFrom).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short' })}`
              : `Till ${new Date(inquiry.moveInTo!).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short' })}`}
          </p>
        )}
      </div>

      {/* Stats row with icons */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
          {hasRooms && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              <span className="text-[10px] text-brand-navy/70">{range(inquiry.minRooms, inquiry.maxRooms, 'rum')}</span>
            </div>
          )}
          {hasSize && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5"/>
              </svg>
              <span className="text-[10px] text-brand-navy/70">{range(inquiry.minSize, inquiry.maxSize, 'm²')}</span>
            </div>
          )}
          {hasFee && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="1"/><path d="M2 11h20M6 15h.01M10 15h4"/>
              </svg>
              <span className="text-[10px] text-brand-navy/70">Avgift: {range(inquiry.minFee, inquiry.maxFee, 'kr/mån')}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-brand-navy/60 leading-relaxed line-clamp-2">{inquiry.description}</p>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {features.map((f) => (
              <span key={f} className="text-[9px] font-raleway font-medium uppercase tracking-[0.08em] px-2 py-0.5 border border-brand-sage/40 text-brand-sage">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
