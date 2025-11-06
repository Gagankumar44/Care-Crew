'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Brain,
  MapPin,
  Camera,
  Mic,
  Users,
  Bot,
  Building2,
  Dna,
  Trophy,
  Stethoscope,
  Lock,
  WifiOff,
  Pill,
  FileText,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Activity,
  Heart,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Advanced Features Section
 * Organized by category with working buttons and integrations
 */

// Feature categories with organized features
const featureCategories = [
  {
    id: 'ai-intelligence',
    title: 'AI & Intelligence',
    icon: Brain,
    color: 'from-blue-500 to-blue-600',
    features: [
      {
        icon: Brain,
        title: 'Neural-Care Mode',
        subtitle: 'Continuous AI Health Guardian',
        description: 'Always-on health context memory that detects patterns across symptoms, scans, vitals, sleep, stress, and labs. Proactive alerts like "You\'ve had 3 headaches in 5 days & slept <6 hrs. Risk: tension migraine spike."',
        highlights: [
          'Pattern detection across all health data',
          'Proactive risk alerts',
          '24/7 health monitoring',
        ],
        cta: { text: 'Learn More', href: '/features/neural-care' },
        badge: 'AI-Powered',
      },
      {
        icon: Mic,
        title: 'Voice-First Medical Assistant',
        subtitle: 'Talk Faster Than You Type',
        description: 'Voice history of symptoms, doctor notes narration to text, and voice emergency mode: "Help — chest pain!" triggers emergency flow instantly.',
        highlights: [
          'Voice symptom timeline',
          'Notes to text conversion',
          'Emergency voice activation',
        ],
        cta: { text: 'Try Voice Mode', href: '/features/voice-assistant' },
        badge: 'New',
      },
      {
        icon: Stethoscope,
        title: 'Doctor AI Co-Pilot',
        subtitle: 'Time-Saving Medical Assistant',
        description: 'Auto note-taking from patient audio, convert visits to structured SOAP notes, prescription suggestions, and risk alerts based on symptom history.',
        highlights: [
          'Auto SOAP note generation',
          'Smart prescription suggestions',
          'Clinical decision support',
        ],
        cta: { text: 'For Doctors', href: '/doctors/ai-copilot' },
        badge: 'Pro',
      },
      {
        icon: Dna,
        title: 'Genomic + Lifestyle Digital Twin',
        subtitle: 'Preview Your Health Future',
        description: 'AI + lifestyle survey to show predictions: metabolic health risk score, sleep burnout trajectory, stress-strain curve, and nutrition recommendations.',
        highlights: [
          'Health risk predictions',
          'Lifestyle optimization',
          'Personalized insights',
        ],
        cta: { text: 'Create Digital Twin', href: '/features/digital-twin' },
        badge: 'Beta',
      },
    ],
  },
  {
    id: 'patient-tools',
    title: 'Patient Tools',
    icon: Activity,
    color: 'from-green-500 to-green-600',
    features: [
      {
        icon: Camera,
        title: 'AI Medical Camera + 3D Body Scan',
        subtitle: 'Full Body Health Tracking',
        description: 'Full body scan model (3D mesh), track posture, swelling changes, wound healing progress. AI monitors skin lesions: "This mole changed shape by 8%. Recheck recommended."',
        highlights: [
          '3D body mesh tracking',
          'Wound healing monitoring',
          'Skin lesion AI analysis',
        ],
        cta: { text: 'Start Scan', href: '/ar-scan' },
        badge: 'AR',
      },
      {
        icon: Pill,
        title: 'Smart Medicine Scanner',
        subtitle: 'Scan, Identify, Track',
        description: 'Scan tablet strip: AI recognizes medicine, shows dosage/warnings, detects conflicts with history, reminds when to take, and detects expired/counterfeit pills.',
        highlights: [
          'Medicine recognition',
          'Dosage tracking',
          'Drug interaction alerts',
        ],
        cta: { text: 'Scan Medicine', href: '/features/medicine-scanner' },
        badge: 'Smart',
      },
      {
        icon: TrendingUp,
        title: 'Personal Health Performance Score',
        subtitle: 'Health Credit Score',
        description: 'Like a credit score but for health. Breakdown: Activity, Sleep, Stress, Labs, Lifestyle, Preventive scans. Unlock badges & get personalized recommendations.',
        highlights: [
          'Comprehensive health score',
          'Badge system',
          'Personalized recommendations',
        ],
        cta: { text: 'View Score', href: '/dashboard/health-score' },
        badge: 'Insights',
      },
    ],
  },
  {
    id: 'family-social',
    title: 'Family & Social Care',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    features: [
      {
        icon: Users,
        title: 'Care-Circle System',
        subtitle: 'Family Health Platform',
        description: 'Add family members + emergency network. Parents\' health monitored remotely, share reports between family, AI alerts family in risk events. Becomes family care platform.',
        highlights: [
          'Multi-user health tracking',
          'Family alerts',
          'Shared health reports',
        ],
        cta: { text: 'Invite Family', href: '/features/care-circle' },
        badge: 'Family',
      },
      {
        icon: Bot,
        title: 'Virtual Nurse Avatar',
        subtitle: '3D/AR Health Guide',
        description: '3D/AR guide assistant for medicine reminders, exercise coaching (ROM tracking), mental wellness breathing AR bubbles, and guided recovery programs.',
        highlights: [
          '3D AR nurse avatar',
          'Exercise coaching',
          'Mental wellness support',
        ],
        cta: { text: 'Meet Your Nurse', href: '/features/virtual-nurse' },
        badge: 'AR',
      },
    ],
  },
  {
    id: 'hospital-integration',
    title: 'Hospital Integration',
    icon: Building2,
    color: 'from-orange-500 to-orange-600',
    features: [
      {
        icon: MapPin,
        title: 'Live Doctor Map + Walk-in Queue',
        subtitle: 'Uber for Doctors',
        description: 'Real-time map of doctors & clinics with instant queue booking. Find real-time available doctors with live queue and walk-in tokens. Like Ola/Uber but for healthcare.',
        highlights: [
          'Real-time doctor availability',
          'Instant queue booking',
          'Walk-in token system',
        ],
        cta: { text: 'Find Doctors', href: '/find-doctors' },
        badge: 'Live',
      },
      {
        icon: Building2,
        title: 'Digital Hospital Lobby',
        subtitle: 'Hospital From Home',
        description: 'Before real visit: Pre-check health via AI, fill forms, submit reports, get assigned doctor queue token. User feels like they entered hospital from home.',
        highlights: [
          'Pre-visit health check',
          'Digital form filling',
          'Queue token assignment',
        ],
        cta: { text: 'Enter Lobby', href: '/hospital-lobby' },
        badge: 'Hospital',
      },
    ],
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    icon: Shield,
    color: 'from-emerald-500 to-emerald-600',
    features: [
      {
        icon: Lock,
        title: 'Zero-Knowledge Medical Locker',
        subtitle: 'Future-Proof Privacy',
        description: 'User controls keys → even platform can\'t peek without consent. End-to-end encryption vault with safe sharing with doctors/family via expiring links.',
        highlights: [
          'End-to-end encryption',
          'User-controlled keys',
          'Expiring share links',
        ],
        cta: { text: 'Learn Security', href: '/security' },
        badge: 'Secure',
      },
      {
        icon: WifiOff,
        title: 'Offline-First Micro-Health Kit',
        subtitle: 'Rural Health Solution',
        description: 'App caches basics offline. When network returns → sync with doctors. Printable first-aid QR card. Portable vitals kit integration ready.',
        highlights: [
          'Offline functionality',
          'Auto-sync on reconnect',
          'Printable QR cards',
        ],
        cta: { text: 'Offline Mode', href: '/features/offline-kit' },
        badge: 'Offline',
      },
    ],
  },
  {
    id: 'gamification',
    title: 'Gamification & Engagement',
    icon: Trophy,
    color: 'from-yellow-500 to-yellow-600',
    features: [
      {
        icon: Trophy,
        title: 'Gamified Health Universe',
        subtitle: 'Earn Health Coins',
        description: 'Earn health coins for steps, scans, checkups, uploading reports, breathing exercises. Redeem for consultation discounts, lab test coupons, pharmacy cashback.',
        highlights: [
          'Health coin rewards',
          'Multiple earning ways',
          'Redeemable rewards',
        ],
        cta: { text: 'Start Earning', href: '/gamification' },
        badge: 'Fun',
      },
    ],
  },
  {
    id: 'practical-tools',
    title: 'Practical Tools',
    icon: FileText,
    color: 'from-pink-500 to-pink-600',
    features: [
      {
        icon: FileText,
        title: 'AI Insurance & Bill Decoder',
        subtitle: 'Transparent Healthcare Costs',
        description: 'Upload hospital bill → AI explains charges, medical codes, suggests cheaper hospitals. Insurance doc OCR: "This claim can be approved, missing discharge summary."',
        highlights: [
          'Bill analysis',
          'Cost transparency',
          'Insurance claim help',
        ],
        cta: { text: 'Decode Bill', href: '/features/bill-decoder' },
        badge: 'AI',
      },
    ],
  },
]

