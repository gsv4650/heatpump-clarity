'use server'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function submitLead(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const name = (formData.get('name') as string | null) ?? ''
  const email = (formData.get('email') as string | null) ?? ''
  const phone = (formData.get('phone') as string | null) ?? ''
  const utility = (formData.get('utility') as string | null) ?? ''
  const interest = (formData.get('interest') as string | null) ?? ''
  const source = (formData.get('source') as string | null) ?? 'estimate_page'
  const notes = (formData.get('notes') as string | null) ?? ''

  if (!email) {
    return { success: false, error: 'Email is required.' }
  }

  if (!hasSupabase) {
    console.log('[mock] submitLead', { name, email, phone, utility, interest, source, notes })
    return { success: true }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { error } = await supabase.from('leads').insert({
    name: name || null,
    email,
    phone: phone || null,
    utility: utility || null,
    interest: interest || null,
    source,
    notes: notes || null,
  })

  if (error) {
    console.error('submitLead error:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
