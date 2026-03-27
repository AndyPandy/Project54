import InquiryForm from '@/components/admin/InquiryForm'

export const metadata = { title: 'New Inquiry — Admin' }

export default function NewInquiryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-navy">New inquiry</h1>
        <p className="text-brand-muted text-sm mt-0.5">Fill in the details below and save as draft or publish.</p>
      </div>
      <InquiryForm />
    </div>
  )
}
