import Link from 'next/link'
import AdminPanel from './AdminPanel'
import { SAMPLE_MANUAL_UPDATES, SAMPLE_LEADS } from '@/lib/data'
import type { ManualUpdate, Lead } from '@/lib/data'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function fetchAdminData(userId: string): Promise<{
  manualUpdates: ManualUpdate[]
  leads: Lead[]
}> {
  if (!hasSupabase) {
    return { manualUpdates: SAMPLE_MANUAL_UPDATES, leads: SAMPLE_LEADS }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const [updatesResult, leadsResult] = await Promise.all([
    supabase.from('manual_updates').select('*').order('created_at', { ascending: false }),
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
  ])

  const manualUpdates: ManualUpdate[] = (updatesResult.data ?? []).map((u) => ({
    id: u.id,
    title: u.title,
    description: u.description,
    published: u.published,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }))

  const leads: Lead[] = (leadsResult.data ?? []).map((l) => ({
    id: l.id,
    source: l.source ?? 'unknown',
    email: l.email ?? '',
    phone: l.phone,
    name: l.name,
    utility: l.utility ?? '',
    interest: l.interest ?? '',
    notes: l.notes,
    createdAt: l.created_at,
  }))

  return { manualUpdates, leads }
}

export default async function AdminPage() {
  if (!hasSupabase) {
    // Mock mode — pass sample data with no real auth gate
    return (
      <AdminPanel
        manualUpdates={SAMPLE_MANUAL_UPDATES}
        leads={SAMPLE_LEADS}
        mockMode={true}
      />
    )
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
        <p className="text-gray-600 mb-6">You must be signed in as an admin to access this page.</p>
        <Link
          href="/auth/signin?redirectTo=/admin"
          className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'admin') {
    return (
      <div className="py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">403 — Forbidden</h1>
        <p className="text-gray-600 mb-6">You don&apos;t have permission to access this page. Admin role required.</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
        >
          Go Home
        </Link>
      </div>
    )
  }

  const { manualUpdates, leads } = await fetchAdminData(user.id)

  return (
    <AdminPanel
      manualUpdates={manualUpdates}
      leads={leads}
      mockMode={false}
    />
  )
}
