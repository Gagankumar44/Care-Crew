import React, { forwardRef } from 'react'

interface IconAmbulanceProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconAmbulance = forwardRef<SVGSVGElement, IconAmbulanceProps>(
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
        aria-label={title || "Ambulance"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Ambulance icon - Emergency medical transport</desc>
        <path d="M10 2v3M14 2v3M5 12h14M5 12l-2 4h3M19 12l2 4h-3M5 12v6M19 12v6" />
        <circle cx="7" cy="20" r="2" />
        <circle cx="17" cy="20" r="2" />
        <path d="M7 20h10" />
        <path d="M9 12h6M11 10h2v4h-2z" />
      </svg>
    )
  }
)

IconAmbulance.displayName = 'IconAmbulance'

export default IconAmbulance

