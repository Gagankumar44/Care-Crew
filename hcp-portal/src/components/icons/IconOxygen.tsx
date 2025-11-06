import React, { forwardRef } from 'react'

interface IconOxygenProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconOxygen = forwardRef<SVGSVGElement, IconOxygenProps>(
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
        aria-label={title || "Oxygen"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Oxygen mask icon - Respiratory therapy</desc>
        <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" />
        <path d="M8 12h8M10 10v4M14 10v4" />
        <path d="M12 16v4M10 18h4" />
      </svg>
    )
  }
)

IconOxygen.displayName = 'IconOxygen'

export default IconOxygen

