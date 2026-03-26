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
    await new Promise((r) => setTimeout(r, 800))
    setStatus('sent')
  }

  const fieldCls = 'w-full border border-brand-navy/20 bg-brand-offwhite px-3 py-2.5 text-sm text-brand-navy/70 focus:outline-none focus:border-brand-navy/50 transition'
  const labelCls = 'block text-[10px] font-bold text-brand-muted uppercase tracking-[0.12em] mb-1.5'

  if (status === 'sent') {
    return (
      <div className="border border-brand-dark p-6 text-center">
        <svg className="w-8 h-8 text-brand-navy mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold text-brand-navy text-sm">Meddelande skickat</p>
        <p className="text-xs text-brand-muted mt-1">Vi återkommer så snart som möjligt.</p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-muted hover:text-brand-navy transition">
          Skicka ett till
        </button>
      </div>
    )
  }

  return (
    <div className="border border-brand-dark p-5">
      <h3 className="font-black text-brand-navy mb-0.5 text-sm uppercase tracking-[0.06em]">Kontakta mäklaren</h3>
      <p className="text-xs text-brand-muted mb-5 line-clamp-1">{apartmentTitle}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={labelCls}>Namn</label>
          <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={fieldCls} placeholder="Ditt namn" />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} className={fieldCls} placeholder="you@example.com" />
        </div>
        <div>
          <label className={labelCls}>Telefon (valfritt)</label>
          <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={fieldCls} placeholder="+46 70 000 00 00" />
        </div>
        <div>
          <label className={labelCls}>Meddelande</label>
          <textarea required rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} className={`${fieldCls} resize-none`} placeholder="Jag är intresserad av den här bostaden…" />
        </div>

        {status === 'error' && <p className="text-xs text-red-600">Något gick fel. Försök igen.</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-brand-sage hover:bg-brand-sage-d text-white font-bold py-3 transition disabled:opacity-60 text-[11px] uppercase tracking-[0.1em]"
        >
          {status === 'sending' ? 'Skickar…' : 'Skicka meddelande'}
        </button>

        <p className="text-[10px] text-brand-muted text-center">
          Dina kontaktuppgifter delas endast med mäklaren.
        </p>
      </form>
    </div>
  )
}
