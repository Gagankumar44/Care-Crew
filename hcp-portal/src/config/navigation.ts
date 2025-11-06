/**
 * Navigation Configuration
 * Centralized navigation structure for easy management
 */

import { 
  LayoutDashboard, 
  MessageSquare, 
  Sparkles, 
  Activity, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Stethoscope, 
  MapPin, 
  AlertCircle, 
  Bell, 
  Settings,
  Plus,
  Heart,
  TestTube,
  ClipboardList,
  Building2,
  DollarSign,
  BarChart3,
  Shield,
  Plane,
  Globe,
  Target,
  Pill,
  Wallet,
  Radio,
  Users,
  QrCode
} from 'lucide-react'
import { createIconComponent } from '@/components/ui/IconWrapper'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
  description?: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

/**
 * Quick Actions - Frequently used features
 */
export const quickActions: NavItem[] = [
  { 
    href: '/ar-scan?type=skin', 
    label: 'Skin Check', 
    icon: Sparkles,
    description: 'AR-powered skin analysis'
  },
  { 
    href: '/ar-scan?type=rom', 
    label: 'ROM Analysis', 
    icon: Activity,
    description: 'Range of motion measurement'
  },
  { 
    href: '/appointments/new', 
    label: 'New Appointment', 
    icon: createIconComponent('appointment-calendar', 20),
    description: 'Schedule a consultation'
  },
]

/**
 * Main Navigation Groups
 */
