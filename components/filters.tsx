"use client"

import type React from "react"

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
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isDropdownOpen) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isDropdownOpen])

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

  const handleDropdownKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const handleOptionKeyDown = (event: React.KeyboardEvent, type: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleTypeToggle(type)
    }
  }

  return (
    <section className="filters-section" role="search" aria-labelledby="filters-title">
      <h2 id="filters-title" className="sr-only">
        Search and Filter Documents
      </h2>

      <div className="filters">
        <div className="filter-group" role="group" aria-labelledby="search-label">
          <label id="search-label" htmlFor="search">
            Search Documents:
          </label>
          <div className="search-input-container">
            <SearchIcon size={18} className="search-icon" aria-hidden="true" />
            <input
              id="search"
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or summary..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              disabled={isLoading}
              aria-describedby="search-help"
              aria-label="Search documents by name or summary"
            />
            <div id="search-help" className="sr-only">
              Type to search through document names and summaries. Results update automatically as you type.
            </div>
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                tabIndex={0}
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="filter-group" role="group" aria-labelledby="type-filter-label">
          <label id="type-filter-label" htmlFor="type-filter">
            Document Types:
          </label>
          <div className="multi-select-container" ref={dropdownRef}>
            <button
              id="type-filter"
              className={`multi-select-button ${isDropdownOpen ? "open" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={handleDropdownKeyDown}
              disabled={isLoading}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              aria-labelledby="type-filter-label"
              aria-describedby="type-filter-help"
            >
              <span className="multi-select-text">{getFilterButtonText()}</span>
              <span className="multi-select-arrow" aria-hidden="true">
                {isDropdownOpen ? "▲" : "▼"}
              </span>
              {isLoading && (
                <div className="select-loading" aria-hidden="true">
                  <LoadingSpinner size={16} />
                </div>
              )}
            </button>
            <div id="type-filter-help" className="sr-only">
              Select document types to filter results. Multiple types can be selected.
            </div>

            {isDropdownOpen && (
              <div
                className="multi-select-dropdown"
                role="listbox"
                aria-labelledby="type-filter-label"
                aria-multiselectable="true"
              >
                <div className="multi-select-header">
                  <button
                    className="multi-select-action"
                    onClick={handleSelectAll}
                    disabled={typeFilter.length === documentTypes.length}
                    aria-label="Select all document types"
                  >
                    Select All
                  </button>
                  <button
                    className="multi-select-action"
                    onClick={handleClearAll}
                    disabled={typeFilter.length === 0}
                    aria-label="Clear all selected document types"
                  >
                    Clear All
                  </button>
                </div>

                <div className="multi-select-options">
                  {documentTypes.map((type) => (
                    <div
                      key={type}
                      className="multi-select-option"
                      role="option"
                      tabIndex={0}
                      onClick={() => handleTypeToggle(type)}
                      onKeyDown={(e) => handleOptionKeyDown(e, type)}
                      aria-selected={typeFilter.includes(type)}
                      aria-labelledby={`type-${type.replace(/\s+/g, "-")}-label`}
                    >
                      <input
                        type="checkbox"
                        checked={typeFilter.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="multi-select-checkbox"
                        aria-hidden="true"
                        tabIndex={-1}
                      />
                      <span id={`type-${type.replace(/\s+/g, "-")}-label`} className="multi-select-label">
                        {type}
                      </span>
                      <span className="multi-select-checkmark" aria-hidden="true">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        <span className="results-text" role="status" aria-live="polite" aria-atomic="true">
          {getResultsText()}
        </span>
        {(searchTerm || typeFilter.length > 0) && !isLoading && (
          <button
            className="clear-filters"
            onClick={() => {
              onSearchChange("")
              onTypeFilterChange([])
            }}
            aria-label="Clear all search terms and filters"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {typeFilter.length > 0 && (
        <div className="active-filters" role="group" aria-labelledby="active-filters-label">
          <span id="active-filters-label" className="active-filters-label">
            Active filters:
          </span>
          <div className="filter-tags" role="list" aria-label="Currently applied filters">
            {typeFilter.map((type) => (
              <span key={type} className="filter-tag" role="listitem">
                {type}
                <button
                  className="filter-tag-remove"
                  onClick={() => handleTypeToggle(type)}
                  aria-label={`Remove ${type} filter`}
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
