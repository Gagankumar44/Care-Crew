/**
 * Design Tokens for Care Crew V2
 * 
 * Provides a unified design system with:
 * - 8px base spacing scale
 * - Consistent radii, shadows, colors
 * - Typography configuration
 * - CSS variable mappings for Tailwind
 */

// Spacing: 8px base scale
export const spacing = {
  0: '0',
  1: '4px',   // 0.5 * base (4px)
  2: '8px',   // 1 * base (8px)
  3: '12px',  // 1.5 * base (12px)
  4: '16px',  // 2 * base (16px)
  8: '64px',  // 8 * base (64px)
  12: '96px', // 12 * base (96px)
  16: '128px', // 16 * base (128px)
} as const

// Border radii
export const radii = {
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const

// Shadows
export const shadows = {
  soft: {
    card: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  },
} as const

// Colors: Warm, organic, and calming palette
export const colors = {
  // Base: Soft off-white/cream background
  base: {
    50: '#FCFBF9', // Soft off-white/cream
    100: '#F9F7F4',
    200: '#F5F2ED',
    300: '#F0ECE4',
  },
  neutrals: {
    50: '#FCFBF9', // Soft cream base
    100: '#F9F7F4',
    200: '#F0ECE4',
    300: '#E5DFD4',
    400: '#D4CCC0',
    500: '#A39D93',
    600: '#7A7369',
    700: '#5C564F',
    800: '#3D3934',
    900: '#262420',
    950: '#1A1816',
  },
  // Primary: Deep forest/moss green (#2C5F2D)
  primary: {
    50: '#F0F7F0',
    100: '#E0EFE1',
    200: '#C4DEC6',
    300: '#9CC59F',
    400: '#6FA574',
    500: '#2C5F2D', // Main forest green
    600: '#255027',
    700: '#1E4120',
    800: '#18321A',
    900: '#122814',
    start: '#2C5F2D', // Forest green
    end: '#1E4120',   // Darker forest green
    gradient: 'linear-gradient(135deg, #2C5F2D 0%, #1E4120 100%)',
  },
  // Secondary: Warm terracotta/coral (#E07A5F) for buttons and alerts
  secondary: {
    50: '#FDF5F3',
    100: '#FBE8E4',
    200: '#F7D1C9',
    300: '#F1B0A3',
    400: '#E8947E',
    500: '#E07A5F', // Main terracotta/coral
    600: '#D26345',
    700: '#B94F35',
    800: '#98422D',
    900: '#7A3726',
    start: '#E07A5F', // Terracotta
    end: '#B94F35',   // Darker terracotta
    gradient: 'linear-gradient(135deg, #E07A5F 0%, #B94F35 100%)',
  },
  // Accent: Bright mint/soft teal (#99EDC3) for highlights and graphs
  accent: {
    50: '#F0FDF9',
    100: '#E0FBF3',
    200: '#C4F7E7',
    300: '#99EDC3', // Main mint/soft teal
    400: '#7EE4B5',
    500: '#5ED9A7',
    600: '#3DCC95',
    700: '#2FA87A',
    800: '#258662',
    900: '#1E6D52',
    start: '#99EDC3', // Mint/soft teal
    end: '#5ED9A7',   // Brighter mint
    gradient: 'linear-gradient(135deg, #99EDC3 0%, #5ED9A7 100%)',
  },
  success: {
    50: '#F0FDF4',
    500: '#2C5F2D', // Forest green for success
    600: '#255027',
    700: '#1E4120',
  },
  danger: {
    50: '#FDF5F3',
    500: '#E07A5F', // Terracotta for danger/alerts
    600: '#D26345',
    700: '#B94F35',
  },
  muted: {
    50: '#FCFBF9',
    100: '#F9F7F4',
    500: '#A39D93',
    600: '#7A7369',
    700: '#5C564F',
  },
} as const

// Typography - Font Pairing
export const typography = {
  fontFamily: {
    heading: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'].join(', '), // Rounded, friendly for headings
    body: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'].join(', '), // Super-readable for body
    primary: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'].join(', '), // Alias for body
    fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'].join(', '),
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

/**
 * CSS Variable Mappings for Tailwind
 * These are injected into :root via globals.css
 */
export const cssVariables = {
  // Spacing
  '--spacing-0': spacing[0],
  '--spacing-1': spacing[1],
  '--spacing-2': spacing[2],
  '--spacing-3': spacing[3],
  '--spacing-4': spacing[4],
  '--spacing-8': spacing[8],
  
  // Radii
  '--radius-sm': radii.sm,
  '--radius-md': radii.md,
  '--radius-lg': radii.lg,
  
  // Base colors (cream background)
  '--color-base-50': colors.base[50],
  '--color-base-100': colors.base[100],
  '--color-base-200': colors.base[200],
  '--color-base-300': colors.base[300],
  
  // Colors - Neutrals (warm cream spectrum)
  '--color-neutral-50': colors.neutrals[50],
  '--color-neutral-100': colors.neutrals[100],
  '--color-neutral-200': colors.neutrals[200],
  '--color-neutral-300': colors.neutrals[300],
  '--color-neutral-400': colors.neutrals[400],
  '--color-neutral-500': colors.neutrals[500],
  '--color-neutral-600': colors.neutrals[600],
  '--color-neutral-700': colors.neutrals[700],
  '--color-neutral-800': colors.neutrals[800],
  '--color-neutral-900': colors.neutrals[900],
  '--color-neutral-950': colors.neutrals[950],
  
  // Primary (forest green)
  '--color-primary-500': colors.primary[500],
  '--color-primary-start': colors.primary.start,
  '--color-primary-end': colors.primary.end,
  '--color-primary-gradient': colors.primary.gradient,
  
  // Secondary (terracotta/coral)
  '--color-secondary-500': colors.secondary[500],
  '--color-secondary-start': colors.secondary.start,
  '--color-secondary-end': colors.secondary.end,
  '--color-secondary-gradient': colors.secondary.gradient,
  
  // Accent (mint/soft teal)
  '--color-accent-300': colors.accent[300],
  '--color-accent-start': colors.accent.start,
  '--color-accent-end': colors.accent.end,
  '--color-accent-gradient': colors.accent.gradient,
  
  // Success
  '--color-success-500': colors.success[500],
  '--color-success-600': colors.success[600],
  
  // Danger
  '--color-danger-500': colors.danger[500],
  '--color-danger-600': colors.danger[600],
  
  // Muted
  '--color-muted-500': colors.muted[500],
  '--color-muted-600': colors.muted[600],
  
  // Shadows
  '--shadow-soft-card': shadows.soft.card,
  '--shadow-soft-elevated': shadows.soft.elevated,
  
  // Typography - Font Pairing
  '--font-heading': typography.fontFamily.heading,
  '--font-body': typography.fontFamily.body,
  '--font-primary': typography.fontFamily.primary,
  '--font-fallback': typography.fontFamily.fallback,
} as const

// Export everything
export const tokens = {
  spacing,
  radii,
  shadows,
  colors,
  typography,
  cssVariables,
} as const

export default tokens
