import React, { forwardRef } from 'react'

interface IconARScanProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconARScan = forwardRef<SVGSVGElement, IconARScanProps>(
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
        aria-label={title || "AR Scan"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>AR scan icon - Augmented reality body scanning</desc>
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M7 2v20M17 2v20M2 7h20M2 17h20" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
)

IconARScan.displayName = 'IconARScan'

export default IconARScan

