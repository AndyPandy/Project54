'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

interface Props {
  searchParams: { [key: string]: string | undefined }
  count: number
  showMap: boolean
  onToggleMap: () => void
  horizontal?: boolean
}

const ROOM_OPTIONS = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']

const FEATURE_OPTIONS = [
  { value: 'balkong', label: 'Balkong / Uteplats / Terrass', tags: ['balkong', 'uteplats', 'terass'] },
  { value: 'hiss',    label: 'Hiss',                         tags: ['hiss'] },
  { value: 'eldstad', label: 'Eldstad',                      tags: ['eldstad'] },
]

export default function ApartmentFilters({ searchParams, count, showMap, onToggleMap, horizontal }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [values, setValues] = useState({
    search:      searchParams.search      ?? '',
    listingType: searchParams.listingType ?? 'all',
    minPrice:    searchParams.minPrice    ?? '',
    maxPrice:    searchParams.maxPrice    ?? '',
    minRooms:    searchParams.minRooms    ?? '',
    maxRooms:    searchParams.maxRooms    ?? '',
    minSize:     searchParams.minSize     ?? '',
    maxSize:     searchParams.maxSize     ?? '',
    features:    searchParams.features   ?? '',
  })

  const apply = useCallback(
    (next: typeof values) => {
      const params = new URLSearchParams()
      if (next.search)                params.set('search',      next.search)
      if (next.listingType !== 'all') params.set('listingType', next.listingType)
      if (next.minPrice)              params.set('minPrice',    next.minPrice)
      if (next.maxPrice)              params.set('maxPrice',    next.maxPrice)
      if (next.minRooms)              params.set('minRooms',    next.minRooms)
      if (next.maxRooms)              params.set('maxRooms',    next.maxRooms)
      if (next.minSize)               params.set('minSize',     next.minSize)
      if (next.maxSize)               params.set('maxSize',     next.maxSize)
      if (next.features)              params.set('features',    next.features)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname],
  )

  function set(key: keyof typeof values, value: string) {
    const next = { ...values, [key]: value }
    setValues(next)
    apply(next)
  }

  function toggleFeature(value: string) {
    const current = values.features ? values.features.split(',') : []
    const next = current.includes(value)
      ? current.filter((f) => f !== value)
      : [...current, value]
    const updated = { ...values, features: next.join(',') }
    setValues(updated)
    apply(updated)
  }

  function clear() {
    const next = { search: '', listingType: 'all', minPrice: '', maxPrice: '', minRooms: '', maxRooms: '', minSize: '', maxSize: '', features: '' }
    setValues(next)
    router.push(pathname, { scroll: false })
  }

  const selectedFeatures = values.features ? values.features.split(',') : []
  const hasFilters = values.search || values.listingType !== 'all' || values.minPrice || values.maxPrice || values.minRooms || values.maxRooms || values.minSize || values.maxSize || values.features

  const selectCls = 'px-2 py-1.5 text-xs font-medium text-brand-navy border border-brand-navy/30 bg-brand-offwhite focus:outline-none focus:border-brand-navy transition'
  const inputCls  = 'w-full px-3 py-2 text-sm font-medium text-brand-navy border border-brand-navy/30 bg-brand-offwhite focus:outline-none focus:border-brand-navy transition'
  const labelCls  = 'block text-[10px] font-bold text-brand-navy uppercase tracking-[0.12em] mb-2'
  const barLabel  = 'block text-[9px] font-raleway font-normal uppercase tracking-[0.12em] text-brand-navy mb-1'

  if (horizontal) return (
    <div className="flex flex-wrap items-end gap-4">

      {/* Typ */}
      <div>
        <span className={barLabel}>Typ</span>
        <div className="flex border border-brand-dark overflow-hidden">
          {['all', 'rent', 'sale', 'kommande'].map((t) => (
            <button key={t} onClick={() => set('listingType', t)}
              className={`px-3 py-1.5 text-[9px] font-raleway font-medium uppercase tracking-[0.08em] transition whitespace-nowrap ${values.listingType === t ? 'bg-brand-sage text-white' : 'text-brand-navy/60 hover:text-brand-navy'}`}>
              {t === 'all' ? 'Alla' : t === 'rent' ? 'Hyra' : t === 'sale' ? 'Köp' : 'Kommande'}
            </button>
          ))}
        </div>
      </div>

      {/* Sök */}
      <div>
        <span className={barLabel}>Sök</span>
        <div className="relative">
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input type="search" value={values.search} onChange={(e) => set('search', e.target.value)}
            placeholder="Område, titel…"
            className="pl-7 pr-3 py-1.5 text-xs font-medium text-brand-navy border border-brand-navy/30 bg-brand-offwhite focus:outline-none focus:border-brand-navy transition w-44" />
        </div>
      </div>

      {/* Rum */}
      <div>
        <span className={barLabel}>Rum</span>
        <div className="flex gap-1 items-center">
          <select value={values.minRooms} onChange={(e) => set('minRooms', e.target.value)} className={selectCls}>
            <option value="">Min</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span className="text-brand-muted text-xs">–</span>
          <select value={values.maxRooms} onChange={(e) => set('maxRooms', e.target.value)} className={selectCls}>
            <option value="">Max</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Area */}
      <div>
        <span className={barLabel}>Area m²</span>
        <div className="flex gap-1 items-center">
          <input type="number" placeholder="Min" min={20} max={250} value={values.minSize} onChange={(e) => set('minSize', e.target.value)} className={`${selectCls} w-16`} />
          <span className="text-brand-muted text-xs">–</span>
          <input type="number" placeholder="Max" min={20} max={250} value={values.maxSize} onChange={(e) => set('maxSize', e.target.value)} className={`${selectCls} w-16`} />
        </div>
      </div>

      {/* Pris */}
      <div>
        <span className={barLabel}>Pris SEK</span>
        <div className="flex gap-1 items-center">
          <input type="number" placeholder="Min" min={100000} step={100000} value={values.minPrice} onChange={(e) => set('minPrice', e.target.value)} className={`${selectCls} w-24`} />
          <span className="text-brand-muted text-xs">–</span>
          <input type="number" placeholder="Max" min={100000} step={100000} value={values.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} className={`${selectCls} w-24`} />
        </div>
      </div>

      {/* Rensa */}
      {hasFilters && (
        <button onClick={clear} className="text-[9px] font-raleway font-medium uppercase tracking-[0.1em] text-brand-navy/50 hover:text-brand-navy transition ml-auto self-end pb-1.5">Rensa</button>
      )}
    </div>
  )

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div>
        <label className={labelCls}>Sök</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={values.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Område, titel…"
            className="w-full pl-9 pr-3 py-2 text-sm text-brand-navy border border-brand-dark bg-brand-offwhite focus:outline-none focus:border-brand-navy transition"
          />
        </div>
      </div>

      {/* Listing type */}
      <div>
        <label className={labelCls}>Typ</label>
        <div className="flex border border-brand-dark overflow-hidden text-xs">
          {['all', 'rent', 'sale', 'kommande'].map((t) => (
            <button
              key={t}
              onClick={() => set('listingType', t)}
              className={`flex-1 py-2 font-bold uppercase tracking-[0.04em] text-[9px] transition ${values.listingType === t ? 'bg-brand-sage text-white' : 'text-brand-muted hover:text-brand-navy'}`}
            >
              {t === 'all' ? 'Alla' : t === 'rent' ? 'Hyra' : t === 'sale' ? 'Köp' : 'Kommande'}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div>
        <label className={labelCls}>Rum</label>
        <div className="flex gap-2 items-center">
          <select value={values.minRooms} onChange={(e) => set('minRooms', e.target.value)} className={selectCls}>
            <option value="">Min</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => (
              <option key={r} value={r}>{r} rum</option>
            ))}
          </select>
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <select value={values.maxRooms} onChange={(e) => set('maxRooms', e.target.value)} className={selectCls}>
            <option value="">Max</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => (
              <option key={r} value={r}>{r} rum</option>
            ))}
          </select>
        </div>
      </div>

      {/* Area */}
      <div>
        <label className={labelCls}>Area (m²)</label>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="20"  min={20}  max={250} value={values.minSize} onChange={(e) => set('minSize', e.target.value)} className={inputCls} />
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <input type="number" placeholder="250" min={20}  max={250} value={values.maxSize} onChange={(e) => set('maxSize', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className={labelCls}>Pris (SEK)</label>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="100 000"    min={100000} step={100000} value={values.minPrice} onChange={(e) => set('minPrice', e.target.value)} className={inputCls} />
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <input type="number" placeholder="30 000 000" min={100000} step={100000} value={values.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className={labelCls}>Egenskaper</label>
        <div className="space-y-2.5">
          {FEATURE_OPTIONS.map((f) => (
            <label key={f.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(f.value)}
                onChange={() => toggleFeature(f.value)}
                className="w-4 h-4 border-brand-dark text-brand-navy accent-brand-navy cursor-pointer"
              />
              <span className="text-xs text-brand-navy group-hover:text-brand-muted transition">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Map toggle */}
      <button
        onClick={onToggleMap}
        className="w-full flex items-center justify-center gap-2 py-2.5 border border-brand-sage text-brand-sage text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-brand-sage hover:text-white transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        {showMap ? 'Dölj karta' : 'Se på karta'}
      </button>

      {/* Results count + clear */}
      <div className="pt-3 border-t border-brand-dark flex items-center justify-between">
        <p className="text-xs text-brand-muted">{count} {count !== 1 ? 'annonser' : 'annons'}</p>
        {hasFilters && (
          <button onClick={clear} className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition">
            Rensa
          </button>
        )}
      </div>
    </aside>
  )
}
