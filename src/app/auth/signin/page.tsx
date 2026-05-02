'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient, hasSupabase } from '@/lib/supabase/client'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const redirectTo = searchParams.get('redirectTo') || '/'
  const callbackError = searchParams.get('error')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasSupabase) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-gray-600">Sign in to your HeatPumpClarity account.</p>
        </div>

        {!hasSupabase && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Mock mode active.</strong> Supabase is not configured. Auth is disabled.
              The app works with sample data. Add Supabase credentials to .env.local to enable real auth.
            </AlertDescription>
          </Alert>
        )}

        {callbackError === 'auth_callback_failed' && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800 text-sm">
              Authentication failed. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                  disabled={!hasSupabase}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/reset"
                    className="text-xs text-[#2563eb] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                  disabled={!hasSupabase}
                />
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                disabled={loading || !hasSupabase}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[#2563eb] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
      <SignInForm />
    </Suspense>
  )
}
