import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CertificatesPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/sign-in")
  }

  // Fetch user's certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select(
      `
      *,
      courses (
        slug,
        title,
        description
      )
    `
    )
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/account">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Certificates</h1>
        <p className="text-muted-foreground">
          Download and verify your professional certifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {certificates?.map((certificate) => (
          <Card key={certificate.id} className="border-sage/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Award className="h-8 w-8 text-sage" />
                <Badge variant="success">Certified</Badge>
              </div>
              <CardTitle className="text-lg">{certificate.courses?.title}</CardTitle>
              <CardDescription>Certificate #{certificate.certificate_number}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Issued:</strong> {new Date(certificate.issued_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Score:</strong> {certificate.final_score}%
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Status:</strong> Valid (Never Expires)
                </p>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/api/certificates/${certificate.id}/download`}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate PDF
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/verify/${certificate.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Public Verification
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!certificates || certificates.length === 0) && (
          <div className="col-span-2 text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Certificates Yet</h2>
            <p className="text-muted-foreground mb-6">
              Complete courses and pass exams to earn professional certifications from the National
              Society of Business Sciences.
            </p>
            <Button asChild size="lg">
              <Link href="/coursecatalog">Start Learning</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
