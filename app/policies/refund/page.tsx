import { ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function RefundPolicyPage() {
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
            <h1 className="text-3xl font-bold text-evergreen-900 mb-2">Refund Policy</h1>
            <p className="text-sage-600">Last updated: January 2025</p>
          </div>

          <div className="prose prose-sage max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                1. General Refund Policy
              </h2>
              <p className="text-sage-700 mb-4">
                At the National Society of Business Sciences (NSBS), we are committed to providing
                high-quality certification courses. We understand that circumstances may arise where
                a refund is necessary.
              </p>
              <p className="text-sage-700 mb-4">
                <strong>All sales are final unless otherwise specified in this policy.</strong>{" "}
                Refunds are processed at our discretion and subject to the conditions outlined
                below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                2. Eligibility for Refunds
              </h2>
              <p className="text-sage-700 mb-4">
                You may be eligible for a refund under the following circumstances:
              </p>

              <h3 className="text-lg font-semibold text-evergreen-700 mb-2">Technical Issues</h3>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Platform unavailability preventing course access for more than 48 hours</li>
                <li>Significant technical defects that prevent course completion</li>
                <li>Content delivery failures not resolved within 72 hours</li>
              </ul>

              <h3 className="text-lg font-semibold text-evergreen-700 mb-2">
                Course Content Issues
              </h3>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Course content significantly differs from the description provided</li>
                <li>Missing essential course materials that cannot be provided</li>
              </ul>

              <h3 className="text-lg font-semibold text-evergreen-700 mb-2">Duplicate Purchases</h3>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Accidental duplicate enrollment in the same course</li>
                <li>System errors resulting in multiple charges</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                3. Non-Refundable Circumstances
              </h2>
              <p className="text-sage-700 mb-4">
                Refunds will NOT be provided in the following situations:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Change of mind after course enrollment</li>
                <li>Failure to complete the course within the access period</li>
                <li>Failure to pass the final examination (maximum 2 attempts allowed)</li>
                <li>Dissatisfaction with course difficulty or content quality</li>
                <li>Personal circumstances preventing course completion</li>
                <li>After certificate has been issued</li>
                <li>More than 30 days after initial purchase</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">4. Refund Process</h2>
              <p className="text-sage-700 mb-4">To request a refund:</p>
              <ol className="list-decimal pl-6 text-sage-700 mb-4">
                <li>
                  Contact our support team at admin@nsbs-certified.com within 30 days of purchase
                </li>
                <li>Provide your order number and detailed reason for the refund request</li>
                <li>Include any supporting documentation or screenshots if applicable</li>
                <li>Allow 5-7 business days for review and response</li>
              </ol>
              <p className="text-sage-700 mb-4">
                All refund requests are reviewed individually and approved refunds will be processed
                within 10-14 business days to the original payment method.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">5. Partial Refunds</h2>
              <p className="text-sage-700 mb-4">
                In certain circumstances, we may offer partial refunds based on:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Percentage of course content accessed</li>
                <li>Time elapsed since purchase</li>
                <li>Specific circumstances of the refund request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">6. Processing Fees</h2>
              <p className="text-sage-700 mb-4">
                Payment processing fees charged by third-party providers (such as Stripe) are
                non-refundable. Approved refunds will be reduced by the original processing fee
                amount.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                7. Course Access After Refund
              </h2>
              <p className="text-sage-700 mb-4">
                Upon approval of a refund, access to the course materials will be immediately
                revoked. Any certificates earned will be invalidated and removed from our
                verification system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                8. Dispute Resolution
              </h2>
              <p className="text-sage-700 mb-4">
                If you are not satisfied with our refund decision, you may escalate the matter by:
              </p>
              <ul className="list-disc pl-6 text-sage-700 mb-4">
                <li>Requesting a review by our senior management team</li>
                <li>Providing additional documentation to support your case</li>
                <li>
                  Contacting your credit card company if you believe the charge was unauthorized
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">9. Policy Changes</h2>
              <p className="text-sage-700 mb-4">
                NSBS reserves the right to modify this refund policy at any time. Changes will be
                effective immediately upon posting on our website. Continued use of our services
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-evergreen-800 mb-4">
                10. Contact Information
              </h2>
              <p className="text-sage-700 mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <div className="bg-sage-50 p-4 rounded-lg">
                <p className="text-sage-700 font-medium">National Society of Business Sciences</p>
                <p className="text-sage-600">Email: admin@nsbs-certified.com</p>
                <p className="text-sage-600">Subject Line: Refund Request - [Your Order Number]</p>
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
