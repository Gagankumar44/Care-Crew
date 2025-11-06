import React, { forwardRef } from 'react'

interface IconSurgeryProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconSurgery = forwardRef<SVGSVGElement, IconSurgeryProps>(
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
        aria-label={title || "Surgery"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Surgery scalpel icon - Surgical procedure</desc>
        <path d="M3 4h18M3 4v16M21 4v16M3 20h18" />
        <path d="M12 4v16M3 12h18" />
        <path d="M8 8l4 4 4-4" />
      </svg>
    )
  }
)

IconSurgery.displayName = 'IconSurgery'

export default IconSurgery

