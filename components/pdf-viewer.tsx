"use client"

import { useState } from "react"
import { LoadingSpinner } from "./loading-spinner"

interface PdfViewerProps {
  fileUrl: string
  fileName: string
}

export function PdfViewer({ fileUrl, fileName }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className="pdf-viewer">
      {isLoading && (
        <div className="pdf-loading">
          <LoadingSpinner size={32} />
          <p>Loading PDF...</p>
        </div>
      )}

      {hasError && (
        <div className="pdf-error">
          <p>Failed to load PDF document</p>
          <button
            className="retry-btn"
            onClick={() => {
              setHasError(false)
              setIsLoading(true)
            }}
          >
            Retry
          </button>
        </div>
      )}

      <iframe
        src={fileUrl}
        title={`PDF Viewer - ${fileName}`}
        className={`pdf-iframe ${isLoading ? "loading" : ""}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: hasError ? "none" : "block" }}
      />
    </div>
  )
}

// Alternative: React-PDF implementation (for production use)
// Uncomment and install react-pdf package: npm install react-pdf

/*
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface ReactPdfViewerProps {
  fileUrl: string
  fileName: string
}

export function ReactPdfViewer({ fileUrl, fileName }: ReactPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [isLoading, setIsLoading] = useState(true)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setIsLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error)
    setIsLoading(false)
  }

  return (
    <div className="react-pdf-viewer">
      <div className="pdf-controls">
        <div className="page-controls">
          <button 
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="control-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pageNumber} of {numPages}
          </span>
          <button 
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="control-btn"
          >
            Next
          </button>
        </div>
        
        <div className="zoom-controls">
          <button 
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="control-btn"
          >
            Zoom Out
          </button>
          <span className="zoom-info">{Math.round(scale * 100)}%</span>
          <button 
            onClick={() => setScale(Math.min(2.0, scale + 0.1))}
            className="control-btn"
          >
            Zoom In
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="pdf-loading">
          <LoadingSpinner size={32} />
          <p>Loading PDF...</p>
        </div>
      )}

      <div className="pdf-document">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<LoadingSpinner size={32} />}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  )
}
*/
