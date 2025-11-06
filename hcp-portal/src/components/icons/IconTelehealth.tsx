import React, { forwardRef } from 'react'

interface IconTelehealthProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconTelehealth = forwardRef<SVGSVGElement, IconTelehealthProps>(
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
        aria-label={title || "Telehealth"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Telehealth video call icon - Remote medical consultation</desc>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 2h12M6 22h12" />
      </svg>
    )
  }
)

IconTelehealth.displayName = 'IconTelehealth'

export default IconTelehealth