function FeatureCard({ 
  feature, 
  categoryColor, 
  index 
}: { 
  feature: typeof featureCategories[0]['features'][0]
  categoryColor: string
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="group relative h-full"
    >
      <div className="relative glass-card p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 h-full transition-all duration-300 hover:shadow-glass-lg hover:border-primary/30">
        {/* Gradient Background on Hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${categoryColor} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
          aria-hidden="true"
        />

        {/* Badge */}
        {feature.badge && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor} text-white text-xs font-semibold mb-4`}
          >
            <Sparkles className="w-3 h-3" />
            {feature.badge}
          </motion.div>
        )}

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className={`w-16 h-16 bg-gradient-to-br ${categoryColor} rounded-2xl flex items-center justify-center mb-4 shadow-float group-hover:shadow-float-lg transition-all duration-300`}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-sm font-medium text-primary mb-3">
            {feature.subtitle}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {feature.description}
          </p>

          {/* Highlights */}
          <ul className="space-y-2 mb-6">
            {feature.highlights.map((highlight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ delay: index * 0.1 + 0.3 + idx * 0.05 }}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <CheckCircle2 className="w-4 h-4 text-health flex-shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            asChild
            variant="outline"
            className={`group w-full sm:w-auto border-2 hover:border-primary/50 bg-white/50 dark:bg-neutral-900/50`}
            onClick={() => {
              // Analytics tracking can be added here
              console.log(`Feature clicked: ${feature.title}`)
            }}
          >
            <Link href={feature.cta.href}>
              {feature.cta.text}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export function AdvancedFeatures() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-24 md:py-32 bg-gradient-to-b from-white via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 relative overflow-hidden"
      aria-label="Advanced features section"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-health/5" aria-hidden="true" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Healthcare Features</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-health to-accent bg-clip-text text-transparent">
              Revolutionary
            </span>{' '}
            <span className="text-gray-900 dark:text-white">
              Healthcare Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Experience the future of healthcare with AI-powered tools, AR technology, and innovative features designed to transform your health journey.
          </p>
        </motion.div>

        {/* Feature Categories */}
        <div className="space-y-20 sm:space-y-24">
          {featureCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
                className="relative"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-float`}
                  >
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {category.features.map((feature, featureIndex) => (
                    <FeatureCard
                      key={feature.title}
                      feature={feature}
                      categoryColor={category.color}
                      index={categoryIndex * 10 + featureIndex}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 sm:mt-20"
        >
          <Button
            asChild
            variant="gradient"
            size="lg"
            className="group"
          >
            <Link href="/auth/register">
              Explore All Features
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Start your free trial • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  )
}

