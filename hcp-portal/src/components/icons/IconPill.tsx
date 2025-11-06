import React, { forwardRef } from 'react'

interface IconPillProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconPill = forwardRef<SVGSVGElement, IconPillProps>(
  ({ size = 24, className = '', title, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-label={title || "Pill"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Pill medication icon - Prescription medicine</desc>
        <path d="M8 12a4 4 0 0 1 8 0" />
        <path d="M8 12a4 4 0 0 0 8 0" />
        <path d="M12 10v4" />
      </svg>
    )
  }
)

IconPill.displayName = 'IconPill'

export default IconPill

