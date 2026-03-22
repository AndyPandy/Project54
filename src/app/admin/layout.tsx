import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminProviders from '@/components/admin/AdminProviders'
import Sidebar from '@/components/admin/Sidebar'
// Auth protection is handled by src/middleware.ts

export const metadata = { title: 'Admin — NyLya' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Auth is enforced by middleware (src/middleware.ts) — no redirect needed here
  return (
    <AdminProviders session={session}>
      <div className="flex min-h-screen bg-brand-offwhite">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </AdminProviders>
  )
}
