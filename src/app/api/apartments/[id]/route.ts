import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

function parse(raw: { images: string; tags: string; [key: string]: unknown }) {
  return { ...raw, images: JSON.parse(raw.images || '[]'), tags: JSON.parse(raw.tags || '[]') }
}

// GET /api/apartments/:id — public
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const apartment = await prisma.apartment.findUnique({ where: { id: params.id } })
    if (!apartment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(parse(apartment))
  } catch (e) {
    console.error('[GET /api/apartments/:id]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/apartments/:id — admin only
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.apartment.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { title, description, price, address, latitude, longitude, rooms, sizeSqm, images, tags, status, listingType, propertyType, floor, fee, operatingCost, buildYear, tenure, floorPlan } = body

    const updated = await prisma.apartment.update({
      where: { id: params.id },
      data: {
        ...(title         !== undefined && { title:         String(title).trim() }),
        ...(description   !== undefined && { description:   String(description).trim() }),
        ...(price         !== undefined && { price:         parseFloat(price) }),
        ...(address       !== undefined && { address:       String(address).trim() }),
        ...(latitude      !== undefined && { latitude:      parseFloat(latitude) }),
        ...(longitude     !== undefined && { longitude:     parseFloat(longitude) }),
        ...(rooms         !== undefined && { rooms:         parseInt(rooms) }),
        ...(sizeSqm       !== undefined && { sizeSqm:       parseFloat(sizeSqm) }),
        ...(images        !== undefined && { images:        JSON.stringify(Array.isArray(images) ? images : []) }),
        ...(tags          !== undefined && { tags:          JSON.stringify(Array.isArray(tags)   ? tags   : []) }),
        ...(status        !== undefined && { status:        status === 'published' ? 'published' : 'draft' }),
        ...(listingType   !== undefined && { listingType:   ['sale', 'kommande'].includes(listingType) ? listingType : 'rent' }),
        ...(propertyType  !== undefined && { propertyType:  String(propertyType) }),
        ...(floor         !== undefined && { floor:         floor === '' || floor === null ? null : parseInt(floor) }),
        ...(fee           !== undefined && { fee:           fee === '' || fee === null ? null : parseFloat(fee) }),
        ...(operatingCost !== undefined && { operatingCost: operatingCost === '' || operatingCost === null ? null : parseFloat(operatingCost) }),
        ...(buildYear     !== undefined && { buildYear:     buildYear === '' || buildYear === null ? null : parseInt(buildYear) }),
        ...(tenure        !== undefined && { tenure:        String(tenure) }),
        ...(floorPlan     !== undefined && { floorPlan:     floorPlan ? String(floorPlan) : '' }),
      },
    })

    return NextResponse.json(parse(updated))
  } catch (e) {
    console.error('[PUT /api/apartments/:id]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// DELETE /api/apartments/:id — admin only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.apartment.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/apartments/:id]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
