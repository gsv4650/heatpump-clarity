'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  INCENTIVE_RATES,
  UTILITY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_SHORT,
  formatCurrency,
  type Utility,
  type CategoryCode,
} from '@/lib/calculator'
import { updateIncentiveRate, toggleUpdate } from '@/app/actions/admin'
import type { ManualUpdate, Lead } from '@/lib/data'

interface Props {
  manualUpdates: ManualUpdate[]
  leads: Lead[]
  mockMode: boolean
}

interface EditingRate {
  utility: string
  category: string
  baseIncentive: string
  dacIncentive: string
}

export default function AdminPanel({ manualUpdates: initialUpdates, leads, mockMode }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(!mockMode)
  const [password, setPassword] = useState('')
  const [editingRate, setEditingRate] = useState<EditingRate | null>(null)
  const [savingRate, setSavingRate] = useState(false)
  const [rateError, setRateError] = useState<string | null>(null)
  const [manualUpdates, setManualUpdates] = useState<ManualUpdate[]>(initialUpdates)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const displayUtilities: Utility[] = [
    'con_edison',
    'national_grid',
    'central_hudson',
    'nyseg',
    'rge',
    'orange_rockland',
  ]

  if (!isAuthenticated) {
    return (
      <div className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Admin Access</h1>
          <p className="text-gray-600 text-center mb-8">This area is restricted to administrators.</p>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  data-ph-no-capture
                />
              </div>
              <Button
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                onClick={() => setIsAuthenticated(true)}
              >
                Sign In
              </Button>
              <p className="text-xs text-center text-gray-500">
                Demo mode — click Sign In with any credentials
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  async function handleSaveRate() {
    if (!editingRate) return
    setSavingRate(true)
    setRateError(null)

    // In mock mode or live mode, call the server action
    // For mock mode, the action just console.logs
    const result = await updateIncentiveRate(
      `${editingRate.utility}-${editingRate.category}`,
      Number(editingRate.baseIncentive),
      Number(editingRate.dacIncentive)
    )

    setSavingRate(false)
    if (!result.success) {
      setRateError(result.error ?? 'Failed to save.')
      return
    }
    setEditingRate(null)
  }

  async function handleToggleUpdate(id: string, currentPublished: boolean) {
    setTogglingId(id)
    const newPublished = !currentPublished
    const result = await toggleUpdate(id, newPublished)

    if (result.success) {
      setManualUpdates((prev) =>
        prev.map((u) => (u.id === id ? { ...u, published: newPublished } : u))
      )
    }
    setTogglingId(null)
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        <Tabs defaultValue="rates" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="rates">Incentive Rates</TabsTrigger>
            <TabsTrigger value="rules">Rules &amp; Text</TabsTrigger>
            <TabsTrigger value="updates">Manual Updates</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          {/* Incentive Rates Tab */}
          <TabsContent value="rates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incentive Rates by Utility &times; Category</CardTitle>
                  <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                    Publish Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {rateError && (
                  <p className="text-red-600 text-sm mb-3">{rateError}</p>
                )}
                {editingRate && (
                  <div className="mb-4 p-4 rounded-lg border border-[#2563eb] bg-blue-50 space-y-3">
                    <p className="text-sm font-medium text-gray-900">
                      Editing: {UTILITY_LABELS[editingRate.utility as Utility]} — {editingRate.category}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Base Incentive ($)</Label>
                        <Input
                          type="number"
                          value={editingRate.baseIncentive}
                          onChange={(e) => setEditingRate({ ...editingRate, baseIncentive: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>DAC Incentive ($)</Label>
                        <Input
                          type="number"
                          value={editingRate.dacIncentive}
                          onChange={(e) => setEditingRate({ ...editingRate, dacIncentive: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                        onClick={handleSaveRate}
                        disabled={savingRate}
                      >
                        {savingRate ? 'Saving…' : 'Save'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingRate(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Utility</TableHead>
                        <TableHead className="min-w-[200px]">Category</TableHead>
                        <TableHead>Base Rate</TableHead>
                        <TableHead>DAC Rate</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayUtilities.flatMap((utility) =>
                        INCENTIVE_RATES.filter((r) => r.utility === utility).map((rate) => (
                          <TableRow key={`${rate.utility}-${rate.category}`}>
                            <TableCell className="font-medium text-sm">
                              {UTILITY_LABELS[rate.utility]}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">
                                  {CATEGORY_SHORT[rate.category as CategoryCode]}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[250px]">
                                  {CATEGORY_LABELS[rate.category as CategoryCode]}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-[#16a34a]">
                              {formatCurrency(rate.baseIncentive)}
                            </TableCell>
                            <TableCell className="font-medium text-[#16a34a]">
                              {formatCurrency(rate.dacIncentive)}
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              flat
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() =>
                                  setEditingRate({
                                    utility: rate.utility,
                                    category: rate.category,
                                    baseIncentive: String(rate.baseIncentive),
                                    dacIncentive: String(rate.dacIncentive),
                                  })
                                }
                              >
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules & Text Tab */}
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Rules &amp; Display Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Edit rule descriptions, eligibility text, and helper text displayed throughout the site.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      key: 'disclaimer_text',
                      label: 'Disclaimer Text',
                      value:
                        'Incentive amounts shown are estimates. Final eligibility and amounts depend on current program rules and utility requirements.',
                    },
                    {
                      key: 'dac_explanation',
                      label: 'DAC Explanation',
                      value:
                        'Check if your address is in a NYS Disadvantaged Community. This may qualify you for enhanced incentives.',
                    },
                    {
                      key: 'full_displacement_helper',
                      label: 'Full Displacement Helper Text',
                      value:
                        'Completely replacing your current heating system (e.g., removing your furnace or boiler entirely)',
                    },
                    {
                      key: 'partial_displacement_helper',
                      label: 'Partial Displacement Helper Text',
                      value:
                        'Adding a heat pump alongside your existing heating system (keeping your furnace as backup)',
                    },
                    {
                      key: 'equipment_helper',
                      label: 'Equipment Selection Helper',
                      value: 'Not sure? Most homes use ducted or ductless air source heat pumps.',
                    },
                  ].map((rule) => (
                    <div key={rule.key} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium text-gray-900">{rule.label}</Label>
                        <Badge variant="outline" className="text-xs font-mono">
                          {rule.key}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{rule.value}</p>
                      <Button variant="outline" size="sm" className="mt-2 text-xs">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Updates Tab */}
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manual Updates</CardTitle>
                  <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white">
                    + New Update
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {manualUpdates.map((update) => (
                    <div key={update.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 text-sm">{update.title}</h3>
                            <Badge
                              className={`text-xs ${
                                update.published
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {update.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{update.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            disabled={togglingId === update.id}
                            onClick={() => handleToggleUpdate(update.id, update.published)}
                          >
                            {togglingId === update.id
                              ? '…'
                              : update.published
                              ? 'Unpublish'
                              : 'Publish'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Check Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Utility</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name || '—'}</TableCell>
                          <TableCell className="text-sm">{lead.email}</TableCell>
                          <TableCell className="text-sm">
                            {lead.utility.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {lead.interest}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {lead.source.replace(/_/g, ' ')}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
