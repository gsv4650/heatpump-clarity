'use server'

const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function uploadDocument(
  projectId: string,
  docType: string,
  file: File
): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  if (!hasSupabase) {
    console.log('[mock] uploadDocument', { projectId, docType, fileName: file.name })
    return { success: true, fileUrl: `/mock-uploads/${projectId}/${docType}` }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { success: false, error: 'Not authenticated.' }
  }

  // Upload file to storage
  const ext = file.name.split('.').pop() ?? 'bin'
  const storagePath = `${projectId}/${docType}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('project-documents')
    .upload(storagePath, file, { upsert: true })

  if (uploadError) {
    return { success: false, error: uploadError.message }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('project-documents')
    .getPublicUrl(storagePath)

  const fileUrl = urlData.publicUrl

  // Update the project_documents row
  const { error: updateError } = await supabase
    .from('project_documents')
    .update({
      file_url: fileUrl,
      file_name: file.name,
      status: 'uploaded',
      uploaded_at: new Date().toISOString(),
    })
    .eq('project_id', projectId)
    .eq('doc_type', docType)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true, fileUrl }
}
