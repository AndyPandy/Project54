import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function parse(raw: { images: string; tags: string; [key: string]: unknown }) {
  return { ...raw, images: JSON.parse(raw.images || '[]'), tags: JSON.parse(raw.tags || '[]') }
}

// GET /api/apartments — public, returns published listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'
    const session = await getServerSession(authOptions)
    const isAdmin = !!session
    const where = all && isAdmin ? {} : { status: 'published' }
    const apartments = await prisma.apartment.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(apartments.map(parse))
  } catch (e) {
    console.error('[GET /api/apartments]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/apartments — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, price, address, latitude, longitude, rooms, sizeSqm, images, tags, status, listingType, propertyType, floor, fee, operatingCost, buildYear, tenure, floorPlan } = body

    if (!title || !description || !price || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = slugify(title)
    let slug = baseSlug
    let n = 1
    while (await prisma.apartment.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`
    }

    const apartment = await prisma.apartment.create({
      data: {
        slug,
        title:       String(title).trim(),
        description: String(description).trim(),
        price:       parseFloat(price),
        address:     String(address).trim(),
        latitude:    parseFloat(latitude) || 0,
        longitude:   parseFloat(longitude) || 0,
        rooms:       parseInt(rooms) || 1,
        sizeSqm:     parseFloat(sizeSqm) || 0,
        images:      JSON.stringify(Array.isArray(images) ? images : []),
        tags:        JSON.stringify(Array.isArray(tags)   ? tags   : []),
        status:       status === 'published' ? 'published' : 'draft',
        listingType:  ['sale', 'kommande'].includes(listingType) ? listingType : 'rent',
        propertyType: propertyType ? String(propertyType) : '',
        floor:        floor !== undefined && floor !== '' ? parseInt(floor) : null,
        fee:          fee !== undefined && fee !== '' ? parseFloat(fee) : null,
        operatingCost: operatingCost !== undefined && operatingCost !== '' ? parseFloat(operatingCost) : null,
        buildYear:     buildYear !== undefined && buildYear !== '' ? parseInt(buildYear) : null,
        tenure:        tenure ? String(tenure) : '',
        floorPlan:     floorPlan ? String(floorPlan) : '',
      },
    })

    return NextResponse.json(parse(apartment), { status: 201 })
  } catch (e) {
    console.error('[POST /api/apartments]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
