'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

interface Props {
  searchParams: { [key: string]: string | undefined }
  count: number
  horizontal?: boolean
}

const ROOM_OPTIONS = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const INQUIRY_FEATURE_OPTIONS = [
  { value: 'eldstad',  label: 'Eldstad' },
  { value: 'hiss',     label: 'Hiss' },
  { value: 'balkong',  label: 'Balkong / Uteplats / Terrass' },
]

export default function InquiryFilters({ searchParams, count, horizontal }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const [values, setValues] = useState({
    search:       searchParams.search       ?? '',
    propertyType: searchParams.propertyType ?? '',
    minRooms:     searchParams.minRooms     ?? '',
    maxRooms:     searchParams.maxRooms     ?? '',
    minSize:      searchParams.minSize      ?? '',
    maxSize:      searchParams.maxSize      ?? '',
    minFee:       searchParams.minFee       ?? '',
    maxFee:       searchParams.maxFee       ?? '',
    features:     searchParams.features     ?? '',
    sort:         searchParams.sort         ?? '',
  })

  const apply = useCallback(
    (next: typeof values) => {
      const params = new URLSearchParams()
      if (next.search)       params.set('search',       next.search)
      if (next.propertyType) params.set('propertyType', next.propertyType)
      if (next.minRooms)     params.set('minRooms',     next.minRooms)
      if (next.maxRooms) params.set('maxRooms',  next.maxRooms)
      if (next.minSize)  params.set('minSize',   next.minSize)
      if (next.maxSize)  params.set('maxSize',   next.maxSize)
      if (next.minFee)   params.set('minFee',    next.minFee)
      if (next.maxFee)   params.set('maxFee',    next.maxFee)
      if (next.features) params.set('features',  next.features)
      if (next.sort)     params.set('sort',      next.sort)
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
    const next = { search: '', propertyType: '', minRooms: '', maxRooms: '', minSize: '', maxSize: '', minFee: '', maxFee: '', features: '', sort: '' }
    setValues(next)
    router.push(pathname, { scroll: false })
  }

  const selectedFeatures = values.features ? values.features.split(',') : []
  const hasFilters = values.search || values.propertyType || values.minRooms || values.maxRooms || values.minSize || values.maxSize || values.minFee || values.maxFee || values.features

  const selectCls = 'px-2 py-1.5 text-[9px] font-raleway font-medium text-brand-navy/60 border border-brand-navy/20 bg-brand-offwhite focus:outline-none focus:border-brand-navy/50 transition'
  const inputCls  = 'w-full px-3 py-2 text-[9px] font-raleway font-medium text-brand-navy/60 border border-brand-navy/20 bg-brand-offwhite focus:outline-none focus:border-brand-navy/50 transition'
  const labelCls  = 'block text-[10px] font-bold text-brand-muted uppercase tracking-[0.12em] mb-2'
  const barLabel  = 'block text-[9px] font-raleway font-normal uppercase tracking-[0.12em] text-brand-muted mb-1'

  if (horizontal) return (
    <div className="flex flex-wrap items-end justify-center gap-4">

      {/* Sök */}
      <div className="flex flex-col items-center">
        <span className={barLabel}>Sök</span>
        <div className="relative">
          <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" /><path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input type="search" value={values.search} onChange={(e) => set('search', e.target.value)}
            placeholder="Titel, plats…"
            className="pl-7 pr-3 py-1.5 text-[9px] font-raleway font-medium text-brand-navy/60 border border-brand-navy/20 bg-brand-offwhite focus:outline-none focus:border-brand-navy/50 transition w-44" />
        </div>
      </div>

      {/* Bostadstyp */}
      <div className="flex flex-col items-center">
        <span className={barLabel}>Bostadstyp</span>
        <div className="flex gap-1">
          {[{ value: '', label: 'Alla' }, { value: 'Lägenhet', label: 'Lägenhet' }, { value: 'Villa', label: 'Villa' }, { value: 'Radhus', label: 'Radhus' }].map((opt) => (
            <button key={opt.value} onClick={() => set('propertyType', opt.value)}
              className={`px-2.5 py-1.5 text-[9px] font-raleway font-medium uppercase tracking-[0.08em] border transition whitespace-nowrap ${
                values.propertyType === opt.value
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'border-brand-navy/20 text-brand-navy/60 hover:border-brand-navy/40'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rum */}
      <div className="flex flex-col items-center">
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
      <div className="flex flex-col items-center">
        <span className={barLabel}>Area m²</span>
        <div className="flex gap-1 items-center">
          <input type="number" placeholder="Min" min={20} max={500} value={values.minSize} onChange={(e) => set('minSize', e.target.value)} className={`${selectCls} w-16`} />
          <span className="text-brand-muted text-xs">–</span>
          <input type="number" placeholder="Max" min={20} max={500} value={values.maxSize} onChange={(e) => set('maxSize', e.target.value)} className={`${selectCls} w-16`} />
        </div>
      </div>

      {/* Avgift */}
      <div className="flex flex-col items-center">
        <span className={barLabel}>Avgift</span>
        <div className="flex gap-1 items-center">
          <input type="number" placeholder="2000" min={0} step={500} value={values.minFee} onChange={(e) => set('minFee', e.target.value)} className={`${selectCls} w-24`} />
          <span className="text-brand-muted text-xs">–</span>
          <input type="number" placeholder="50000" min={0} step={500} value={values.maxFee} onChange={(e) => set('maxFee', e.target.value)} className={`${selectCls} w-24`} />
        </div>
      </div>

      {/* Egenskaper */}
      <div className="flex flex-col items-center">
        <span className={barLabel}>Egenskaper</span>
        <div className="flex gap-1">
          {INQUIRY_FEATURE_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => toggleFeature(f.value)}
              className={`px-2.5 py-1.5 text-[9px] font-raleway font-medium uppercase tracking-[0.08em] border transition whitespace-nowrap ${
                selectedFeatures.includes(f.value)
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'border-brand-navy/20 text-brand-navy/60 hover:border-brand-navy/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={clear} className="text-[9px] font-raleway font-medium uppercase tracking-[0.1em] text-brand-navy/50 hover:text-brand-navy transition self-end pb-1.5">Rensa</button>
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
            placeholder="Titel, plats…"
            className="w-full pl-9 pr-3 py-2 text-sm text-brand-navy border border-brand-dark bg-brand-offwhite focus:outline-none focus:border-brand-navy transition"
          />
        </div>
      </div>

      {/* Bostadstyp */}
      <div>
        <label className={labelCls}>Bostadstyp</label>
        <select value={values.propertyType} onChange={(e) => set('propertyType', e.target.value)} className={inputCls}>
          <option value="">Alla</option>
          <option value="Lägenhet">Lägenhet</option>
          <option value="Villa">Villa</option>
          <option value="Radhus">Radhus</option>
        </select>
      </div>

      {/* Rooms */}
      <div>
        <label className={labelCls}>Rum</label>
        <div className="flex gap-2 items-center">
          <select value={values.minRooms} onChange={(e) => set('minRooms', e.target.value)} className={selectCls}>
            <option value="">Min</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => <option key={r} value={r}>{r} rum</option>)}
          </select>
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <select value={values.maxRooms} onChange={(e) => set('maxRooms', e.target.value)} className={selectCls}>
            <option value="">Max</option>
            {ROOM_OPTIONS.filter(Boolean).map((r) => <option key={r} value={r}>{r} rum</option>)}
          </select>
        </div>
      </div>

      {/* Area */}
      <div>
        <label className={labelCls}>Area (m²)</label>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="20"  min={20} max={500} value={values.minSize} onChange={(e) => set('minSize', e.target.value)} className={inputCls} />
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <input type="number" placeholder="500" min={20} max={500} value={values.maxSize} onChange={(e) => set('maxSize', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Fee */}
      <div>
        <label className={labelCls}>Avgift (kr/mån)</label>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="2000"  min={0} step={500} value={values.minFee} onChange={(e) => set('minFee', e.target.value)} className={inputCls} />
          <span className="text-brand-muted text-xs flex-shrink-0">–</span>
          <input type="number" placeholder="50000" min={0} step={500} value={values.maxFee} onChange={(e) => set('maxFee', e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className={labelCls}>Egenskaper</label>
        <div className="space-y-2.5">
          {INQUIRY_FEATURE_OPTIONS.map((f) => (
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

      {/* Results count + clear */}
      <div className="pt-3 border-t border-brand-dark flex items-center justify-between">
        <p className="text-xs text-brand-muted">{count} {count !== 1 ? 'förfrågningar' : 'förfrågan'}</p>
        {hasFilters && (
          <button onClick={clear} className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition">
            Rensa
          </button>
        )}
      </div>
    </aside>
  )
}
