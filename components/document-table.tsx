"use client"

import { DocumentRow } from "./document-row"
import { SkeletonLoader } from "./skeleton-loader"
import { SearchIcon } from "./icons"

interface Document {
  id: string
  name: string
  type: string
  summary: string
  uploadedDate: string
  lastViewed?: string
  fileUrl: string
}

interface DocumentTableProps {
  documents: Document[]
  sortField: keyof Document | null
  sortDirection: "asc" | "desc"
  onSort: (field: keyof Document) => void
  onViewDocument: (document: Document) => void
  onDownload: (document: Document) => void
  formatDate: (dateString: string) => string
  isLoading: boolean
}

export function DocumentTable({
  documents,
  sortField,
  sortDirection,
  onSort,
  onViewDocument,
  onDownload,
  formatDate,
  isLoading,
}: DocumentTableProps) {
  const renderSortIndicator = (field: keyof Document) => {
    if (sortField === field) {
      return <span className="sort-indicator">{sortDirection === "asc" ? " ↑" : " ↓"}</span>
    }
    return null
  }

  return (
    <section className="table-section">
      <div className="table-header">
        <h3>Documents</h3>
        {!isLoading && (
          <span className="table-count">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </span>
        )}
      </div>

      <table className="documents-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => !isLoading && onSort("name")}>
              Document Name
              {renderSortIndicator("name")}
            </th>
            <th className="sortable" onClick={() => !isLoading && onSort("type")}>
              Type
              {renderSortIndicator("type")}
            </th>
            <th>Summary</th>
            <th className="sortable" onClick={() => !isLoading && onSort("uploadedDate")}>
              Uploaded Date
              {renderSortIndicator("uploadedDate")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} style={{ padding: 0, border: "none" }}>
                <SkeletonLoader rows={6} />
              </td>
            </tr>
          ) : (
            documents.map((document) => (
              <DocumentRow
                key={document.id}
                document={document}
                onView={onViewDocument}
                onDownload={onDownload}
                formatDate={formatDate}
              />
            ))
          )}
        </tbody>
      </table>

      {!isLoading && documents.length === 0 && (
        <div className="no-results">
          <SearchIcon size={48} className="no-results-icon" />
          <p>No documents found matching your criteria.</p>
          <p className="no-results-hint">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </section>
  )
}
