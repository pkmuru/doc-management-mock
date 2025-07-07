"use client"

import { useState, useRef, useEffect } from "react"
import { LoadingSpinner } from "./loading-spinner"
import { SearchIcon } from "./icons"

interface FiltersProps {
  searchTerm: string
  typeFilter: string[]
  documentTypes: string[]
  onSearchChange: (value: string) => void
  onTypeFilterChange: (value: string[]) => void
  isLoading?: boolean
  resultsCount?: number
  totalCount?: number
}

export function Filters({
  searchTerm,
  typeFilter,
  documentTypes,
  onSearchChange,
  onTypeFilterChange,
  isLoading = false,
  resultsCount = 0,
  totalCount = 0,
}: FiltersProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTypeToggle = (type: string) => {
    const newFilter = typeFilter.includes(type) ? typeFilter.filter((t) => t !== type) : [...typeFilter, type]
    onTypeFilterChange(newFilter)
  }

  const handleSelectAll = () => {
    onTypeFilterChange(documentTypes)
  }

  const handleClearAll = () => {
    onTypeFilterChange([])
  }

  const getResultsText = () => {
    if (isLoading) return "Loading..."

    if (searchTerm || typeFilter.length > 0) {
      return `Showing ${resultsCount} of ${totalCount} documents`
    }

    return `${totalCount} documents total`
  }

  const getFilterButtonText = () => {
    if (typeFilter.length === 0) return "All Types"
    if (typeFilter.length === 1) return typeFilter[0]
    return `${typeFilter.length} types selected`
  }

  return (
    <section className="filters-section">
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="search">Search Documents:</label>
          <div className="search-input-container">
            <SearchIcon size={18} className="search-icon" />
            <input
              id="search"
              type="text"
              placeholder="Search by name or summary..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              disabled={isLoading}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => onSearchChange("")} title="Clear search">
                ×
              </button>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Document Types:</label>
          <div className="multi-select-container" ref={dropdownRef}>
            <button
              className={`multi-select-button ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
            >
              <span className="multi-select-text">{getFilterButtonText()}</span>
              <span className="multi-select-arrow">{isDropdownOpen ? "▲" : "▼"}</span>
              {isLoading && (
                <div className="select-loading">
                  <LoadingSpinner size={16} />
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="multi-select-dropdown">
                <div className="multi-select-header">
                  <button
                    className="multi-select-action"
                    onClick={handleSelectAll}
                    disabled={typeFilter.length === documentTypes.length}
                  >
                    Select All
                  </button>
                  <button className="multi-select-action" onClick={handleClearAll} disabled={typeFilter.length === 0}>
                    Clear All
                  </button>
                </div>

                <div className="multi-select-options">
                  {documentTypes.map((type) => (
                    <label key={type} className="multi-select-option">
                      <input
                        type="checkbox"
                        checked={typeFilter.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="multi-select-checkbox"
                      />
                      <span className="multi-select-label">{type}</span>
                      <span className="multi-select-checkmark">✓</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        <span className="results-text">{getResultsText()}</span>
        {(searchTerm || typeFilter.length > 0) && !isLoading && (
          <button
            className="clear-filters"
            onClick={() => {
              onSearchChange("")
              onTypeFilterChange([])
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {typeFilter.length > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="filter-tags">
            {typeFilter.map((type) => (
              <span key={type} className="filter-tag">
                {type}
                <button
                  className="filter-tag-remove"
                  onClick={() => handleTypeToggle(type)}
                  title={`Remove ${type} filter`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
