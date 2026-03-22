'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/admin/ImageUpload'
import { LISTING_TAGS } from '@/lib/tags'
import type { Apartment } from '@/types'

interface Props {
  apartment?: Apartment
}

export default function ListingForm({ apartment }: Props) {
  const router = useRouter()
  const isEdit = !!apartment

  const [form, setForm] = useState({
    title:         apartment?.title       ?? '',
    description:   apartment?.description ?? '',
    price:         apartment?.price?.toString()   ?? '',
    address:       apartment?.address     ?? '',
    latitude:      apartment?.latitude?.toString()  ?? '',
    longitude:     apartment?.longitude?.toString() ?? '',
    rooms:         apartment?.rooms?.toString()     ?? '1',
    sizeSqm:       apartment?.sizeSqm?.toString()   ?? '',
    listingType:   apartment?.listingType ?? 'rent',
    status:        apartment?.status      ?? 'draft',
    propertyType:  apartment?.propertyType ?? '',
    floor:         apartment?.floor?.toString()         ?? '',
    fee:           apartment?.fee?.toString()           ?? '',
    operatingCost: apartment?.operatingCost?.toString() ?? '',
    buildYear:     apartment?.buildYear?.toString()     ?? '',
    tenure:        apartment?.tenure ?? '',
    floorPlan:     apartment?.floorPlan ?? '',
  })
  const [images, setImages] = useState<string[]>(apartment?.images ?? [])
  const [tags, setTags]     = useState<string[]>(apartment?.tags   ?? [])

  function toggleTag(value: string) {
    setTags((prev) => prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value])
  }
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')
  const [floorPlanUploading, setFloorPlanUploading] = useState(false)
  const [floorPlanError, setFloorPlanError]         = useState('')
  const floorPlanInputRef = useRef<HTMLInputElement>(null)

  async function handleFloorPlanFile(files: FileList | null) {
    if (!files || !files.length) return
    setFloorPlanError('')
    setFloorPlanUploading(true)
    const formData = new FormData()
    formData.append('files', files[0])
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        setFloorPlanError(data.error ?? 'Upload failed')
        return
      }
      const data = await res.json()
      set('floorPlan', data.paths[0])
    } catch {
      setFloorPlanError('Upload failed. Please try again.')
    } finally {
      setFloorPlanUploading(false)
      if (floorPlanInputRef.current) floorPlanInputRef.current.value = ''
    }
  }

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent, publishStatus?: 'draft' | 'published') {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      ...form,
      status: publishStatus ?? form.status,
      images,
      tags,
    }

    const url    = isEdit ? `/api/apartments/${apartment!.id}` : '/api/apartments'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let msg = `Server error ${res.status}`
        try { const d = await res.json(); msg = d.error ?? msg } catch { /* non-JSON body */ }
        setError(msg)
        return
      }

      router.push('/admin/listings')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition'
  const labelCls = 'block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1.5'

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3">Details</h2>

            <div>
              <label className={labelCls}>Title *</label>
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="e.g. Modern 2-Bedroom in City Centre" />
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                required
                rows={6}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={`${inputCls} resize-y`}
                placeholder="Describe the apartment…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Listing type</label>
                <select value={form.listingType} onChange={(e) => set('listingType', e.target.value)} className={inputCls}>
                  <option value="rent">Hyra</option>
                  <option value="sale">Till salu</option>
                  <option value="kommande">Kommande</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Price *{form.listingType === 'rent' ? ' (per month)' : ''}</label>
                <input required type="number" min="0" step="any" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputCls} placeholder="e.g. 2200" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Rooms *</label>
                <input required type="number" min="1" max="20" value={form.rooms} onChange={(e) => set('rooms', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Size (m²) *</label>
                <input required type="number" min="1" step="any" value={form.sizeSqm} onChange={(e) => set('sizeSqm', e.target.value)} className={inputCls} placeholder="e.g. 68" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Bostadstyp</label>
                <input value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)} className={inputCls} placeholder="t.ex. Lägenhet, Villa" />
              </div>
              <div>
                <label className={labelCls}>Våning</label>
                <input type="number" min="0" value={form.floor} onChange={(e) => set('floor', e.target.value)} className={inputCls} placeholder="t.ex. 3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Byggår</label>
                <input type="number" min="1800" max="2100" value={form.buildYear} onChange={(e) => set('buildYear', e.target.value)} className={inputCls} placeholder="t.ex. 1985" />
              </div>
              <div>
                <label className={labelCls}>Boendeform</label>
                <input value={form.tenure} onChange={(e) => set('tenure', e.target.value)} className={inputCls} placeholder="t.ex. Bostadsrätt" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Avgift (kr/mån)</label>
                <input type="number" min="0" step="any" value={form.fee} onChange={(e) => set('fee', e.target.value)} className={inputCls} placeholder="t.ex. 3500" />
              </div>
              <div>
                <label className={labelCls}>Driftkostnad (kr/år)</label>
                <input type="number" min="0" step="any" value={form.operatingCost} onChange={(e) => set('operatingCost', e.target.value)} className={inputCls} placeholder="t.ex. 12000" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3">Location</h2>

            <div>
              <label className={labelCls}>Address *</label>
              <input required value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} placeholder="e.g. 14 Market Square, City Centre" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Latitude</label>
                <input type="number" step="any" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} className={inputCls} placeholder="e.g. 59.3293" />
              </div>
              <div>
                <label className={labelCls}>Longitude</label>
                <input type="number" step="any" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} className={inputCls} placeholder="e.g. 18.0686" />
              </div>
            </div>
            <p className="text-xs text-brand-muted">
              Tip: find coordinates on{' '}
              <a href="https://www.latlong.net" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">
                latlong.net
              </a>
            </p>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Egenskaper</h2>
            <div className="flex flex-wrap gap-2">
              {LISTING_TAGS.map((tag) => {
                const active = tags.includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition ${active ? tag.color + ' opacity-100' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'}`}
                  >
                    {tag.label}
                    {active && (
                      <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Photos</h2>
            <ImageUpload images={images} onChange={setImages} />
          </div>

          {/* Floor plan */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Planlösning</h2>
            <input
              ref={floorPlanInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFloorPlanFile(e.target.files)}
            />
            {form.floorPlan ? (
              <div className="space-y-3">
                <div className="relative group w-fit">
                  <img src={form.floorPlan} alt="Planlösning" className="max-h-52 rounded-lg border border-gray-200 object-contain" />
                  <button
                    type="button"
                    onClick={() => set('floorPlan', '')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
                    title="Ta bort"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => floorPlanInputRef.current?.click()}
                  className="text-xs text-brand-muted hover:text-brand-navy underline transition"
                >
                  Byt bild
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-green/50 transition cursor-pointer"
                onClick={() => floorPlanInputRef.current?.click()}
              >
                {floorPlanUploading ? (
                  <div className="flex flex-col items-center gap-2 text-brand-muted">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-sm">Laddar upp…</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-brand-muted">
                    <svg className="w-7 h-7 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm"><span className="font-semibold text-brand-green">Klicka för att ladda upp</span> planlösning</p>
                    <p className="text-xs">JPEG, PNG, WebP</p>
                  </div>
                )}
              </div>
            )}
            {floorPlanError && <p className="text-xs text-red-600 mt-2">{floorPlanError}</p>}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="text-xs font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Publish</h2>

            <div className="mb-5">
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5 mb-4">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-green hover:bg-brand-green-d text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
              >
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save listing'}
              </button>

              {!isEdit && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'published')}
                  className="w-full bg-brand-navy hover:bg-brand-dark text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                >
                  Save & publish
                </button>
              )}

              <button
                type="button"
                onClick={() => router.push('/admin/listings')}
                className="w-full text-brand-muted hover:text-brand-navy text-sm font-medium py-2 transition"
              >
                Cancel
              </button>
            </div>

            {isEdit && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-brand-muted space-y-1">
                <p>Created: {new Date(apartment!.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(apartment!.updatedAt).toLocaleDateString()}</p>
                <a href={`/apartments/${apartment!.slug}`} target="_blank" className="text-brand-green hover:underline block mt-2">
                  View public listing ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
