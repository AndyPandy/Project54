import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteInquiryButton from '@/components/admin/DeleteInquiryButton'

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })

  function range(min: number | null, max: number | null, unit: string) {
    if (min != null && max != null) return `${min}–${max} ${unit}`
    if (min != null) return `Fr. ${min} ${unit}`
    if (max != null) return `T. ${max} ${unit}`
    return '—'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">Inquiries</h1>
          <p className="text-brand-muted text-sm mt-0.5">{inquiries.length} total</p>
        </div>
        <Link
          href="/admin/inquiries/new"
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-d text-white text-sm font-bold px-4 py-2.5 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New inquiry
        </Link>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-brand-muted text-sm">No inquiries yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold text-brand-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3">Titel</th>
                <th className="text-left px-4 py-3">Plats</th>
                <th className="text-left px-4 py-3">Rum</th>
                <th className="text-left px-4 py-3">Area</th>
                <th className="text-left px-4 py-3">Avgift</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-brand-navy truncate max-w-[180px]">{inq.title}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-muted truncate max-w-[120px]">{inq.desiredLocation || '—'}</td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{range(inq.minRooms, inq.maxRooms, 'rum')}</td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{range(inq.minSize, inq.maxSize, 'm²')}</td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">{range(inq.minFee, inq.maxFee, 'kr')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${inq.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/inquiries/${inq.id}/edit`}
                        className="text-xs font-semibold text-brand-navy hover:text-brand-muted transition"
                      >
                        Edit
                      </Link>
                      <DeleteInquiryButton id={inq.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
