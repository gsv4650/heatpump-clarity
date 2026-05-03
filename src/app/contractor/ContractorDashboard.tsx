'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORY_LABELS, type CategoryCode } from '@/lib/calculator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SAMPLE_PROJECTS, getDocumentReadiness } from '@/lib/data'
import { createProject } from '@/app/actions/projects'
import type { Project } from '@/lib/data'

type FilterTab = 'all' | 'active' | 'needs_docs' | 'completed'

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  complete: 'bg-green-100 text-green-700',
  denied: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  in_progress: 'In Progress',
  complete: 'Complete',
  denied: 'Denied',
}

interface Props {
  projects: Project[]
  mockMode: boolean
  contractorName?: string
}

interface NewProjectForm {
  address: string
  city: string
  state: string
  zip: string
  utility: string
  category: string
  categoryLabel: string
  customerName: string
  customerEmail: string
  customerPhone: string
}

const EMPTY_FORM: NewProjectForm = {
  address: '',
  city: '',
  state: 'NY',
  zip: '',
  utility: '',
  category: '',
  categoryLabel: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
}

const UTILITY_OPTIONS = [
  { value: 'con_edison', label: 'Con Edison' },
  { value: 'national_grid', label: 'National Grid' },
  { value: 'central_hudson', label: 'Central Hudson' },
  { value: 'nyseg', label: 'NYSEG' },
  { value: 'rge', label: 'RG&E' },
  { value: 'orange_rockland', label: 'Orange & Rockland' },
]

const CATEGORY_OPTIONS = (Object.entries(CATEGORY_LABELS) as [CategoryCode, string][]).map(
  ([value, label]) => ({ value, label })
)

export default function ContractorDashboard({ projects: initialProjects, mockMode, contractorName }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(!mockMode)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [showNewProject, setShowNewProject] = useState(false)
  const [form, setForm] = useState<NewProjectForm>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  const displayProjects = mockMode && isLoggedIn ? SAMPLE_PROJECTS : projects

  const filteredProjects = displayProjects.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'active') return ['draft', 'submitted', 'in_progress'].includes(p.status)
    if (filter === 'needs_docs') return p.documents.some((d) => d.required && d.status === 'missing')
    if (filter === 'completed') return p.status === 'complete'
    return true
  })

  const activeCount = displayProjects.filter((p) =>
    ['draft', 'submitted', 'in_progress'].includes(p.status)
  ).length
  const completedCount = displayProjects.filter((p) => p.status === 'complete').length
  const needsDocsCount = displayProjects.filter((p) =>
    p.documents.some((d) => d.required && d.status === 'missing')
  ).length

  async function handleNewProject(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.category || !form.utility || !form.address || !form.customerName || !form.customerEmail) {
      setFormError('Please fill in all required fields.')
      return
    }

    const selectedCategory = CATEGORY_OPTIONS.find((c) => c.value === form.category)
    setFormLoading(true)

    const result = await createProject({
      ...form,
      categoryLabel: selectedCategory?.label ?? form.category,
    })

    setFormLoading(false)

    if (!result.success) {
      setFormError(result.error ?? 'Failed to create project.')
      return
    }

    setShowNewProject(false)
    setForm(EMPTY_FORM)

    if (mockMode) {
      // In mock mode just show a success alert briefly
      alert('Project created (mock mode — not persisted to DB)')
    } else {
      // Reload page to get fresh data
      window.location.reload()
    }
  }

  // Mock mode login gate
  if (mockMode && !isLoggedIn) {
    return (
      <div className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Contractor Login</h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to manage your NYS Clean Heat projects.
          </p>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                onClick={() => setIsLoggedIn(true)}
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

  const displayName = contractorName ?? 'Green Energy Solutions'

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {displayName}</h1>
            <p className="text-gray-600">Manage your NYS Clean Heat projects</p>
          </div>
          <Button
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
            onClick={() => setShowNewProject(true)}
          >
            + New Project
          </Button>
        </div>

        {/* New Project Modal */}
        {showNewProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">New Project</h2>
                  <button
                    onClick={() => { setShowNewProject(false); setFormError(null) }}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleNewProject} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="np-address">Address *</Label>
                      <Input id="np-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="np-city">City *</Label>
                      <Input id="np-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="np-zip">ZIP *</Label>
                      <Input id="np-zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="mt-1" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="np-utility">Utility *</Label>
                    <select
                      id="np-utility"
                      value={form.utility}
                      onChange={(e) => setForm({ ...form, utility: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                      required
                    >
                      <option value="">Select utility…</option>
                      {UTILITY_OPTIONS.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="np-category">Category *</Label>
                    <select
                      id="np-category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                      required
                    >
                      <option value="">Select category…</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="np-customerName">Customer Name *</Label>
                    <Input id="np-customerName" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="np-customerEmail">Customer Email *</Label>
                    <Input id="np-customerEmail" type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="np-customerPhone">Customer Phone</Label>
                    <Input id="np-customerPhone" type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="mt-1" />
                  </div>

                  {formError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800 text-sm">{formError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white" disabled={formLoading}>
                      {formLoading ? 'Creating…' : 'Create Project'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowNewProject(false); setFormError(null) }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-[#16a34a]">{completedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">Pending Documents</p>
              <p className="text-3xl font-bold text-amber-600">{needsDocsCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'needs_docs', label: 'Needs Docs' },
              { key: 'completed', label: 'Completed' },
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(tab.key)}
              className={
                filter === tab.key
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                  : 'border-gray-300'
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const readiness = getDocumentReadiness(project)
            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {project.customerName}
                          </p>
                          <Badge className={`text-xs ${STATUS_COLORS[project.status]}`}>
                            {STATUS_LABELS[project.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {project.address}, {project.city}, {project.state} {project.zip}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {project.categoryLabel} · {project.utilityLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 sm:w-48">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Docs</span>
                            <span>{readiness}%</span>
                          </div>
                          <Progress value={readiness} className="h-2" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 sm:w-24 text-right">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
          {filteredProjects.length === 0 && (
            <p className="text-center text-gray-500 py-8">No projects match this filter.</p>
          )}
        </div>
      </div>
    </div>
  )
}
