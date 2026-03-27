import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import InquiryListingsClient from '@/components/InquiryListingsClient'
import type { Inquiry } from '@/types'

function parseInquiry(raw: {
  id: string; slug: string; title: string; description: string
  desiredLocation: string; minSize: number | null; maxSize: number | null
  minFee: number | null; maxFee: number | null; minRooms: number | null
  maxRooms: number | null; desiredFloor: string; fireplaceReq: boolean
  elevatorReq: boolean; terraceReq: boolean; patioReq: boolean
  balconyReq: boolean; moveInFrom: string; moveInTo: string; status: string; createdAt: Date; updatedAt: Date
}): Inquiry {
  return {
    ...raw,
    status: raw.status as 'draft' | 'published',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }
}

export default async function KopfragningPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { search, minRooms, maxRooms, minSize, maxSize, minFee, maxFee, features, sort } = searchParams

  const where: Record<string, unknown> = { status: 'published' }

  if (minRooms) where.minRooms = { ...(where.minRooms as object ?? {}), gte: parseInt(minRooms) }
  if (maxRooms) where.maxRooms = { ...(where.maxRooms as object ?? {}), lte: parseInt(maxRooms) }
  if (minSize)  where.minSize  = { ...(where.minSize  as object ?? {}), gte: parseFloat(minSize) }
  if (maxSize)  where.maxSize  = { ...(where.maxSize  as object ?? {}), lte: parseFloat(maxSize) }
  if (minFee)   where.minFee   = { ...(where.minFee   as object ?? {}), gte: parseFloat(minFee) }
  if (maxFee)   where.maxFee   = { ...(where.maxFee   as object ?? {}), lte: parseFloat(maxFee) }

  const orderBy =
    sort === 'rooms_asc'  ? { minRooms: 'asc'  as const } :
    sort === 'size_asc'   ? { minSize:  'asc'  as const } :
    sort === 'fee_asc'    ? { minFee:   'asc'  as const } :
    sort === 'fee_desc'   ? { minFee:   'desc' as const } :
                            { createdAt: 'desc' as const }

  const rawInquiries = await prisma.inquiry.findMany({
    where,
    orderBy,
  })

  let inquiries = rawInquiries.map(parseInquiry)

  if (search) {
    const q = search.toLowerCase()
    inquiries = inquiries.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.desiredLocation.toLowerCase().includes(q),
    )
  }

  if (features) {
    const selected = features.split(',')
    inquiries = inquiries.filter((i) =>
      selected.every((f) => {
        if (f === 'eldstad') return i.fireplaceReq
        if (f === 'hiss')    return i.elevatorReq
        if (f === 'balkong') return i.balconyReq || i.patioReq || i.terraceReq
        return true
      })
    )
  }

  return (
    <>
      <Suspense fallback={null}><Navbar /></Suspense>
      <InquiryListingsClient inquiries={inquiries} searchParams={searchParams} />
    </>
  )
}
