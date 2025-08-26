import { CheckoutButton } from "@/components/payment/checkout-button"
import { PurchaseConfirmation } from "@/components/payment/purchase-confirmation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCourseBySlug } from "@/lib/fs-data"
import { Award, BookOpen, CheckCircle, Target } from "lucide-react"
import { notFound } from "next/navigation"

interface CourseDescriptionPageProps {
  params: {
    slug: string
  }
}

export default async function CourseDescriptionPage({ params }: CourseDescriptionPageProps) {
  const course = await getCourseBySlug(params.slug)

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-sage/5 to-mocha-mousse/5">
      <div className="container mx-auto px-4 py-8">
        {/* Purchase Confirmation */}
        <div className="max-w-2xl mx-auto mb-8">
          <PurchaseConfirmation courseSlug={course.slug} courseTitle={course.title} />
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              {course.category}
            </Badge>
            <h1 className="text-4xl font-bold text-evergreen mb-4">{course.title}</h1>
            <p className="text-xl text-mocha-mousse mb-6">{course.description}</p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-mocha-mousse">
                <BookOpen className="h-5 w-5" />
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-2 text-mocha-mousse">
                <Award className="h-5 w-5" />
                <span>Professional Certificate</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <Card className="border-mint-sage/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-evergreen">
                    <Target className="h-5 w-5 text-mint-sage" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.learningObjectives?.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-mint-sage mt-0.5 flex-shrink-0" />
                        <span className="text-mocha-mousse">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Course Overview */}
              <Card className="border-mint-sage/20">
                <CardHeader>
                  <CardTitle className="text-evergreen">Course Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-evergreen max-w-none">
                  <p className="text-mocha-mousse leading-relaxed">
                    {course.longDescription || course.description}
                  </p>
                </CardContent>
              </Card>

              {/* Certification Info */}
              <Card className="border-mint-sage/20">
                <CardHeader>
                  <CardTitle className="text-evergreen">Professional Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-mocha-mousse mb-4">
                    Upon successful completion of this course and passing the certification exam
                    with 85% or higher, you will receive a professional certificate from the
                    National Society of Business Sciences.
                  </p>
                  <div className="bg-mint-sage/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-evergreen mb-2">Certificate Features:</h4>
                    <ul className="space-y-1 text-sm text-mocha-mousse">
                      <li>• Lifetime validity - never expires</li>
                      <li>• Downloadable PDF certificate</li>
                      <li>• Public verification available</li>
                      <li>• Industry-recognized credential</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Purchase */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-mint-sage/20">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-evergreen mb-2">${course.price}</div>
                    <p className="text-sm text-mocha-mousse">One-time payment</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CheckoutButton
                    courseSlug={course.slug}
                    courseName={course.title}
                    price={course.price}
                    className="w-full"
                  />

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-mocha-mousse">Lessons:</span>
                      <span className="font-medium text-evergreen">
                        {course.lessons?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mocha-mousse">Exam Attempts:</span>
                      <span className="font-medium text-evergreen">2 maximum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mocha-mousse">Pass Rate:</span>
                      <span className="font-medium text-evergreen">85% required</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <p className="text-xs text-mocha-mousse mb-2">30-day money-back guarantee</p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full bg-transparent border-mint-sage text-mint-sage hover:bg-mint-sage/10"
                    >
                      <a href="/policies/refund">View Refund Policy</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
