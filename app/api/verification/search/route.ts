import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const certificateNumber = searchParams.get("number")

    if (!certificateNumber) {
      return NextResponse.json({ error: "Certificate number is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: certificate, error } = await supabase
      .from("certificates")
      .select("id")
      .eq("certificate_number", certificateNumber)
      .eq("revoked", false)
      .single()

    if (error || !certificate) {
      return NextResponse.json({ certificateId: null })
    }

    return NextResponse.json({ certificateId: certificate.id })
  } catch (error) {
    console.error("Certificate search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
