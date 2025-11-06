import React, { forwardRef } from 'react'

interface IconStethoscopeProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconStethoscope = forwardRef<SVGSVGElement, IconStethoscopeProps>(
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
        aria-label={title || "Stethoscope"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Stethoscope icon - Medical examination tool</desc>
        <path d="M6 12a3 3 0 1 0 6 0M12 12a3 3 0 1 0 6 0M9 12v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-3" />
        <path d="M18 9a3 3 0 1 1 6 0v3a3 3 0 1 1-6 0V9z" />
      </svg>
    )
  }
)

IconStethoscope.displayName = 'IconStethoscope'

export default IconStethoscope

