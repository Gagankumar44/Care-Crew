import React, { forwardRef } from 'react'

interface IconPharmacyProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconPharmacy = forwardRef<SVGSVGElement, IconPharmacyProps>(
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
        aria-label={title || "Pharmacy"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Pharmacy mortar and pestle icon - Medication dispensing</desc>
        <path d="M12 2v20M8 6h8M8 6v12M16 6v12" />
        <circle cx="12" cy="12" r="2" />
        <path d="M10 8h4M10 16h4" />
      </svg>
    )
  }
)

IconPharmacy.displayName = 'IconPharmacy'

export default IconPharmacy

