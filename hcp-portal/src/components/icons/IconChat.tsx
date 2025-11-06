import React, { forwardRef } from 'react'

interface IconChatProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  title?: string
}

export const IconChat = forwardRef<SVGSVGElement, IconChatProps>(
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
        aria-label={title || "Chat"}
        {...props}
      >
        {title && <title>{title}</title>}
        <desc>Chat message icon - Medical support communication</desc>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M9 10h6M9 14h4" />
      </svg>
    )
  }
)

IconChat.displayName = 'IconChat'

export default IconChat

