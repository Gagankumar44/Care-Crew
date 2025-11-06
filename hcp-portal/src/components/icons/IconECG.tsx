import React, { forwardRef } from 'react'

interface IconECGProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconECG = forwardRef<SVGSVGElement, IconECGProps>(
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
        aria-label={title || "ECG"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>ECG heartbeat icon - Heart rate monitoring</desc>
        <path d="M2 12h4M6 9v6M8 12h8M16 8v8M18 12h4M22 12v-4" />
        <path d="M2 18h20" />
      </svg>
    )
  }
)

IconECG.displayName = 'IconECG'

export default IconECG

