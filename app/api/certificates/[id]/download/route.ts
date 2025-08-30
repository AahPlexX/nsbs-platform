import { generateCertificatePDF } from "@/lib/pdf-generator"
import type { Certificate } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

interface Profile {
  full_name: string | null
}

interface Course {
  title: string
}

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
      .single() as { data: Certificate | null; error: unknown }

    if (error || !certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single() as { data: Profile | null; error: unknown }

    // Get course title
    const { data: course } = await supabase
      .from("courses")
      .select("title, slug")
      .eq("id", certificate.course_id)
      .single() as { data: (Course & { slug: string }) | null; error: unknown }

    const userName = profile?.full_name ?? "Certificate Recipient"
    const courseTitle = course?.title ?? "Course"

    // Generate PDF with actual user and course data
    const pdfBuffer = generateCertificatePDF(certificate, userName, courseTitle)

    // Return PDF response
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="NSBS-Certificate-${certificate.certificate_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Certificate download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
