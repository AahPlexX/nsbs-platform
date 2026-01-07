import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'The National Society of Business Sciences',
    template: '%s | NSBS',
  },
  description:
    'The National Society of Business Sciences - Advancing knowledge and excellence in business education and research.',
  keywords: [
    'business sciences',
    'business education',
    'professional development',
    'business research',
  ],
  authors: [{ name: 'The National Society of Business Sciences' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'The National Society of Business Sciences',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
