import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [total, published, drafts] = await Promise.all([
    prisma.apartment.count(),
    prisma.apartment.count({ where: { status: 'published' } }),
    prisma.apartment.count({ where: { status: 'draft' } }),
  ])

  const recent = await prisma.apartment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, slug: true, title: true, status: true, price: true, listingType: true, createdAt: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Dashboard</h1>
          <p className="text-brand-muted text-sm mt-0.5">Overview of your listings</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-d text-white text-sm font-bold px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total listings', value: total,     color: 'text-brand-navy' },
          { label: 'Published',      value: published, color: 'text-brand-green' },
          { label: 'Drafts',         value: drafts,    color: 'text-amber-500'  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-brand-muted font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-brand-navy text-sm">Recent listings</h2>
          <Link href="/admin/listings" className="text-xs text-brand-green font-semibold hover:underline">
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-brand-offwhite/60">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Price</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recent.map((apt) => (
              <tr key={apt.id} className="hover:bg-brand-offwhite/50 transition">
                <td className="px-5 py-3.5 font-medium text-brand-navy">{apt.title}</td>
                <td className="px-5 py-3.5 capitalize text-brand-muted">{apt.listingType}</td>
                <td className="px-5 py-3.5 text-brand-navy font-semibold">
                  {apt.price.toLocaleString('sv-SE')} kr{apt.listingType === 'rent' ? '/mån' : ''}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${apt.status === 'published' ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-amber-600'}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/admin/listings/${apt.id}/edit`}
                    className="text-xs text-brand-green font-semibold hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
