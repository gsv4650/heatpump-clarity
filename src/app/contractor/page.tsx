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

  // Check role
  const { data: userData } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!userData || userData.role !== 'contractor') {
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
