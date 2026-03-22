import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// One-time admin setup endpoint — protected by SETUP_SECRET env var
export async function POST(req: NextRequest) {
  const secret = process.env.SETUP_SECRET
  if (!secret) return NextResponse.json({ error: 'SETUP_SECRET not configured' }, { status: 500 })

  const { token, email, password, name } = await req.json()
  if (token !== secret) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 409 })

  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      name: name ?? 'Admin',
      role: 'admin',
    },
  })

  return NextResponse.json({ ok: true, id: user.id, email: user.email })
}