export const navigationGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { 
        href: '/dashboard', 
        label: 'Dashboard', 
        icon: LayoutDashboard,
        description: 'Your health overview'
      },
    ]
  },
  {
    title: 'Communication',
    items: [
      { 
        href: '/messages', 
        label: 'Messages', 
        icon: createIconComponent('chat-medical-support', 20),
        badge: '3',
        description: 'Chat with providers'
      },
      { 
        href: '/assistant', 
        label: 'AI Assistant', 
        icon: createIconComponent('ai-brain-circuit', 20),
        description: 'AI-powered health assistant'
      },
    ]
  },
  {
    title: 'Health Tools',
    items: [
      { 
        href: '/ar-scan', 
        label: 'AR Check', 
        icon: createIconComponent('ar-scan-camera-person', 20),
        description: 'AR-guided health checks'
      },
      { 
        href: '/triage', 
        label: 'Symptom Check', 
        icon: Activity,
        description: 'AI symptom assessment'
      },
      { 
        href: '/vitals', 
        label: 'Vital Measurements', 
        icon: createIconComponent('ecg-heartbeat', 20),
        description: 'Track your vitals'
      },
      { 
        href: '/ai-nurse-monitoring', 
        label: 'AI-Nurse Monitoring', 
        icon: Radio,
        description: '24x7 live health monitoring'
      },
      { 
        href: '/lab-tests', 
        label: 'Lab Tests & Scans', 
        icon: createIconComponent('lab-test-microscope', 20),
        description: 'Book tests and view results'
      },
      { 
        href: '/health-programs', 
        label: 'Health Programs', 
        icon: Target,
        description: 'AI-guided care plans'
      },
    ]
  },
  {
    title: 'Health Records',
    items: [
      { 
        href: '/health-report', 
        label: 'Health Report', 
        icon: createIconComponent('health-report-pdf', 20),
        description: 'Comprehensive health report'
      },
      { 
        href: '/reports', 
        label: 'Reports & Scans', 
        icon: ClipboardList,
        description: 'View all medical reports'
      },
      { 
        href: '/health-wallet', 
        label: 'Health Wallet', 
        icon: Wallet,
        description: 'Secure health records vault'
      },
      { 
        href: '/health-trends', 
        label: 'Health Trends', 
        icon: TrendingUp,
        description: 'Track your health trends'
      },
      { 
        href: '/health-data', 
        label: 'Health Data', 
        icon: BarChart3,
        description: 'Detailed health metrics'
      },
    ]
  },
  {
    title: 'Appointments',
    items: [
      { 
        href: '/appointments', 
        label: 'Appointments', 
        icon: createIconComponent('appointment-calendar', 20),
        badge: '2',
        description: 'Manage appointments'
      },
      { 
        href: '/prescriptions', 
        label: 'E-Prescriptions', 
        icon: createIconComponent('prescription-rx', 20),
        description: 'View prescriptions and order medicines'
      },
    ]
  },
  {
    title: 'Healthcare Providers',
    items: [
      { 
        href: '/hospitals', 
        label: 'Hospital Directory', 
        icon: createIconComponent('hospital-building', 20),
        description: 'Find hospitals'
      },
      { 
        href: '/doctors', 
        label: 'Doctors', 
        icon: createIconComponent('doctor-profile-new', 20),
        description: 'Browse healthcare providers'
      },
      { 
        href: '/triage-referral', 
        label: 'AI Hospital Referral', 
        icon: Sparkles,
        description: 'Get AI-powered referrals'
      },
    ]
  },
  {
    title: 'Healthcare Costs',
    items: [
      { 
        href: '/surgery-costs', 
        label: 'Surgery Costs', 
        icon: DollarSign,
        description: 'Estimate surgery costs'
      },
      { 
        href: '/hospital-cost-comparison', 
        label: 'Cost Comparison', 
        icon: TrendingUp,
        description: 'Compare healthcare costs'
      },
    ]
  },
  {
    title: 'Locations',
    items: [
      { 
        href: '/hospital-map', 
        label: 'Hospital Map', 
        icon: createIconComponent('map-hospital-locator', 20),
        description: 'Find nearby hospitals'
      },
    ]
  },
  {
    title: 'System',
    items: [
      { 
        href: '/emergency', 
        label: 'Emergency', 
        icon: createIconComponent('emergency-siren', 20),
        description: 'Emergency services with ICE contacts'
      },
      { 
        href: '/notifications', 
        label: 'Notifications', 
        icon: Bell,
        badge: '5',
        description: 'View notifications'
      },
      { 
        href: '/settings', 
        label: 'Settings', 
        icon: Settings,
        description: 'Account settings'
      },
    ]
  },
  {
    title: 'Administration',
    items: [
      { 
        href: '/admin/dashboard', 
        label: 'Admin Dashboard', 
        icon: Shield,
        description: 'India-level control and analytics'
      },
      { 
        href: '/admin/state-admin', 
        label: 'State Admin Portal', 
        icon: Shield,
        description: 'State-level hospital management'
      },
      { 
        href: '/admin/hospital-registry', 
        label: 'Hospital Registry', 
        icon: Building2,
        description: 'National hospital registry control'
      },
      { 
        href: '/admin/air-ambulance', 
        label: 'Air Ambulance Dashboard', 
        icon: Plane,
        description: 'Mission tracking and management'
      },
      { 
        href: '/admin/surgery-analytics', 
        label: 'Surgery Demand Analytics', 
        icon: Target,
        description: 'Predictive surgery demand analytics'
      },
      { 
        href: '/admin/multi-state-control', 
        label: 'Multi-State Control', 
        icon: Globe,
        description: 'Full multi-state hospital control'
      },
    ]
  },
  {
    title: 'Role-Based Dashboards',
    items: [
      { 
        href: '/state-dashboard', 
        label: 'State Dashboard', 
        icon: Globe,
        description: 'Regional health administration'
      },
      { 
        href: '/hospital-dashboard', 
        label: 'Hospital Dashboard', 
        icon: Building2,
        description: 'Hospital management portal'
      },
      { 
        href: '/doctor-dashboard', 
        label: 'Doctor Dashboard', 
        icon: Users,
        description: 'Appointments and patient records'
      },
    ]
  },
  {
    title: 'Hospital Services',
    items: [
      { 
        href: '/hospital-finder', 
        label: 'Hospital Finder', 
        icon: Building2,
        description: 'Find hospitals with advanced filters'
      },
      { 
        href: '/hospital-cost-comparison', 
        label: 'Cost Comparison', 
        icon: DollarSign,
        description: 'Compare surgery costs'
      },
      { 
        href: '/surgery-costs', 
        label: 'Surgery Costs', 
        icon: DollarSign,
        description: 'View surgery cost estimates'
      },
      { 
        href: '/air-ambulance-request', 
        label: 'Request Air Ambulance', 
        icon: Plane,
        description: 'Emergency air transport'
      },
    ]
  },
]

/**
 * Get all navigation items flattened
 */
export function getAllNavItems(): NavItem[] {
  return navigationGroups.flatMap(group => group.items)
}

/**
 * Get navigation item by href
 */
export function getNavItemByHref(href: string): NavItem | undefined {
  return getAllNavItems().find(item => item.href === href)
}

/**
 * Get navigation groups for sidebar
 */
export function getNavigationGroups(): NavGroup[] {
  return navigationGroups
}

/**
 * Get quick actions
 */
export function getQuickActions(): NavItem[] {
  return quickActions
}

