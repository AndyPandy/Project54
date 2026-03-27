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
      className="group block border border-brand-dark bg-brand-offwhite hover:border-brand-navy transition"
    >
      {/* Header strip */}
      <div className="px-5 pt-5 pb-4 border-b border-brand-dark">
        <span className="inline-block text-[9px] font-bold uppercase tracking-[0.12em] text-brand-muted mb-2">
          Köpförfrågan
        </span>
        <h2 className="font-raleway font-medium text-sm uppercase tracking-[0.1em] text-brand-navy group-hover:text-brand-sage transition line-clamp-1">
          {inquiry.title}
        </h2>
        {inquiry.desiredLocation && (
          <p className="text-[10px] text-brand-muted mt-1 font-raleway uppercase tracking-[0.08em]">
            {inquiry.desiredLocation}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="px-5 py-4 space-y-2">
        <p className="text-xs text-brand-navy/70 leading-relaxed line-clamp-2">{inquiry.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          {hasRooms && (
            <span className="text-[10px] text-brand-muted">
              {range(inquiry.minRooms, inquiry.maxRooms, 'rum')}
            </span>
          )}
          {hasSize && (
            <span className="text-[10px] text-brand-muted">
              {range(inquiry.minSize, inquiry.maxSize, 'm²')}
            </span>
          )}
          {hasFee && (
            <span className="text-[10px] text-brand-muted">
              Avgift: {range(inquiry.minFee, inquiry.maxFee, 'kr/mån')}
            </span>
          )}
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {features.map((f) => (
              <span key={f} className="text-[9px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 border border-brand-dark text-brand-muted">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
