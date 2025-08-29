import { generateCertificatePDF } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase"
import type { Certificate } from "@/lib/types"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Get user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get certificate with ownership verification
    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .eq("revoked", false)
      .single()

    if (error || !certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Generate PDF
    const pdfBuffer = await generateCertificatePDF(certificate)

    // Return PDF response
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="NSBS-Certificate-${(certificate as Certificate).certificate_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Certificate download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
