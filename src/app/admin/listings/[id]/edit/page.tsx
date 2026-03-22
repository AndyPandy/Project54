import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ListingForm from '@/components/admin/ListingForm'
import ShowingsManager from '@/components/admin/ShowingsManager'
import type { Apartment, Showing } from '@/types'

export const metadata = { title: 'Edit Listing — Admin' }

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const raw = await prisma.apartment.findUnique({ where: { id: params.id } })
  if (!raw) notFound()

  const rawShowings = await prisma.showing.findMany({
    where: { apartmentId: params.id },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })
  const showings: Showing[] = rawShowings.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() }))

  const apartment: Apartment = {
    ...raw,
    images: JSON.parse(raw.images || '[]'),
    tags:   JSON.parse(raw.tags   || '[]'),
    status: raw.status as 'draft' | 'published',
    listingType: raw.listingType as 'rent' | 'sale' | 'kommande',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-navy">Edit listing</h1>
        <p className="text-brand-muted text-sm mt-0.5">{apartment.title}</p>
      </div>
      <ListingForm apartment={apartment} />
      <div className="mt-6">
        <ShowingsManager apartmentId={params.id} initial={showings} />
      </div>
    </div>
  )
}
