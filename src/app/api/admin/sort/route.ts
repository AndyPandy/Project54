import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { ids } = await req.json() as { ids: string[] }
  if (!Array.isArray(ids)) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  await Promise.all(
    ids.map((id, index) => prisma.apartment.update({ where: { id }, data: { sortOrder: index } }))
  )

  return NextResponse.json({ ok: true })
}
