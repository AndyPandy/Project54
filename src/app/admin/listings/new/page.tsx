import ListingForm from '@/components/admin/ListingForm'

export const metadata = { title: 'New Listing — Admin' }

export default function NewListingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-brand-navy">New listing</h1>
        <p className="text-brand-muted text-sm mt-0.5">Fill in the details below and save as draft or publish.</p>
      </div>
      <ListingForm />
    </div>
  )
}
