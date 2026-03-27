import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// PUT /api/admin/inquiries/:id — admin only
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.inquiry.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const {
      title, description, desiredLocation, minSize, maxSize, minFee, maxFee,
      minRooms, maxRooms, desiredFloor, fireplaceReq, elevatorReq, terraceReq,
      patioReq, balconyReq, status,
    } = body

    const updated = await prisma.inquiry.update({
      where: { id: params.id },
      data: {
        ...(title           !== undefined && { title:           String(title).trim() }),
        ...(description     !== undefined && { description:     String(description).trim() }),
        ...(desiredLocation !== undefined && { desiredLocation: String(desiredLocation).trim() }),
        ...(minSize         !== undefined && { minSize:         minSize === '' || minSize === null ? null : parseFloat(minSize) }),
        ...(maxSize         !== undefined && { maxSize:         maxSize === '' || maxSize === null ? null : parseFloat(maxSize) }),
        ...(minFee          !== undefined && { minFee:          minFee  === '' || minFee  === null ? null : parseFloat(minFee) }),
        ...(maxFee          !== undefined && { maxFee:          maxFee  === '' || maxFee  === null ? null : parseFloat(maxFee) }),
        ...(minRooms        !== undefined && { minRooms:        minRooms === '' || minRooms === null ? null : parseInt(minRooms) }),
        ...(maxRooms        !== undefined && { maxRooms:        maxRooms === '' || maxRooms === null ? null : parseInt(maxRooms) }),
        ...(desiredFloor    !== undefined && { desiredFloor:    String(desiredFloor).trim() }),
        ...(fireplaceReq    !== undefined && { fireplaceReq:    !!fireplaceReq }),
        ...(elevatorReq     !== undefined && { elevatorReq:     !!elevatorReq }),
        ...(terraceReq      !== undefined && { terraceReq:      !!terraceReq }),
        ...(patioReq        !== undefined && { patioReq:        !!patioReq }),
        ...(balconyReq      !== undefined && { balconyReq:      !!balconyReq }),
        ...(status          !== undefined && { status:          status === 'published' ? 'published' : 'draft' }),
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    console.error('[PUT /api/admin/inquiries/:id]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// DELETE /api/admin/inquiries/:id — admin only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.inquiry.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[DELETE /api/admin/inquiries/:id]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
