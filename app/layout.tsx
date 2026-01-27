import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'JobSwipe AI - Find Your Dream Job with AI-Powered Matching',
    template: '%s | JobSwipe AI',
  },
  description: 'Revolutionary job matching platform that uses AI to connect top talent with amazing opportunities. Swipe, match, and get hired faster than ever.',
  keywords: ['job search', 'AI recruiting', 'job matching', 'career', 'hiring', 'recruitment', 'swipe jobs'],
  authors: [{ name: 'JobSwipe AI' }],
  creator: 'JobSwipe AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobswipe.ai',
    siteName: 'JobSwipe AI',
    title: 'JobSwipe AI - Find Your Dream Job with AI-Powered Matching',
    description: 'Revolutionary job matching platform that uses AI to connect top talent with amazing opportunities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobSwipe AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSwipe AI - Find Your Dream Job with AI-Powered Matching',
    description: 'Revolutionary job matching platform that uses AI to connect top talent with amazing opportunities.',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(142.1 76.2% 36.3%)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(0 84.2% 60.2%)',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
