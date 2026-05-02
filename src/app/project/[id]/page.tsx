import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/data'
import type { Project } from '@/lib/data'
import ProjectDetail from './ProjectDetail'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function fetchProject(id: string): Promise<Project | null> {
  if (!hasSupabase) {
    return getProjectById(id) ?? null
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: p } = await supabase
    .from('projects')
    .select(`
      *,
      project_documents(*),
      homeowners(full_name, email, phone)
    `)
    .eq('id', id)
    .single()

  if (!p) return null

  return {
    id: p.id,
    contractorId: p.contractor_id,
    homeownerId: p.homeowner_id,
    customerName: p.homeowners?.full_name ?? 'Unknown',
    customerEmail: p.homeowners?.email ?? '',
    customerPhone: p.homeowners?.phone ?? '',
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
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await fetchProject(id)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}
