// Mock data for appointments
export interface Appointment {
  id: string
  provider: string
  specialty: string
  date: string
  time: string
  location: string
  type: 'in-person' | 'virtual'
  status: 'upcoming' | 'confirmed' | 'pending'
}

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    provider: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: 'Tomorrow, Dec 15',
    time: '10:00 AM',
    location: '123 Medical Center Dr',
    type: 'virtual',
    status: 'confirmed',
  },
  {
    id: '2',
    provider: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    date: 'Dec 18, 2024',
    time: '2:30 PM',
    location: '456 Health Plaza',
    type: 'in-person',
    status: 'upcoming',
  },
]

// Mock data for messages
export interface Message {
  id: string
  from: string
  preview: string
  time: string
  unread: boolean
}

export const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Dr. Sarah Johnson',
    preview: 'Your test results are ready for review',
    time: '2h ago',
    unread: true,
  },
  {
    id: '2',
    from: 'MediAR Support',
    preview: 'Reminder: Appointment tomorrow at 10 AM',
    time: '5h ago',
    unread: true,
  },
  {
    id: '3',
    from: 'Dr. Michael Chen',
    preview: 'Follow-up on your skin check results',
    time: '1d ago',
    unread: false,
  },
]

// Hospital and Doctor data
export interface Doctor {
  id: string
  name: string
  specialty: string
  hospitalId: string
  hospitalName: string
  rating: number
  reviewCount: number
  experience: number
  qualifications: string[]
  languages: string[]
  availability: string
  nextSlot: string
  type: 'virtual' | 'in-person' | 'both'
  image?: string
  bio?: string
  consultationFee: number
}

export interface Hospital {
  id: string
  name: string
  state: string
  city: string
  address: string
  rating: number
  reviewCount: number
  facilities: string[]
  specialties: string[]
  emergencyAvailable: boolean
  ambulanceAvailable: boolean
  phone: string
  image?: string
  coordinates?: {
    lat: number
    lng: number
  }
  beds: number
  icuBeds: number
  establishedYear: number
}

export interface SurgeryCost {
  id: string
  name: string
  category: string
  avgCost: number
  costRange: {
    min: number
    max: number
  }
  hospitalId?: string
  hospitalName?: string
}

