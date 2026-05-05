'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient, hasSupabase } from '@/lib/supabase/client'
import { createUserProfile } from '@/app/actions/auth'

type Role = 'homeowner' | 'contractor'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<Role>('homeowner')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasSupabase) return
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await createUserProfile(data.user.id, fullName, email, role)
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#f8fafc]">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600 mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/auth/signin" className="text-[#2563eb] hover:underline font-medium">
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-600">Join HeatPumpClarity to track your project.</p>
        </div>

        {!hasSupabase && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Mock mode active.</strong> Supabase is not configured. Sign-up is disabled.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <Label className="mb-2 block">I am a…</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['homeowner', 'contractor'] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      disabled={!hasSupabase}
                      className={`rounded-lg border-2 p-3 text-sm font-medium transition-colors text-center ${
                        role === r
                          ? 'border-[#2563eb] bg-blue-50 text-[#2563eb]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {r === 'homeowner' ? '🏠 Homeowner' : '🔧 Contractor'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                  required
                  disabled={!hasSupabase}
                  data-ph-no-capture
                />
              </div>

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
                  data-ph-no-capture
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  required
                  disabled={!hasSupabase}
                  data-ph-no-capture
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  required
                  disabled={!hasSupabase}
                  data-ph-no-capture
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
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-[#2563eb] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
