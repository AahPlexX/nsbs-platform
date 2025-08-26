import { ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-bold text-evergreen-900 mb-2">Terms of Service</h1>
            <p className="text-sage-600">Last updated: January 2025</p>
          </div>

          <div className="prose prose-sage max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-sage-700 mb-4">
                By accessing and using the National Society of Business Sciences (NSBS)
                certification platform, you accept and agree to be bound by the terms and provision
                of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">2. Use License</h2>
              <p className="text-sage-700 mb-4">
                Permission is granted to temporarily access the materials on NSBS's platform for
                personal, non-commercial transitory viewing only. This is the grant of a license,
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the platform</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                3. Course Access and Certification
              </h2>
              <p className="text-sage-700 mb-4">
                Course access is granted upon successful payment and is valid for the duration
                specified in the course description. Certification is awarded upon successful
                completion of course requirements and passing the final examination with a minimum
                score of 85%.
              </p>
              <p className="text-sage-700 mb-4">
                Each user is allowed a maximum of two (2) attempts per examination. Certificates
                issued by NSBS do not expire and remain valid indefinitely unless revoked for cause.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">4. User Accounts</h2>
              <p className="text-sage-700 mb-4">
                You are responsible for maintaining the confidentiality of your account and
                password. You agree to accept responsibility for all activities that occur under
                your account or password.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">5. Payment Terms</h2>
              <p className="text-sage-700 mb-4">
                All course fees are due at the time of enrollment. We accept major credit cards and
                process payments securely through Stripe. All sales are final unless otherwise
                specified in our refund policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-sage-700 mb-4">
                All course materials, including but not limited to text, graphics, logos, images,
                and software, are the property of NSBS and are protected by copyright and other
                intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                7. Limitation of Liability
              </h2>
              <p className="text-sage-700 mb-4">
                In no event shall NSBS or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the materials on NSBS's
                platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">8. Modifications</h2>
              <p className="text-sage-700 mb-4">
                NSBS may revise these terms of service at any time without notice. By using this
                platform, you are agreeing to be bound by the then current version of these terms of
                service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                9. Contact Information
              </h2>
              <p className="text-sage-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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
