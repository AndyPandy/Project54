import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import ApartmentCard from '@/components/ApartmentCard'
import ListingsClient from '@/components/ListingsClient'
import type { Apartment } from '@/types'

function parseApartment(raw: {
  id: string; slug: string; title: string; description: string
  price: number; address: string; latitude: number; longitude: number
  rooms: number; sizeSqm: number; images: string; tags: string; status: string
  listingType: string; propertyType: string; floor: number | null
  fee: number | null; operatingCost: number | null; buildYear: number | null
  tenure: string; floorPlan: string; createdAt: Date; updatedAt: Date
}): Apartment {
  return {
    ...raw,
    images: JSON.parse(raw.images || '[]'),
    tags:   JSON.parse(raw.tags   || '[]'),
    status: raw.status as 'draft' | 'published',
    listingType: raw.listingType as 'rent' | 'sale' | 'kommande',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { search, listingType, minPrice, maxPrice, minRooms, maxRooms, minSize, maxSize, features } = searchParams

  const where: Record<string, unknown> = { status: 'published' }

  if (listingType && listingType !== 'all') where.listingType = listingType
  if (minRooms)  where.rooms    = { ...(where.rooms    as object ?? {}), gte: parseInt(minRooms) }
  if (maxRooms)  where.rooms    = { ...(where.rooms    as object ?? {}), lte: parseInt(maxRooms) }
  if (minPrice)  where.price    = { ...(where.price    as object ?? {}), gte: parseFloat(minPrice) }
  if (maxPrice)  where.price    = { ...(where.price    as object ?? {}), lte: parseFloat(maxPrice) }
  if (minSize)   where.sizeSqm  = { ...(where.sizeSqm  as object ?? {}), gte: parseFloat(minSize) }
  if (maxSize)   where.sizeSqm  = { ...(where.sizeSqm  as object ?? {}), lte: parseFloat(maxSize) }

  const rawApartments = await prisma.apartment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  let apartments = rawApartments.map(parseApartment)

  if (search) {
    const q = search.toLowerCase()
    apartments = apartments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    )
  }

  if (features) {
    const featureMap: Record<string, string[]> = {
      balkong: ['balkong', 'uteplats', 'terass'],
      hiss:    ['hiss'],
      eldstad: ['eldstad'],
    }
    const selected = features.split(',')
    apartments = apartments.filter((a) =>
      selected.every((f) => (featureMap[f] ?? [f]).some((tag) => a.tags.includes(tag)))
    )
  }

  return (
    <>
      <Suspense fallback={null}><Navbar /></Suspense>
      <ListingsClient apartments={apartments} searchParams={searchParams} />
    </>
  )
}
