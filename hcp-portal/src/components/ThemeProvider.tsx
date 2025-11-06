'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Set initial theme from localStorage or default to dark
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        const initialTheme = (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) 
          ? savedTheme 
          : 'dark'
        
        setTheme(initialTheme)
        
        // Apply theme immediately on mount
        const html = document.documentElement
        html.classList.remove('light', 'dark')
        html.classList.add(initialTheme)
        
        const body = document.body
        if (initialTheme === 'dark') {
          body.style.backgroundColor = '#171717'
        } else {
          body.style.backgroundColor = '#ffffff'
        }
        
        setMounted(true)
      } catch (e) {
        console.error('Error loading theme:', e)
        setTheme('dark')
        const html = document.documentElement
        html.classList.remove('light', 'dark')
        html.classList.add('dark')
        document.body.style.backgroundColor = '#171717'
        setMounted(true)
      }
    } else {
      // Server-side: default to dark
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.classList.remove('light', 'dark')
      html.classList.add(theme)
      
      // Ensure body has proper background
      const body = document.body
      if (theme === 'dark') {
        body.style.backgroundColor = '#171717' // neutral-900
      } else {
        body.style.backgroundColor = '#ffffff' // white
      }
      
      try {
        if (mounted) {
          localStorage.setItem('theme', theme)
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Always render children - don't wait for mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
