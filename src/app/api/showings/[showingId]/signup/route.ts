import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { showingId: string } }) {
  try {
    const { name, email } = await req.json()
    if (!name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const showing = await prisma.showing.findUnique({ where: { id: params.showingId } })
    if (!showing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.showingSignup.create({ data: { showingId: params.showingId, name, email } })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
