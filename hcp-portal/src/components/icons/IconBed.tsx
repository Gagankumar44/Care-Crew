import React, { forwardRef } from 'react'

interface IconBedProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconBed = forwardRef<SVGSVGElement, IconBedProps>(
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
        aria-label={title || "Hospital Bed"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Hospital bed icon - Inpatient care facility</desc>
        <path d="M2 8v10M2 8h20M2 8l2-4h16l2 4M22 8v10M6 12h12M6 16h12M4 18h16" />
      </svg>
    )
  }
)

IconBed.displayName = 'IconBed'

export default IconBed

