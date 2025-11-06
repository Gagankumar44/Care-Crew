import type { Metadata } from 'next'

/**
 * SEO Metadata for Landing Page
 * Optimized for conversion and search engine visibility
 */
export const metadata: Metadata = {
  title: 'Care Crew - AI-Powered AR Healthcare Platform | Transform Telehealth',
  description: 'Experience the future of healthcare with AI-powered symptom analysis and AR-guided medical examinations. Trusted by 50,000+ patients. HIPAA compliant. Start free trial.',
  keywords: [
    'telehealth',
    'AI healthcare',
    'AR medical',
    'remote consultation',
    'symptom analysis',
    'healthcare technology',
    'telemedicine platform',
    'virtual healthcare',
    'AI symptom checker',
    'AR medical scanning',
    'health tech',
    'digital health',
    'virtual doctor',
    'AI diagnosis',
  ],
  authors: [{ name: 'Care Crew' }],
  creator: 'Care Crew',
  publisher: 'Care Crew',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://carecrew.com',
    siteName: 'Care Crew',
    title: 'Care Crew - AI-Powered AR Healthcare Platform',
    description: 'Transform healthcare with AI and AR technology. Get instant medical assessments from home.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Care Crew - AI-Powered AR Healthcare Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Crew - AI-Powered AR Healthcare',
    description: 'Experience the future of telehealth with AI and AR.',
    images: ['/twitter-card.jpg'],
    creator: '@carecrew',
  },
  alternates: {
    canonical: 'https://carecrew.com',
  },
  category: 'Healthcare Technology',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

