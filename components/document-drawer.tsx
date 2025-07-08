"use client"

import { useEffect, useRef } from "react"
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
  const drawerRef = useRef<HTMLDivElement>(null)

  // Handle escape key and body scroll
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined" || typeof document === "undefined") return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      // Add event listener - check if document exists
      if (document && document.addEventListener) {
        document.addEventListener("keydown", handleEscape)
      }

      // Prevent body scroll when drawer is open
      if (document && document.body) {
        document.body.style.overflow = "hidden"
      }
    }

    return () => {
      // Cleanup event listener - check if document exists
      if (document && document.removeEventListener) {
        document.removeEventListener("keydown", handleEscape)
      }

      // Restore body scroll - check if document and body exist
      if (document && document.body) {
        document.body.style.overflow = "unset"
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !document) return null

  return (
    <div
      className="drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      aria-describedby="drawer-description"
    >
      <div className="drawer" onClick={(e) => e.stopPropagation()} ref={drawerRef} role="document">
        <div className="drawer-header">
          <div className="drawer-title">
            <PdfIcon size={24} className="drawer-pdf-icon" aria-hidden="true" />
            <h2 id="drawer-title">{document.name}</h2>
            {isMarkingViewed && (
              <div className="marking-viewed" role="status" aria-live="polite">
                <LoadingSpinner size={16} />
                <span>Updating...</span>
              </div>
            )}
          </div>
          <div className="drawer-actions">
            <button
              className="action-btn download-btn"
              onClick={() => onDownload(document)}
              aria-label={`Download ${document.name}`}
              aria-describedby="download-help"
            >
              <DownloadIcon size={16} aria-hidden="true" />
              <span>Download</span>
            </button>
            <div id="download-help" className="sr-only">
              Downloads the document to your device
            </div>

            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close document preview"
              aria-describedby="close-help"
            >
              <CloseIcon size={18} aria-hidden="true" />
            </button>
            <div id="close-help" className="sr-only">
              Closes the document preview and returns to the document list
            </div>
          </div>
        </div>

        <div className="drawer-content">
          <div className="document-info" role="region" aria-labelledby="document-info-title">
            <h3 id="document-info-title" className="sr-only">
              Document Information
            </h3>
            <p>
              <strong>Type:</strong> {document.type}
            </p>
            <p>
              <strong>Summary:</strong> {document.summary}
            </p>
            <p>
              <strong>Uploaded:</strong>
              <time dateTime={document.uploadedDate}>{formatDate(document.uploadedDate)}</time>
            </p>
            {document.lastViewed && (
              <p>
                <strong>Last Viewed:</strong>
                <time dateTime={document.lastViewed}>{formatDate(document.lastViewed)}</time>
              </p>
            )}
          </div>

          <div className="document-preview" role="region" aria-labelledby="document-preview-title">
            <h3 id="document-preview-title" className="sr-only">
              Document Preview
            </h3>
            <div id="drawer-description" className="sr-only">
              Preview of {document.name}, a {document.type} document. Use the download button to save this document to
              your device.
            </div>
            <PdfViewer fileUrl={document.fileUrl} fileName={document.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
