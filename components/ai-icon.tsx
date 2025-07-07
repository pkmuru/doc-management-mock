interface IconProps {
  size?: number
  className?: string
}

export function AIIcon({ size = 16, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain/AI representation with sparkles */}
      <path
        d="M12 2C13.5 2 15 2.5 16 3.5C17 2.5 18.5 2 20 2C21 3 21.5 4.5 21.5 6C22.5 7 22 8.5 22 10C22 11.5 21.5 13 20.5 14C21.5 15 21 16.5 21 18C20 19 18.5 19.5 17 19.5C16 20.5 14.5 21 13 21C11.5 21 10 20.5 9 19.5C7.5 19.5 6 19 5 18C5 16.5 4.5 15 5.5 14C4.5 13 5 11.5 5 10C5 8.5 5.5 7 6.5 6C5.5 4.5 6 3 7 2C8.5 2 10 2.5 11 3.5C11.5 2.5 12 2 12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner neural network pattern */}
      <circle cx="9" cy="9" r="1" fill="currentColor" />
      <circle cx="15" cy="9" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
      {/* Connecting lines */}
      <path d="M9 9L12 12L15 9" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M9 15L12 12L15 15" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* Sparkles for AI magic */}
      <path d="M18 6L19 7L18 8L17 7L18 6Z" fill="currentColor" opacity="0.8" />
      <path d="M6 16L7 17L6 18L5 17L6 16Z" fill="currentColor" opacity="0.8" />
    </svg>
  )
}
