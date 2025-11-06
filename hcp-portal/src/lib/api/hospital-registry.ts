/**
 * Hospital Registry Service API Client
 * Client for interacting with the hospital registry service (Port 3006)
 */

import { API_CONFIG, apiRequest } from './config'

export interface Hospital {
  id: string
  name: string
  state_code: string
  state_name?: string
  city: string
  address?: string
  phone?: string
  email?: string
  type: 'public' | 'private'
  accreditation?: string
  beds_total?: number
  beds_available?: number
  icu_beds?: number
  status: 'active' | 'inactive' | 'suspended'
  registration_number?: string
  registration_date?: string
  created_at?: string
  updated_at?: string
}

export interface HospitalStatistics {
  totalHospitals: number
  activeHospitals: number
  inactiveHospitals: number
  suspendedHospitals: number
  totalBeds: number
  availableBeds: number
  publicHospitals: number
  privateHospitals: number
  byState: Record<string, number>
}

export interface HospitalFilters {
  stateCode?: string
  city?: string
  status?: string
  type?: string
}

/**
 * Get all hospitals with optional filters
 */
export async function getHospitals(filters?: HospitalFilters): Promise<Hospital[]> {
  const params = new URLSearchParams()
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.city) params.append('city', filters.city)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.type) params.append('type', filters.type)

  const queryString = params.toString()
  const url = queryString 
    ? `${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}?${queryString}`
    : API_CONFIG.HOSPITAL_REGISTRY_SERVICE

  return apiRequest<Hospital[]>(url)
}

/**
 * Get hospital statistics
 */
export async function getHospitalStatistics(filters?: { stateCode?: string }): Promise<HospitalStatistics> {
  const params = new URLSearchParams()
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/statistics?${queryString}`
    : `${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/statistics`

  return apiRequest<HospitalStatistics>(url)
}

/**
 * Get hospital by ID
 */
export async function getHospitalById(id: string): Promise<Hospital> {
  return apiRequest<Hospital>(`${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/${id}`)
}

/**
 * Create hospital (admin only)
 */
export async function createHospital(data: Partial<Hospital>): Promise<Hospital> {
  return apiRequest<Hospital>(API_CONFIG.HOSPITAL_REGISTRY_SERVICE, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Update hospital (admin only)
 */
export async function updateHospital(id: string, data: Partial<Hospital>): Promise<Hospital> {
  return apiRequest<Hospital>(`${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Delete hospital (admin only)
 */
export async function deleteHospital(id: string): Promise<void> {
  return apiRequest<void>(`${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Create inspection record
 */
export async function createInspection(hospitalId: string, data: {
  inspectionDate: string
  inspectorName: string
  inspectionType: string
  status: string
  findings?: string
  complianceScore?: number
}): Promise<any> {
  return apiRequest<any>(`${API_CONFIG.HOSPITAL_REGISTRY_SERVICE}/${hospitalId}/inspections`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

