'use server'

import { getDocumentChecklist, type CategoryCode } from '@/lib/calculator'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export interface CreateProjectData {
  address: string
  city: string
  state: string
  zip: string
  utility: string
  category: string
  categoryLabel: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  homeType?: string
  isDac?: boolean
  estimatedIncentive?: number
}

export async function createProject(
  data: CreateProjectData
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  if (!hasSupabase) {
    console.log('[mock] createProject', data)
    return { success: true, projectId: `mock-${Date.now()}` }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated.' }
  }

  // Get contractor id (same as user id for contractors)
  const { data: contractorData, error: contractorError } = await supabase
    .from('contractors')
    .select('id')
    .eq('id', user.id)
    .single()

  if (contractorError || !contractorData) {
    return { success: false, error: 'Contractor profile not found.' }
  }

  // Create a homeowner record for the customer
  const { data: homeowner, error: homeownerError } = await supabase
    .from('homeowners')
    .insert({
      full_name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone ?? null,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      utility: data.utility,
      home_type: data.homeType ?? null,
      is_dac: data.isDac ?? false,
    })
    .select('id')
    .single()

  if (homeownerError || !homeowner) {
    return { success: false, error: homeownerError?.message ?? 'Failed to create homeowner.' }
  }

  // Create the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      contractor_id: contractorData.id,
      homeowner_id: homeowner.id,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      utility: data.utility,
      category: data.category,
      category_label: data.categoryLabel,
      home_type: data.homeType ?? null,
      is_dac: data.isDac ?? false,
      estimated_incentive: data.estimatedIncentive ?? null,
      status: 'draft',
    })
    .select('id')
    .single()

  if (projectError || !project) {
    return { success: false, error: projectError?.message ?? 'Failed to create project.' }
  }

  // Insert required document rows based on category
  const docChecklist = getDocumentChecklist(data.category as CategoryCode)
  if (docChecklist.length > 0) {
    const docRows = docChecklist.map((doc) => ({
      project_id: project.id,
      doc_type: doc.docType,
      doc_label: doc.label,
      required: doc.required,
      status: 'missing',
    }))

    const { error: docsError } = await supabase.from('project_documents').insert(docRows)
    if (docsError) {
      console.error('createProject docs error:', docsError)
      // Non-fatal
    }
  }

  return { success: true, projectId: project.id }
}
