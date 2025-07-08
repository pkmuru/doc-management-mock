"use client"

import type React from "react"

import { PdfIcon } from "./pdf-icon"
import { ViewIcon, DownloadIcon } from "./icons"

interface Document {
  id: string
  name: string
  type: string
  summary: string
  uploadedDate: string
  lastViewed?: string
  fileUrl: string
}

interface DocumentRowProps {
  document: Document
  onView: (document: Document) => void
  onDownload: (document: Document) => void
  formatDate: (dateString: string) => string
  rowIndex: number
  totalRows: number
}

export function DocumentRow({ document, onView, onDownload, formatDate, rowIndex, totalRows }: DocumentRowProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onView(document)
    }
  }

  const handleViewKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      event.stopPropagation()
      onView(document)
    }
  }

  const handleDownloadKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      event.stopPropagation()
      onDownload(document)
    }
  }

  return (
    <tr
      className="table-row"
      role="row"
      tabIndex={0}
      onClick={() => onView(document)}
      onKeyDown={handleKeyDown}
      aria-label={`Document: ${document.name}, ${document.type}, uploaded ${formatDate(document.uploadedDate)}. Row ${rowIndex} of ${totalRows}. Press Enter to view.`}
      aria-describedby={`doc-${document.id}-summary`}
    >
      <td role="gridcell" className="document-name">
        <div className="document-name-container">
          <PdfIcon size={18} className="pdf-icon" aria-hidden="true" />
          <span>{document.name}</span>
        </div>
      </td>
      <td role="gridcell">
        <span className="document-type" aria-label={`Document type: ${document.type}`}>
          {document.type}
        </span>
      </td>
      <td
        role="gridcell"
        className="document-summary"
        id={`doc-${document.id}-summary`}
        aria-label={`Summary: ${document.summary}`}
      >
        {document.summary}
      </td>
      <td role="gridcell" aria-label={`Uploaded on ${formatDate(document.uploadedDate)}`}>
        {formatDate(document.uploadedDate)}
      </td>
      <td role="gridcell" className="actions-cell">
        <button
          className="action-btn view-btn"
          onClick={(e) => {
            e.stopPropagation()
            onView(document)
          }}
          onKeyDown={handleViewKeyDown}
          aria-label={`View document ${document.name}`}
          aria-describedby={`view-${document.id}-desc`}
        >
          <ViewIcon size={14} aria-hidden="true" />
          <span>View</span>
        </button>
        <span id={`view-${document.id}-desc`} className="sr-only">
          Opens document in preview panel
        </span>

        <button
          className="action-btn download-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDownload(document)
          }}
          onKeyDown={handleDownloadKeyDown}
          aria-label={`Download document ${document.name}`}
          aria-describedby={`download-${document.id}-desc`}
        >
          <DownloadIcon size={14} aria-hidden="true" />
          <span>Download</span>
        </button>
        <span id={`download-${document.id}-desc`} className="sr-only">
          Downloads document to your device
        </span>
      </td>
    </tr>
  )
}
