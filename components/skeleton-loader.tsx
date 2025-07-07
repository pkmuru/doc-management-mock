interface SkeletonLoaderProps {
  rows?: number
  className?: string
}

export function SkeletonLoader({ rows = 5, className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`skeleton-container ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-row">
          <div className="skeleton-item skeleton-icon"></div>
          <div className="skeleton-item skeleton-name"></div>
          <div className="skeleton-item skeleton-type"></div>
          <div className="skeleton-item skeleton-summary"></div>
          <div className="skeleton-item skeleton-date"></div>
          <div className="skeleton-item skeleton-actions"></div>
        </div>
      ))}
    </div>
  )
}

export function KpiSkeleton() {
  return (
    <div className="kpi-skeleton-container">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="kpi-skeleton">
          <div className="skeleton-item skeleton-kpi-title"></div>
          <div className="skeleton-item skeleton-kpi-value"></div>
        </div>
      ))}
    </div>
  )
}
