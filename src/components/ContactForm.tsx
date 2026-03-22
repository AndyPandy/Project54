'use client'

import { useState } from 'react'

interface Props {
  apartmentTitle: string
  apartmentId: string
}

export default function ContactForm({ apartmentTitle }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // In production wire this to an email API (e.g. Resend, SendGrid)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-6 text-center">
        <svg className="w-10 h-10 text-brand-green mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold text-brand-navy">Meddelande skickat!</p>
        <p className="text-sm text-brand-muted mt-1">Vi återkommer så snart som möjligt.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-xs text-brand-green font-semibold hover:underline">
          Skicka ett till
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="font-black text-brand-navy mb-1">Kontakta mäklaren</h3>
      <p className="text-xs text-brand-muted mb-5 line-clamp-2">{apartmentTitle}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1">Namn</label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition"
            placeholder="Ditt namn"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1">Telefon (valfritt)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition"
            placeholder="+46 70 000 00 00"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1">Meddelande</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition resize-none"
            placeholder="Jag är intresserad av den här bostaden…"
          />
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-600">Något gick fel. Försök igen.</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-brand-green hover:bg-brand-green-d text-white font-bold py-3 rounded-lg transition disabled:opacity-60 text-sm"
        >
          {status === 'sending' ? 'Skickar…' : 'Skicka meddelande'}
        </button>

        <p className="text-xs text-brand-muted text-center">
          Dina kontaktuppgifter delas endast med mäklaren.
        </p>
      </form>
    </div>
  )
}
