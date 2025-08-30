import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { certificateId: string } }) {
  try {
    const supabase = await createClient()

    const { data: certificate, error } = await supabase
      .from("certificates")
      .select(
        `
        id,
        certificate_number,
        course_title,
        user_name,
        issued_at,
        revoked,
        users!inner(name, email)
      `
      )
      .eq("id", params.certificateId)
      .single()

    if (error || !certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    if (certificate.revoked) {
      return NextResponse.json({ error: "Certificate has been revoked" }, { status: 410 })
    }

    // Log verification
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    await supabase.from("certificate_verifications").insert({
      certificate_id: certificate.id,
      verified_at: new Date().toISOString(),
      ip_address: clientIp,
    })

    return NextResponse.json({
      valid: true,
      certificate: {
        id: certificate.id,
        certificate_number: certificate.certificate_number,
        course_title: certificate.course_title,
        user_name: certificate.user_name,
        issued_at: certificate.issued_at,
      },
    })
  } catch (error) {
    console.error("Certificate verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