export const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Apollo Hospitals',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Mathura Road, Sarita Vihar, New Delhi',
    rating: 4.8,
    reviewCount: 1234,
    facilities: ['24/7 Emergency', 'ICU', 'MRI', 'CT Scan', 'Cardiac Cath Lab', 'Ambulance Service'],
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Gastroenterology'],
    emergencyAvailable: true,
    ambulanceAvailable: true,
    phone: '+91-11-2692-5800',
    beds: 500,
    icuBeds: 75,
    establishedYear: 1996,
    coordinates: { lat: 28.5446, lng: 77.2889 },
  },
  {
    id: '2',
    name: 'Fortis Healthcare',
    state: 'Maharashtra',
    city: 'Mumbai',
    address: 'Mulund Goregaon Link Road, Mulund West, Mumbai',
    rating: 4.7,
    reviewCount: 987,
    facilities: ['24/7 Emergency', 'ICU', 'NICU', 'Robotic Surgery', 'Ambulance Service'],
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Orthopedics', 'Transplant'],
    emergencyAvailable: true,
    ambulanceAvailable: true,
    phone: '+91-22-4925-4925',
    beds: 300,
    icuBeds: 50,
    establishedYear: 2001,
    coordinates: { lat: 19.1654, lng: 72.9470 },
  },
  {
    id: '3',
    name: 'AIIMS Delhi',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Ansari Nagar, New Delhi',
    rating: 4.9,
    reviewCount: 3456,
    facilities: ['24/7 Emergency', 'ICU', 'Trauma Center', 'Research Labs', 'Ambulance Service'],
    specialties: ['All Specialties', 'Research', 'Teaching Hospital'],
    emergencyAvailable: true,
    ambulanceAvailable: true,
    phone: '+91-11-2658-8500',
    beds: 2000,
    icuBeds: 300,
    establishedYear: 1956,
    coordinates: { lat: 28.5670, lng: 77.2070 },
  },
  {
    id: '4',
    name: 'Manipal Hospitals',
    state: 'Karnataka',
    city: 'Bangalore',
    address: '98, HAL Old Airport Road, Bangalore',
    rating: 4.6,
    reviewCount: 856,
    facilities: ['24/7 Emergency', 'ICU', 'MRI', 'CT Scan', 'Ambulance Service'],
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    emergencyAvailable: true,
    ambulanceAvailable: true,
    phone: '+91-80-2502-4444',
    beds: 400,
    icuBeds: 60,
    establishedYear: 1991,
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: '5',
    name: 'Max Healthcare',
    state: 'Haryana',
    city: 'Gurgaon',
    address: 'Sector 56, Gurgaon',
    rating: 4.5,
    reviewCount: 654,
    facilities: ['24/7 Emergency', 'ICU', 'NICU', 'Ambulance Service'],
    specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'],
    emergencyAvailable: true,
    ambulanceAvailable: true,
    phone: '+91-124-4256-900',
    beds: 250,
    icuBeds: 40,
    establishedYear: 2001,
    coordinates: { lat: 28.4089, lng: 77.0731 },
  },
]

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    hospitalId: '1',
    hospitalName: 'Apollo Hospitals',
    rating: 4.9,
    reviewCount: 234,
    experience: 15,
    qualifications: ['MBBS', 'MD Cardiology', 'DM Cardiology'],
    languages: ['English', 'Hindi'],
    availability: 'Available now',
    nextSlot: '10:00 AM',
    type: 'both',
    bio: 'Specialized in interventional cardiology with 15+ years of experience',
    consultationFee: 1500,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    hospitalId: '2',
    hospitalName: 'Fortis Healthcare',
    rating: 4.8,
    reviewCount: 187,
    experience: 12,
    qualifications: ['MBBS', 'MD Dermatology'],
    languages: ['English', 'Hindi', 'Mandarin'],
    availability: 'Available in 2 hours',
    nextSlot: '2:00 PM',
    type: 'both',
    bio: 'Expert in cosmetic and medical dermatology',
    consultationFee: 1200,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'General Practitioner',
    hospitalId: '3',
    hospitalName: 'AIIMS Delhi',
    rating: 4.7,
    reviewCount: 456,
    experience: 10,
    qualifications: ['MBBS', 'MD General Medicine'],
    languages: ['English', 'Hindi', 'Spanish'],
    availability: 'Available tomorrow',
    nextSlot: '9:00 AM',
    type: 'in-person',
    bio: 'Comprehensive primary care physician',
    consultationFee: 800,
  },
  {
    id: '4',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    hospitalId: '1',
    hospitalName: 'Apollo Hospitals',
    rating: 4.9,
    reviewCount: 312,
    experience: 20,
    qualifications: ['MBBS', 'MD Cardiology', 'DM Cardiology', 'FACC'],
    languages: ['English', 'Hindi'],
    availability: 'Available now',
    nextSlot: '11:00 AM',
    type: 'both',
    bio: 'Senior cardiologist with expertise in cardiac surgery',
    consultationFee: 2000,
  },
  {
    id: '5',
    name: 'Dr. Priya Sharma',
    specialty: 'Neurologist',
    hospitalId: '4',
    hospitalName: 'Manipal Hospitals',
    rating: 4.6,
    reviewCount: 145,
    experience: 8,
    qualifications: ['MBBS', 'MD Neurology'],
    languages: ['English', 'Hindi', 'Kannada'],
    availability: 'Available in 3 hours',
    nextSlot: '3:00 PM',
    type: 'both',
    bio: 'Specialized in stroke management and epilepsy',
    consultationFee: 1800,
  },
]

export const mockSurgeryCosts: SurgeryCost[] = [
  {
    id: '1',
    name: 'Angioplasty',
    category: 'Cardiac',
    avgCost: 250000,
    costRange: { min: 150000, max: 400000 },
  },
  {
    id: '2',
    name: 'Cataract Surgery',
    category: 'Ophthalmology',
    avgCost: 35000,
    costRange: { min: 20000, max: 60000 },
  },
  {
    id: '3',
    name: 'Knee Replacement',
    category: 'Orthopedics',
    avgCost: 300000,
    costRange: { min: 200000, max: 500000 },
  },
  {
    id: '4',
    name: 'Hip Replacement',
    category: 'Orthopedics',
    avgCost: 350000,
    costRange: { min: 250000, max: 550000 },
  },
  {
    id: '5',
    name: 'Appendectomy',
    category: 'General Surgery',
    avgCost: 50000,
    costRange: { min: 30000, max: 80000 },
  },
  {
    id: '6',
    name: 'Gallbladder Removal',
    category: 'General Surgery',
    avgCost: 60000,
    costRange: { min: 40000, max: 90000 },
  },
]

