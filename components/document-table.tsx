"use client"

import type React from "react"

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
      return (
        <span className="sort-indicator" aria-label={`Sorted ${sortDirection === "asc" ? "ascending" : "descending"}`}>
          {sortDirection === "asc" ? " ↑" : " ↓"}
        </span>
      )
    }
    return null
  }

  const handleSort = (field: keyof Document) => {
    if (!isLoading) {
      onSort(field)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, field: keyof Document) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleSort(field)
    }
  }

  return (
    <section className="table-section" role="region" aria-labelledby="documents-table-title">
      <div className="table-header">
        <h3 id="documents-table-title">Documents</h3>
        {!isLoading && (
          <span
            className="table-count"
            role="status"
            aria-live="polite"
            aria-label={`${documents.length} ${documents.length === 1 ? "document" : "documents"} found`}
          >
            {documents.length} {documents.length === 1 ? "document" : "documents"}
          </span>
        )}
      </div>

      <table className="documents-table" role="table" aria-label="Documents list" aria-describedby="table-description">
        <caption id="table-description" className="sr-only">
          Table showing document details including name, type, summary, upload date, and available actions. Click column
          headers to sort. Click rows to view documents.
        </caption>

        <thead role="rowgroup">
          <tr role="row">
            <th
              className="sortable"
              role="columnheader"
              tabIndex={isLoading ? -1 : 0}
              onClick={() => handleSort("name")}
              onKeyDown={(e) => handleKeyDown(e, "name")}
              aria-sort={sortField === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
              aria-label="Document Name, sortable column"
            >
              Document Name
              {renderSortIndicator("name")}
            </th>
            <th
              className="sortable"
              role="columnheader"
              tabIndex={isLoading ? -1 : 0}
              onClick={() => handleSort("type")}
              onKeyDown={(e) => handleKeyDown(e, "type")}
              aria-sort={sortField === "type" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
              aria-label="Document Type, sortable column"
            >
              Type
              {renderSortIndicator("type")}
            </th>
            <th role="columnheader" aria-label="Document Summary">
              Summary
            </th>
            <th
              className="sortable"
              role="columnheader"
              tabIndex={isLoading ? -1 : 0}
              onClick={() => handleSort("uploadedDate")}
              onKeyDown={(e) => handleKeyDown(e, "uploadedDate")}
              aria-sort={sortField === "uploadedDate" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
              aria-label="Upload Date, sortable column"
            >
              Uploaded Date
              {renderSortIndicator("uploadedDate")}
            </th>
            <th role="columnheader" aria-label="Available Actions">
              Actions
            </th>
          </tr>
        </thead>

        <tbody role="rowgroup">
          {isLoading ? (
            <tr role="row">
              <td colSpan={5} style={{ padding: 0, border: "none" }} aria-label="Loading documents">
                <SkeletonLoader rows={6} />
              </td>
            </tr>
          ) : (
            documents.map((document, index) => (
              <DocumentRow
                key={document.id}
                document={document}
                onView={onViewDocument}
                onDownload={onDownload}
                formatDate={formatDate}
                rowIndex={index + 1}
                totalRows={documents.length}
              />
            ))
          )}
        </tbody>
      </table>

      {!isLoading && documents.length === 0 && (
        <div className="no-results" role="status" aria-live="polite">
          <SearchIcon size={48} className="no-results-icon" aria-hidden="true" />
          <p>No documents found matching your criteria.</p>
          <p className="no-results-hint">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </section>
  )
}
