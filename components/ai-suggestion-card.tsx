"use client"

import { useState } from "react"
import { AIIcon } from "./icons"
import { LoadingSpinner } from "./loading-spinner"

interface AISuggestion {
  title: string
  description: string
  searchTerm: string
  typeFilters: string[]
  category: string
}

interface AISuggestionCardProps {
  onApplySuggestion: (searchTerm: string, typeFilters: string[]) => void
  isLoading?: boolean
}

export function AISuggestionCard({ onApplySuggestion, isLoading = false }: AISuggestionCardProps) {
  const [isApplying, setIsApplying] = useState(false)

  const getCurrentSuggestion = (): AISuggestion => {
    const now = new Date()
    const month = now.getMonth() + 1 // 1-12
    const day = now.getDate()

    // Tax season (January 1 - April 15)
    if (month <= 4 && (month < 4 || day <= 15)) {
      return {
        title: "Tax Filing Season",
        description: "Looking for tax documents?",
        searchTerm: "tax",
        typeFilters: ["Tax Documents"],
        category: "Seasonal",
      }
    }

    // Q1 reporting (April - May)
    if (month >= 4 && month <= 5) {
      return {
        title: "Q1 Financial Review",
        description: "Need quarterly statements?",
        searchTerm: "Q1",
        typeFilters: ["Bank statements", "Investment Documents"],
        category: "Quarterly",
      }
    }

    // Mid-year planning (June - August)
    if (month >= 6 && month <= 8) {
      return {
        title: "Mid-Year Planning",
        description: "Review investment portfolio?",
        searchTerm: "investment",
        typeFilters: ["Investment Documents", "401k documents"],
        category: "Planning",
      }
    }

    // Q3 reporting (September - October)
    if (month >= 9 && month <= 10) {
      return {
        title: "Q3 Financial Review",
        description: "Check quarterly performance?",
        searchTerm: "Q3",
        typeFilters: ["Investment Documents", "401k documents"],
        category: "Quarterly",
      }
    }

    // Year-end planning (November - December)
    if (month >= 11) {
      return {
        title: "Year-End Planning",
        description: "Prepare for tax season?",
        searchTerm: "2024",
        typeFilters: ["Tax Documents", "Investment Documents", "401k documents"],
        category: "Planning",
      }
    }

    // Default - recent documents
    return {
      title: "Recent Activity",
      description: "Find recent bank statements?",
      searchTerm: "bank statement",
      typeFilters: ["Bank statements"],
      category: "Recent",
    }
  }

  const suggestion = getCurrentSuggestion()

  const handleApplySuggestion = async () => {
    setIsApplying(true)

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    onApplySuggestion(suggestion.searchTerm, suggestion.typeFilters)
    setIsApplying(false)
  }

  return (
    <div
      className={`ai-suggestion-card ${isApplying ? "applying" : ""}`}
      onClick={!isLoading && !isApplying ? handleApplySuggestion : undefined}
    >
      <div className="ai-suggestion-header">
        <div className="ai-suggestion-icon">
          <AIIcon size={16} className="ai-icon" />
        </div>
        <div className="ai-suggestion-badge">AI Suggestion</div>
      </div>

      <div className="ai-suggestion-content">
        <h3 className="ai-suggestion-title">{suggestion.title}</h3>
        <p className="ai-suggestion-description">{suggestion.description}</p>

        <div className="ai-suggestion-meta">
          <span className="ai-suggestion-category">{suggestion.category}</span>
          <span className="ai-suggestion-separator">•</span>
          <span className="ai-suggestion-filters">
            {suggestion.typeFilters.length} filter{suggestion.typeFilters.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="ai-suggestion-action">
        {isApplying ? (
          <div className="ai-suggestion-loading">
            <LoadingSpinner size={14} />
            <span>Applying...</span>
          </div>
        ) : (
          <div className="ai-suggestion-cta">
            <span>Click to apply</span>
          </div>
        )}
      </div>
    </div>
  )
}
