"use client"

import type React from "react"

import { LoadingSpinner } from "./loading-spinner"
import { KpiSkeleton } from "./skeleton-loader"
import { AISuggestionCard } from "./ai-suggestion-card"
import { PdfIcon } from "./pdf-icon"

interface Document {
  id: string
  name: string
  type: string
  summary: string
  uploadedDate: string
  lastViewed?: string
  fileUrl: string
}

interface KpiData {
  totalDocuments: number
  recentlyViewed: number
  recentlyUploaded: number
}

interface KpiCardsProps {
  kpiData: KpiData | null
  isLoading: boolean
  onAISuggestion: (searchTerm: string, typeFilters: string[]) => void
  recentlyViewedDocuments?: Document[]
  recentlyUploadedDocuments?: Document[]
  onViewDocument: (document: Document) => void
}

interface KpiCardProps {
  title: string
  value: number
  isLoading?: boolean
}

function KpiCard({ title, value, isLoading = false }: KpiCardProps) {
  return (
    <div className="kpi-card" role="region" aria-labelledby={`kpi-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3 id={`kpi-${title.toLowerCase().replace(/\s+/g, "-")}`}>{title}</h3>
      <div
        className="kpi-value"
        aria-live="polite"
        aria-atomic="true"
        aria-label={isLoading ? `Loading ${title.toLowerCase()}` : `${value} ${title.toLowerCase()}`}
      >
        {isLoading ? <LoadingSpinner size={24} /> : value}
      </div>
    </div>
  )
}

interface RecentlyViewedCardProps {
  documents: Document[]
  isLoading?: boolean
  onViewDocument: (document: Document) => void
}

function RecentlyViewedCard({ documents, isLoading = false, onViewDocument }: RecentlyViewedCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent, document: Document) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onViewDocument(document)
    }
  }

  return (
    <div className="kpi-card recently-viewed-card" role="region" aria-labelledby="recently-viewed-title">
      <h3 id="recently-viewed-title">Recently Viewed</h3>
      {isLoading ? (
        <div className="kpi-value" aria-live="polite" aria-label="Loading recently viewed documents">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        <div className="recently-viewed-list" role="list" aria-label="Recently viewed documents">
          {documents.length === 0 ? (
            <div className="no-recent-documents" role="status" aria-live="polite">
              <span className="no-recent-text">No recent views</span>
            </div>
          ) : (
            documents.map((document, index) => (
              <div
                key={document.id}
                className="recent-document-item clickable"
                role="listitem"
                tabIndex={0}
                onClick={() => onViewDocument(document)}
                onKeyDown={(e) => handleKeyDown(e, document)}
                aria-label={`View document: ${document.name}`}
                aria-describedby={`recent-doc-${index}-desc`}
              >
                <PdfIcon size={12} className="recent-document-icon" aria-hidden="true" />
                <span className="recent-document-name" aria-hidden="true">
                  {document.name}
                </span>
                <span id={`recent-doc-${index}-desc`} className="sr-only">
                  PDF document, click to view
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface RecentlyUploadedCardProps {
  documents: Document[]
  isLoading?: boolean
  onViewDocument: (document: Document) => void
}

function RecentlyUploadedCard({ documents, isLoading = false, onViewDocument }: RecentlyUploadedCardProps) {
  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    if (diffDays <= 30) return `${Math.ceil((diffDays - 1) / 7)} weeks ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent, document: Document) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onViewDocument(document)
    }
  }

  return (
    <div className="kpi-card recently-uploaded-card" role="region" aria-labelledby="recently-uploaded-title">
      <h3 id="recently-uploaded-title">Recently Uploaded</h3>
      {isLoading ? (
        <div className="kpi-value" aria-live="polite" aria-label="Loading recently uploaded documents">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        <div className="recently-uploaded-list" role="list" aria-label="Recently uploaded documents">
          {documents.length === 0 ? (
            <div className="no-recent-documents" role="status" aria-live="polite">
              <span className="no-recent-text">No recent uploads</span>
            </div>
          ) : (
            documents.map((document, index) => (
              <div
                key={document.id}
                className="recent-document-item clickable"
                role="listitem"
                tabIndex={0}
                onClick={() => onViewDocument(document)}
                onKeyDown={(e) => handleKeyDown(e, document)}
                aria-label={`View document: ${document.name}, uploaded ${formatUploadDate(document.uploadedDate)}`}
                aria-describedby={`upload-doc-${index}-desc`}
              >
                <PdfIcon size={12} className="recent-document-icon" aria-hidden="true" />
                <div className="recent-document-content" aria-hidden="true">
                  <span className="recent-document-name">{document.name}</span>
                  <span className="recent-document-date">{formatUploadDate(document.uploadedDate)}</span>
                </div>
                <span id={`upload-doc-${index}-desc`} className="sr-only">
                  PDF document uploaded {formatUploadDate(document.uploadedDate)}, click to view
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function KpiCards({
  kpiData,
  isLoading,
  onAISuggestion,
  recentlyViewedDocuments = [],
  recentlyUploadedDocuments = [],
  onViewDocument,
}: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="kpi-skeleton-container" role="region" aria-label="Loading dashboard statistics">
        <KpiSkeleton />
        <div className="ai-suggestion-skeleton" aria-label="Loading AI suggestions">
          <div className="skeleton-item skeleton-ai-header"></div>
          <div className="skeleton-item skeleton-ai-title"></div>
          <div className="skeleton-item skeleton-ai-description"></div>
        </div>
      </div>
    )
  }

  if (!kpiData) {
    return null
  }

  return (
    <section className="kpi-section" role="region" aria-labelledby="dashboard-stats">
      <h2 id="dashboard-stats" className="sr-only">
        Dashboard Statistics
      </h2>
      <KpiCard title="Total Documents" value={kpiData.totalDocuments} />
      <RecentlyViewedCard documents={recentlyViewedDocuments} isLoading={isLoading} onViewDocument={onViewDocument} />
      <RecentlyUploadedCard
        documents={recentlyUploadedDocuments}
        isLoading={isLoading}
        onViewDocument={onViewDocument}
      />
      <AISuggestionCard onApplySuggestion={onAISuggestion} isLoading={isLoading} />
    </section>
  )
}
