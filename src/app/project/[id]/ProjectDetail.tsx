'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { getDocumentReadiness } from '@/lib/data'
import { formatCurrency } from '@/lib/calculator'
import { uploadDocument } from '@/app/actions/documents'
import type { Project, ProjectDocument } from '@/lib/data'

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

const DOC_STATUS_ICON: Record<string, string> = {
  missing: '⬜',
  uploaded: '🔄',
  approved: '✅',
  rejected: '❌',
}

const DOC_STATUS_LABEL: Record<string, string> = {
  missing: 'Missing',
  uploaded: 'Uploaded',
  approved: 'Approved',
  rejected: 'Rejected',
}

interface Props {
  project: Project
}

export default function ProjectDetail({ project: initialProject }: Props) {
  const [project, setProject] = useState<Project>(initialProject)
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const readiness = getDocumentReadiness(project)
  const missingDocs = project.documents.filter((d) => d.required && d.status === 'missing')
  const rejectedDocs = project.documents.filter((d) => d.status === 'rejected')

  const activityLog = [
    { date: project.createdAt, text: 'Project created' },
    ...project.documents
      .filter((d) => d.uploadedAt)
      .map((d) => ({ date: d.uploadedAt!, text: `${d.docLabel} uploaded` })),
    { date: project.updatedAt, text: `Status changed to ${STATUS_LABELS[project.status]}` },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  async function handleFileSelect(doc: ProjectDocument, file: File) {
    setUploading(doc.docType)
    setUploadError(null)

    const result = await uploadDocument(project.id, doc.docType, file)

    setUploading(null)

    if (!result.success) {
      setUploadError(`Failed to upload ${doc.docLabel}: ${result.error}`)
      return
    }

    // Optimistically update the document status
    setProject((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.docType === doc.docType
          ? {
              ...d,
              status: 'uploaded' as const,
              fileName: file.name,
              fileUrl: result.fileUrl ?? null,
              uploadedAt: new Date().toISOString(),
            }
          : d
      ),
    }))
  }

  function triggerUpload(docType: string) {
    fileInputRefs.current[docType]?.click()
  }

  return (
    <div className="py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/contractor"
          className="text-sm text-[#2563eb] hover:underline mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.customerName}</h1>
            <p className="text-gray-600">
              {project.address}, {project.city}, {project.state} {project.zip}
            </p>
          </div>
          <Badge className={`text-sm px-3 py-1 ${STATUS_COLORS[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </Badge>
        </div>

        {/* Warnings */}
        {project.status === 'denied' && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">
              <strong>Project Denied:</strong> {project.notes}
            </AlertDescription>
          </Alert>
        )}
        {missingDocs.length > 0 && project.status !== 'complete' && (
          <Alert className="bg-amber-50 border-amber-200 mb-6">
            <AlertDescription className="text-amber-800">
              <strong>
                Missing {missingDocs.length} required document
                {missingDocs.length !== 1 ? 's' : ''}:
              </strong>{' '}
              {missingDocs.map((d) => d.docLabel).join(', ')}
            </AlertDescription>
          </Alert>
        )}
        {rejectedDocs.length > 0 && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">
              <strong>
                {rejectedDocs.length} document{rejectedDocs.length !== 1 ? 's' : ''} rejected:
              </strong>{' '}
              {rejectedDocs.map((d) => `${d.docLabel} — ${d.notes}`).join('; ')}
            </AlertDescription>
          </Alert>
        )}
        {uploadError && (
          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertDescription className="text-red-800">{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{project.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{project.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{project.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Home Type</p>
                    <p className="font-medium capitalize">
                      {project.homeType.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{project.categoryLabel}</p>
                    <p className="text-xs text-gray-400">{project.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Utility</p>
                    <p className="font-medium">{project.utilityLabel}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Incentive</p>
                    <p className="font-medium text-[#16a34a]">
                      {formatCurrency(project.estimatedIncentive)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">DAC Eligible</p>
                    <p className="font-medium">{project.isDac ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Checklist */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Document Checklist</CardTitle>
                  <span className="text-sm text-gray-500">{readiness}% complete</span>
                </div>
                <Progress value={readiness} className="h-2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                    >
                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[doc.docType] = el }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileSelect(doc, file)
                          e.target.value = ''
                        }}
                      />

                      <div className="flex items-center gap-3">
                        <span className="text-lg">{DOC_STATUS_ICON[doc.status]}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.docLabel}</p>
                          {doc.fileName && (
                            <p className="text-xs text-gray-500">{doc.fileName}</p>
                          )}
                          {doc.notes && (
                            <p className="text-xs text-red-600 mt-0.5">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            doc.status === 'approved'
                              ? 'border-green-300 text-green-700'
                              : doc.status === 'rejected'
                              ? 'border-red-300 text-red-700'
                              : doc.status === 'uploaded'
                              ? 'border-blue-300 text-blue-700'
                              : 'border-gray-300 text-gray-500'
                          }`}
                        >
                          {DOC_STATUS_LABEL[doc.status]}
                        </Badge>
                        {(doc.status === 'missing' || doc.status === 'rejected') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`text-xs ${
                              doc.status === 'rejected'
                                ? 'border-red-300 text-red-700'
                                : ''
                            }`}
                            onClick={() => triggerUpload(doc.docType)}
                            disabled={uploading === doc.docType}
                          >
                            {uploading === doc.docType
                              ? 'Uploading…'
                              : doc.status === 'rejected'
                              ? 'Re-upload'
                              : 'Upload'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Action */}
            {missingDocs.length > 0 &&
              project.status !== 'complete' &&
              project.status !== 'denied' && (
                <Card className="border-[#2563eb]">
                  <CardContent className="pt-6">
                    <p className="font-semibold text-gray-900 mb-2">Next Step</p>
                    <p className="text-sm text-gray-600">
                      Upload remaining {missingDocs.length} document
                      {missingDocs.length !== 1 ? 's' : ''} to submit your application.
                    </p>
                  </CardContent>
                </Card>
              )}

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLog.slice(0, 8).map((entry, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-gray-300 mt-1.5" />
                        {i < activityLog.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className="text-gray-900">{entry.text}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