// E-Prescription data
export interface Prescription {
  id: string
  doctorName: string
  doctorSpecialty: string
  date: string
  medicines: Medicine[]
  instructions: string
  followUpDate?: string
  status: 'active' | 'completed' | 'expired'
}

export interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  available: boolean
  pharmacyPrice?: number
}

export const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialty: 'Cardiology',
    date: '2024-12-10',
    medicines: [
      {
        id: 'm1',
        name: 'Aspirin',
        dosage: '75mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food',
        available: true,
        pharmacyPrice: 250,
      },
      {
        id: 'm2',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take at bedtime',
        available: true,
        pharmacyPrice: 450,
      },
    ],
    instructions: 'Take medications as prescribed. Follow up in 30 days.',
    followUpDate: '2025-01-10',
    status: 'active',
  },
]

// Lab Test data
export interface LabTest {
  id: string
  name: string
  category: string
  description: string
  price: number
  preparation: string
  duration: string
  available: boolean
}

export interface LabBooking {
  id: string
  testId: string
  testName: string
  date: string
  time: string
  labName: string
  address: string
  status: 'scheduled' | 'completed' | 'cancelled'
  results?: LabResult
}

export interface LabResult {
  id: string
  testName: string
  date: string
  values: LabValue[]
  aiSummary?: string
  recommendations?: string
}

export interface LabValue {
  parameter: string
  value: string
  unit: string
  normalRange: string
  status: 'normal' | 'abnormal' | 'critical'
}

export const mockLabTests: LabTest[] = [
  {
    id: '1',
    name: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    description: 'Complete blood count including RBC, WBC, platelets, hemoglobin',
    price: 500,
    preparation: 'Fasting not required',
    duration: '30 minutes',
    available: true,
  },
  {
    id: '2',
    name: 'Liver Function Test (LFT)',
    category: 'Blood Test',
    description: 'Comprehensive liver function panel',
    price: 800,
    preparation: 'Fasting required (8-12 hours)',
    duration: '30 minutes',
    available: true,
  },
  {
    id: '3',
    name: 'Kidney Function Test (KFT)',
    category: 'Blood Test',
    description: 'Kidney function assessment',
    price: 600,
    preparation: 'Fasting required (8-12 hours)',
    duration: '30 minutes',
    available: true,
  },
  {
    id: '4',
    name: 'Lipid Profile',
    category: 'Blood Test',
    description: 'Cholesterol and triglyceride levels',
    price: 700,
    preparation: 'Fasting required (12 hours)',
    duration: '30 minutes',
    available: true,
  },
  {
    id: '5',
    name: 'ECG',
    category: 'Diagnostic',
    description: 'Electrocardiogram for heart rhythm',
    price: 400,
    preparation: 'No special preparation',
    duration: '15 minutes',
    available: true,
  },
]

export const mockLabBookings: LabBooking[] = [
  {
    id: '1',
    testId: '1',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-12-15',
    time: '10:00 AM',
    labName: 'Apollo Diagnostics',
    address: '123 Medical Center Dr, New Delhi',
    status: 'scheduled',
  },
]

export const mockLabResults: LabResult[] = [
  {
    id: '1',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-12-05',
    values: [
      {
        parameter: 'Hemoglobin',
        value: '14.5',
        unit: 'g/dL',
        normalRange: '13.5 - 17.5',
        status: 'normal',
      },
      {
        parameter: 'WBC Count',
        value: '7200',
        unit: '/μL',
        normalRange: '4000 - 11000',
        status: 'normal',
      },
      {
        parameter: 'Platelet Count',
        value: '250000',
        unit: '/μL',
        normalRange: '150000 - 450000',
        status: 'normal',
      },
    ],
    aiSummary: 'All parameters are within normal range. No abnormalities detected.',
    recommendations: 'Continue current health regimen. Next test recommended in 6 months.',
  },
]

// AI Health Programs data
export interface HealthProgram {
  id: string
  name: string
  category: 'chronic-care' | 'fitness' | 'rehab' | 'mental-wellness'
  description: string
  duration: string
  enrolled: boolean
  progress: number
  status: 'active' | 'completed' | 'available'
  modules: ProgramModule[]
  aiCoachEnabled: boolean
  arExercisesEnabled: boolean
}

export interface ProgramModule {
  id: string
  title: string
  type: 'education' | 'exercise' | 'medication' | 'monitoring'
  completed: boolean
  duration: string
}

