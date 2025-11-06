'use client'

import { motion, useInView, useAnimation } from 'framer-motion'
import { Brain, Camera, Activity, Shield, Zap, Heart, ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react'
import { useRef, useState } from 'react'
import Link from 'next/link'

const features = [
  {
    icon: Brain,
    title: 'AI Symptom Check',
    description: 'Get instant health guidance powered by advanced AI. Describe your symptoms and receive personalized recommendations.',
    fullDescription: 'Our AI analyzes your symptoms using cutting-edge medical databases, providing instant preliminary assessments with 95%+ accuracy. Get peace of mind in seconds.',
    gradient: 'from-blue-500 to-blue-600',
    stats: '95%',
    statLabel: 'Accuracy Rate',
    benefits: ['Instant Analysis', '24/7 Available', 'Privacy Protected'],
    link: '/triage',
    featured: false,
  },
  {
    icon: Camera,
    title: 'AR Skin Analysis',
    description: 'Use your phone camera to scan and analyze skin conditions with AR guidance. Get professional insights instantly.',
    fullDescription: 'Revolutionary AR technology guides you through skin examinations with overlays and measurements. AI detects potential issues early.',
    gradient: 'from-green-500 to-green-600',
    stats: '2 min',
    statLabel: 'Analysis Time',
    benefits: ['AR Guided', 'Early Detection', 'Professional Grade'],
    link: '/ar-scan',
    featured: true,
  },
  {
    icon: Activity,
    title: 'ROM Analysis',
    description: 'Track your range of motion with AR-guided exercises. Perfect for physical therapy and rehabilitation.',
    fullDescription: 'Advanced motion tracking analyzes your range of motion with precision. Ideal for post-surgery recovery and injury rehabilitation.',
    gradient: 'from-purple-500 to-purple-600',
    stats: '±1°',
    statLabel: 'Precision',
    benefits: ['Real-time Tracking', 'Progress Reports', 'PT Recommended'],
    link: '/ar-scan',
    featured: false,
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Your health data is encrypted and secure. We meet the highest standards for medical data protection.',
    fullDescription: 'Enterprise-grade security with end-to-end encryption. We comply with HIPAA, GDPR, and all major healthcare regulations.',
    gradient: 'from-emerald-500 to-emerald-600',
    stats: '100%',
    statLabel: 'Compliant',
    benefits: ['End-to-End Encryption', 'HIPAA Certified', 'GDPR Compliant'],
    link: '/settings',
    featured: false,
  },
  {
    icon: Zap,
    title: 'Virtual Health Assistant',
    description: '24/7 AI-powered health assistant ready to answer questions, schedule appointments, and provide guidance.',
    fullDescription: 'Your personal health companion available 24/7. Get answers, track symptoms, manage medications, and schedule appointments seamlessly.',
    gradient: 'from-orange-500 to-orange-600',
    stats: '< 2s',
    statLabel: 'Response Time',
    benefits: ['Always Available', 'Smart Scheduling', 'Medication Reminders'],
    link: '/assistant',
    featured: false,
  },
  {
    icon: Heart,
    title: 'Health Data Tracking',
    description: 'Monitor your vitals, medications, and health trends all in one place. Comprehensive health management.',
    fullDescription: 'Unified health dashboard tracks everything: vitals, medications, lab results, appointments, and health trends over time.',
    gradient: 'from-red-500 to-pink-600',
    stats: '10+',
    statLabel: 'Metrics Tracked',
    benefits: ['Unified Dashboard', 'Trend Analysis', 'Export Reports'],
    link: '/health-data',
    featured: false,
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const controls = useAnimation()
  const Icon = feature.icon

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }
    },
    hover: {
      y: -12,
      scale: 1.02,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }

  const iconVariants = {
    rest: { 
      scale: 1,
      rotate: 0,
    },
    hover: { 
      scale: 1.15,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={feature.featured ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative ${feature.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`relative glass-card p-8 h-full cursor-pointer overflow-hidden transition-all duration-500 ${
          feature.featured 
            ? 'bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800' 
            : 'border border-neutral-200/50 dark:border-neutral-800/50'
        }`}
        style={{
          transformStyle: 'preserve-3d',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12] rounded-3xl transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />

        {/* Featured Badge */}
        {feature.featured && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
            className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-white text-xs font-semibold shadow-lg"
          >
            <Sparkles className="w-3 h-3" />
            Featured
          </motion.div>
        )}

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-20`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${15 + i * 12}%`,
              }}
              animate={isHovered ? {
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                scale: [1, 1.5, 1],
              } : {}}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Icon with 3D Effect */}
        <motion.div
          variants={iconVariants}
          initial="rest"
          animate={isHovered ? "hover" : "rest"}
          className={`relative z-10 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-float group-hover:shadow-float-lg transition-all duration-300`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <Icon className="w-10 h-10 text-white relative z-10" />
          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50`}
            animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
          />
        </motion.div>

        {/* Stats Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="absolute top-6 right-6 text-right"
        >
          <div className={`text-3xl font-bold bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
            {feature.stats}
          </div>
          <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            {feature.statLabel}
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h3 
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-health transition-all duration-300"
          >
            {feature.title}
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
            animate={isExpanded ? { height: 'auto' } : {}}
          >
            {isExpanded ? feature.fullDescription : feature.description}
          </motion.p>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={isExpanded ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            className="space-y-2 mb-4 overflow-hidden"
          >
            {feature.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={isExpanded ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <CheckCircle2 className={`w-4 h-4 text-transparent bg-gradient-to-br ${feature.gradient} bg-clip-text`} />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Link
              href={feature.link}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/link"
              onClick={(e) => e.stopPropagation()}
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary transition-colors"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </motion.button>
          </motion.div>

          {/* Progress Indicator */}
          {isExpanded && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
              className={`mt-4 h-1 bg-gradient-to-r ${feature.gradient} rounded-full`}
            />
          )}
        </div>

        {/* Shine Effect on Hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
          animate={isHovered ? {
            x: ['-200%', '200%'],
          } : {}}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 2,
          }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="py-32 bg-white dark:bg-neutral-900 relative w-full min-h-screen overflow-hidden"
      style={{ display: 'block', position: 'relative', width: '100%', zIndex: '10' }}
    >
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[120px]"
          animate={isInView ? {
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-green-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-[120px]"
          animate={isInView ? {
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 30, 0],
          } : {}}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-7xl">
        {/* Section Header with Animation */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-20 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Revolutionary Features</span>
          </motion.div>

          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Powerful Features for{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 bg-clip-text text-transparent">
                Modern Healthcare
              </span>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            Experience the future of telehealth with cutting-edge AI and AR technology. 
            Everything you need for comprehensive health management.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: 'Active Users', value: '10K+' },
              { label: 'Health Checks', value: '50K+' },
              { label: 'Satisfaction', value: '98%' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
        >
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <span>Start Your Health Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
