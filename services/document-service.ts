interface Document {
  id: string
  name: string
  type: string
  summary: string
  uploadedDate: string
  lastViewed?: string
  fileUrl: string
}

interface DocumentsResponse {
  documents: Document[]
  total: number
}

interface KpiData {
  totalDocuments: number
  recentlyViewed: number
  recentlyUploaded: number
}

// Mock data with real PDF
const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Sample Bank Statement.pdf",
    type: "Bank statements",
    summary: "Sample bank statement document for testing PDF viewer functionality",
    uploadedDate: "2024-01-15",
    lastViewed: "2024-01-20",
    fileUrl: "/documents/sample-bank-statement.pdf", // Real PDF file
  },
  {
    id: "2",
    name: "Tax Return 2023.pdf",
    type: "Tax Documents",
    summary: "Annual tax return filing for 2023",
    uploadedDate: "2024-02-10",
    lastViewed: "2024-02-12",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "3",
    name: "401k Statement Q4 2023.pdf",
    type: "401k documents",
    summary: "Quarterly 401k retirement account statement",
    uploadedDate: "2024-01-05",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "4",
    name: "Bank Statement - February 2024.pdf",
    type: "Bank statements",
    summary: "Monthly bank statement for February",
    uploadedDate: "2024-02-15",
    lastViewed: "2024-02-16",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "5",
    name: "W2 Form 2023.pdf",
    type: "Tax Documents",
    summary: "W2 wage and tax statement for 2023",
    uploadedDate: "2024-01-25",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "6",
    name: "401k Contribution Summary.pdf",
    type: "401k documents",
    summary: "Annual contribution summary and investment performance",
    uploadedDate: "2024-01-30",
    lastViewed: "2024-01-31",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "7",
    name: "Insurance Policy 2024.pdf",
    type: "Insurance Documents",
    summary: "Annual insurance policy renewal documentation",
    uploadedDate: "2024-03-01",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "8",
    name: "Investment Portfolio Q1 2024.pdf",
    type: "Investment Documents",
    summary: "Quarterly investment portfolio performance report",
    uploadedDate: "2024-03-15",
    lastViewed: "2024-03-16",
    fileUrl: "/placeholder.svg?height=800&width=600",
  },
]

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DocumentService {
  // Fetch all documents with optional filtering
  static async getDocuments(searchTerm?: string, typeFilter?: string[]): Promise<DocumentsResponse> {
    // Simulate API call delay
    await delay(800 + Math.random() * 400) // 800-1200ms delay

    let filteredDocuments = [...mockDocuments]

    if (searchTerm) {
      filteredDocuments = filteredDocuments.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.summary.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (typeFilter && typeFilter.length > 0) {
      filteredDocuments = filteredDocuments.filter((doc) => typeFilter.includes(doc.type))
    }

    return {
      documents: filteredDocuments,
      total: filteredDocuments.length,
    }
  }

  // Fetch KPI data
  static async getKpiData(): Promise<KpiData> {
    // Simulate API call delay
    await delay(600 + Math.random() * 300) // 600-900ms delay

    const recentlyViewed = mockDocuments.filter((doc) => doc.lastViewed).length
    const recentlyUploaded = mockDocuments.filter((doc) => {
      const uploadDate = new Date(doc.uploadedDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return uploadDate >= thirtyDaysAgo
    }).length

    return {
      totalDocuments: mockDocuments.length,
      recentlyViewed,
      recentlyUploaded,
    }
  }

  // Update document view timestamp
  static async markAsViewed(documentId: string): Promise<void> {
    // Simulate API call delay
    await delay(200 + Math.random() * 100) // 200-300ms delay

    const docIndex = mockDocuments.findIndex((doc) => doc.id === documentId)
    if (docIndex !== -1) {
      mockDocuments[docIndex].lastViewed = new Date().toISOString().split("T")[0]
    }
  }

  // Get document types for filter dropdown
  static async getDocumentTypes(): Promise<string[]> {
    // Simulate API call delay
    await delay(300 + Math.random() * 200) // 300-500ms delay

    const types = [...new Set(mockDocuments.map((doc) => doc.type))]
    return types.sort()
  }

  // Get recently viewed documents with full document objects
  static async getRecentlyViewedDocuments(limit = 3): Promise<Document[]> {
    // Simulate API call delay
    await delay(400 + Math.random() * 200) // 400-600ms delay

    const recentlyViewed = mockDocuments
      .filter((doc) => doc.lastViewed)
      .sort((a, b) => {
        const dateA = new Date(a.lastViewed || "").getTime()
        const dateB = new Date(b.lastViewed || "").getTime()
        return dateB - dateA // Most recent first
      })
      .slice(0, limit)

    return recentlyViewed
  }

  // Get recently uploaded documents with full document objects
  static async getRecentlyUploadedDocuments(limit = 3): Promise<Document[]> {
    // Simulate API call delay
    await delay(400 + Math.random() * 200) // 400-600ms delay

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentlyUploaded = mockDocuments
      .filter((doc) => {
        const uploadDate = new Date(doc.uploadedDate)
        return uploadDate >= thirtyDaysAgo
      })
      .sort((a, b) => {
        const dateA = new Date(a.uploadedDate).getTime()
        const dateB = new Date(b.uploadedDate).getTime()
        return dateB - dateA // Most recent first
      })
      .slice(0, limit)

    return recentlyUploaded
  }
}
