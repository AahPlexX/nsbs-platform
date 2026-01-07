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
  description: 'Professional development and certification for business professionals',
  keywords: ['business', 'certification', 'professional development', 'NSBS'],
  authors: [{ name: 'The National Society of Business Sciences' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nsbs.org',
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
