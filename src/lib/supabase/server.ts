import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
            // Middleware handles session refresh
          }
        },
      },
    }
  )
}

// Service-role client — server only, never expose to browser.
//
// IMPORTANT: uses createClient from @supabase/supabase-js directly, NOT
// createServerClient from @supabase/ssr. The @supabase/ssr version attaches
// the user's session cookies alongside the service role key, which causes
// Postgres to use the user's JWT identity for RLS instead of service_role,
// producing 42501 errors. The plain createClient has no cookie machinery and
// presents only the service role key, correctly bypassing RLS.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
