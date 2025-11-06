/**
 * Ambulance Service API Client
 * Client for interacting with the ambulance service (Port 3007)
 */

import { API_CONFIG, apiRequest } from './config'

export interface AirAmbulance {
  id: string
  registration_number: string
  model: string
  status: 'available' | 'on_mission' | 'maintenance'
  base_location: {
    lat: number
    lng: number
    address: string
  }
  capacity: number
  equipment: string[]
  created_at: string
}

export interface Mission {
  id: string
  ambulance_id: string
  registration_number?: string
  mission_type: 'emergency' | 'transfer' | 'evacuation'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'dispatched' | 'in_transit' | 'completed' | 'cancelled'
  origin_location: {
    lat: number
    lng: number
    address: string
  }
  destination_location: {
    lat: number
    lng: number
    address: string
    hospital_id?: string
  }
  patient_info?: {
    name: string
    age: number
    condition: string
    urgency: string
  }
  estimated_distance_km?: number
  estimated_duration_minutes?: number
  assigned_crew?: Array<{
    name: string
    role: string
  }>
  dispatched_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface MissionTracking {
  id: string
  mission_id: string
  latitude: number
  longitude: number
  altitude?: number
  speed?: number
  heading?: number
  timestamp: string
  notes?: string
}

export interface DashboardStats {
  availableAmbulances: number
  ambulancesOnMission: number
  pendingMissions: number
  missionsInTransit: number
  missionsToday: number
  completedToday: number
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStatistics(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>(`${API_CONFIG.AMBULANCE_SERVICE}/dashboard/statistics`)
}

/**
 * Get all air ambulances
 */
export async function getAirAmbulances(filters?: { status?: string }): Promise<AirAmbulance[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.AMBULANCE_SERVICE}/ambulances?${queryString}`
    : `${API_CONFIG.AMBULANCE_SERVICE}/ambulances`

  return apiRequest<AirAmbulance[]>(url)
}

/**
 * Get air ambulance by ID
 */
export async function getAirAmbulanceById(id: string): Promise<AirAmbulance> {
  return apiRequest<AirAmbulance>(`${API_CONFIG.AMBULANCE_SERVICE}/ambulances/${id}`)
}

/**
 * Get all missions
 */
export async function getMissions(filters?: {
  status?: string
  priority?: string
  ambulanceId?: string
}): Promise<Mission[]> {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.ambulanceId) params.append('ambulanceId', filters.ambulanceId)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.AMBULANCE_SERVICE}/missions?${queryString}`
    : `${API_CONFIG.AMBULANCE_SERVICE}/missions`

  return apiRequest<Mission[]>(url)
}

/**
 * Get mission by ID
 */
export async function getMissionById(id: string): Promise<Mission> {
  return apiRequest<Mission>(`${API_CONFIG.AMBULANCE_SERVICE}/missions/${id}`)
}

/**
 * Create mission
 */
export async function createMission(data: Partial<Mission>): Promise<Mission> {
  return apiRequest<Mission>(`${API_CONFIG.AMBULANCE_SERVICE}/missions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Update mission status
 */
export async function updateMissionStatus(
  id: string,
  status: Mission['status']
): Promise<Mission> {
  return apiRequest<Mission>(`${API_CONFIG.AMBULANCE_SERVICE}/missions/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

/**
 * Add tracking update
 */
export async function addTrackingUpdate(
  missionId: string,
  data: {
    latitude: number
    longitude: number
    altitude?: number
    speed?: number
    heading?: number
    notes?: string
  }
): Promise<MissionTracking> {
  return apiRequest<MissionTracking>(`${API_CONFIG.AMBULANCE_SERVICE}/missions/${missionId}/tracking`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get mission tracking history
 */
export async function getMissionTracking(missionId: string): Promise<MissionTracking[]> {
  return apiRequest<MissionTracking[]>(`${API_CONFIG.AMBULANCE_SERVICE}/missions/${missionId}/tracking`)
}

