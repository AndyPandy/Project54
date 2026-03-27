import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// POST /api/admin/inquiries — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      title, description, desiredLocation, minSize, maxSize, minFee, maxFee,
      minRooms, maxRooms, desiredFloor, fireplaceReq, elevatorReq, terraceReq,
      patioReq, balconyReq, propertyType, moveInFrom, moveInTo, status,
    } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = slugify(String(title))
    let slug = baseSlug
    let n = 1
    while (await prisma.inquiry.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        slug,
        title:           String(title).trim(),
        description:     String(description).trim(),
        desiredLocation: desiredLocation ? String(desiredLocation).trim() : '',
        minSize:         minSize !== undefined && minSize !== '' ? parseFloat(minSize) : null,
        maxSize:         maxSize !== undefined && maxSize !== '' ? parseFloat(maxSize) : null,
        minFee:          minFee  !== undefined && minFee  !== '' ? parseFloat(minFee)  : null,
        maxFee:          maxFee  !== undefined && maxFee  !== '' ? parseFloat(maxFee)  : null,
        minRooms:        minRooms !== undefined && minRooms !== '' ? parseInt(minRooms) : null,
        maxRooms:        maxRooms !== undefined && maxRooms !== '' ? parseInt(maxRooms) : null,
        desiredFloor:    desiredFloor ? String(desiredFloor).trim() : '',
        fireplaceReq:    !!fireplaceReq,
        elevatorReq:     !!elevatorReq,
        terraceReq:      !!terraceReq,
        patioReq:        !!patioReq,
        balconyReq:      !!balconyReq,
        propertyType:    propertyType ? String(propertyType).trim() : '',
        moveInFrom:      moveInFrom ? String(moveInFrom).trim() : '',
        moveInTo:        moveInTo   ? String(moveInTo).trim()   : '',
        status:          status === 'published' ? 'published' : 'draft',
      },
    })

    return NextResponse.json(inquiry, { status: 201 })
  } catch (e) {
    console.error('[POST /api/admin/inquiries]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
