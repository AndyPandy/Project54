'use client'

import { useState } from 'react'
import type { Showing } from '@/types'

interface Props {
  apartmentId: string
  initial: Showing[]
}

const DAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} • ${dateStr.slice(0, 4)}`
}

export default function ShowingsManager({ apartmentId, initial }: Props) {
  const [showings, setShowings]   = useState<Showing[]>(initial)
  const [date, setDate]           = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime]     = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  async function addShowing(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch(`/api/apartments/${apartmentId}/showings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, startTime, endTime }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Kunde inte spara')
        return
      }
      const created = await res.json()
      setShowings((prev) => [...prev, created])
      setDate(''); setStartTime(''); setEndTime('')
    } finally {
      setSaving(false)
    }
  }

  async function deleteShowing(id: string) {
    await fetch(`/api/showings/${id}`, { method: 'DELETE' })
    setShowings((prev) => prev.filter((s) => s.id !== id))
  }

  const inputCls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition'

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Visningstider</h2>

      {/* Existing showings */}
      {showings.length > 0 ? (
        <ul className="space-y-2 mb-5">
          {showings.map((s) => (
            <li key={s.id} className="flex items-center justify-between bg-brand-offwhite rounded-lg px-4 py-2.5">
              <div>
                <p className="text-sm font-semibold text-brand-navy">{formatDate(s.date)}</p>
                <p className="text-xs text-brand-muted">{s.startTime} – {s.endTime}</p>
              </div>
              <button
                onClick={() => deleteShowing(s.id)}
                className="text-red-400 hover:text-red-600 transition"
                title="Ta bort"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-brand-muted mb-5">Inga visningstider tillagda.</p>
      )}

      {/* Add new */}
      {showings.length < 3 && (
        <form onSubmit={addShowing} className="space-y-3">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-wide">Lägg till visningstid</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-brand-muted mb-1">Datum</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">Starttid</label>
              <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="block text-xs text-brand-muted mb-1">Sluttid</label>
              <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={`${inputCls} w-full`} />
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="bg-brand-green hover:bg-brand-green-d text-white font-bold px-4 py-2 rounded-lg text-sm transition disabled:opacity-60"
          >
            {saving ? 'Sparar…' : '+ Lägg till'}
          </button>
        </form>
      )}
      {showings.length >= 3 && (
        <p className="text-xs text-brand-muted">Max 3 visningstider per annons.</p>
      )}
    </div>
  )
}
