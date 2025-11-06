import React, { forwardRef } from 'react'

interface IconIVProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconIV = forwardRef<SVGSVGElement, IconIVProps>(
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
        aria-label={title || "IV"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>IV drip icon - Intravenous infusion therapy</desc>
        <path d="M12 2v20M8 2h8M8 2v4M16 2v4M12 10v4M10 12h4" />
        <path d="M6 14h12M6 14l-2 4h16l-2-4" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    )
  }
)

IconIV.displayName = 'IconIV'

export default IconIV

