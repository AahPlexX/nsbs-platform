import Link from "next/link"
import { ArrowLeft, GraduationCap } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-mocha-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-evergreen-600" />
              <span className="text-xl font-bold text-evergreen-900">NSBS</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/coursecatalog"
                className="text-evergreen-700 hover:text-evergreen-900 font-medium"
              >
                Course Catalog
              </Link>
              <Link
                href="/verification"
                className="text-evergreen-700 hover:text-evergreen-900 font-medium"
              >
                Verify Certificate
              </Link>
              <Link
                href="/auth/sign-in"
                className="bg-evergreen-600 text-white px-4 py-2 rounded-lg hover:bg-evergreen-700 transition-colors"
              >
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-evergreen-600 hover:text-evergreen-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-evergreen-900 mb-2">Privacy Policy</h1>
            <p className="text-sage-600">Last updated: January 2025</p>
          </div>

          <div className="prose prose-sage max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-sage-700 mb-4">
                We collect information you provide directly to us, such as when you create an
                account, enroll in courses, or contact us for support.
              </p>
              <h3 className="text-lg font-semibold text-evergreen-700 mb-2">
                Personal Information
              </h3>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Name and email address</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Course progress and examination results</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-sage-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Provide, maintain, and improve our certification platform</li>
                <li>Process course enrollments and payments</li>
                <li>Track course progress and issue certificates</li>
                <li>Send important updates about your courses and certifications</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                3. Information Sharing
              </h2>
              <p className="text-sage-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties except as described below:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>
                  <strong>Service Providers:</strong> We may share information with trusted
                  third-party service providers who assist us in operating our platform
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information when required by
                  law or to protect our rights
                </li>
                <li>
                  <strong>Certificate Verification:</strong> Certificate information may be shared
                  for verification purposes when requested by authorized parties
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">4. Data Security</h2>
              <p className="text-sage-700 mb-4">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing through Stripe</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">5. Data Retention</h2>
              <p className="text-sage-700 mb-4">
                We retain your personal information for as long as necessary to provide our services
                and fulfill the purposes outlined in this privacy policy. Certificate records are
                maintained indefinitely to support ongoing verification needs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">6. Your Rights</h2>
              <p className="text-sage-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Access and update your personal information</li>
                <li>
                  Request deletion of your personal information (subject to legal requirements)
                </li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-sage-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our
                platform. These help us remember your preferences, analyze site usage, and provide
                personalized content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-sage-700 mb-4">
                Our platform integrates with third-party services including:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>
                  <strong>Supabase:</strong> Database and authentication services
                </li>
                <li>
                  <strong>Stripe:</strong> Payment processing
                </li>
                <li>
                  <strong>Resend:</strong> Email delivery services
                </li>
                <li>
                  <strong>Google:</strong> OAuth authentication
                </li>
              </ul>
              <p className="text-sage-700 mb-4">
                These services have their own privacy policies governing their use of your
                information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-sage-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new privacy policy on this page and updating the "Last
                updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">10. Contact Us</h2>
              <p className="text-sage-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-sage-50 p-4 rounded-lg">
                <p className="text-sage-700 font-medium">National Society of Business Sciences</p>
                <p className="text-sage-600">Email: admin@nsbs-certified.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-evergreen-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-sage-300" />
                <span className="text-xl font-bold">NSBS</span>
              </div>
              <p className="text-sage-300 mb-4">
                Advancing business excellence through professional certification and continuous
                learning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/coursecatalog" className="text-sage-300 hover:text-white">
                    Course Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="text-sage-300 hover:text-white">
                    Verify Certificate
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-in" className="text-sage-300 hover:text-white">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/policies/privacy" className="text-sage-300 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="text-sage-300 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund" className="text-sage-300 hover:text-white">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-evergreen-800 mt-8 pt-8 text-center">
            <p className="text-sage-400">
              © 2025 National Society of Business Sciences. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
