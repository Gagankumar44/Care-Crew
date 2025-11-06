/**
 * Admin Service API Client
 * Client for interacting with the admin service (Port 3005)
 */

import { API_CONFIG, apiRequest } from './config'

export interface StateAdmin {
  id: string
  user_id: string
  state_code: string
  state_name: string
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface Hospital {
  id: string
  name: string
  state_code: string
  city: string
  address?: string
  phone?: string
  email?: string
  type: 'public' | 'private'
  status: 'active' | 'inactive' | 'suspended'
  beds_total?: number
  beds_available?: number
  icu_beds?: number
}

export interface StateSettings {
  state_code: string
  settings: Record<string, any>
  updated_at: string
}

export interface HospitalControlLog {
  id: string
  admin_id: string
  hospital_id: string
  action: string
  details: Record<string, any>
  created_at: string
}

export interface StateStats {
  totalHospitals: number
  activeHospitals: number
  totalBeds: number
  availableBeds: number
  publicHospitals: number
  privateHospitals: number
}

/**
 * Get current admin info
 */
export async function getCurrentAdmin(): Promise<StateAdmin> {
  return apiRequest<StateAdmin>(`${API_CONFIG.ADMIN_SERVICE}/me`)
}

/**
 * Create state admin (super admin only)
 */
export async function createStateAdmin(data: {
  userId: string
  stateCode: string
  stateName: string
  permissions?: string[]
}): Promise<StateAdmin> {
  return apiRequest<StateAdmin>(`${API_CONFIG.ADMIN_SERVICE}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get hospitals in state
 */
export async function getStateHospitals(stateCode?: string): Promise<Hospital[]> {
  return apiRequest<Hospital[]>(`${API_CONFIG.ADMIN_SERVICE}/hospitals`)
}

/**
 * Get state settings
 */
export async function getStateSettings(): Promise<StateSettings> {
  return apiRequest<StateSettings>(`${API_CONFIG.ADMIN_SERVICE}/settings`)
}

/**
 * Update state settings
 */
export async function updateStateSettings(settings: Record<string, any>): Promise<StateSettings> {
  return apiRequest<StateSettings>(`${API_CONFIG.ADMIN_SERVICE}/settings`, {
    method: 'PUT',
    body: JSON.stringify({ settings }),
  })
}

/**
 * Get control logs
 */
export async function getControlLogs(limit: number = 100): Promise<HospitalControlLog[]> {
  return apiRequest<HospitalControlLog[]>(`${API_CONFIG.ADMIN_SERVICE}/logs?limit=${limit}`)
}

/**
 * Control hospital action
 */
export async function controlHospital(
  hospitalId: string,
  action: string,
  details?: Record<string, any>
): Promise<HospitalControlLog> {
  return apiRequest<HospitalControlLog>(`${API_CONFIG.ADMIN_SERVICE}/hospitals/${hospitalId}/control`, {
    method: 'POST',
    body: JSON.stringify({ action, details }),
  })
}

/**
 * Calculate state statistics from hospitals
 */
export function calculateStateStats(hospitals: Hospital[]): StateStats {
  const activeHospitals = hospitals.filter(h => h.status === 'active')
  const totalBeds = hospitals.reduce((sum, h) => sum + (h.beds_total || 0), 0)
  const availableBeds = hospitals.reduce((sum, h) => sum + (h.beds_available || 0), 0)
  const publicHospitals = hospitals.filter(h => h.type === 'public').length
  const privateHospitals = hospitals.filter(h => h.type === 'private').length

  return {
    totalHospitals: hospitals.length,
    activeHospitals: activeHospitals.length,
    totalBeds,
    availableBeds,
    publicHospitals,
    privateHospitals,
  }
}

