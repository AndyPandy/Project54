import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { put } from '@vercel/blob'

const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  if (!files.length) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  const paths: string[] = []

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `File too large (max 8 MB): ${file.name}` }, { status: 400 })
    }

    const blob = await put(file.name, file, { access: 'public' })
    paths.push(blob.url)
  }

  return NextResponse.json({ paths })
}
