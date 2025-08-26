import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CertificatesManagement() {
  const supabase = createServerSupabaseClient()

  const { data: certificates } = await supabase
    .from("certificates")
    .select(
      `
      *,
      user_profiles(email, full_name),
      courses(title)
    `
    )
    .order("issued_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Certificate Management</h1>
          <p className="text-muted-foreground">Manage issued certificates and verification</p>
        </div>
        <div className="flex items-center gap-4">
          <Input placeholder="Search certificates..." className="w-64" />
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {certificates?.map((certificate) => (
          <Card key={certificate.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-semibold">
                      {certificate.user_profiles?.full_name || certificate.user_profiles?.email}
                    </h3>
                    <Badge variant={certificate.status === "active" ? "success" : "destructive"}>
                      {certificate.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{certificate.courses?.title}</p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Certificate #{certificate.certificate_number}</span>
                    <span>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</span>
                    <span>Score: {certificate.exam_score}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                  {certificate.status === "active" && (
                    <Button variant="destructive" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) || <p className="text-muted-foreground">No certificates found</p>}
      </div>
    </div>
  )
}
