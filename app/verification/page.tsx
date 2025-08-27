import { VerificationForm } from "@/components/certificate/verification-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NS</span>
              </div>
              <span className="font-bold text-lg text-foreground">
                National Society of Business Sciences
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/coursecatalog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Courses
              </Link>
              <Link href="/verification" className="text-foreground font-medium">
                Verify Certificate
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/auth/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/coursecatalog">
                <Button size="sm">Get Certified</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-mint-sage/10 to-evergreen/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-mint-sage/20 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-evergreen">
                  Certificate Verification
                </CardTitle>
                <CardDescription className="text-mocha-mousse">
                  Enter a certificate number to verify its authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading...</div>}>
                  <VerificationForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link
                href="/"
                className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NS</span>
                </div>
                <span className="font-bold text-foreground">NSBS</span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Empowering professionals through comprehensive business sciences certification
                programs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Courses</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/coursecatalog" className="hover:text-foreground transition-colors">
                    All Courses
                  </Link>
                </li>
                <li>
                  <a
                    href="/courses/business-analytics"
                    className="hover:text-foreground transition-colors"
                  >
                    Business Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="/courses/project-management"
                    className="hover:text-foreground transition-colors"
                  >
                    Project Management
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/verification" className="hover:text-foreground transition-colors">
                    Verify Certificate
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund" className="hover:text-foreground transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/policies/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 National Society of Business Sciences. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
