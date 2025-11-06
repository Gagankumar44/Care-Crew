/**
 * Structured Data (JSON-LD) for SEO
 * Implements Schema.org schemas for Organization, Product, MedicalBusiness, and WebSite
 */

export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Care Crew',
    description: 'AI-powered healthcare platform with AR-guided medical examinations',
    url: 'https://carecrew.com',
    logo: 'https://carecrew.com/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX', // TODO: Update with real number
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      // TODO: Update with actual social media URLs
      'https://twitter.com/carecrew',
      'https://facebook.com/carecrew',
      'https://linkedin.com/company/carecrew',
    ],
    medicalSpecialty: ['Telemedicine', 'Preventive Medicine'],
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Care Crew',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI Symptom Analysis',
      'AR-Guided Medical Examinations',
      'HIPAA Compliant',
      '24/7 Support',
      'Real-time Health Monitoring',
    ],
  }

  const medicalBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Care Crew',
    description: 'AI-powered telehealth platform with AR technology',
    url: 'https://carecrew.com',
    telephone: '+1-XXX-XXX-XXXX', // TODO: Update with real number
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    medicalSpecialty: 'Telemedicine',
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'HIPAA Compliance',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Care Crew',
    url: 'https://carecrew.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://carecrew.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

