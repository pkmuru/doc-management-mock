"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "../components/header"
import { KpiCards } from "../components/kpi-cards"
import { Filters } from "../components/filters"
import { DocumentTable } from "../components/document-table"
import { DocumentDrawer } from "../components/document-drawer"
import { DocumentService } from "../services/document-service"
import { AIIcon } from "../components/ai-icon"
import "./globals.css"

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

export default function DocumentViewer() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [allDocuments, setAllDocuments] = useState<Document[]>([]) // Store all documents for count
  const [kpiData, setKpiData] = useState<KpiData | null>(null)
  const [documentTypes, setDocumentTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([]) // Changed to array
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [sortField, setSortField] = useState<keyof Document | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [aiSuggestionApplied, setAiSuggestionApplied] = useState<string | null>(null)
  const [recentlyViewedDocuments, setRecentlyViewedDocuments] = useState<Document[]>([])
  const [recentlyUploadedDocuments, setRecentlyUploadedDocuments] = useState<Document[]>([])
  const [isLoadingRecentlyViewed, setIsLoadingRecentlyViewed] = useState(true)

  // Loading states
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true)
  const [isLoadingKpi, setIsLoadingKpi] = useState(true)
  const [isLoadingTypes, setIsLoadingTypes] = useState(true)
  const [isMarkingViewed, setIsMarkingViewed] = useState(false)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Reload documents when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDocuments()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, typeFilter])

  const loadInitialData = async () => {
    try {
      // Load all data in parallel
      const [documentsResponse, kpiResponse, typesResponse, recentlyViewedResponse, recentlyUploadedResponse] =
        await Promise.all([
          DocumentService.getDocuments(),
          DocumentService.getKpiData(),
          DocumentService.getDocumentTypes(),
          DocumentService.getRecentlyViewedDocuments(),
          DocumentService.getRecentlyUploadedDocuments(),
        ])

      setDocuments(documentsResponse.documents)
      setAllDocuments(documentsResponse.documents) // Store all documents
      setKpiData(kpiResponse)
      setDocumentTypes(typesResponse)
      setRecentlyViewedDocuments(recentlyViewedResponse)
      setRecentlyUploadedDocuments(recentlyUploadedResponse)
    } catch (error) {
      console.error("Failed to load initial data:", error)
    } finally {
      setIsLoadingDocuments(false)
      setIsLoadingKpi(false)
      setIsLoadingTypes(false)
      setIsLoadingRecentlyViewed(false)
    }
  }

  const loadDocuments = async () => {
    setIsLoadingDocuments(true)
    try {
      const response = await DocumentService.getDocuments(searchTerm, typeFilter)
      setDocuments(response.documents)
    } catch (error) {
      console.error("Failed to load documents:", error)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const sortedDocuments = useMemo(() => {
    if (!sortField) return documents

    const sorted = [...documents].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle date sorting
      if (sortField === "uploadedDate" || sortField === "lastViewed") {
        aValue = new Date(aValue || "").getTime()
        bValue = new Date(bValue || "").getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [documents, sortField, sortDirection])

  const handleViewDocument = async (document: Document) => {
    setSelectedDocument(document)
    setIsDrawerOpen(true)

    // Mark as viewed in background
    setIsMarkingViewed(true)
    try {
      await DocumentService.markAsViewed(document.id)
      // Refresh KPI data and recently viewed documents after marking as viewed
      const [kpiResponse, recentlyViewedResponse] = await Promise.all([
        DocumentService.getKpiData(),
        DocumentService.getRecentlyViewedDocuments(),
      ])
      setKpiData(kpiResponse)
      setRecentlyViewedDocuments(recentlyViewedResponse)
    } catch (error) {
      console.error("Failed to mark document as viewed:", error)
    } finally {
      setIsMarkingViewed(false)
    }
  }

  const handleDownload = (document: Document) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = document.fileUrl
    link.download = document.name
    link.click()
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedDocument(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSort = (field: keyof Document) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAISuggestion = (searchTerm: string, typeFilters: string[]) => {
    setSearchTerm(searchTerm)
    setTypeFilter(typeFilters)
    setAiSuggestionApplied(
      `AI search applied: "${searchTerm}" with ${typeFilters.length} type filter${typeFilters.length > 1 ? "s" : ""}`,
    )

    // Clear the AI suggestion message after 4 seconds
    setTimeout(() => {
      setAiSuggestionApplied(null)
    }, 4000)
  }

  const handleClearAllFilters = () => {
    setSearchTerm("")
    setTypeFilter([])
    setAiSuggestionApplied(null)
  }

  return (
    <div className="app">
      <Header title="My Documents" subtitle="Manage and view your PDF documents" />

      <KpiCards
        kpiData={kpiData}
        isLoading={isLoadingKpi || isLoadingRecentlyViewed}
        onAISuggestion={handleAISuggestion}
        recentlyViewedDocuments={recentlyViewedDocuments}
        recentlyUploadedDocuments={recentlyUploadedDocuments}
        onViewDocument={handleViewDocument}
      />

      {aiSuggestionApplied && (
        <div className="ai-suggestion-notification">
          <div className="ai-notification-content">
            <AIIcon size={16} className="ai-notification-icon" />
            <span className="ai-notification-text">{aiSuggestionApplied}</span>
            <button className="ai-notification-close" onClick={() => setAiSuggestionApplied(null)}>
              ×
            </button>
          </div>
        </div>
      )}

      <Filters
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        documentTypes={documentTypes}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
        isLoading={isLoadingTypes}
        resultsCount={documents.length}
        totalCount={allDocuments.length}
      />

      <DocumentTable
        documents={sortedDocuments}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onViewDocument={handleViewDocument}
        onDownload={handleDownload}
        formatDate={formatDate}
        isLoading={isLoadingDocuments}
      />

      <DocumentDrawer
        document={selectedDocument}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onDownload={handleDownload}
        formatDate={formatDate}
        isMarkingViewed={isMarkingViewed}
      />
    </div>
  )
}
