// India Analytics API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_INDIA_ANALYTICS_API_URL || 'http://localhost:3024/api/v1';

export interface IndiaAnalytics {
  state_stats: StateStats[];
  totals: {
    total_hospitals: number;
    total_surgeries: number;
    total_air_ambulance_missions: number;
    states_count: number;
  };
}

export interface StateStats {
  state_code: string;
  state_name: string;
  hospital_count: number;
  city_count: number;
  total_surgeries: number;
  avg_surgery_cost: number | null;
  hospitals_with_pricing: number;
  air_ambulance_missions: number;
  completed_missions: number;
}

export interface StateAnalytics {
  state: {
    id: string;
    name: string;
    code: string;
  };
  hospital_count: number;
  doctor_count: number;
  surgery_costs: Array<{
    category: string;
    avg_cost: number;
    min_cost: number;
    max_cost: number;
    hospital_count: number;
  }>;
  top_hospitals: Array<{
    id: string;
    name: string;
    city: string;
    rating: number;
    review_count: number;
  }>;
  hospitals: any[];
}

export async function getIndiaAnalytics(): Promise<IndiaAnalytics> {
  const response = await fetch(`${API_BASE_URL}/analytics/india`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'x-user-role': 'admin',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch India analytics');
  const data = await response.json();
  return data.data;
}

export async function getStateAnalytics(stateCode: string): Promise<StateAnalytics> {
  const response = await fetch(`${API_BASE_URL}/analytics/state/${stateCode}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'x-user-role': 'admin',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch state analytics');
  const data = await response.json();
  return data.data;
}

export async function getSurgeryCostComparison(surgeryId: string) {
  const response = await fetch(`${API_BASE_URL}/analytics/surgery/${surgeryId}/comparison`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch surgery cost comparison');
  const data = await response.json();
  return data.data;
}

export async function getTopAffordableHospitals(surgeryId: string, limit = 10) {
  const response = await fetch(`${API_BASE_URL}/analytics/surgery/${surgeryId}/affordable?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch affordable hospitals');
  const data = await response.json();
  return data.data;
}

export async function getTopRatedHospitals(limit = 10) {
  const response = await fetch(`${API_BASE_URL}/analytics/hospitals/top-rated?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch top rated hospitals');
  const data = await response.json();
  return data.data;
}

export async function getMonthlyStatewiseReport(stateCode?: string, month?: number, year?: number) {
  const params = new URLSearchParams();
  if (stateCode) params.append('stateCode', stateCode);
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  
  const response = await fetch(`${API_BASE_URL}/analytics/reports/monthly?${params}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'x-user-role': 'admin',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch monthly report');
  const data = await response.json();
  return data.data;
}

