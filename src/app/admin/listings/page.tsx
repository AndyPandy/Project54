import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function ListingsPage() {
  const apartments = await prisma.apartment.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Listings</h1>
          <p className="text-brand-muted text-sm mt-0.5">{apartments.length} total</p>
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

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-offwhite/60">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Rooms / Size</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Price</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {apartments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-brand-muted">
                  No listings yet.{' '}
                  <Link href="/admin/listings/new" className="text-brand-green font-semibold hover:underline">
                    Create one →
                  </Link>
                </td>
              </tr>
            )}
            {apartments.map((apt) => (
              <tr key={apt.id} className="hover:bg-brand-offwhite/50 transition">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-brand-navy">{apt.title}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{apt.address}</p>
                </td>
                <td className="px-5 py-3.5 capitalize text-brand-muted">{apt.listingType}</td>
                <td className="px-5 py-3.5 text-brand-muted">{apt.rooms} rooms · {apt.sizeSqm} m²</td>
                <td className="px-5 py-3.5 font-semibold text-brand-navy">
                  {apt.price.toLocaleString('sv-SE')} kr{apt.listingType === 'rent' ? '/mån' : ''}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${apt.status === 'published' ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-amber-600'}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/apartments/${apt.slug}`}
                      target="_blank"
                      className="text-xs text-brand-muted hover:text-brand-navy transition"
                    >
                      View ↗
                    </Link>
                    <Link
                      href={`/admin/listings/${apt.id}/edit`}
                      className="text-xs text-brand-green font-semibold hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={apt.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
