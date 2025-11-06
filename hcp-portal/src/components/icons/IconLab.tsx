import React, { forwardRef } from 'react'

interface IconLabProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconLab = forwardRef<SVGSVGElement, IconLabProps>(
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
        aria-label={title || "Lab"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Laboratory microscope icon - Medical testing facility</desc>
        <circle cx="12" cy="8" r="3" />
        <path d="M12 11v10M8 21h8M6 13l-2 2M18 13l2 2M10 17l-1 1M14 17l1 1" />
        <path d="M9 5h6M9 5l-1 2M15 5l1 2" />
      </svg>
    )
  }
)

IconLab.displayName = 'IconLab'

export default IconLab

