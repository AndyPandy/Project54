'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password.')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Image src="/logo.png" alt="NyLya" width={180} height={68} className="flex-shrink-0 object-contain brightness-0 invert" />
          </div>
          <p className="text-brand-offwhite/50 text-sm">Admin portal</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-brand-navy mb-6">Sign in</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-navy uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green-d text-white font-bold py-2.5 rounded-lg transition disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
