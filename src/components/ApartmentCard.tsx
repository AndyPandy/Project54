import Link from 'next/link'
import Image from 'next/image'
import type { Apartment } from '@/types'

export default function ApartmentCard({ apt }: { apt: Apartment }) {
  const cover = apt.images[0] ?? null
  const price =
    apt.listingType === 'rent'
      ? `${apt.price.toLocaleString('sv-SE')} kr/mån`
      : `${apt.price.toLocaleString('sv-SE')} kr`

  const badge =
    apt.listingType === 'kommande' ? { label: 'Kommande', bg: '#B59A6A', text: '#fff' } :
    apt.listingType === 'rent'     ? { label: 'Uthyrning', bg: '#BE9CB3', text: '#fff' } :
                                     { label: 'Salu', bg: '#1A1815', text: '#fff' }

  return (
    <Link
      href={`/apartments/${apt.slug}`}
      className="group flex flex-col overflow-hidden hover:opacity-90 transition-opacity duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-[3/2] bg-brand-dark overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={apt.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-103 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="pt-3 pb-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="font-sans font-black text-sm text-brand-navy leading-snug line-clamp-2 flex-1">{apt.title}</h3>
          <p className="text-sm font-black text-brand-navy whitespace-nowrap flex-shrink-0">{price}</p>
        </div>
        <p className="text-xs text-brand-muted mb-3">{apt.address}</p>

        <div className="flex items-center gap-4 text-[11px] text-brand-muted border-t border-brand-dark pt-2.5">
          <span>{apt.rooms} rum</span>
          <span>{apt.sizeSqm} m²</span>
          {apt.fee != null && <span>{apt.fee.toLocaleString('sv-SE')} kr/mån</span>}
        </div>
      </div>
    </Link>
  )
}
