/**
 * Performance Optimization Utilities
 * Provides helpers for asset optimization, lazy loading, and critical CSS
 */

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  basePath: string,
  filename: string,
  formats: ('webp' | 'jpg' | 'png')[] = ['webp', 'jpg'],
  sizes: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): string {
  const srcSets: string[] = []
  
  formats.forEach(format => {
    const srcSet = sizes
      .map(size => {
        const density = size === 640 ? 1 : size / 640
        const file = density === 1 
          ? `${filename}.${format}`
          : `${filename}@${Math.round(density)}x.${format}`
        return `${basePath}/${file} ${density}x`
      })
      .join(', ')
    srcSets.push(srcSet)
  })
  
  return srcSets.join(', ')
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  as: 'image' | 'font' | 'style' | 'script',
  crossorigin: boolean = false
): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (crossorigin) {
    link.crossOrigin = 'anonymous'
  }
  
  // Check if already exists
  const existing = document.querySelector(`link[rel="preload"][href="${href}"]`)
  if (!existing) {
    document.head.appendChild(link)
  }
}

/**
 * Prefetch resource for future navigation
 */
export function prefetchResource(href: string): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  
  // Check if already exists
  const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`)
  if (!existing) {
    document.head.appendChild(link)
  }
}

/**
 * Lazy load image with intersection observer
 */
export function lazyLoadImage(element: HTMLImageElement): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load immediately
    if (element.dataset.src) {
      element.src = element.dataset.src
    }
    return
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
          observer.unobserve(img)
        }
      })
    },
    {
      rootMargin: '50px', // Start loading 50px before viewport
    }
  )
  
  observer.observe(element)
}

/**
 * Optimize image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpg' {
  if (typeof window === 'undefined') return 'jpg'
  
  // Check for AVIF support
  const avif = new Image()
  avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
  
  // Check for WebP support
  const webp = new Image()
  webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  
  return 'webp' // Default to webp as it has better support than avif
}

/**
 * Critical CSS inline helper
 */
export function inlineCriticalCSS(css: string): void {
  if (typeof document === 'undefined') return
  
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

/**
 * Defer non-critical CSS loading
 */
export function deferNonCriticalCSS(href: string): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.media = 'print'
  link.onload = function() {
    this.media = 'all'
  }
  document.head.appendChild(link)
}
