'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient, hasSupabase } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.push('/auth/signin')
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#f8fafc]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
          <p className="text-gray-600">Choose a new password for your account.</p>
        </div>

        {!hasSupabase && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertDescription className="text-amber-800 text-sm">
              <strong>Mock mode active.</strong> Supabase is not configured.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                {loading ? 'Updating…' : 'Update Password'}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600">
              <Link href="/auth/signin" className="text-[#2563eb] hover:underline font-medium">
                Back to Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
