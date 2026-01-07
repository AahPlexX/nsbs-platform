import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Access educational resources, guides, and materials from The National Society of Business Sciences.',
}

export default function ResourcesPage() {
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
            <Link href="/about" className="text-sm hover:underline">
              About
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
          <h1 className="text-4xl font-bold tracking-tight">Resources</h1>
          <p className="mt-4 text-lg text-gray-600">
            Educational materials and resources for business professionals
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Course Catalog</h2>
              <p className="mt-2 text-gray-600">
                Browse our comprehensive selection of professional certification
                programs across multiple business disciplines.
              </p>
              <Link
                href="/coursecatalog"
                className="mt-4 inline-block text-primary-600 hover:underline"
              >
                View Courses →
              </Link>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Getting Started Guide</h2>
              <p className="mt-2 text-gray-600">
                New to NSBS? Learn how to create an account, enroll in courses,
                and begin your certification journey.
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-block text-primary-600 hover:underline"
              >
                Create Account →
              </Link>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Certification Information</h2>
              <p className="mt-2 text-gray-600">
                Learn about our certification programs, requirements, and the
                value they provide to your professional development.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-block text-primary-600 hover:underline"
              >
                Learn More →
              </Link>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Support & Contact</h2>
              <p className="mt-2 text-gray-600">
                Have questions? Our support team is here to help you succeed in
                your certification journey.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-primary-600 hover:underline"
              >
                Contact Us →
              </Link>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-gray-50 p-8">
            <h2 className="text-2xl font-bold">Study Tips for Success</h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>
                  Set aside dedicated time each week for coursework and study
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>
                  Take detailed notes and create summaries of key concepts
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>
                  Apply learnings to real-world scenarios in your current role
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>
                  Review material multiple times before attempting assessments
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>
                  Join study groups or discussion forums to enhance learning
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-12 rounded-lg border-l-4 border-primary-600 bg-primary-50 p-6">
            <h3 className="font-bold text-primary-900">
              Content Development in Progress
            </h3>
            <p className="mt-2 text-primary-800">
              We are actively developing comprehensive course materials and
              additional resources. New content will be added regularly. Check
              back often for updates!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
