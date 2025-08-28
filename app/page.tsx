import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, BookOpen, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">NS</span>
              </div>
              <span className="font-bold text-lg text-foreground">
                National Society of Business Sciences
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/coursecatalog"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Courses
              </Link>
              <Link
                href="/verification"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
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

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Professional Certification Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Advance Your Career with
            <span className="text-primary block mt-2">Business Sciences Certification</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have enhanced their expertise through our
            comprehensive certification programs. Build credibility, expand knowledge, and unlock
            new opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coursecatalog">
              <Button size="lg" className="text-lg px-8 py-3">
                Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/verification">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Verify Certificate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose NSBS Certification?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our certification programs are designed by industry experts to provide practical,
              relevant skills that employers value.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert-Designed Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn from industry-leading content created by business professionals with
                  real-world experience.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Recognized Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn certificates that are valued by employers and recognized across the business
                  community.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Professional Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join a community of certified professionals and expand your business network.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Preview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Popular Certification Programs
            </h2>
            <p className="text-muted-foreground">
              Start your journey with our most sought-after certification courses.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="mint-sage" className="w-fit">
                  Business Analytics
                </Badge>
                <CardTitle className="text-xl">Data-Driven Decision Making</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Master the art of business analytics and learn to make strategic decisions based
                  on data insights.
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$299</span>
                  <Button size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="mocha-mousse" className="w-fit">
                  Project Management
                </Badge>
                <CardTitle className="text-xl">Strategic Project Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Develop essential project management skills and learn to lead teams to successful
                  outcomes.
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$349</span>
                  <Button size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge variant="evergreen" className="w-fit">
                  Digital Marketing
                </Badge>
                <CardTitle className="text-xl">Modern Marketing Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Learn cutting-edge digital marketing techniques to drive business growth in the
                  digital age.
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">$279</span>
                  <Button size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/coursecatalog">
              <Button variant="outline" size="lg">
                View All Courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Professionals Worldwide
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Certified Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Certification Programs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Advance Your Career?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who have transformed their careers through our
            certification programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/coursecatalog">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">NS</span>
                </div>
                <span className="font-bold text-foreground">NSBS</span>
              </div>
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
