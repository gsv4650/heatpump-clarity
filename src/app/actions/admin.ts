'use server'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function getAdminSupabase() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { supabase: null, error: 'Not authenticated.' }
  }

  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (roleError || !userData || userData.role !== 'admin') {
    return { supabase: null, error: 'Forbidden: admin role required.' }
  }

  return { supabase, error: null }
}

export async function updateIncentiveRate(
  id: string,
  baseIncentive: number,
  dacIncentive: number
): Promise<{ success: boolean; error?: string }> {
  if (!hasSupabase) {
    console.log('[mock] updateIncentiveRate', { id, baseIncentive, dacIncentive })
    return { success: true }
  }

  const { supabase, error: authError } = await getAdminSupabase()
  if (!supabase) {
    return { success: false, error: authError ?? 'Forbidden.' }
  }

  const { error } = await supabase
    .from('utility_rules')
    .update({ base_incentive: baseIncentive, dac_incentive: dacIncentive })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function toggleUpdate(
  id: string,
  published: boolean
): Promise<{ success: boolean; error?: string }> {
  if (!hasSupabase) {
    console.log('[mock] toggleUpdate', { id, published })
    return { success: true }
  }

  const { supabase, error: authError } = await getAdminSupabase()
  if (!supabase) {
    return { success: false, error: authError ?? 'Forbidden.' }
  }

  const { error } = await supabase
    .from('manual_updates')
    .update({ published })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
