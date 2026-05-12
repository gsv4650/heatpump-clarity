'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  calculateEstimate,
  formatCurrency,
  getDocumentChecklist,
  type EligibilityInput,
  type HomeType,
  type Utility,
  type ProjectType,
  type EquipmentType,
} from '@/lib/calculator'
import { submitLead } from '@/app/actions/leads'

function EstimateContent() {
  const searchParams = useSearchParams()
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)

  const input: EligibilityInput = {
    homeType:              (searchParams.get('homeType') as HomeType)        || 'single_family',
    utility:               (searchParams.get('utility') as Utility)          || 'con_edison',
    projectType:           (searchParams.get('projectType') as ProjectType)  || 'retrofit',
    equipmentType:         (searchParams.get('equipmentType') as EquipmentType) || 'ashp_ducted',
    willDecommission:      searchParams.get('willDecommission') === 'true',
    hasIntegratedControls: searchParams.get('hasIntegratedControls') === 'true',
    coversAllUnits:        searchParams.get('coversAllUnits') === 'true',
    isDac:                 searchParams.get('isDac') === 'true',
    sqft:                  searchParams.get('sqft') ? Number(searchParams.get('sqft')) : undefined,
  }

  const estimate = calculateEstimate(input)

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!leadEmail) {
      setLeadError('Email is required.')
      return
    }
    setLeadSubmitting(true)
    setLeadError(null)

    const fd = new FormData()
    fd.set('name', leadName)
    fd.set('email', leadEmail)
    fd.set('phone', leadPhone)
    fd.set('utility', input.utility)
    fd.set('interest', estimate?.category ?? '')
    fd.set('source', 'estimate_page')

    const result = await submitLead(fd)
    setLeadSubmitting(false)

    if (!result.success) {
      setLeadError(result.error ?? 'Something went wrong. Please try again.')
      return
    }

    setLeadSuccess(true)
  }

  if (!estimate) {
    return (
      <div className="py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Eligible Under Current Program</h1>
        <p className="text-gray-600 mb-6">
          Based on your answers, this project combination may not be eligible under the NYS Clean
          Heat program. Contact your utility directly to confirm, or start over to check a different
          scenario.
        </p>
        <Link
          href="/eligibility"
          className="inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors"
        >
          Start Over
        </Link>
      </div>
    )
  }

  const docs = getDocumentChecklist(estimate.category)

  const steps = [
    'Find a participating contractor',
    'Get a proposal and project scope',
    'Contractor submits application to NYSERDA',
    'Installation',
    'Post-installation verification',
    'Incentive paid to contractor (passed to you as a discount)',
  ]

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Incentive Estimate</h1>
        <p className="text-gray-600 mb-6">
          Based on your answers, here&apos;s what you may qualify for under the NYS Clean Heat
          program.
        </p>

        {/* Main Estimate Card */}
        <Card className="border-[#2563eb] border-2 mb-6">
          <CardHeader className="bg-blue-50 rounded-t-lg">
            <CardTitle className="text-xl text-gray-900">Estimated Incentive</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Your Utility</p>
                <p className="font-semibold text-gray-900">{estimate.utilityLabel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Category</p>
                <p className="font-semibold text-gray-900">{estimate.categoryLabel}</p>
                <Badge variant="secondary" className="mt-1 text-xs bg-gray-100 text-gray-600">
                  {estimate.categoryShort}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Incentive</p>
              <p className="text-3xl font-bold text-[#16a34a]">
                {formatCurrency(estimate.estimatedIncentiveMin)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Flat dollar amount per project
                {estimate.isDac && estimate.dacBonus > 0 && (
                  <> | DAC rate: {formatCurrency(estimate.dacRate)}</>
                )}
              </p>
              {estimate.retailOnly && (
                <p className="text-sm text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded p-2">
                  This incentive is available through the midstream retail channel. Ask your
                  retailer or distributor about claiming it at point of sale.
                </p>
              )}
            </div>

            {estimate.isDac && estimate.dacBonus > 0 && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <p className="text-sm font-medium text-green-800">
                  DAC Bonus Included: +{formatCurrency(estimate.dacBonus)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  You&apos;re in a Disadvantaged Community, which qualifies you for enhanced
                  incentive rates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weatherized Tier notice — space heating categories only, before 2026-09-01 */}
        {/* TODO: After 2026-09-01, replace this notice with actual Weatherized Tier rate
            calculation. NYSERDA expected to publish rates before launch; check Program
            Manual for updates. */}
        {(['cat_2', 'cat_2a', 'cat_2b', 'cat_3', 'cat_4'] as const).includes(
          estimate.category as 'cat_2' | 'cat_2a' | 'cat_2b' | 'cat_3' | 'cat_4'
        ) && new Date() < new Date('2026-09-01') && (
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <AlertDescription className="text-blue-800 text-sm">
              <span className="font-semibold">ℹ️ Heads up:</span> Starting September 1, 2026,
              NYS Clean Heat will offer differentiated rates for projects that meet a minimum
              weatherization standard (Weatherized Tier). The estimate above reflects current
              rates and does not yet include Weatherized Tier amounts, which NYSERDA has not
              published. If your installation will occur on or after September 1, 2026, your
              final incentive may differ.{' '}
              <span className="text-blue-700">
                Source: NYS Clean Heat Program Manual, Section 2.1.5.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* How to Claim */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Claim Your Incentive</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#2563eb] text-white text-sm flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              Your contractor will need these documents to submit your application:
            </p>
            <ul className="space-y-2">
              {docs.map((doc) => (
                <li key={doc.docType} className="flex items-center gap-2">
                  <span className="text-gray-400">{doc.required ? '☐' : '○'}</span>
                  <span className="text-gray-700">{doc.label}</span>
                  {!doc.required && (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex-1"
            onClick={() => window.print()}
          >
            Print / Save This Estimate
          </Button>
          <Link
            href="/eligibility"
            className="flex-1 inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 transition-colors"
          >
            Start Over
          </Link>
        </div>

        {/* Lead Capture */}
        <Card className="mb-6 border-[#16a34a]">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-lg text-gray-900">
              Want a contractor to contact you?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {leadSuccess ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-semibold text-gray-900 mb-1">
                  You&apos;re on the list!
                </p>
                <p className="text-sm text-gray-600">
                  A participating contractor in your area will reach out soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">
                  Leave your contact info and we&apos;ll connect you with a certified NYS Clean
                  Heat contractor near you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="lead-name">Name (optional)</Label>
                    <Input
                      id="lead-name"
                      type="text"
                      placeholder="Jane Smith"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="mt-1"
                      data-ph-no-capture
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead-phone">Phone (optional)</Label>
                    <Input
                      id="lead-phone"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="mt-1"
                      data-ph-no-capture
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lead-email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lead-email"
                    type="email"
                    placeholder="you@example.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="mt-1"
                    required
                    data-ph-no-capture
                  />
                </div>

                {leadError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800 text-sm">{leadError}</AlertDescription>
                  </Alert>
                )}

                <p className="text-xs text-gray-500">
                  By submitting, you agree to be contacted by a participating
                  NYS Clean Heat contractor about your project. We will not
                  sell your information. See our{' '}
                  <a href="/privacy" className="underline hover:text-gray-700">
                    Privacy Policy
                  </a>
                  .
                </p>

                <Button
                  type="submit"
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white"
                  disabled={leadSubmitting}
                >
                  {leadSubmitting ? 'Submitting…' : 'Connect Me With a Contractor'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800 text-sm">
            <strong>Disclaimer:</strong> Incentive amounts shown are estimates based on current
            program data. Final eligibility and amounts depend on current program rules, equipment
            specifications, and utility requirements. Incentive rates are subject to change. Always
            confirm with your contractor and NYSERDA before making purchasing decisions.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default function EstimatePage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 px-4 text-center text-gray-500">Loading your estimate...</div>
      }
    >
      <EstimateContent />
    </Suspense>
  )
}
