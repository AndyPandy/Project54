'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) {
    return (
      <div className="aspect-[16/9] bg-brand-offwhite rounded-xl flex items-center justify-center">
        <div className="text-center text-brand-muted">
          <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Inga foton</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-[16/9] rounded-xl overflow-hidden bg-brand-offwhite cursor-zoom-in"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[selected]}
          alt={`${title} — photo ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="object-cover"
          priority
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
            {selected + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${i === selected ? 'border-brand-green' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image src={src} alt={`Thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + images.length) % images.length) }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % images.length) }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-[80vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selected]}
              alt={`${title} — photo ${selected + 1}`}
              width={1200}
              height={800}
              className="object-contain rounded-xl max-h-[80vh] w-auto mx-auto"
            />
          </div>
        </div>
      )}
    </>
  )
}
