import React, { forwardRef } from 'react'

interface IconDoctorProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconDoctor = forwardRef<SVGSVGElement, IconDoctorProps>(
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
        aria-label={title || "Doctor"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Doctor profile icon - Healthcare professional</desc>
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M12 11v6M9 14h6" />
      </svg>
    )
  }
)

IconDoctor.displayName = 'IconDoctor'

export default IconDoctor

