/**
 * Theme V2 utilities
 * 
 * Centralized logic for theme v2 feature flag
 */

/**
 * Check if Theme V2 is enabled
 * 
 * Priority:
 * 1. Query param ?theme=v2 (highest priority - runtime override)
 * 2. Environment variable THEME_V2 or NEXT_PUBLIC_THEME_V2
 * 
 * @param searchParams - Optional search params from URL
 * @returns boolean indicating if Theme V2 is enabled
 */
export function isThemeV2Enabled(searchParams?: URLSearchParams | string): boolean {
  // Check query parameter first
  if (searchParams) {
    const params = typeof searchParams === 'string' 
      ? new URLSearchParams(searchParams)
      : searchParams
    
    const theme = params.get('theme')
    if (theme === 'v2') {
      return true
    }
  }

  // Check environment variable
  // NEXT_PUBLIC_ prefix makes it accessible client-side
  const envValue = process.env.NEXT_PUBLIC_THEME_V2 || process.env.THEME_V2
  return envValue === 'true' || envValue === '1'
}

/**
 * Get theme class name to apply
 */
export function getThemeClassName(isV2: boolean): string {
  return isV2 ? 'theme-v2' : 'theme-v1'
}

