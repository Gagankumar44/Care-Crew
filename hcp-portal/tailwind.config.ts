import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm, organic, calming palette
        // Base: Soft cream background
        base: {
          DEFAULT: '#FCFBF9', // Soft off-white/cream
          50: '#FCFBF9',
          100: '#F9F7F4',
          200: '#F5F2ED',
          300: '#F0ECE4',
        },
        // Primary: Forest/Moss Green
        primary: {
          DEFAULT: '#2C5F2D', // Main forest green
          50: '#F0F7F0',
          100: '#E0EFE1',
          200: '#C4DEC6',
          300: '#9CC59F',
          400: '#6FA574',
          500: '#2C5F2D',
          600: '#255027',
          700: '#1E4120',
          800: '#18321A',
          900: '#122814',
        },
        // Secondary: Terracotta/Coral (for buttons and alerts)
        secondary: {
          DEFAULT: '#E07A5F', // Main terracotta/coral
          50: '#FDF5F3',
          100: '#FBE8E4',
          200: '#F7D1C9',
          300: '#F1B0A3',
          400: '#E8947E',
          500: '#E07A5F',
          600: '#D26345',
          700: '#B94F35',
          800: '#98422D',
          900: '#7A3726',
        },
        // Accent: Mint/Soft Teal (for highlights and graphs)
        accent: {
          DEFAULT: '#99EDC3', // Main mint/soft teal
          50: '#F0FDF9',
          100: '#E0FBF3',
          200: '#C4F7E7',
          300: '#99EDC3',
          400: '#7EE4B5',
          500: '#5ED9A7',
          600: '#3DCC95',
          700: '#2FA87A',
          800: '#258662',
          900: '#1E6D52',
        },
        // Success: Forest green
        success: {
          DEFAULT: '#2C5F2D',
          50: '#F0FDF4',
          500: '#2C5F2D',
          600: '#255027',
          700: '#1E4120',
        },
        // Danger/Error: Terracotta for alerts
        error: {
          DEFAULT: '#E07A5F',
          50: '#FDF5F3',
          100: '#FBE8E4',
          500: '#E07A5F',
          600: '#D26345',
          700: '#B94F35',
        },
        danger: {
          DEFAULT: '#E07A5F',
          50: '#FDF5F3',
          100: '#FBE8E4',
          500: '#E07A5F',
          600: '#D26345',
          700: '#B94F35',
        },
        // Warning: Warm orange
        warning: {
          DEFAULT: '#E07A5F',
          50: '#FDF5F3',
          100: '#FBE8E4',
          500: '#E07A5F',
          600: '#D26345',
          700: '#B94F35',
        },
        // Info: Mint accent
        info: {
          DEFAULT: '#99EDC3',
          50: '#F0FDF9',
          100: '#E0FBF3',
          500: '#99EDC3',
          600: '#5ED9A7',
          700: '#2FA87A',
        },
        // Health: Forest green
        health: {
          DEFAULT: '#2C5F2D',
          50: '#F0F7F0',
          100: '#E0EFE1',
          500: '#2C5F2D',
          600: '#255027',
          700: '#1E4120',
        },
        // Warm neutrals - cream spectrum
        neutral: {
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
        glass: 'rgba(252, 251, 249, 0.8)', // Cream-based glass
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        // Subtle glass shadows - reduced saturation
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.1), 0 4px 16px 0 rgba(0, 0, 0, 0.06)',
        'glass-xl': '0 24px 64px 0 rgba(0, 0, 0, 0.12), 0 8px 24px 0 rgba(0, 0, 0, 0.08)',
        'glass-heavy': '0 32px 96px 0 rgba(0, 0, 0, 0.15), 0 16px 48px 0 rgba(0, 0, 0, 0.1)',
        // Hover elevation (for micro-interactions)
        'elevation-1': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elevation-2': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elevation-hover': '0 12px 32px rgba(0, 0, 0, 0.15)',
        soft: '0 2px 8px rgba(0,0,0,0.02)',
        medium: '0 4px 16px rgba(0,0,0,0.04)',
        hard: '0 8px 24px rgba(0,0,0,0.08)',
        glow: '0 0 40px rgba(10, 132, 255, 0.4)',
        'glow-primary': '0 0 40px rgba(10, 132, 255, 0.4)',
        'glow-health': '0 0 40px rgba(52, 199, 89, 0.4)',
        'glow-accent': '0 0 40px rgba(94, 92, 230, 0.4)',
        'glow-success': '0 0 40px rgba(52, 199, 89, 0.4)',
        'glow-error': '0 0 40px rgba(255, 59, 48, 0.4)',
        inner: 'inset 0 2px 4px rgba(0,0,0,0.03)',
        'depth-1': '0 1px 3px rgba(0,0,0,0.1)',
        'depth-2': '0 4px 8px rgba(0,0,0,0.12)',
        'depth-3': '0 10px 20px rgba(0,0,0,0.15)',
      },
      fontFamily: {
        // Font Pairing: Nunito (headings) + Inter (body)
        heading: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'], // Rounded, friendly for headings
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'], // Super-readable for body
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'], // Default to body font
        display: ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'], // Display uses heading font
        text: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'], // Text uses body font
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      blur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'gradient-rotate': 'gradientRotate 6s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        gradientXY: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        gradientRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '10%, 30%': { transform: 'scale(0.9)' },
          '20%, 40%, 60%, 80%': { transform: 'scale(1.1)' },
          '50%, 70%': { transform: 'scale(1.05)' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // 8px baseline grid for spacing and sizing
      spacing: {
        // 8px increments (0.5rem = 8px at default 16px root)
        '0.5': '0.125rem',   // 2px
        '1': '0.25rem',      // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',       // 8px ⭐ base unit
        '3': '0.75rem',      // 12px
        '4': '1rem',         // 16px (2x base)
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px (3x base)
        '8': '2rem',         // 32px (4x base)
        '10': '2.5rem',      // 40px (5x base)
        '12': '3rem',        // 48px (6x base)
        '16': '4rem',        // 64px (8x base)
        '20': '5rem',        // 80px (10x base)
        '24': '6rem',        // 96px (12x base)
        '32': '8rem',        // 128px (16x base)
        '40': '10rem',       // 160px (20x base)
        '48': '12rem',       // 192px (24x base)
        '56': '14rem',       // 224px (28x base)
        '64': '16rem',       // 256px (32x base)
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Micro-interactions: 200-380ms smooth transitions
      transitionDuration: {
        '200': '200ms',      // Fast interactions
        '250': '250ms',      // Standard interactions
        '300': '300ms',      // Default transition
        '350': '350ms',      // Slightly slower
        '380': '380ms',      // Maximum for smooth feel
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Warm, organic gradients
        'gradient-primary': 'linear-gradient(135deg, #2C5F2D 0%, #1E4120 100%)', // Forest green
        'gradient-secondary': 'linear-gradient(135deg, #E07A5F 0%, #B94F35 100%)', // Terracotta
        'gradient-accent': 'linear-gradient(135deg, #99EDC3 0%, #5ED9A7 100%)', // Mint
        'gradient-success': 'linear-gradient(135deg, #2C5F2D 0%, #1E4120 100%)', // Forest green
        'gradient-error': 'linear-gradient(135deg, #E07A5F 0%, #B94F35 100%)', // Terracotta
        // Subtle glass gradients (reduced opacity)
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}
export default config

