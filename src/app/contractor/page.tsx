import { redirect } from 'next/navigation'
import ContractorDashboard from './ContractorDashboard'
import { SAMPLE_PROJECTS } from '@/lib/data'
import type { Project } from '@/lib/data'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getServerProjects(userId: string): Promise<Project[]> {
  if (!hasSupabase) return SAMPLE_PROJECTS

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      *,
      project_documents(*)
    `)
    .eq('contractor_id', userId)
    .order('updated_at', { ascending: false })

  if (!projects) return []

  // Map DB rows to our Project shape
  return projects.map((p) => ({
    id: p.id,
    contractorId: p.contractor_id,
    homeownerId: p.homeowner_id,
    customerName: p.customer_name ?? 'Unknown',
    customerEmail: p.customer_email ?? '',
    customerPhone: p.customer_phone ?? '',
    address: p.address,
    city: p.city ?? '',
    state: p.state ?? 'NY',
    zip: p.zip ?? '',
    utility: p.utility,
    utilityLabel: p.utility_label ?? p.utility,
    category: p.category,
    categoryLabel: p.category_label ?? p.category,
    homeType: p.home_type ?? 'single_family',
    isNewConstruction: p.is_new_construction ?? false,
    isDac: p.is_dac ?? false,
    estimatedIncentive: Number(p.estimated_incentive ?? 0),
    status: p.status as Project['status'],
    notes: p.notes ?? '',
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    documents: (p.project_documents ?? []).map(
      (d: {
        id: string
        project_id: string
        doc_type: string
        doc_label: string
        file_url: string | null
        file_name: string | null
        status: string
        required: boolean
        notes: string | null
        uploaded_at: string | null
      }) => ({
        id: d.id,
        projectId: d.project_id,
        docType: d.doc_type,
        docLabel: d.doc_label,
        fileUrl: d.file_url,
        fileName: d.file_name,
        status: d.status as 'missing' | 'uploaded' | 'approved' | 'rejected',
        required: d.required,
        notes: d.notes,
        uploadedAt: d.uploaded_at,
      })
    ),
  }))
}

export default async function ContractorPage() {
  // Read env vars at the top of the function — before any try blocks —
  // so they're available in the debug page output regardless of where failure occurs.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null

  if (!hasSupabase) {
    // Mock mode — render dashboard with sample data and no real auth
    return <ContractorDashboard projects={SAMPLE_PROJECTS} mockMode={true} />
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirectTo=/contractor')
  }

  // Check role — use maybeSingle() so a missing row returns null instead of throwing
  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle()

  // If the users profile row is missing (can happen if createUserProfile failed
  // silently during signup), try to recover via service role upsert using
  // user.user_metadata — role and full_name are stored there at signUp() time.
  if (!userData) {
    // Recovery: attempt to create the missing public.users row via service role
    type UpsertError = {
      code: string | null
      message: string | null
      details: string | null
      hint: string | null
    }
    let usersUpsertError: UpsertError | null = null
    let contractorsUpsertError: UpsertError | null = null

    try {
      const { createServiceClient } = await import('@/lib/supabase/server')
      const serviceSupabase = await createServiceClient()

      const role = (user.user_metadata?.role as string) ?? 'contractor'
      const fullName = (user.user_metadata?.full_name as string) ?? null

      const { error: ue } = await serviceSupabase
        .from('users')
        .upsert({ id: user.id, email: user.email, full_name: fullName, role })

      if (ue) {
        usersUpsertError = {
          code: ue.code ?? null,
          message: ue.message ?? null,
          details: (ue as { details?: string }).details ?? null,
          hint: (ue as { hint?: string }).hint ?? null,
        }
        console.error('[contractor recovery] users upsert error:', usersUpsertError)
      } else if (role === 'contractor') {
        const { error: ce } = await serviceSupabase
          .from('contractors')
          .upsert({ id: user.id, company_name: fullName ?? user.email ?? 'My Company' })

        if (ce) {
          contractorsUpsertError = {
            code: ce.code ?? null,
            message: ce.message ?? null,
            details: (ce as { details?: string }).details ?? null,
            hint: (ce as { hint?: string }).hint ?? null,
          }
          console.error('[contractor recovery] contractors upsert error:', contractorsUpsertError)
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[contractor recovery] unexpected throw:', msg)
      usersUpsertError = { code: null, message: msg, details: null, hint: null }
    }

    // Re-fetch after recovery attempt
    const { data: recovered } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (!recovered || recovered.role !== 'contractor') {
      // Recovery failed — render debug page instead of redirecting
      // This is a temporary diagnostic tool. Remove after root cause is fixed.
      return (
        <div className="py-12 px-4 sm:px-6 max-w-3xl mx-auto font-mono text-sm">
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 space-y-6">
            <div>
              <h1 className="text-lg font-bold text-red-900 mb-1">
                Contractor Dashboard — Recovery Failed (Debug Mode)
              </h1>
              <p className="text-red-700 text-xs">
                This is a temporary diagnostic page. Email the contents below to{' '}
                <strong>support@heatpumpclarity.com</strong> so we can fix this.
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">Auth User</p>
              <p className="text-gray-700">ID: <span className="text-blue-700">{user.id}</span></p>
              <p className="text-gray-700">Email: <span className="text-blue-700">{user.email}</span></p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">user_metadata</p>
              <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto text-gray-900 whitespace-pre-wrap break-all">
                {JSON.stringify(user.user_metadata, null, 2)}
              </pre>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">public.users upsert error</p>
              {usersUpsertError ? (
                <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto text-red-900 whitespace-pre-wrap break-all">
                  {JSON.stringify(usersUpsertError, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic text-xs">No error — upsert appeared to succeed but row still missing after re-fetch.</p>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">public.contractors upsert error</p>
              {contractorsUpsertError ? (
                <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto text-red-900 whitespace-pre-wrap break-all">
                  {JSON.stringify(contractorsUpsertError, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 italic text-xs">
                  {usersUpsertError
                    ? 'Skipped — users upsert failed first.'
                    : 'No error — upsert appeared to succeed.'}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">ENV VAR DIAGNOSTIC</p>
              <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto text-gray-900 whitespace-pre-wrap break-all">
                {JSON.stringify({
                  NEXT_PUBLIC_SUPABASE_URL: {
                    set: supabaseUrl !== null && supabaseUrl.length > 0,
                    length: supabaseUrl?.length ?? 0,
                    first30: supabaseUrl ? supabaseUrl.slice(0, 30) : '(empty)',
                  },
                  SUPABASE_SERVICE_ROLE_KEY: {
                    set: serviceKey !== null && serviceKey.length > 0,
                    length: serviceKey?.length ?? 0,
                    first30: serviceKey ? serviceKey.slice(0, 30) : '(empty)',
                  },
                }, null, 2)}
              </pre>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-800">users row after recovery attempt</p>
              <pre className="bg-gray-100 rounded p-3 text-xs overflow-auto text-gray-900 whitespace-pre-wrap break-all">
                {JSON.stringify(recovered, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )
    }

    // Recovery succeeded
    const contractorName = recovered.full_name ?? user.email ?? 'Contractor'
    const projects = await getServerProjects(user.id)
    return (
      <ContractorDashboard
        projects={projects}
        mockMode={false}
        contractorName={contractorName}
      />
    )
  }

  if (userData.role !== 'contractor') {
    redirect('/auth/signin?redirectTo=/contractor')
  }

  const projects = await getServerProjects(user.id)

  return (
    <ContractorDashboard
      projects={projects}
      mockMode={false}
      contractorName={userData.full_name ?? user.email ?? 'Contractor'}
    />
  )
}
