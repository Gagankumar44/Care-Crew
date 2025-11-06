import React, { forwardRef } from 'react'

interface IconHospitalProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconHospital = forwardRef<SVGSVGElement, IconHospitalProps>(
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
        aria-label={title || "Hospital"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Hospital building icon - Medical facility</desc>
        <path d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4" />
        <path d="M9 9h6M9 15h6M12 12v6" />
      </svg>
    )
  }
)

IconHospital.displayName = 'IconHospital'

export default IconHospital

