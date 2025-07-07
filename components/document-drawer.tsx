"use client"

import { PdfIcon } from "./pdf-icon"
import { DownloadIcon, CloseIcon } from "./icons"
import { LoadingSpinner } from "./loading-spinner"
import { PdfViewer } from "./pdf-viewer"

interface Document {
  id: string
  name: string
  type: string
  summary: string
  uploadedDate: string
  lastViewed?: string
  fileUrl: string
}

interface DocumentDrawerProps {
  document: Document | null
  isOpen: boolean
  onClose: () => void
  onDownload: (document: Document) => void
  formatDate: (dateString: string) => string
  isMarkingViewed?: boolean
}

export function DocumentDrawer({
  document,
  isOpen,
  onClose,
  onDownload,
  formatDate,
  isMarkingViewed = false,
}: DocumentDrawerProps) {
  if (!isOpen || !document) return null

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <PdfIcon size={24} className="drawer-pdf-icon" />
            <h2>{document.name}</h2>
            {isMarkingViewed && (
              <div className="marking-viewed">
                <LoadingSpinner size={16} />
                <span>Updating...</span>
              </div>
            )}
          </div>
          <div className="drawer-actions">
            <button className="action-btn download-btn" onClick={() => onDownload(document)} title="Download document">
              <DownloadIcon size={16} />
              <span>Download</span>
            </button>
            <button className="close-btn" onClick={onClose} title="Close preview">
              <CloseIcon size={18} />
            </button>
          </div>
        </div>
        <div className="drawer-content">
          <div className="document-info">
            <p>
              <strong>Type:</strong> {document.type}
            </p>
            <p>
              <strong>Summary:</strong> {document.summary}
            </p>
            <p>
              <strong>Uploaded:</strong> {formatDate(document.uploadedDate)}
            </p>
            {document.lastViewed && (
              <p>
                <strong>Last Viewed:</strong> {formatDate(document.lastViewed)}
              </p>
            )}
          </div>
          <div className="document-preview">
            <PdfViewer fileUrl={document.fileUrl} fileName={document.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
