'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return
    setError('')
    setUploading(true)

    const formData = new FormData()
    Array.from(files).forEach((f) => formData.append('files', f))

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Upload failed')
        return
      }
      const data = await res.json()
      onChange([...images, ...data.paths])
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function move(from: number, to: number) {
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-green/50 transition cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Uploading…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-muted">
            <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">
              <span className="font-semibold text-brand-green">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs">JPEG, PNG, WebP — max 8 MB each</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((src, i) => (
            <div key={src} className="relative group aspect-square rounded-lg overflow-hidden bg-brand-offwhite border border-gray-100">
              <Image src={src} alt={`Photo ${i + 1}`} fill sizes="150px" className="object-cover" />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {i > 0 && (
                  <button
                    type="button"
                    title="Move left"
                    onClick={() => move(i, i - 1)}
                    className="bg-white/90 rounded p-1 text-brand-navy hover:bg-white"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  title="Remove"
                  onClick={() => remove(i)}
                  className="bg-red-500 rounded p-1 text-white hover:bg-red-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {i < images.length - 1 && (
                  <button
                    type="button"
                    title="Move right"
                    onClick={() => move(i, i + 1)}
                    className="bg-white/90 rounded p-1 text-brand-navy hover:bg-white"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {i === 0 && (
                <span className="absolute top-1 left-1 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
