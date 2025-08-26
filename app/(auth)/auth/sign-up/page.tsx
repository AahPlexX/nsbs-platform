import { SignInForm } from "@/components/auth/sign-in-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-sage/5 to-evergreen/5">
      <header className="border-b border-mint-sage/20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-sage">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-evergreen">NSBS</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-mocha-mousse hover:text-evergreen transition-colors">
                Home
              </Link>
              <Link
                href="/coursecatalog"
                className="text-mocha-mousse hover:text-evergreen transition-colors"
              >
                Courses
              </Link>
              <Link
                href="/verification"
                className="text-mocha-mousse hover:text-evergreen transition-colors"
              >
                Verify Certificate
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md">
          <Card className="border-mint-sage/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint-sage/10">
                <GraduationCap className="h-8 w-8 text-mint-sage" />
              </div>
              <CardTitle className="text-2xl font-semibold text-evergreen">Join NSBS</CardTitle>
              <CardDescription className="text-mocha-mousse/80">
                Create your account to start your certification journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInForm isSignUp={true} />
              <div className="mt-6 text-center text-sm text-mocha-mousse/60">
                Already have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="font-medium text-mint-sage hover:text-mint-sage/80 transition-colors"
                >
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-mint-sage/20 bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-sage">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-evergreen">NSBS</span>
              </div>
              <p className="text-sm text-mocha-mousse/80">
                National Society of Business Sciences - Professional Certification Platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-evergreen mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-mocha-mousse/80">
                <li>
                  <Link href="/" className="hover:text-evergreen transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/coursecatalog" className="hover:text-evergreen transition-colors">
                    Course Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-evergreen transition-colors">
                    Verify Certificate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-evergreen mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-mocha-mousse/80">
                <li>
                  <Link href="/policies/privacy" className="hover:text-evergreen transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="hover:text-evergreen transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund" className="hover:text-evergreen transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-evergreen mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-mocha-mousse/80">
                <li>
                  <Link href="/contact" className="hover:text-evergreen transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <span>admin@nsbs-certified.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-mint-sage/20 mt-8 pt-8 text-center text-sm text-mocha-mousse/60">
            <p>&copy; 2024 National Society of Business Sciences. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
