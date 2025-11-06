import React, { forwardRef } from 'react'

interface IconWheelchairProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconWheelchair = forwardRef<SVGSVGElement, IconWheelchairProps>(
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
        aria-label={title || "Wheelchair"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Wheelchair icon - Accessibility and mobility aid</desc>
        <circle cx="12" cy="4" r="2" />
        <path d="M19 13v-2a2 2 0 0 0-2-2h-1.5M12 6v8M9 14h6M9 14l-1 4h8l-1-4M9 14h6" />
        <circle cx="7" cy="20" r="2" />
        <circle cx="17" cy="20" r="2" />
        <path d="M7 20h10" />
      </svg>
    )
  }
)

IconWheelchair.displayName = 'IconWheelchair'

export default IconWheelchair

