import { jsPDF } from "jspdf"
import type { Certificate } from "./types"

export async function generateCertificatePDF(certificate: Certificate): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // NSBS Brand Colors
  const mintSage = "#9CAF88"
  const mochaMousese = "#A0826D"
  const evergreen = "#355E3B"

  // Certificate background
  doc.setFillColor(248, 250, 252) // Light background
  doc.rect(0, 0, 297, 210, "F")

  // Header border
  doc.setFillColor(53, 94, 59) // Evergreen
  doc.rect(0, 0, 297, 20, "F")

  // NSBS Logo area
  doc.setFillColor(255, 255, 255)
  doc.rect(20, 30, 60, 40, "F")
  doc.setTextColor(53, 94, 59)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("NSBS", 50, 50)

  // Certificate title
  doc.setTextColor(53, 94, 59)
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 60, { align: "center" })

  // Recipient name
  doc.setTextColor(160, 130, 109) // Mocha Mousse
  doc.setFontSize(24)
  doc.setFont("helvetica", "normal")
  doc.text(`${certificate.user_name}`, 148.5, 85, { align: "center" })

  // Course completion text
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text("has successfully completed the course", 148.5, 105, { align: "center" })

  // Course title
  doc.setTextColor(53, 94, 59)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text(`${certificate.course_title}`, 148.5, 125, { align: "center" })

  // Issue date
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  const issueDate = new Date(certificate.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(`Issued on ${issueDate}`, 148.5, 145, { align: "center" })

  // Certificate number
  doc.setFontSize(10)
  doc.text(`Certificate No: ${certificate.certificate_number}`, 148.5, 155, { align: "center" })

  // Verification URL
  doc.setTextColor(53, 94, 59)
  doc.text(`Verify at: ${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificate.id}`, 148.5, 165, {
    align: "center",
  })

  // Footer
  doc.setFillColor(156, 175, 136) // Mint Sage
  doc.rect(0, 190, 297, 20, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("National Society of Business Sciences", 148.5, 202, { align: "center" })

  return Buffer.from(doc.output("arraybuffer"))
}
