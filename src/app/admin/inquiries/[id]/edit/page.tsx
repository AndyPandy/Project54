import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import InquiryForm from '@/components/admin/InquiryForm'
import type { Inquiry } from '@/types'

export const metadata = { title: 'Edit Inquiry — Admin' }

export default async function EditInquiryPage({ params }: { params: { id: string } }) {
  const raw = await prisma.inquiry.findUnique({ where: { id: params.id } })
  if (!raw) notFound()

  const inquiry: Inquiry = {
    ...raw,
    status: raw.status as 'draft' | 'published',
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-navy">Edit inquiry</h1>
        <p className="text-brand-muted text-sm mt-0.5 truncate">{inquiry.title}</p>
      </div>
      <InquiryForm inquiry={inquiry} />
    </div>
  )
}
