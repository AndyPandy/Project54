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

  function rangeVal(min: number | null, max: number | null) {
    if (min != null && max != null) return `${min}–${max}`
    if (min != null) return `${min}+`
    if (max != null) return `–${max}`
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

  return (
    <Link
      href={`/kopforfragan/${inquiry.slug}`}
      className="group block border-l-4 border-brand-sage border-t border-r border-b border-brand-dark hover:border-brand-navy transition-colors"
      style={{ backgroundColor: 'rgba(143, 176, 130, 0.10)', borderLeftColor: '#8FB082' }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-brand-dark">
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
        {moveInLabel && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-brand-sage/15 border border-brand-sage/40 text-[9px] font-raleway font-medium uppercase tracking-[0.08em] text-brand-sage">
            Inflyttning: {moveInLabel}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 pt-5 pb-4">
        {(hasRooms || hasSize || hasFee) && (
          <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
            {hasRooms && (
              <div>
                <p className="text-[9px] font-raleway font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Rum</p>
                <p className="text-base font-raleway font-light text-brand-navy">{rangeVal(inquiry.minRooms, inquiry.maxRooms)}</p>
              </div>
            )}
            {hasSize && (
              <div>
                <p className="text-[9px] font-raleway font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Boarea</p>
                <p className="text-base font-raleway font-light text-brand-navy">{range(inquiry.minSize, inquiry.maxSize, 'm²')}</p>
              </div>
            )}
            {hasFee && (
              <div>
                <p className="text-[9px] font-raleway font-medium uppercase tracking-[0.1em] text-brand-muted mb-0.5">Avgift</p>
                <p className="text-base font-raleway font-light text-brand-navy">{range(inquiry.minFee, inquiry.maxFee, 'kr/mån')}</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-brand-navy/80 leading-relaxed line-clamp-2">{inquiry.description}</p>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3">
            {features.map((f) => (
              <span key={f} className="text-[9px] font-raleway font-medium uppercase tracking-[0.08em] px-2 py-0.5 border border-brand-sage/70 text-brand-sage">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-5 flex justify-end">
        <span className="text-[9px] font-raleway font-medium uppercase tracking-[0.15em] text-brand-sage group-hover:text-brand-navy transition">
          Svara på förfrågan →
        </span>
      </div>
    </Link>
  )
}