export const mockHealthPrograms: HealthProgram[] = [
  {
    id: '1',
    name: 'Diabetes Management Program',
    category: 'chronic-care',
    description: 'Personalized diabetes care plan with AI coaching and AR exercises',
    duration: '12 weeks',
    enrolled: true,
    progress: 65,
    status: 'active',
    aiCoachEnabled: true,
    arExercisesEnabled: true,
    modules: [
      { id: 'm1', title: 'Understanding Diabetes', type: 'education', completed: true, duration: '30 min' },
      { id: 'm2', title: 'Blood Sugar Monitoring', type: 'monitoring', completed: true, duration: '15 min' },
      { id: 'm3', title: 'Daily Exercise Routine', type: 'exercise', completed: false, duration: '45 min' },
      { id: 'm4', title: 'Medication Management', type: 'medication', completed: false, duration: '20 min' },
    ],
  },
  {
    id: '2',
    name: 'Cardio Fitness Program',
    category: 'fitness',
    description: 'Heart-healthy fitness program with AR-guided cardio exercises',
    duration: '8 weeks',
    enrolled: false,
    progress: 0,
    status: 'available',
    aiCoachEnabled: true,
    arExercisesEnabled: true,
    modules: [
      { id: 'm1', title: 'Cardio Basics', type: 'education', completed: false, duration: '25 min' },
      { id: 'm2', title: 'AR Cardio Workout', type: 'exercise', completed: false, duration: '30 min' },
    ],
  },
  {
    id: '3',
    name: 'Physiotherapy Rehab',
    category: 'rehab',
    description: 'Knee rehabilitation with AR ROM tracking',
    duration: '6 weeks',
    enrolled: true,
    progress: 40,
    status: 'active',
    aiCoachEnabled: true,
    arExercisesEnabled: true,
    modules: [
      { id: 'm1', title: 'ROM Assessment', type: 'monitoring', completed: true, duration: '20 min' },
      { id: 'm2', title: 'AR ROM Exercises', type: 'exercise', completed: false, duration: '45 min' },
    ],
  },
]

// Health Wallet data
export interface HealthDocument {
  id: string
  name: string
  type: 'report' | 'prescription' | 'scan' | 'lab-result' | 'vaccination'
  uploadDate: string
  category: string
  fileSize: string
  aiSummary?: string
  sharedWith?: string[]
}

export const mockHealthDocuments: HealthDocument[] = [
  {
    id: '1',
    name: 'Blood Test Report - Dec 2024',
    type: 'lab-result',
    uploadDate: '2024-12-05',
    category: 'Laboratory',
    fileSize: '2.5 MB',
    aiSummary: 'All parameters normal. Hemoglobin: 14.5 g/dL, WBC: 7200/μL',
    sharedWith: ['Dr. Sarah Johnson'],
  },
  {
    id: '2',
    name: 'Chest X-Ray - Nov 2024',
    type: 'scan',
    uploadDate: '2024-11-20',
    category: 'Radiology',
    fileSize: '5.2 MB',
    aiSummary: 'No abnormalities detected. Clear lung fields.',
    sharedWith: ['Dr. Michael Chen'],
  },
  {
    id: '3',
    name: 'Prescription - Hypertension',
    type: 'prescription',
    uploadDate: '2024-12-10',
    category: 'Prescription',
    fileSize: '0.8 MB',
    aiSummary: 'Medications: Aspirin 75mg, Atorvastatin 20mg',
  },
]

// AI Nurse Monitoring data
export interface VitalReading {
  id: string
  type: 'heart-rate' | 'blood-pressure' | 'temperature' | 'stress' | 'oxygen'
  value: number | string
  unit: string
  timestamp: string
  status: 'normal' | 'warning' | 'critical'
  alert?: string
}

export const mockVitalReadings: VitalReading[] = [
  {
    id: '1',
    type: 'heart-rate',
    value: 72,
    unit: 'bpm',
    timestamp: new Date().toISOString(),
    status: 'normal',
  },
  {
    id: '2',
    type: 'blood-pressure',
    value: '120/80',
    unit: 'mmHg',
    timestamp: new Date().toISOString(),
    status: 'normal',
  },
  {
    id: '3',
    type: 'temperature',
    value: 98.6,
    unit: '°F',
    timestamp: new Date().toISOString(),
    status: 'normal',
  },
]

// Emergency contacts
export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  isPrimary: boolean
}

export const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'John Doe',
    relationship: 'Spouse',
    phone: '+1-234-567-8900',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    relationship: 'Sibling',
    phone: '+1-234-567-8901',
    isPrimary: false,
  },
]

