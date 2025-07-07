interface PdfIconProps {
  size?: number
  className?: string
}

export function PdfIcon({ size = 20, className = "" }: PdfIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        fill="#DC143C"
        stroke="#DC143C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="14,2 14,8 20,8"
        fill="white"
        stroke="#DC143C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="6"
        fill="white"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        PDF
      </text>
    </svg>
  )
}
