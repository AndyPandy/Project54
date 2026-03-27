'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Inquiry } from '@/types'

interface Props {
  inquiry?: Inquiry
}

export default function InquiryForm({ inquiry }: Props) {
  const router = useRouter()
  const isEdit = !!inquiry

  const [form, setForm] = useState({
    title:           inquiry?.title           ?? '',
    description:     inquiry?.description     ?? '',
    desiredLocation: inquiry?.desiredLocation ?? '',
    minSize:         inquiry?.minSize?.toString()    ?? '',
    maxSize:         inquiry?.maxSize?.toString()    ?? '',
    minFee:          inquiry?.minFee?.toString()     ?? '',
    maxFee:          inquiry?.maxFee?.toString()     ?? '',
    minRooms:        inquiry?.minRooms?.toString()   ?? '',
    maxRooms:        inquiry?.maxRooms?.toString()   ?? '',
    desiredFloor:    inquiry?.desiredFloor    ?? '',
    fireplaceReq:    inquiry?.fireplaceReq    ?? false,
    elevatorReq:     inquiry?.elevatorReq     ?? false,
    terraceReq:      inquiry?.terraceReq      ?? false,
    patioReq:        inquiry?.patioReq        ?? false,
    balconyReq:      inquiry?.balconyReq      ?? false,
    propertyType:    inquiry?.propertyType    ?? '',
    moveInFrom:      inquiry?.moveInFrom      ?? '',
    moveInTo:        inquiry?.moveInTo        ?? '',
    status:          inquiry?.status          ?? 'draft',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent, publishStatus?: 'draft' | 'published') {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { ...form, status: publishStatus ?? form.status }
    const url    = isEdit ? `/api/admin/inquiries/${inquiry!.id}` : '/api/admin/inquiries'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let msg = `Server error ${res.status}`
        try { const d = await res.json(); msg = d.error ?? msg } catch { /* non-JSON */ }
        setError(msg)
        return
      }

      router.push('/admin/inquiries')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
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
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3">Förfrågan</h2>

            <div>
              <label className={labelCls}>Titel *</label>
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="t.ex. Söker 3-rums i Södermalm" />
            </div>

            <div>
              <label className={labelCls}>Beskrivning *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={`${inputCls} resize-y`}
                placeholder="Beskriv vad du söker…"
              />
            </div>

            <div>
              <label className={labelCls}>Önskat område</label>
              <input value={form.desiredLocation} onChange={(e) => set('desiredLocation', e.target.value)} className={inputCls} placeholder="t.ex. Södermalm, Vasastan" />
            </div>

            <div>
              <label className={labelCls}>Bostadstyp</label>
              <select value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)} className={inputCls}>
                <option value="">Ej angiven</option>
                <option value="Lägenhet">Lägenhet</option>
                <option value="Villa">Villa</option>
                <option value="Radhus">Radhus</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Min rum</label>
                <input type="number" min="1" max="20" value={form.minRooms} onChange={(e) => set('minRooms', e.target.value)} className={inputCls} placeholder="t.ex. 2" />
              </div>
              <div>
                <label className={labelCls}>Max rum</label>
                <input type="number" min="1" max="20" value={form.maxRooms} onChange={(e) => set('maxRooms', e.target.value)} className={inputCls} placeholder="t.ex. 4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Min area (m²)</label>
                <input type="number" min="0" step="any" value={form.minSize} onChange={(e) => set('minSize', e.target.value)} className={inputCls} placeholder="t.ex. 50" />
              </div>
              <div>
                <label className={labelCls}>Max area (m²)</label>
                <input type="number" min="0" step="any" value={form.maxSize} onChange={(e) => set('maxSize', e.target.value)} className={inputCls} placeholder="t.ex. 120" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Min avgift (kr/mån)</label>
                <input type="number" min="0" step="any" value={form.minFee} onChange={(e) => set('minFee', e.target.value)} className={inputCls} placeholder="t.ex. 5000" />
              </div>
              <div>
                <label className={labelCls}>Max avgift (kr/mån)</label>
                <input type="number" min="0" step="any" value={form.maxFee} onChange={(e) => set('maxFee', e.target.value)} className={inputCls} placeholder="t.ex. 15000" />
              </div>
            </div>

            <div>
              <label className={labelCls}>Önskad våning</label>
              <input value={form.desiredFloor} onChange={(e) => set('desiredFloor', e.target.value)} className={inputCls} placeholder="t.ex. 2 eller högre, ej bottenvåning" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Inflyttning från</label>
                <input type="date" value={form.moveInFrom} onChange={(e) => set('moveInFrom', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Inflyttning till</label>
                <input type="date" value={form.moveInTo} onChange={(e) => set('moveInTo', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Önskade egenskaper</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([
                { key: 'fireplaceReq', label: 'Eldstad' },
                { key: 'elevatorReq',  label: 'Hiss' },
                { key: 'terraceReq',   label: 'Terrass' },
                { key: 'patioReq',     label: 'Uteplats' },
                { key: 'balconyReq',   label: 'Balkong' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={(e) => set(key, e.target.checked)}
                    className="w-4 h-4 accent-brand-navy cursor-pointer"
                  />
                  <span className="text-sm text-brand-navy group-hover:text-brand-muted transition">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="text-xs font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Publicering</h2>

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
                {saving ? 'Sparar…' : isEdit ? 'Spara ändringar' : 'Spara'}
              </button>

              {!isEdit && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'published')}
                  className="w-full bg-brand-navy hover:bg-brand-dark text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                >
                  Spara &amp; publicera
                </button>
              )}

              <button
                type="button"
                onClick={() => router.push('/admin/inquiries')}
                className="w-full text-brand-muted hover:text-brand-navy text-sm font-medium py-2 transition"
              >
                Avbryt
              </button>
            </div>

            {isEdit && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-brand-muted space-y-1">
                <p>Skapad: {new Date(inquiry!.createdAt).toLocaleDateString('sv-SE')}</p>
                <p>Uppdaterad: {new Date(inquiry!.updatedAt).toLocaleDateString('sv-SE')}</p>
                <a href={`/kopforfragan/${inquiry!.slug}`} target="_blank" className="text-brand-green hover:underline block mt-2">
                  Visa publik sida ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
