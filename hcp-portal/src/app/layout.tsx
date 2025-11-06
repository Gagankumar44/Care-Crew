import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './test-visibility.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeV2Provider } from '@/components/ThemeV2Provider'
import { QueryProvider } from '@/components/QueryProvider'
import { ConditionalClerkProvider } from '@/components/ConditionalClerkProvider'
import { StructuredData } from '@/components/StructuredData'
import { SkipLink } from '@/components/SkipLink'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Care Crew - AI-Powered AR Telehealth Platform',
  description: 'Revolutionary healthcare platform combining AI symptom analysis and AR-guided medical examinations. HIPAA compliant telehealth solution.',
  keywords: ['telehealth', 'AI healthcare', 'AR medicine', 'virtual doctor', 'health tech', 'remote healthcare', 'digital health', 'AI diagnosis', 'telemedicine'],
  authors: [{ name: 'Care Crew Team' }],
  openGraph: {
    title: 'Care Crew - AI-Powered AR Telehealth',
    description: 'Experience the future of healthcare with AI and AR technology. Get instant health guidance from anywhere.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Care Crew Healthcare Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Crew - AI-Powered AR Telehealth',
    description: 'Experience the future of healthcare with AI and AR technology',
    images: ['/og-image.png'],
  },
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
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const html = document.documentElement;
                  if (theme === 'light') {
                    html.classList.remove('dark');
                    html.classList.add('light');
                  } else {
                    html.classList.remove('light');
                    html.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} style={{ minHeight: '100vh' }}>
        <SkipLink />
        <StructuredData />
        <ConditionalClerkProvider>
          <QueryProvider>
            <ThemeV2Provider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </ThemeV2Provider>
          </QueryProvider>
        </ConditionalClerkProvider>
      </body>
    </html>
  )
}

