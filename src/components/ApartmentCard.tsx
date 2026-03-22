import Link from 'next/link'
import Image from 'next/image'
import { LISTING_TAGS } from '@/lib/tags'
import type { Apartment } from '@/types'

export default function ApartmentCard({ apt }: { apt: Apartment }) {
  const cover = apt.images[0] ?? null
  const price =
    apt.listingType === 'rent'
      ? `${apt.price.toLocaleString('sv-SE')} kr/mån`
      : apt.listingType === 'kommande'
      ? `${apt.price.toLocaleString('sv-SE')} kr`
      : `${apt.price.toLocaleString('sv-SE')} kr`

  return (
    <Link
      href={`/apartments/${apt.slug}`}
      className="group bg-white rounded-xl border border-brand-dark/8 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-brand-offwhite overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={apt.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 22V12h6v10" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          {apt.listingType === 'kommande' ? (
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
              Kommande
            </span>
          ) : (
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${apt.listingType === 'rent' ? 'text-white' : 'bg-brand-green text-white'}`} style={apt.listingType === 'rent' ? { backgroundColor: '#BE9CB3' } : {}}>
              {apt.listingType === 'rent' ? 'Hyra' : 'Köp'}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-base font-black text-brand-green mb-0.5">{price}</p>
        <h3 className="font-bold text-brand-navy text-xs line-clamp-2 mb-1">{apt.title}</h3>
        <p className="text-xs text-brand-muted line-clamp-1 mb-2">{apt.address}</p>

        {/* Tags */}
        {apt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {apt.tags.map((value) => {
              const tag = LISTING_TAGS.find((t) => t.value === value)
              if (!tag) return null
              return (
                <span key={value} className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${tag.color}`}>
                  {tag.label}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 pt-2 border-t border-gray-50 text-[11px] text-brand-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {apt.rooms} rum
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {apt.sizeSqm} m²
          </span>
          {apt.fee != null && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {apt.fee.toLocaleString('sv-SE')} kr/mån
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
