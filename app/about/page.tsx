import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About NSBS',
  description:
    'Learn about The National Society of Business Sciences, our mission, and commitment to advancing business education.',
}

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            NSBS
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>
            <Link href="/coursecatalog" className="text-sm hover:underline">
              Courses
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight">
            About The National Society of Business Sciences
          </h1>

          <div className="mt-8 space-y-6 text-lg text-gray-700">
            <p>
              The National Society of Business Sciences (NSBS) is dedicated to
              advancing excellence in business education, research, and
              professional development. We provide world-class certification
              programs that equip professionals with the knowledge and skills
              needed to excel in today's dynamic business environment.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p>
              To elevate the practice and understanding of business sciences
              through rigorous education, innovative research, and professional
              certification programs that serve individuals, organizations, and
              society.
            </p>

            <h2 className="mt-12 text-2xl font-bold text-gray-900">
              Our Values
            </h2>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Excellence:</strong> We maintain the highest standards
                in our educational programs and certifications.
              </li>
              <li>
                <strong>Integrity:</strong> We operate with transparency,
                honesty, and ethical principles in all our activities.
              </li>
              <li>
                <strong>Innovation:</strong> We embrace new ideas and
                methodologies to stay at the forefront of business sciences.
              </li>
              <li>
                <strong>Inclusivity:</strong> We provide accessible,
                high-quality education to professionals from all backgrounds.
              </li>
              <li>
                <strong>Impact:</strong> We focus on practical, applicable
                knowledge that creates real value in professional practice.
              </li>
            </ul>

            <h2 className="mt-12 text-2xl font-bold text-gray-900">
              What We Offer
            </h2>
            <p>
              NSBS provides comprehensive professional certification programs
              across multiple business disciplines, including:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Business Analytics and Intelligence</li>
              <li>Strategic Planning and Management</li>
              <li>Digital Transformation Leadership</li>
              <li>Project Management and Agile Methodologies</li>
              <li>Financial Forecasting and Modeling</li>
              <li>Change Management and Organizational Development</li>
            </ul>

            <h2 className="mt-12 text-2xl font-bold text-gray-900">
              Our Commitment
            </h2>
            <p>
              We are committed to maintaining the highest academic and
              professional standards while ensuring our programs remain
              accessible and relevant to modern business challenges. Our
              certifications are designed by subject matter experts and
              continuously updated to reflect current industry practices and
              emerging trends.
            </p>

            <div className="mt-12 rounded-lg bg-primary-50 p-6">
              <h3 className="text-xl font-bold text-primary-900">
                Join Our Community
              </h3>
              <p className="mt-2 text-primary-800">
                Become part of a growing network of business professionals
                committed to excellence and continuous learning.
              </p>
              <div className="mt-4">
                <Link
                  href="/signup"
                  className="inline-block rounded-lg bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
