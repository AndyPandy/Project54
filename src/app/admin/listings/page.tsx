import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SortableListings from '@/components/admin/SortableListings'

export default async function ListingsPage() {
  const apartments = await prisma.apartment.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Listings</h1>
          <p className="text-brand-muted text-sm mt-0.5">{apartments.length} total · drag to reorder</p>
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

      <SortableListings initialApartments={apartments.map((apt) => ({
        id: apt.id,
        title: apt.title,
        address: apt.address,
        listingType: apt.listingType,
        rooms: apt.rooms,
        sizeSqm: apt.sizeSqm,
        price: apt.price,
        status: apt.status,
        slug: apt.slug,
      }))} />
    </div>
  )
}
