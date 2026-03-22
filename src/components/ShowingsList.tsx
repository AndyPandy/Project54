'use client'

import { useState } from 'react'
import type { Showing } from '@/types'

interface Props {
  showings: Showing[]
  apartmentTitle: string
  address: string
}

const DAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function toCalendarDate(dateStr: string, timeStr: string) {
  return `${dateStr.replace(/-/g, '')}T${timeStr.replace(':', '')}00`
}

function googleCalendarUrl(showing: Showing, title: string, address: string) {
  const start = toCalendarDate(showing.date, showing.startTime)
  const end   = toCalendarDate(showing.date, showing.endTime)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Visning – ${title}`,
    dates: `${start}/${end}`,
    location: address,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

function icsContent(showing: Showing, title: string, address: string) {
  const start = toCalendarDate(showing.date, showing.startTime)
  const end   = toCalendarDate(showing.date, showing.endTime)
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:Visning – ${title}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `LOCATION:${address}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export default function ShowingsList({ showings, apartmentTitle, address }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, { name: string; email: string }>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  if (showings.length === 0) return null

  function getForm(id: string) {
    return forms[id] ?? { name: '', email: '' }
  }

  function setFormField(id: string, field: 'name' | 'email', value: string) {
    setForms((f) => ({ ...f, [id]: { ...getForm(id), [field]: value } }))
  }

  async function handleSignup(e: React.FormEvent, showing: Showing) {
    e.preventDefault()
    const { name, email } = getForm(showing.id)
    if (!name || !email) return
    setLoading((l) => ({ ...l, [showing.id]: true }))
    try {
      await fetch(`/api/showings/${showing.id}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      setSubmitted((s) => ({ ...s, [showing.id]: true }))
    } finally {
      setLoading((l) => ({ ...l, [showing.id]: false }))
    }
  }

  function downloadIcs(showing: Showing) {
    const blob = new Blob([icsContent(showing, apartmentTitle, address)], { type: 'text/calendar' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'visning.ics'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold text-brand-navy mb-3">Visningstider</h2>
      <div className="space-y-2">
        {showings.map((showing) => {
          const isOpen = selectedId === showing.id
          const form   = getForm(showing.id)
          const done   = submitted[showing.id]

          return (
            <div key={showing.id} className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Button */}
              <button
                onClick={() => setSelectedId(isOpen ? null : showing.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${isOpen ? 'bg-brand-navy text-white' : 'bg-white hover:bg-brand-offwhite text-brand-navy'}`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">{formatDate(showing.date)}</span>
                  <span className={`text-sm ${isOpen ? 'text-white/80' : 'text-brand-muted'}`}>{showing.startTime} – {showing.endTime}</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                  {/* Calendar buttons */}
                  <div>
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">Lägg till i kalender</p>
                    <div className="flex gap-2">
                      <a
                        href={googleCalendarUrl(showing, apartmentTitle, address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition text-brand-navy"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.5 3h-3V1.5h-1.5V3h-9V1.5H4.5V3h-3A1.5 1.5 0 000 4.5v15A1.5 1.5 0 001.5 21h18a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm0 16.5h-18V9h18v10.5zm0-12h-18V4.5h3V6H6V4.5h9V6h1.5V4.5h3V7.5z"/>
                        </svg>
                        Google Calendar
                      </a>
                      <button
                        onClick={() => downloadIcs(showing)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition text-brand-navy"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Ladda ner .ics
                      </button>
                    </div>
                  </div>

                  {/* Signup */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-3">Anmäl dig till visning</p>
                    {done ? (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm font-semibold">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Du är anmäld! Vi ses på visningen.
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSignup(e, showing)} className="space-y-2">
                        <input
                          required
                          type="text"
                          placeholder="Ditt namn"
                          value={form.name}
                          onChange={(e) => setFormField(showing.id, 'name', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Din e-post"
                          value={form.email}
                          onChange={(e) => setFormField(showing.id, 'email', e.target.value)}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition"
                        />
                        <button
                          type="submit"
                          disabled={loading[showing.id]}
                          className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                        >
                          {loading[showing.id] ? 'Skickar…' : 'Anmäl mig'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
