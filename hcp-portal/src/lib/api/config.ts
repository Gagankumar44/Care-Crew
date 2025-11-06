/**
 * API Configuration
 * Centralized configuration for backend service endpoints
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const API_CONFIG = {
  // Base URLs for backend services
  ADMIN_SERVICE: process.env.NEXT_PUBLIC_ADMIN_SERVICE_URL || 'http://localhost:3005/api/v1/admin',
  HOSPITAL_REGISTRY_SERVICE: process.env.NEXT_PUBLIC_HOSPITAL_REGISTRY_SERVICE_URL || 'http://localhost:3006/api/v1/hospitals',
  AMBULANCE_SERVICE: process.env.NEXT_PUBLIC_AMBULANCE_SERVICE_URL || 'http://localhost:3007/api/v1/ambulance',
  ANALYTICS_SERVICE: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || 'http://localhost:3008/api/v1/analytics',
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3000/api/v1/auth',
}

/**
 * Get authentication token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
}

/**
 * Get default headers for API requests
 */
export function getDefaultHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Handle API response errors
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = 'An error occurred'
  
  try {
    const errorData = await response.json()
    errorMessage = errorData.error?.message || errorData.message || errorMessage
  } catch {
    errorMessage = response.statusText || `HTTP ${response.status}`
  }
  
  throw new Error(errorMessage)
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    await handleApiError(response)
  }

  const data = await response.json()
  return data.data || data
}

