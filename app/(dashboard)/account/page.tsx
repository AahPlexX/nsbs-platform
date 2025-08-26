import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, ExternalLink, BookOpen, Award, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AccountDashboard() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/sign-in")
  }

  // Fetch user's purchases
  const { data: purchases } = await supabase
    .from("purchases")
    .select(
      `
      *,
      courses (
        slug,
        title,
        description,
        price
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch user's certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select(
      `
      *,
      courses (
        slug,
        title
      )
    `
    )
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })

  // Fetch course progress
  const { data: progress } = await supabase
    .from("course_progress")
    .select(
      `
      *,
      courses (
        slug,
        title,
        lesson_count
      )
    `
    )
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/coursecatalog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course Catalog
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your courses, certificates, and account information
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="purchases">Purchase History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progress?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Courses in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificates?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Professional certifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchases?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Course purchases</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest course progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates?.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Award className="h-8 w-8 text-sage" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        Certificate earned: {cert.courses?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="success">Certified</Badge>
                  </div>
                ))}

                {(!certificates || certificates.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No recent activity. Start a course to see your progress here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Track your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progress?.map((courseProgress) => {
                  const progressPercentage = Math.round(
                    (courseProgress.completed_lessons /
                      (courseProgress.courses?.lesson_count || 1)) *
                      100
                  )

                  return (
                    <div key={courseProgress.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {courseProgress.courses?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {courseProgress.completed_lessons} of{" "}
                            {courseProgress.courses?.lesson_count} lessons completed
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={progressPercentage === 100 ? "success" : "secondary"}>
                            {progressPercentage}% Complete
                          </Badge>
                          <Button asChild size="sm">
                            <Link href={`/learn/${courseProgress.courses?.slug}`}>
                              Continue Learning
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                  )
                })}

                {(!progress || progress.length === 0) && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No courses in progress</p>
                    <Button asChild>
                      <Link href="/coursecatalog">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>
                Download and verify your professional certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {certificates?.map((certificate) => (
                  <Card key={certificate.id} className="border-sage/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Award className="h-8 w-8 text-sage" />
                        <Badge variant="success">Certified</Badge>
                      </div>
                      <CardTitle className="text-lg">{certificate.courses?.title}</CardTitle>
                      <CardDescription>
                        Certificate #{certificate.certificate_number}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(certificate.issued_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Score: {certificate.final_score}%
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/api/certificates/${certificate.id}/download`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/verify/${certificate.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Verify
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!certificates || certificates.length === 0) && (
                  <div className="col-span-2 text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No certificates earned yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete courses and pass exams to earn professional certifications
                    </p>
                    <Button asChild>
                      <Link href="/coursecatalog">Start Learning</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>View your course purchase history and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchases?.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{purchase.courses?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {purchase.stripe_payment_intent_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${(purchase.amount / 100).toFixed(2)}
                        </p>
                        <Badge variant={purchase.status === "completed" ? "success" : "secondary"}>
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {(!purchases || purchases.length === 0) && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No purchases yet</p>
                    <Button asChild>
                      <Link href="/coursecatalog">Browse Courses</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
