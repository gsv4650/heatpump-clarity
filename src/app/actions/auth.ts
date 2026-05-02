'use server'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function createUserProfile(
  userId: string,
  fullName: string,
  email: string,
  role: 'homeowner' | 'contractor'
): Promise<{ success: boolean; error?: string }> {
  if (!hasSupabase) {
    console.log('[mock] createUserProfile', { userId, fullName, email, role })
    return { success: true }
  }

  const { createServiceClient } = await import('@/lib/supabase/server')
  const supabase = await createServiceClient()

  const { error: userError } = await supabase
    .from('users')
    .insert({ id: userId, full_name: fullName, email, role })

  if (userError) {
    console.error('createUserProfile error:', userError)
    return { success: false, error: userError.message }
  }

  if (role === 'contractor') {
    const { error: contractorError } = await supabase
      .from('contractors')
      .insert({ id: userId, company_name: fullName })

    if (contractorError) {
      console.error('createContractor error:', contractorError)
      // Non-fatal — user profile was created
    }
  }

  return { success: true }
}

export async function getUserRole(
  userId: string
): Promise<'homeowner' | 'contractor' | 'admin' | null> {
  if (!hasSupabase) {
    return null
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data.role as 'homeowner' | 'contractor' | 'admin'
}
