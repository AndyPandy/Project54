'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Apartment } from '@/types'
import { LISTING_TAGS } from '@/lib/tags'

export default function ApartmentCard({ apt }: { apt: Apartment }) {
  const [hovered, setHovered] = useState(false)
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
      className="flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] lg:aspect-[3/2] bg-brand-dark overflow-hidden">
        {cover ? (
          <>
            <img
              src={cover}
              alt={apt.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
                transition: 'transform 0.7s ease-in-out',
              }}
            />
            <div
              style={{
                position: 'absolute', inset: 0,
                backgroundColor: hovered ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0)',
                transition: 'background-color 0.7s ease-in-out',
              }}
            />
          </>
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
          <h3 className="font-raleway text-xs sm:text-sm text-brand-navy leading-snug truncate flex-1 uppercase tracking-[0.1em]" style={{ fontWeight: 300 }}>{apt.address}</h3>
          <p className="font-raleway text-sm text-brand-navy whitespace-nowrap flex-shrink-0 uppercase tracking-[0.05em]" style={{ fontWeight: 300 }}>{price}</p>
        </div>

        {apt.propertyType && (
          <p className="text-[9px] font-raleway uppercase tracking-[0.08em] text-brand-muted mb-1">{apt.propertyType}</p>
        )}

        {/* Tags where address used to be */}
        {apt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {apt.tags.map((value) => {
              const tag = LISTING_TAGS.find((t) => t.value === value)
              if (!tag) return null
              return (
                <span key={value} className="text-[9px] font-raleway font-normal uppercase tracking-[0.08em] text-brand-navy/60">
                  {tag.label}
                </span>
              )
            }).reduce((acc: React.ReactNode[], el, i, arr) => {
              if (el === null) return acc
              acc.push(el)
              if (i < arr.length - 1) acc.push(<span key={`sep-${i}`} className="text-[9px] text-brand-muted/40">·</span>)
              return acc
            }, [])}
          </div>
        )}

        <div className="flex items-center gap-4 text-[11px] text-brand-navy/70 border-t border-brand-dark pt-2.5">
          <span>{apt.rooms} rum</span>
          <span>{apt.sizeSqm} m²</span>
          {apt.fee != null && <span>{apt.fee.toLocaleString('sv-SE')} kr/mån</span>}
        </div>
      </div>
    </Link>
  )
}
