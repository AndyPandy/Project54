import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const showings = await prisma.showing.findMany({
      where: { apartmentId: params.id },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    return NextResponse.json(showings.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })))
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const count = await prisma.showing.count({ where: { apartmentId: params.id } })
    if (count >= 3) return NextResponse.json({ error: 'Max 3 showings per listing' }, { status: 400 })

    const { date, startTime, endTime } = await req.json()
    if (!date || !startTime || !endTime) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const showing = await prisma.showing.create({
      data: { apartmentId: params.id, date, startTime, endTime },
    })
    return NextResponse.json({ ...showing, createdAt: showing.createdAt.toISOString() }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
