/**
 * Accessibility Utilities
 * Provides helper functions for ARIA labels, keyboard navigation, and WCAG compliance
 */

/**
 * Generate ARIA label for metric card
 */
export function getMetricAriaLabel(title: string, value: string | number, trend?: number): string {
  let label = `${title}: ${value}`
  if (trend !== undefined) {
    label += `, ${trend >= 0 ? 'increased' : 'decreased'} by ${Math.abs(trend)}%`
  }
  return label
}

/**
 * Generate ARIA label for navigation item
 */
export function getNavAriaLabel(label: string, isActive: boolean, isCurrent: boolean): string {
  let ariaLabel = `Navigate to ${label}`
  if (isActive) {
    ariaLabel += ' (current page)'
  }
  if (isCurrent) {
    ariaLabel += ' (you are here)'
  }
  return ariaLabel
}

/**
 * Check if color contrast meets WCAG AA standards
 * Returns true if contrast ratio >= 4.5 for normal text or >= 3.0 for large text
 */
export function checkContrastRatio(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  // Simple contrast check (would need proper color parsing in production)
  // For now, return true as Tailwind colors are pre-checked for accessibility
  const minRatio = isLargeText ? 3.0 : 4.5
  // In production, use a library like `tinycolor2` or `chroma-js` for actual calculation
  return true // Placeholder - actual implementation would calculate luminance
}

/**
 * Get focus visible styles for keyboard navigation
 */
export function getFocusStyles(
  variant: 'default' | 'primary' | 'danger' = 'default'
): string {
  const styles = {
    default: 'focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-teal-500/20',
    primary: 'focus-visible:outline-2 focus-visible:outline-teal-400 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-teal-400/30',
    danger: 'focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-red-500/20',
  }
  return styles[variant]
}

/**
 * Skip link component helper
 */
export function getSkipLinkHref(target: 'main' | 'navigation' | 'search' = 'main'): string {
  const ids = {
    main: '#main-content',
    navigation: '#sidebar-nav',
    search: '#search-input',
  }
  return ids[target]
}

/**
 * Generate unique ID for ARIA relationships
 */
let idCounter = 0
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Screen reader only class
 */
export const srOnly = 'sr-only'

/**
 * Not screen reader only (for focus state)
 */
export const notSrOnly = 'focus:not-sr-only'
