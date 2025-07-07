"use client"

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
}

export function DocumentRow({ document, onView, onDownload, formatDate }: DocumentRowProps) {
  return (
    <tr className="table-row" onClick={() => onView(document)}>
      <td className="document-name">
        <div className="document-name-container">
          <PdfIcon size={18} className="pdf-icon" />
          <span>{document.name}</span>
        </div>
      </td>
      <td>
        <span className="document-type">{document.type}</span>
      </td>
      <td className="document-summary">{document.summary}</td>
      <td>{formatDate(document.uploadedDate)}</td>
      <td className="actions-cell">
        <button
          className="action-btn view-btn"
          onClick={(e) => {
            e.stopPropagation()
            onView(document)
          }}
          title="View document"
        >
          <ViewIcon size={14} />
          <span>View</span>
        </button>
        <button
          className="action-btn download-btn"
          onClick={(e) => {
            e.stopPropagation()
            onDownload(document)
          }}
          title="Download document"
        >
          <DownloadIcon size={14} />
          <span>Download</span>
        </button>
      </td>
    </tr>
  )
}
