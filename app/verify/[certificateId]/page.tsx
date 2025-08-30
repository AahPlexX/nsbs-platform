import { VerificationResult } from "@/components/certificate/verification-result"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"

interface Props {
  params: { certificateId: string }
}

export default async function DirectVerificationPage({ params }: Props) {
  const supabase = await createClient()

  const { data: certificate, error } = await supabase
    .from("certificates")
    .select(
      `
      *,
      users!inner(name, email)
    `
    )
    .eq("id", params.certificateId)
    .eq("revoked", false)
    .single()

  if (error || !certificate) {
    notFound()
  }

  // Log verification
  await supabase.from("certificate_verifications").insert({
    certificate_id: certificate.id,
    verified_at: new Date().toISOString(),
    ip_address: "system",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-sage/10 to-evergreen/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-mint-sage/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-evergreen">
                Certificate Verified
              </CardTitle>
              <CardDescription className="text-mocha-mousse">
                This certificate has been verified as authentic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationResult certificate={certificate} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
