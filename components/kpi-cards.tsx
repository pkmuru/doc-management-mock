"use client"

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
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="kpi-value">{isLoading ? <LoadingSpinner size={24} /> : value}</div>
    </div>
  )
}

interface RecentlyViewedCardProps {
  documents: Document[]
  isLoading?: boolean
  onViewDocument: (document: Document) => void
}

function RecentlyViewedCard({ documents, isLoading = false, onViewDocument }: RecentlyViewedCardProps) {
  return (
    <div className="kpi-card recently-viewed-card">
      <h3>Recently Viewed</h3>
      {isLoading ? (
        <div className="kpi-value">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        <div className="recently-viewed-list">
          {documents.length === 0 ? (
            <div className="no-recent-documents">
              <span className="no-recent-text">No recent views</span>
            </div>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="recent-document-item clickable"
                onClick={() => onViewDocument(document)}
                title={`Click to view: ${document.name}`}
              >
                <PdfIcon size={12} className="recent-document-icon" />
                <span className="recent-document-name">{document.name}</span>
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

  return (
    <div className="kpi-card recently-uploaded-card">
      <h3>Recently Uploaded</h3>
      {isLoading ? (
        <div className="kpi-value">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        <div className="recently-uploaded-list">
          {documents.length === 0 ? (
            <div className="no-recent-documents">
              <span className="no-recent-text">No recent uploads</span>
            </div>
          ) : (
            documents.map((document) => (
              <div
                key={document.id}
                className="recent-document-item clickable"
                onClick={() => onViewDocument(document)}
                title={`Click to view: ${document.name} (uploaded ${formatUploadDate(document.uploadedDate)})`}
              >
                <PdfIcon size={12} className="recent-document-icon" />
                <div className="recent-document-content">
                  <span className="recent-document-name">{document.name}</span>
                  <span className="recent-document-date">{formatUploadDate(document.uploadedDate)}</span>
                </div>
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
      <div className="kpi-skeleton-container">
        <KpiSkeleton />
        <div className="ai-suggestion-skeleton">
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
    <section className="kpi-section">
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
