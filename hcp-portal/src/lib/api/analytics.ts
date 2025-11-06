/**
 * Analytics Service API Client
 * Client for interacting with the analytics service (Port 3008)
 */

import { API_CONFIG, apiRequest } from './config'

export interface DemandHistory {
  id: string
  hospital_id?: string
  state_code?: string
  surgery_type: string
  specialty: string
  demand_count: number
  date: string
  created_at: string
}

export interface DemandPrediction {
  id: string
  hospital_id?: string
  state_code?: string
  surgery_type: string
  specialty: string
  predicted_demand: number
  confidence_level: number
  prediction_date: string
  period_start: string
  period_end: string
  factors: Record<string, any>
  created_at: string
}

export interface DemandStatistics {
  totalDemand: number
  averageDemand: number
  peakDemand: number
  peakDate: string
  bySurgeryType: Record<string, number>
  bySpecialty: Record<string, number>
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface ResourceUtilization {
  id: string
  hospital_id?: string
  state_code?: string
  resource_type: string
  total_capacity: number
  utilized_capacity: number
  utilization_percentage: number
  date: string
  created_at: string
}

export interface AnalyticsReport {
  id: string
  report_type: string
  hospital_id?: string
  state_code?: string
  period_start: string
  period_end: string
  data: Record<string, any>
  generated_at: string
}

export interface AnalyticsFilters {
  hospitalId?: string
  stateCode?: string
  surgeryType?: string
  specialty?: string
  startDate?: string
  endDate?: string
}

/**
 * Get historical surgery demand
 */
export async function getHistoricalDemand(filters?: AnalyticsFilters): Promise<DemandHistory[]> {
  const params = new URLSearchParams()
  if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId)
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.surgeryType) params.append('surgeryType', filters.surgeryType)
  if (filters?.specialty) params.append('specialty', filters.specialty)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.ANALYTICS_SERVICE}/demand/history?${queryString}`
    : `${API_CONFIG.ANALYTICS_SERVICE}/demand/history`

  return apiRequest<DemandHistory[]>(url)
}

/**
 * Record surgery demand
 */
export async function recordSurgeryDemand(data: {
  hospitalId?: string
  stateCode?: string
  surgeryType: string
  specialty: string
  demandCount: number
  date: string
}): Promise<DemandHistory> {
  return apiRequest<DemandHistory>(`${API_CONFIG.ANALYTICS_SERVICE}/demand`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get demand statistics
 */
export async function getDemandStatistics(filters?: {
  hospitalId?: string
  stateCode?: string
  startDate?: string
  endDate?: string
}): Promise<DemandStatistics> {
  const params = new URLSearchParams()
  if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId)
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.ANALYTICS_SERVICE}/demand/statistics?${queryString}`
    : `${API_CONFIG.ANALYTICS_SERVICE}/demand/statistics`

  return apiRequest<DemandStatistics>(url)
}

/**
 * Get predictions
 */
export async function getPredictions(filters?: {
  hospitalId?: string
  stateCode?: string
  surgeryType?: string
  specialty?: string
}): Promise<DemandPrediction[]> {
  const params = new URLSearchParams()
  if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId)
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.surgeryType) params.append('surgeryType', filters.surgeryType)
  if (filters?.specialty) params.append('specialty', filters.specialty)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.ANALYTICS_SERVICE}/predictions?${queryString}`
    : `${API_CONFIG.ANALYTICS_SERVICE}/predictions`

  return apiRequest<DemandPrediction[]>(url)
}

/**
 * Generate prediction
 */
export async function generatePrediction(data: {
  hospitalId?: string
  stateCode?: string
  surgeryType: string
  specialty: string
  periodStart: string
  periodEnd: string
}): Promise<DemandPrediction> {
  return apiRequest<DemandPrediction>(`${API_CONFIG.ANALYTICS_SERVICE}/predictions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get resource utilization
 */
export async function getResourceUtilization(filters?: {
  hospitalId?: string
  stateCode?: string
  resourceType?: string
  startDate?: string
  endDate?: string
}): Promise<ResourceUtilization[]> {
  const params = new URLSearchParams()
  if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId)
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.resourceType) params.append('resourceType', filters.resourceType)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.ANALYTICS_SERVICE}/resources/utilization?${queryString}`
    : `${API_CONFIG.ANALYTICS_SERVICE}/resources/utilization`

  return apiRequest<ResourceUtilization[]>(url)
}

/**
 * Record resource utilization
 */
export async function recordResourceUtilization(data: {
  hospitalId?: string
  stateCode?: string
  resourceType: string
  totalCapacity: number
  utilizedCapacity: number
  date: string
}): Promise<ResourceUtilization> {
  return apiRequest<ResourceUtilization>(`${API_CONFIG.ANALYTICS_SERVICE}/resources/utilization`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Get analytics reports
 */
export async function getAnalyticsReports(filters?: {
  hospitalId?: string
  stateCode?: string
  reportType?: string
}): Promise<AnalyticsReport[]> {
  const params = new URLSearchParams()
  if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId)
  if (filters?.stateCode) params.append('stateCode', filters.stateCode)
  if (filters?.reportType) params.append('reportType', filters.reportType)

  const queryString = params.toString()
  const url = queryString
    ? `${API_CONFIG.ANALYTICS_SERVICE}/reports?${queryString}`
    : `${API_CONFIG.ANALYTICS_SERVICE}/reports`

  return apiRequest<AnalyticsReport[]>(url)
}

/**
 * Generate analytics report
 */
export async function generateAnalyticsReport(data: {
  reportType: string
  hospitalId?: string
  stateCode?: string
  periodStart: string
  periodEnd: string
}): Promise<AnalyticsReport> {
  return apiRequest<AnalyticsReport>(`${API_CONFIG.ANALYTICS_SERVICE}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

